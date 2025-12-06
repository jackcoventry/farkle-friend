import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import Navigation, {
  NavLinkRenderProps,
} from "@/components/Navigation/Navigation";
import { NavItem } from "@/components/Navigation/NavItem";
import { NavLink } from "@/components/Navigation/NavLink";

describe("Nav", () => {
  it("renders a nav element with aria-label and children", () => {
    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/home">Home</NavLink>
        </NavItem>
      </Navigation>
    );

    const nav = screen.getByLabelText("Main navigation");
    expect(nav.tagName.toLowerCase()).toBe("nav");

    const list = nav.querySelector("ul");
    expect(list).toBeInTheDocument();

    const listItems = list?.querySelectorAll("li");
    expect(listItems?.length).toBe(1);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("provides renderLink via context so NavLink uses it", () => {
    const renderLink = vi.fn(
      ({ href, children, className, ariaCurrent }: NavLinkRenderProps) => (
        <a
          aria-current={ariaCurrent}
          className={className}
          data-testid="custom-link"
          href={href}
        >
          {children}
        </a>
      )
    );

    render(
      <Navigation ariaLabel="Main navigation" renderLink={renderLink}>
        <NavItem>
          <NavLink href="/dashboard" isActive>
            Dashboard
          </NavLink>
        </NavItem>
      </Navigation>
    );

    const customLink = screen.getByTestId("custom-link");

    expect(renderLink).toHaveBeenCalledTimes(1);
    const call = renderLink.mock.calls[0][0];

    expect(call.href).toBe("/dashboard");
    expect(call.children).toBe("Dashboard");
    expect(call.className).toContain("nav-link");
    expect(call.ariaCurrent).toBe("page");

    expect(customLink).toHaveAttribute("href", "/dashboard");
    expect(customLink).toHaveAttribute("aria-current", "page");
    expect(customLink).toHaveClass("nav-link");
    expect(customLink).toHaveClass("nav-link--active");
  });

  describe("menu toggle", () => {
    it("renders a toggle button wired to the nav element", () => {
      render(
        <Navigation ariaLabel="Main navigation">
          <NavItem>
            <NavLink href="/one">One</NavLink>
          </NavItem>
        </Navigation>
      );

      const button = screen.getByRole("button", { name: /menu/i });
      expect(button).toBeInTheDocument();

      // Should be collapsed initially
      expect(button).toHaveAttribute("aria-expanded", "false");

      const nav = screen.getByLabelText("Main navigation");

      // nav has id matching aria-controls
      const controlsId = button.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(nav).toHaveAttribute("id", controlsId!);

      // nav stores toggle state
      expect(nav).toHaveAttribute("data-open", "false");
    });

    it("toggles aria-expanded and nav when clicked", async () => {
      const user = userEvent.setup();

      render(
        <Navigation ariaLabel="Main navigation">
          <NavItem>
            <NavLink href="/one">One</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/two">Two</NavLink>
          </NavItem>
        </Navigation>
      );

      const button = screen.getByRole("button", { name: /menu/i });
      const nav = screen.getByLabelText("Main navigation");

      // initial state
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(nav).toHaveAttribute("data-open", "false");

      // open menu
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");
      expect(nav).toHaveAttribute("data-open", "true");

      // close again
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(nav).toHaveAttribute("data-open", "false");
    });
  });
});

describe("NavItem", () => {
  it("wraps children in an li element", () => {
    render(
      <Navigation ariaLabel="Test nav">
        <NavItem>
          <span data-testid="inside-item">Hello</span>
        </NavItem>
      </Navigation>
    );

    const span = screen.getByTestId("inside-item");
    const li = span.closest("li");
    expect(li).toBeInTheDocument();
  });
});

describe("NavLink", () => {
  it("falls back to a plain anchor when no renderLink is provided", () => {
    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/plain">Plain link</NavLink>
        </NavItem>
      </Navigation>
    );

    const link = screen.getByText("Plain link");
    expect(link.tagName.toLowerCase()).toBe("a");
    expect(link).toHaveAttribute("href", "/plain");
    expect(link).toHaveClass("nav-link");
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("sets aria-current='page' and active class when isActive is true", () => {
    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/active" isActive>
            Active link
          </NavLink>
        </NavItem>
      </Navigation>
    );

    const link = screen.getByText("Active link");

    expect(link).toHaveAttribute("href", "/active");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("nav-link--active");
  });

  it("does not set aria-current when isActive is false", () => {
    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/inactive" isActive={false}>
            Inactive link
          </NavLink>
        </NavItem>
      </Navigation>
    );

    const link = screen.getByText("Inactive link");

    expect(link).toHaveAttribute("href", "/inactive");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link).toHaveClass("nav-link");
    expect(link).not.toHaveClass("nav-link--active");
  });

  it("merges custom className with base classes", () => {
    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/custom" className="text-blue">
            Custom
          </NavLink>
        </NavItem>
      </Navigation>
    );

    const link = screen.getByText("Custom");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("text-blue");
  });
});

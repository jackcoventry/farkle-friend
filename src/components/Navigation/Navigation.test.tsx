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
  it("renders header, title, toggle and shows nav with children when opened", async () => {
    const user = userEvent.setup();

    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/home">Home</NavLink>
        </NavItem>
      </Navigation>
    );

    // header title is always visible
    expect(screen.getByText("FARKLE FRIEND!")).toBeInTheDocument();

    // toggle button is rendered when there are children
    const button = screen.getByRole("button", { name: /menu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");

    // nav is NOT rendered until opened
    expect(screen.queryByLabelText("Main navigation")).not.toBeInTheDocument();

    // open the menu
    await user.click(button);

    const nav = screen.getByLabelText("Main navigation");
    expect(nav.tagName.toLowerCase()).toBe("nav");
    expect(nav).toHaveAttribute("data-open", "true");

    // basic structure: nav > ul > li
    const list = nav.querySelector("ul");
    expect(list).toBeInTheDocument();

    const listItems = list?.querySelectorAll("li");
    expect(listItems?.length).toBe(1);

    // link text visible
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("provides renderLink via context so NavLink uses it (when nav is open)", async () => {
    const user = userEvent.setup();

    const renderLink = vi.fn(
      ({ href, children, className, ariaCurrent }: NavLinkRenderProps) => (
        <a
          data-testid="custom-link"
          href={href}
          className={className}
          aria-current={ariaCurrent}
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

    // open menu so nav + links render
    const button = screen.getByRole("button", { name: /menu/i });
    await user.click(button);

    const customLink = screen.getByTestId("custom-link");

    // renderLink was called with correct props
    expect(renderLink).toHaveBeenCalledTimes(1);
    const call = renderLink.mock.calls[0][0];

    expect(call.href).toBe("/dashboard");
    expect(call.children).toBe("Dashboard");
    expect(call.className).toContain("nav-link");
    expect(call.ariaCurrent).toBe("page");

    // element is in the DOM with correct attributes
    expect(customLink).toHaveAttribute("href", "/dashboard");
    expect(customLink).toHaveAttribute("aria-current", "page");
    expect(customLink).toHaveClass("nav-link");
    expect(customLink).toHaveClass("nav-link--active");
  });

  describe("menu toggle & open state", () => {
    it("controls aria-expanded and nav[data-open] when clicked", async () => {
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

      // Initial: closed, nav not in DOM
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.queryByLabelText("Main navigation")
      ).not.toBeInTheDocument();

      // Open
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");

      const nav = screen.getByLabelText("Main navigation");
      expect(nav).toHaveAttribute("data-open", "true");

      // Close again
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.queryByLabelText("Main navigation")
      ).not.toBeInTheDocument();
    });
  });
});

describe("NavItem", () => {
  it("wraps children in an li element when nav is open", async () => {
    const user = userEvent.setup();

    render(
      <Navigation ariaLabel="Test nav">
        <NavItem>
          <span data-testid="inside-item">Hello</span>
        </NavItem>
      </Navigation>
    );

    // open menu
    const button = screen.getByRole("button", { name: /menu/i });
    await user.click(button);

    const span = screen.getByTestId("inside-item");
    const li = span.closest("li");
    expect(li).toBeInTheDocument();
  });
});

describe("NavLink", () => {
  it("falls back to a plain anchor when no renderLink is provided", async () => {
    const user = userEvent.setup();

    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/plain">Plain link</NavLink>
        </NavItem>
      </Navigation>
    );

    // open menu
    const button = screen.getByRole("button", { name: /menu/i });
    await user.click(button);

    const link = screen.getByText("Plain link");
    expect(link.tagName.toLowerCase()).toBe("a");
    expect(link).toHaveAttribute("href", "/plain");
    expect(link).toHaveClass("nav-link");
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("sets aria-current='page' and active class when isActive is true", async () => {
    const user = userEvent.setup();

    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/active" isActive>
            Active link
          </NavLink>
        </NavItem>
      </Navigation>
    );

    // open menu
    const button = screen.getByRole("button", { name: /menu/i });
    await user.click(button);

    const link = screen.getByText("Active link");
    expect(link).toHaveAttribute("href", "/active");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("nav-link--active");
  });

  it("does not set aria-current when isActive is false", async () => {
    const user = userEvent.setup();

    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/inactive" isActive={false}>
            Inactive link
          </NavLink>
        </NavItem>
      </Navigation>
    );

    // open menu
    const button = screen.getByRole("button", { name: /menu/i });
    await user.click(button);

    const link = screen.getByText("Inactive link");
    expect(link).toHaveAttribute("href", "/inactive");
    expect(link).not.toHaveAttribute("aria-current");
    expect(link).toHaveClass("nav-link");
    expect(link).not.toHaveClass("nav-link--active");
  });

  it("merges custom className with base classes", async () => {
    const user = userEvent.setup();

    render(
      <Navigation ariaLabel="Main navigation">
        <NavItem>
          <NavLink href="/custom" className="text-blue">
            Custom
          </NavLink>
        </NavItem>
      </Navigation>
    );

    // open menu
    const button = screen.getByRole("button", { name: /menu/i });
    await user.click(button);

    const link = screen.getByText("Custom");
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveClass("text-blue");
  });
});

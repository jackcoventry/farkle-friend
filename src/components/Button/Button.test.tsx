import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "./Button";

describe("Button (polymorphic)", () => {
  /* -----------------------------
   * DEFAULT BUTTON BEHAVIOUR
   * ----------------------------- */

  it("renders a <button> by default with children content", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button.tagName.toLowerCase()).toBe("button");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "default");
  });

  it("applies additional className", () => {
    render(<Button className="extra-class">Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button.className).toContain("button");
    expect(button.className).toContain("extra-class");
  });

  it("calls onClick when clicked (button variant)", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole("button", { name: "Click me" });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("respects explicit type prop on button", () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole("button", { name: "Submit" });
    expect(button).toHaveAttribute("type", "submit");
  });

  /* -----------------------------
   * ANCHOR VARIANT
   * ----------------------------- */

  it("renders an <a> when as='a' with correct href and attributes", () => {
    render(
      <Button as="a" href="https://example.com">
        Go
      </Button>
    );

    const link = screen.getByRole("link", { name: "Go" });
    expect(link.tagName.toLowerCase()).toBe("a");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("data-variant", "primary");
    expect(link).toHaveAttribute("data-size", "default");
    expect(link).toHaveAttribute("data-icon-position", "right");
  });

  it("sets rel='noopener noreferrer' when target='_blank' and no rel specified", () => {
    render(
      <Button as="a" href="https://example.com" target="_blank">
        External
      </Button>
    );

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("respects explicit rel when target='_blank'", () => {
    render(
      <Button as="a" href="https://example.com" target="_blank" rel="nofollow">
        External
      </Button>
    );

    const link = screen.getByRole("link", { name: "External" });
    expect(link).toHaveAttribute("rel", "nofollow");
  });

  /* -----------------------------
   * INLINE SPAN VARIANT
   * ----------------------------- */

  it("renders a <span> when as='inline' with presentational attributes", () => {
    render(<Button as="inline">Inline label</Button>);

    const span = screen.getByText("Inline label").closest(".button");
    expect(span).not.toBeNull();
    if (!span) return;

    expect(span.tagName.toLowerCase()).toBe("span");
    expect(span).toHaveAttribute("data-variant", "primary");
    expect(span).toHaveAttribute("data-size", "default");
    expect(span).toHaveAttribute("data-icon-position", "right");

    // Ensure no button/anchor-only attributes leak through
    expect(span).not.toHaveAttribute("href");
    expect(span).not.toHaveAttribute("type");
    expect(span).not.toHaveAttribute("disabled");
  });

  it("renders children inside content span for inline variant when not iconOnly", () => {
    render(<Button as="inline">Inline label</Button>);

    const content = screen.getByText("Inline label");
    expect(content).toBeInTheDocument();
    expect(content.closest(".content")).not.toBeNull();
  });

  /* -----------------------------
   * ICON / ARIA LABEL BEHAVIOUR
   * ----------------------------- */

  it("respects icon, iconOnly and computes aria-label from string children (button)", () => {
    render(
      <Button icon="arrow-right" iconOnly>
        Icon label
      </Button>
    );

    const button = screen.getByRole("button", { name: "Icon label" });

    // Text should not be visually rendered because iconOnly=true
    expect(screen.queryByText("Icon label")).not.toBeInTheDocument();

    const svg = button.querySelector("svg.icon");
    expect(svg).not.toBeNull();
  });

  it("uses provided ariaLabel instead of deriving from children when iconOnly", () => {
    render(
      <Button icon="arrow-right" iconOnly ariaLabel="Custom label">
        Icon label
      </Button>
    );

    const button = screen.getByRole("button", { name: "Custom label" });

    // Text should still not be present
    expect(screen.queryByText("Icon label")).not.toBeInTheDocument();

    const svg = button.querySelector("svg.icon");
    expect(svg).not.toBeNull();
  });

  it("renders content and icon together when not iconOnly", () => {
    render(<Button icon="arrow-right">Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" });

    const contentSpan = button.querySelector(".content");
    expect(contentSpan).not.toBeNull();
    expect(screen.getByText("Click me")).toBeInTheDocument();

    const svg = button.querySelector("svg.icon");
    expect(svg).not.toBeNull();
  });

  it("sets data attributes for size, variant, and iconPosition", () => {
    render(
      <Button size="small" variant="secondary" iconPosition="left">
        Small secondary
      </Button>
    );

    const button = screen.getByRole("button", { name: "Small secondary" });
    expect(button).toHaveAttribute("data-size", "small");
    expect(button).toHaveAttribute("data-variant", "secondary");
    expect(button).toHaveAttribute("data-icon-position", "left");
  });

  /* -----------------------------
   * REF FORWARDING
   * ----------------------------- */

  it("forwards ref correctly to button element", () => {
    const ref = React.createRef<HTMLButtonElement>();

    render(<Button ref={ref}>Click me</Button>);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("forwards ref correctly to anchor element when as='a'", () => {
    const ref = React.createRef<HTMLAnchorElement>();

    render(
      <Button as="a" href="https://example.com" ref={ref}>
        Link
      </Button>
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it("forwards ref correctly to span element when as='inline'", () => {
    const ref = React.createRef<HTMLSpanElement>();

    render(
      <Button as="inline" ref={ref}>
        Inline label
      </Button>
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName.toLowerCase()).toBe("span");
  });
});

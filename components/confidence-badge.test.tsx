import { render, screen } from "@testing-library/react";
import { ConfidenceBadge } from "./confidence-badge";

test("renders high confidence with the correct text and color", () => {
  render(<ConfidenceBadge level="high" />);

  const badge = screen.getByText("High");

  expect(badge).toBeInTheDocument();
  expect(badge).toHaveClass("text-green-600");
});

test("renders medium confidence with the correct text and color", () => {
  render(<ConfidenceBadge level="medium" />);

  const badge = screen.getByText("Medium");

  expect(badge).toBeInTheDocument();
  expect(badge).toHaveClass("text-yellow-600");
});

test("renders low confidence with the correct text and color", () => {
  render(<ConfidenceBadge level="low" />);

  const badge = screen.getByText("Low");

  expect(badge).toBeInTheDocument();
  expect(badge).toHaveClass("text-red-600");
});
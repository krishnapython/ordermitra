
import { render, screen, fireEvent } from "@testing-library/react";
import { useChat } from "ai/react";
import { OrderMitraPanel } from "./ordermitra-panel";

jest.mock("ai/react", () => ({
  useChat: jest.fn(),
}));

const mockUseChat = useChat as jest.Mock;

describe("OrderMitraPanel", () => {
  const mockHandleInputChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockStop = jest.fn();
  const mockReload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseChat.mockReturnValue({
      messages: [
        {
          id: "1",
          role: "assistant",
          content: "Hello! How can I help you with your order?",
        },
      ],
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      status: "ready",
      stop: mockStop,
      reload: mockReload,
      error: undefined,
    });
  });

  test("renders the assistant message", () => {
    render(<OrderMitraPanel />);

    expect(
      screen.getByText("Hello! How can I help you with your order?")
    ).toBeInTheDocument();
  });

  test("renders the chat input", () => {
    render(<OrderMitraPanel />);

    expect(
      screen.getByRole("textbox")
    ).toBeInTheDocument();
  });

  test("calls handleInputChange when the user types", () => {
    render(<OrderMitraPanel />);

    const input = screen.getByRole("textbox");

    fireEvent.change(input, {
      target: { value: "Where is my order?" },
    });

    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  test("calls handleSubmit when the message is submitted", () => {
    render(<OrderMitraPanel />);

    const input = screen.getByRole("textbox");

    fireEvent.submit(input.closest("form")!);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test("shows loading state while the assistant is responding", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      input: "Where is my order?",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      status: "streaming",
      stop: mockStop,
      reload: mockReload,
      error: undefined,
    });

    render(<OrderMitraPanel />);

    expect(
      screen.getByText(/loading|thinking|sending/i)
    ).toBeInTheDocument();
  });

  test("calls stop when stopping the response", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      status: "streaming",
      stop: mockStop,
      reload: mockReload,
      error: undefined,
    });

    render(<OrderMitraPanel />);

    const stopButton = screen.getByRole("button", {
      name: /stop/i,
    });

    fireEvent.click(stopButton);

    expect(mockStop).toHaveBeenCalled();
  });

  test("calls reload when retrying after an error", () => {
    mockUseChat.mockReturnValue({
      messages: [],
      input: "",
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
      status: "ready",
      stop: mockStop,
      reload: mockReload,
      error: new Error("Failed to send message"),
    });

    render(<OrderMitraPanel />);

    expect(
      screen.getByText(/failed to send message/i)
    ).toBeInTheDocument();

    const retryButton = screen.getByRole("button", {
      name: /retry|reload/i,
    });

    fireEvent.click(retryButton);

    expect(mockReload).toHaveBeenCalled();
  });
});
```

**Important:** the exact loading/error button text depends on your `OrderMitraPanel` implementation. If you share `components/ordermitra-panel.tsx`, I can make the tests match its actual UI exactly rather than guessing selectors.

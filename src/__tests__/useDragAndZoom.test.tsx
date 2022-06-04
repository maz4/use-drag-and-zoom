import { fireEvent, render, screen } from "@testing-library/react";
import useDragAndZoom from "../useDragAndZoom";

const TestComponent = (): JSX.Element => {
  const ref = useDragAndZoom<HTMLDivElement>({
    width: 200,
    height: 200,
    minZoom: 1,
    maxZoom: 2,
  });
  return (
    <div ref={ref} data-testid="test">
      <p>test text</p>
    </div>
  );
};

describe("test useDragAndZoom hook", () => {
  it("should render test component", () => {
    render(<TestComponent />);

    expect(screen.getByText(/test text/i)).toBeInTheDocument();
  });

  it("should check for inline transform style", () => {
    render(<TestComponent />);
    const div = screen.getByTestId("test");

    expect(div.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("should scroll and increase zoom", () => {
    render(<TestComponent />);
    const div = screen.getByTestId("test");

    fireEvent.wheel(div, { deltaY: 100 });

    expect(div.style.transform).toBe("translate(0px, 0px) scale(1.05)");
  });

  it("should scroll and decrease zoom", () => {
    render(<TestComponent />);
    const div = screen.getByTestId("test");

    fireEvent.wheel(div, { deltaY: 10 });
    expect(div.style.transform).toBe("translate(0px, 0px) scale(1.005)");

    fireEvent.wheel(div, { deltaY: -10 });
    expect(div.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("should zoom in and drag element", () => {
    render(<TestComponent />);
    const div = screen.getByTestId("test");

    fireEvent.wheel(div, { deltaY: 1000 });
    expect(div.style.transform).toBe("translate(0px, 0px) scale(1.5)");

    fireEvent.mouseDown(div);
    fireEvent.mouseMove(div, { clientX: -100, clientY: -100 });
    fireEvent.mouseUp(div);

    expect(div.style.transform).toBe("translate(-50px, -50px) scale(1.5)");
  });

  it("should zoom out and element change style translation to 0", () => {
    render(<TestComponent />);
    const div = screen.getByTestId("test");

    fireEvent.wheel(div, { deltaY: 2000 });
    expect(div.style.transform).toBe("translate(0px, 0px) scale(2)");

    fireEvent.mouseDown(div);
    fireEvent.mouseMove(div, { clientX: -100, clientY: -100 });
    fireEvent.mouseUp(div);

    expect(div.style.transform).toBe("translate(-100px, -100px) scale(2)");

    fireEvent.wheel(div, { deltaY: -2000 });
    expect(div.style.transform).toBe("translate(0px, 0px) scale(1)");
  });
});

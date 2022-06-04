import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface UseDraggable {
  width: number;
  height: number;
  minZoom: number;
  maxZoom: number;
}

const useDragAndZoom = <T extends HTMLElement>({
  width,
  height,
  minZoom,
  maxZoom,
}: UseDraggable): MutableRefObject<T> => {
  let SCROLL_SENSITIVITY = 0.0005;
  const [cameraOffset, setCameraOffset] = useState<Record<string, any>>({
    x: 0,
    y: 0,
  });
  const [cameraZoom, setCameraZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Record<string, number>>({
    x: 0,
    y: 0,
  });

  const containerRef = useRef<T>(null);

  const calculateContainerEdge = useCallback(
    (dimension: number, zoom: number) => {
      return (dimension * zoom - dimension) / 2;
    },
    []
  );

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      setIsDragging(true);
      setDragStart({
        x: event.clientX - cameraOffset.x,
        y: event.clientY - cameraOffset.y,
      });
    },
    [cameraOffset]
  );

  const onMouseUp = useCallback(
    (event: MouseEvent) => {
      setIsDragging(false);
    },
    [setIsDragging]
  );

  const onMouseOut = useCallback(
    (event: MouseEvent) => {
      setIsDragging(false);
    },
    [setIsDragging]
  );

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        const calculatedX = event.clientX - dragStart.x;
        const calculatedY = event.clientY - dragStart.y;

        const xEdge = calculateContainerEdge(width, cameraZoom);
        const yEdge = calculateContainerEdge(height, cameraZoom);

        let newX = Math.max(calculatedX, -xEdge);
        newX = Math.min(newX, xEdge);

        let newY = Math.max(calculatedY, -yEdge);
        newY = Math.min(newY, yEdge);

        setCameraOffset({
          x: newX,
          y: newY,
        });
      }
    },
    [
      dragStart,
      isDragging,
      setCameraOffset,
      width,
      height,
      cameraZoom,
      calculateContainerEdge,
    ]
  );

  const onWheelZoom = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      const zoomAmount = event.deltaY * SCROLL_SENSITIVITY;

      let tempZoom = cameraZoom;
      if (!isDragging) {
        if (zoomAmount) {
          tempZoom = tempZoom + zoomAmount;
        }

        tempZoom = Math.max(tempZoom, minZoom);
        tempZoom = Math.min(tempZoom, maxZoom);

        if (event.deltaY < 0) {
          const xEdge = calculateContainerEdge(width, tempZoom);
          const yEdge = calculateContainerEdge(height, tempZoom);

          const zoomDelta = (tempZoom - minZoom) / SCROLL_SENSITIVITY;

          const { x, y } = cameraOffset;
          const cameraOffsetDeltaX = x / zoomDelta < 1 ? 1 : zoomDelta;
          const cameraOffsetDeltaY = y / zoomDelta < 1 ? 1 : zoomDelta;

          const calculatedX =
            x > 0 ? x - cameraOffsetDeltaX : x + cameraOffsetDeltaX;
          const calculatedY =
            y > 0 ? y - cameraOffsetDeltaY : y + cameraOffsetDeltaY;

          let newX = Math.max(calculatedX, -xEdge);
          newX = Math.min(newX, xEdge);

          let newY = Math.max(calculatedY, -yEdge);
          newY = Math.min(newY, yEdge);

          if (x !== 0 || y !== 0) {
            setCameraOffset({
              x: newX,
              y: newY,
            });
          }
        }

        setCameraZoom(tempZoom);
      }
    },
    [
      height,
      cameraOffset,
      isDragging,
      maxZoom,
      minZoom,
      SCROLL_SENSITIVITY,
      width,
      cameraZoom,
      calculateContainerEdge,
      setCameraOffset,
      setCameraZoom,
    ]
  );

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref.style.transform = `translate(${cameraOffset.x}px, ${cameraOffset.y}px) scale(${cameraZoom})`;
    }
  }, [cameraOffset, containerRef, cameraZoom]);

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref?.addEventListener("mousedown", onMouseDown);
      ref?.addEventListener("mouseup", onMouseUp);
      ref?.addEventListener("mouseout", onMouseOut);
      ref?.addEventListener("mousemove", onMouseMove);
      ref?.addEventListener("wheel", onWheelZoom);
    }

    return () => {
      ref?.removeEventListener("mousedown", onMouseDown);
      ref?.removeEventListener("mouseup", onMouseUp);
      ref?.removeEventListener("mouseout", onMouseOut);
      ref?.removeEventListener("mousemove", onMouseMove);
      ref?.removeEventListener("wheel", onWheelZoom);
    };
  }, [
    onMouseDown,
    onMouseMove,
    onMouseOut,
    onMouseUp,
    onWheelZoom,
    containerRef,
  ]);

  return containerRef;
};

export default useDragAndZoom;

import useDragAndZoom from "../src/useDragAndZoom";

function Example() {
  const WIDTH = 600;
  const HEIGHT = 600;
  const MIN_ZOOM = 1;
  const MAZ_ZOOM = 2;
  const ref = useDragAndZoom<HTMLDivElement>({
    width: WIDTH,
    height: HEIGHT,
    minZoom: MIN_ZOOM,
    maxZoom: MAZ_ZOOM,
  });
  return (
    <div
      style={{
        overflow: "hidden",
      }}
    >
      <div
        ref={ref}
        style={{
          width: WIDTH,
          height: HEIGHT,
          backgroundImage: `url(./logo.svg)`, // your background image
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundColor: "royalblue",
        }}
      ></div>
    </div>
  );
}

export default Example;

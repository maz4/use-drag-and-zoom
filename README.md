# useDragAndZoom react hook

A simple react hook that allows dragging and zooming on the element.
It zooms in inside of the selected element and when zooms out the element comebacks to its original boundaries.

The parent element has to have CSS styles set to `overflow: hidden`

If you use typescript you will have to define a type of HTMLElement to which the ref is going to be attached to, for example `useDragAndZoom<HTMLDivElement>({...})`.

## installation

## Usage

```ts
const ref = useDragAndZoom<HTMLDivElement>({
  width: 600,
  height: 600,
  minZoom: 1,
  maxZoom: 2,
});

return (
  // parent div
  <div
    style={{
      overflow: "hidden",
    }}
  >
    <div ref={ref}>content of your element which can be zoomed in</div>
  </div>
);
```

## Interface

```ts
interface UseDraggable {
  width: number;
  height: number;
  minZoom: number;
  maxZoom: number;
}
```

## Demo

[Codesanbox link ](https://codesandbox.io/s/infallible-mendel-lehmyb?file=/src/App.tsx)

### License

MIT

"use client";

import { useEffect, useRef, useState } from "react";

interface PosState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function Home() {
  // const boxRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<PosState>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const [mousedown, setMousedown] = useState(false);
  const [mousedownResize, setMousedownResize] = useState(false);

  useEffect(() => {
    const movementHandler = (e: MouseEvent) => {
      if (mousedown) {
        setState({
          ...state,
          x: e.movementX + state.x,
          y: e.movementY + state.y,
        });
      }

      if (mousedownResize) {
        console.log("resize");
        setState({
          ...state,
          width: e.movementX + state.width,
          height: e.movementY + state.height,
        });
      }
    };

    const mouseupHandler = () => {
      setMousedown(false);
      setMousedownResize(false);
    };

    window.addEventListener("mousemove", movementHandler);
    window.addEventListener("mouseup", mouseupHandler);

    return () => {
      window.removeEventListener("mousemove", movementHandler);
      window.removeEventListener("mouseup", mouseupHandler);
    };
  }, [mousedown, mousedownResize, state]);

  return (
    <main>
      <div
        className="cursor-grab active:cursor-grabbing bg-zinc-500 bg-opacity-10 border-black absolute"
        style={{
          width: `${state.width}px`,
          height: `${state.height}px`,
          top: `${state.y}px`,
          left: `${state.x}px`,
        }}
        onMouseDown={() => {
          setMousedown(true);
        }}
      >
        <div
          onMouseDown={(e) => {
            setMousedownResize(true);
            e.stopPropagation();
          }}
          className="absolute bottom-0 right-0 w-4 h-4 bg-zinc-500 -mr-2 -mb-2"
        ></div>
      </div>
    </main>
  );
}

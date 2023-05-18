"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "@/app/page";

export interface PosState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function Viewer(props: { image: Image }) {
  const [state, setState] = useState<PosState>({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  });

  const [mousedown, setMousedown] = useState(false);
  const [mousedownResize, setMousedownResize] = useState(false);

  const submit = useCallback(() => {
    const scaleFactors = [
      props.image.size[0] / window.innerWidth,
      props.image.size[1] / window.innerHeight,
    ];

    const scaleFactor = Math.max(scaleFactors[0], scaleFactors[1]);

    fetch("/submitData", {
      method: "POST",
      body: JSON.stringify({
        data: {
          x: state.x * scaleFactor,
          y: state.y * scaleFactor,
          width: state.width * scaleFactor,
          height: state.height * scaleFactor,
        },
        name: props.image.name,
      }),
    });
  }, [
    props.image.name,
    props.image.size,
    state.height,
    state.width,
    state.x,
    state.y,
  ]);

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

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key == "Enter") {
        submit();
      }
    };

    window.addEventListener("mousemove", movementHandler);
    window.addEventListener("mouseup", mouseupHandler);

    window.addEventListener("keypress", keyHandler);

    return () => {
      window.removeEventListener("mousemove", movementHandler);
      window.removeEventListener("mouseup", mouseupHandler);
      window.removeEventListener("keypress", keyHandler);
    };
  }, [mousedown, mousedownResize, state, submit]);

  return (
    <div
      className="h-[100dvh] w-[100dvw] bg-contain bg-no-repeat"
      style={{ backgroundImage: `url("/${props.image.name}")` }}
    >
      <div
        className="cursor-grab active:cursor-grabbing bg-zinc-400 bg-opacity-50 border-black absolute"
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
      <button
        onClick={submit}
        className="bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white bottom-0 absolute  p-2 px-6 m-2 rounded-md shadow-md"
      >
        Submit
      </button>
    </div>
  );
}

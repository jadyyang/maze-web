import { useMemo, useRef, useState, useCallback } from "react";

import MazeService from "@/lib/service/maze";
import Board, { FenceData } from "@/lib/service/maze/board";


type Setting = {
  size: [number, number];
  inpos: [number, number];
  outpose: [number, number];
}

type Service = {
  create: (size: [number, number], inpos: [number, number], outpos: [number, number]) => void;
  drawBench: (() => boolean) | undefined;
}


export default function useMaze(): [FenceData | null, Service] {
  const [ data, setData ] = useState<FenceData | null>(null);
  const mazeRef = useRef<Board | null>(null);

  function create(size: [number, number], inpos: [number, number], outpos: [number, number]) {
    const maze = MazeService.create(size, inpos, outpos);
    mazeRef.current = maze;
    setData(maze.getFenceData());
  }

  const drawBench = useCallback(function () {
    const maze = mazeRef.current;
    if (maze !== null) {
      const result = maze.drawBench();
      setData(maze.getFenceData());
      return result;
    }
    return false;
  }, [mazeRef]);

  return [ data, {
    create,
    drawBench,
  } ];
}

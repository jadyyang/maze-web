import { useMemo, useRef, useState } from "react";

import MazeService from "@/lib/service/maze";
import Board, { FenceData } from "@/lib/service/maze/board";


type Setting = {
  size: [number, number];
  inpos: [number, number];
  outpose: [number, number];
}

type Service = {
  create: (size: [number, number], inpos: [number, number], outpos: [number, number]) => void;
}


export default function useMaze(): [FenceData | null, Service] {
  const [ data, setData ] = useState<FenceData | null>(null);
  const mazeRef = useRef<Board | null>(null);

  function create(size: [number, number], inpos: [number, number], outpos: [number, number]) {
    const maze = MazeService.create(size, inpos, outpos);
    mazeRef.current = maze;
    setData(maze.getFenceData());
  }

  return [ data, {
    create,
  } ];
}

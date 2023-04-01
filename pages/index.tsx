import { useState } from "react";

import Layout from "@/components/layout";
import Widget from "@/components/home/widget";
import useMaze from "@/components/home/use-maze";
import MazeBoard from "@/components/home/mazeboard";


export default function Maze() {
  const [ mazeData, mazeService ] = useMaze();

  function handleCreateMaze() {
    mazeService.create([8, 8], [4, 0], [4, 7]);
  }

  return (
    <Layout>
      <div className="my-10 grid w-full max-w-screen-xl animate-[slide-down-fade_0.5s_ease-in-out] grid-cols-1 gap-5 px-5 md:grid-cols-3 xl:px-0">
        <Widget key="view" large>
          <MazeBoard data={mazeData} />
        </Widget>
        <Widget key="control" title="控制">
          <button 
            onClick={handleCreateMaze}
            className="flex w-40 items-center justify-center rounded-md border border-gray-300 px-3 py-2 transition-all duration-75 hover:border-gray-800 focus:outline-none active:bg-gray-100"
          >生成</button>
        </Widget>
      </div>
    </Layout>
  );
}


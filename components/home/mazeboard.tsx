import { ReactNode } from "react";

import { FenceData } from "@/lib/service/maze/board";


const per_length = 30; // 单位长度
const offset = 2;


export default function MazeBoard({
  data,
}: {
  data: FenceData | null;
}) {
  if (data === null) {
    return <div>还没有生成</div>;
  }

  const items = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    for (let j = 0; j < row.length; j++) {
      const item = row[j];
      if (item[0] === 1) {
        items.push(<line 
          key={`${i}_${j}_0`}
          x1={(j+1) * per_length + offset}
          y1={i * per_length + offset}
          x2={(j+1) * per_length + offset}
          y2={(i+1) * per_length + offset}
          stroke="gray"
          // style="stroke:#006600;" 
        />);
      }

      if (item[1] === 1) {
        items.push(<line 
          key={`${i}_${j}_1`}
          x1={(j+1) * per_length + offset}
          y1={(i+1) * per_length + offset}
          x2={j * per_length + offset}
          y2={(i+1) * per_length + offset}
          stroke="gray"
          // style="stroke:#006600;" 
        />);
      }

      if (j === 0 && item[2] === 1) {
        items.push(<line 
          key={`${i}_${j}_2`}
          x1={j * per_length + offset}
          y1={(i+1) * per_length + offset}
          x2={j * per_length + offset}
          y2={i * per_length + offset}
          stroke="gray"
          // style="stroke:#006600;" 
        />);
      }

      if (i === 0 && item[3] === 1) {
        items.push(<line 
          key={`${i}_${j}_3`}
          x1={j * per_length + offset}
          y1={i * per_length + offset}
          x2={(j+1) * per_length + offset}
          y2={i * per_length + offset}
          stroke="gray"
          // style="stroke:#006600;" 
        />);
      }
    }
  }

  return (
    <svg width={data[0].length * per_length + 2 * offset} height={data.length * per_length + 2 * offset}>
      { items }
    </svg>
  )
}

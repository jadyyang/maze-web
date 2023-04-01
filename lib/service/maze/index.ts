import Board from './board';


export function create(
  size: [number, number], // 迷宫尺寸
  inpos: [number, number], // 入口坐标
  outpos: [number, number], // 出口坐标 
): Board {
  return new Board(size, inpos, outpos);
}

const Service = {
  create,
};

export default Service;

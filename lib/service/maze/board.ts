
type Point = [number, number]; // 点类型
type Line = Point[]; // 线类型

// 一个格子的围栏数据，四个分别是右侧、下侧、左侧、上侧是否有围栏，1表示有围栏，0表示没有围栏
export type FenceState = [0 | 1, 0 | 1, 0 | 1, 0 | 1];
export type FenceData = FenceState[][];


function getPointPosition([ x, y ]: Point, [ accordingX, accordingY ]: Point): 'right' | 'down' | 'left' | 'up' {
  if (x === accordingX) {
    return y > accordingY ? 'down' : 'up';
  }
  return x > accordingX ? 'right' : 'left';
}


export default class Board {
  size: [number, number] = [0, 0]; // 迷宫尺寸，第一项为宽度，第二项为高度
  inpos: Point = [0, 0]; // 入口坐标
  outpos: Point = [0, 0]; // 出口坐标 
  lines: Line[] = []; // 线列表

  constructor(
    size: [number, number], // 迷宫尺寸，第一个为宽
    inpos: Point, // 入口坐标
    outpos: Point, // 出口坐标 
  ) {
    this.size = size;
    this.inpos = inpos;
    this.outpos = outpos;

    this.lines = [Board.getLine(inpos, outpos)];
  }

  // 从起点到终点构建一条线
  static getLine(fromPoint: Point, toPoint: Point): Line {
    const line: Line = [];

    let [ x, y ] = fromPoint;
    line.push([x, y]);
    let [ toX, toY ] = toPoint;
    while ( x !== toX || y !== toY) {
      x = x === toX ? x : (x < toX ? (x + 1) : (x - 1));
      y = y === toY ? y : (y < toY ? (y + 1) : (y - 1));
      line.push([x, y]);
    }

    return line;
  }

  // 获得围栏数据
  getFenceData(): FenceData {
    const data: FenceData = [];

    // 构建整体围栏数据
    for (let i = 0; i < this.size[1]; i++) {
      data[i] = [];
      for (let j = 0; j < this.size[0]; j++) {
        data[i][j] = [1, 1, 1, 1];
      }
    }

    // 根据线更新围栏数据
    this.lines.forEach((line) => {
      console.log(line); // FIXME:
      for (let i = 1; i < line.length; i++) {
        const prevPoint = line[i-1];
        const point = line[i];
        switch (getPointPosition(point, prevPoint)) {
          case 'right':
            data[prevPoint[1]][prevPoint[0]][0] = 0;
            data[point[1]][point[0]][2] = 0;
            break;
          case 'down':
            data[prevPoint[1]][prevPoint[0]][1] = 0;
            data[point[1]][point[0]][3] = 0;
            break;
          case 'left':
            data[prevPoint[1]][prevPoint[0]][2] = 0;
            data[point[1]][point[0]][0] = 0;
            break;
          case 'up':
            data[prevPoint[1]][prevPoint[0]][3] = 0;
            data[point[1]][point[0]][1] = 0;
            break;
        }
      }
    });

    // 起点和结束点设置为空
    [this.inpos, this.outpos].forEach(([x, y]) => {
      if (x === 0) {
        data[y][x][2] = 0;
      } else if (x === data[0].length - 1) {
        data[y][x][0] = 0;
      }
      if (y === 0) {
        data[y][x][3] = 0;
      } else if (y === data.length - 1) {
        data[y][x][1] = 0;
      }
    });

    console.log(data); // FIXME:

    return data;
  }
}
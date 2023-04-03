
type Point = [number, number]; // 点类型
type Line = Point[]; // 线类型
type Direction = 'right' | 'down' | 'left' | 'up';

// 一个格子的围栏数据，四个分别是右侧、下侧、左侧、上侧是否有围栏，1表示有围栏，0表示没有围栏
export type FenceState = [0 | 1, 0 | 1, 0 | 1, 0 | 1];
export type FenceData = FenceState[][];


// 获得方向
function getDirection([ x, y ]: Point, [ accordingX, accordingY ]: Point): Direction {
  if (x === accordingX) {
    return y > accordingY ? 'down' : 'up';
  }
  return x > accordingX ? 'right' : 'left';
}

function random(value: number): number {
  return Math.floor(Math.random() * value);
}


export default class Board {
  size: [number, number] = [0, 0]; // 迷宫尺寸，第一项为宽度，第二项为高度
  inpos: Point = [0, 0]; // 入口坐标
  outpos: Point = [0, 0]; // 出口坐标 
  #usePoints: (0 | 1)[][] = []; // 每个坐标点是否被占用，1表示占用，0表示没有占用
  #lines: Line[] = []; // 线列表

  constructor(
    size: [number, number], // 迷宫尺寸，第一个为宽
    inpos: Point, // 入口坐标
    outpos: Point, // 出口坐标 
  ) {
    this.size = size;
    this.inpos = inpos;
    this.outpos = outpos;

    this.#usePoints = [];
    this.#initUsePoints();

    // 这里存储线的列表。第1条线是主线，也就是通路。其他的不是
    this.#lines = [];

    this.#initMainLine();
  }

  // 从起点到终点构建一条线
  static getLine(fromPoint: Point, toPoint: Point): Line {
    const line: Line = [];

    let [ x, y ] = fromPoint;
    line.push([x, y]);
    let [ toX, toY ] = toPoint;
    while ( x !== toX || y !== toY) {
      if (x !== toX) {
        x = x < toX ? (x + 1) : (x - 1);
      } else {
        y = y < toY ? (y + 1) : (y - 1);
      } 
      line.push([x, y]);
    }

    return line;
  }

  // 初始化主路
  #initMainLine() {
    const line = Board.getLine(this.inpos, this.outpos);

    for(const point of line) {
      this.#usePoint(point);
    }

    this.#lines = [line];
  }

  #initUsePoints() {
    const usePoints: (0 | 1)[][] = [];

    // 构建整体围栏数据
    for (let i = 0; i < this.size[1]; i++) {
      usePoints[i] = [];
      for (let j = 0; j < this.size[0]; j++) {
        usePoints[i][j] = 0;
      }
    }

    this.#usePoints = usePoints;
  }

  // 占用某个点
  #usePoint([x, y]: Point) {
    this.#usePoints[y][x] = 1;
  } 

  // 不占用某个点
  #unusePoint([x, y]: Point) {
    this.#usePoints[y][x] = 0;
  } 

  /**
   * 在主线上拉丝
   * 
   * @returns 是否添加成功
   */
  drawBench(): boolean {
    let line = this.#lines[0];

    // 线上随机选择一点（不包括最后一点）
    const i = random(line.length - 1);
    const point = line[i];
    const nextPoint = line[i + 1];
    console.log(`选择了第 ${i} 个点，分别是 ${point}, ${nextPoint}`); // FIXME:

    const directions = point[1] === nextPoint[1] ? ['up', 'down'] : ['left', 'right'];
    if (Math.round(Math.random()) === 1) directions.reverse();
    for (const direction of directions) {
      let steps = this.#getMaxSteps([point, nextPoint], direction as Direction);
      console.log(`${direction} 方向上，最多有 ${steps} 步`); // FIXME:
      if (steps > 0) {
        steps = random(steps) + 1;
        const newPoints = this.#addCorner([point, nextPoint], direction as Direction, steps);
        console.log(`${direction} 上，移动了 ${steps} 步，生成了新的点为: `, newPoints); // FIXME:
        line.splice(i, 0, ...newPoints);
        newPoints.forEach(point => this.#usePoint(point));
        return true;
      }
    }

    return false;
  }

  #getMaxSteps(points: [Point, Point], direction: Direction): number {
    // FIXME: 注意：
    // points 的两个点必须是相邻的
    // direction必须是points两点连线的垂线方向

    const axis = direction === 'left' || direction === 'right' ? 0 : 1;
    const step = direction === 'right' || direction === 'down' ? 1 : -1;

    let steps = 1;
    while (points.every((point) => {
      const newPoint = [...point];
      newPoint[axis] = newPoint[axis] + step * steps;
      const [ x, y ] = newPoint;

      return x >= 0 && x < this.size[0] && y >= 0 && y < this.size[1] && this.#usePoints[y][x] === 0;
    })) {
      steps += 1;
    }

    return steps - 1;
  }

  #addCorner(points: [Point, Point], direction: Direction, steps: number): Point[] {
    const axis = direction === 'left' || direction === 'right' ? 0 : 1;
    const step = direction === 'right' || direction === 'down' ? 1 : -1;

    const newPoints: [Point[], Point[]] = [[], []];
    for (let i = 1; i<=steps; i++) {
      points.forEach((point, j) => {
        const newPoint: Point = [...point];
        newPoint[axis] = newPoint[axis] + step * i;
        newPoints[j].push(newPoint);
      });
    }

    newPoints[1].reverse();
    return newPoints[0].concat(newPoints[1]);
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
    this.#lines.forEach((line) => {
      for (let i = 1; i < line.length; i++) {
        const prevPoint = line[i-1];
        const point = line[i];
        switch (getDirection(point, prevPoint)) {
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
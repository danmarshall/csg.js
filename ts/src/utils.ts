import Vector2D from './math/Vector2'

function fnNumberSort (a: number, b: number) {
  return a - b
}

function fnSortByIndex (a: { index: number}, b: { index: number}) {
  return a.index - b.index
}

const IsFloat = function (n: number) {
  return (!isNaN(n)) || (n === Infinity) || (n === -Infinity)
}

const solve2Linear = function (a: number, b: number, c: number, d: number, u: number, v: number) {
  let det = a * d - b * c
  let invdet = 1.0 / det
  let x = u * d - b * v
  let y = -u * c + a * v
  x *= invdet
  y *= invdet
  return [x, y]
}

function insertSorted<T>(array: T[], element: T, comparefunc: (a: T, b: T) => number) {
  let leftbound = 0
  let rightbound = array.length
  while (rightbound > leftbound) {
    let testindex = Math.floor((leftbound + rightbound) / 2)
    let testelement = array[testindex]
    let compareresult = comparefunc(element, testelement)
    if (compareresult > 0) // element > testelement
    {
      leftbound = testindex + 1
    } else {
      rightbound = testindex
    }
  }
  array.splice(leftbound, 0, element)
}

// Get the x coordinate of a point with a certain y coordinate, interpolated between two
// points (CSG.Vector2D).
// Interpolation is robust even if the points have the same y coordinate
const interpolateBetween2DPointsForY = function (point1: Vector2D, point2: Vector2D, y: number) {
  let f1 = y - point1.y
  let f2 = point2.y - point1.y
  if (f2 < 0) {
    f1 = -f1
    f2 = -f2
  }
  let t: number;
  if (f1 <= 0) {
    t = 0.0
  } else if (f1 >= f2) {
    t = 1.0
  } else if (f2 < 1e-10) { // FIXME Should this be CSG.EPS?
    t = 0.5
  } else {
    t = f1 / f2
  }
  let result = point1.x + t * (point2.x - point1.x)
  return result
}

export {
  fnNumberSort,
  fnSortByIndex,
  IsFloat,
  solve2Linear,
  insertSorted,
  interpolateBetween2DPointsForY
}

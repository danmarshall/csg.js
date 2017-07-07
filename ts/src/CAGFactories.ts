import CAG from './CAG';
import Side from './math/Side';
import Vector2D from './math/Vector2';
import Vertex from './math/Vertex2';

/** Reconstruct a CAG from an object with identical property names.
 * @param {Object} obj - anonymous object, typically from JSON
 * @returns {CAG} new CAG object
 */
const fromObject = function (obj) {
  let sides = obj.sides.map(function (s) {
    return Side.fromObject(s)
  })
  let cag = CAG.fromSides(sides)
  cag.isCanonicalized = obj.isCanonicalized
  return cag
}

/** Construct a CAG from a list of points (a polygon).
 * Like fromPoints() but does not check if the result is a valid polygon.
 * The points MUST rotate counter clockwise.
 * The points can define a convex or a concave polygon.
 * The polygon must not self intersect.
 * @param {points[]} points - list of points in 2D space
 * @returns {CAG} new CAG object
 */
const fromPointsNoCheck = function (points: Vector2D[]) {
  let sides: Side[] = []
  let prevpoint = new Vector2D(points[points.length - 1])
  let prevvertex = new Vertex(prevpoint)
  points.map(function (p) {
    let point = new Vector2D(p)
    let vertex = new Vertex(point)
    let side = new Side(prevvertex, vertex)
    sides.push(side)
    prevvertex = vertex
  })
  return CAG.fromSides(sides)
}

export {
  fromObject,
  fromPointsNoCheck,
  //fromFakeCSG
}

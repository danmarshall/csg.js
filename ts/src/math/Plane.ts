import Vector3D from './Vector3'
import Line3D from './Line3'
import { EPS, getTag } from '../constants'
import Matrix4 from './Matrix4'

// # class Plane
// Represents a plane in 3D space.
class Plane {
  private tag: number;

  constructor(public normal: Vector3D, public w: number) {
    this.normal = normal
    this.w = w
  }

  // create from an untyped object with identical property names:
  static fromObject(obj: Plane) {
    let normal = new Vector3D(obj.normal)
    let w = parseFloat(obj.w as any)
    return new Plane(normal, w)
  }

  static fromVector3Ds(a: Vector3D, b: Vector3D, c: Vector3D) {
    let n = b.minus(a).cross(c.minus(a)).unit()
    return new Plane(n, n.dot(a))
  }

  // like fromVector3Ds, but allow the vectors to be on one point or one line
  // in such a case a random plane through the given points is constructed
  static anyPlaneFromVector3Ds(a: Vector3D, b: Vector3D, c: Vector3D) {
    let v1 = b.minus(a)
    let v2 = c.minus(a)
    if (v1.length() < EPS) {
      v1 = v2.randomNonParallelVector()
    }
    if (v2.length() < EPS) {
      v2 = v1.randomNonParallelVector()
    }
    let normal = v1.cross(v2)
    if (normal.length() < EPS) {
      // this would mean that v1 == v2.negated()
      v2 = v1.randomNonParallelVector()
      normal = v1.cross(v2)
    }
    normal = normal.unit()
    return new Plane(normal, normal.dot(a))
  }

  static fromPoints(a: Vector3D, b: Vector3D, c: Vector3D) {
    a = new Vector3D(a)
    b = new Vector3D(b)
    c = new Vector3D(c)
    return Plane.fromVector3Ds(a, b, c)
  }

  static fromNormalAndPoint(normal: Vector3D, point: Vector3D) {
    normal = new Vector3D(normal)
    point = new Vector3D(point)
    normal = normal.unit()
    let w = point.dot(normal)
    return new Plane(normal, w)
  }

  flipped() {
    return new Plane(this.normal.negated(), -this.w)
  }

  getTag() {
    let result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  }

  equals(n: Plane) {
    return this.normal.equals(n.normal) && this.w === n.w
  }

  transform(matrix4x4: Matrix4) {
    let ismirror = matrix4x4.isMirroring()
    // get two vectors in the plane:
    let r = this.normal.randomNonParallelVector()
    let u = this.normal.cross(r)
    let v = this.normal.cross(u)
    // get 3 points in the plane:
    let point1 = this.normal.times(this.w)
    let point2 = point1.plus(u)
    let point3 = point1.plus(v)
    // transform the points:
    point1 = point1.multiply4x4(matrix4x4)
    point2 = point2.multiply4x4(matrix4x4)
    point3 = point3.multiply4x4(matrix4x4)
    // and create a new plane from the transformed points:
    let newplane = Plane.fromVector3Ds(point1, point2, point3)
    if (ismirror) {
      // the transform is mirroring
      // We should mirror the plane:
      newplane = newplane.flipped()
    }
    return newplane
  }

  // robust splitting of a line by a plane
  // will work even if the line is parallel to the plane
  splitLineBetweenPoints(p1: Vector3D, p2: Vector3D) {
    let direction = p2.minus(p1)
    let labda = (this.w - this.normal.dot(p1)) / this.normal.dot(direction)
    if (isNaN(labda)) labda = 0
    if (labda > 1) labda = 1
    if (labda < 0) labda = 0
    let result = p1.plus(direction.times(labda))
    return result
  }

  // returns Vector3D
  intersectWithLine(line3d: Line3D) {
    return line3d.intersectWithPlane(this)
  }

  // intersection of two planes
  intersectWithPlane(plane: Plane) {
    return Line3D.fromPlanes(this, plane)
  }

  signedDistanceToPoint(point: Vector3D) {
    let t = this.normal.dot(point) - this.w
    return t
  }

  toString() {
    return '[normal: ' + this.normal.toString() + ', w: ' + this.w + ']'
  }

  mirrorPoint(point3d: Vector3D) {
    let distance = this.signedDistanceToPoint(point3d)
    let mirrored = point3d.minus(this.normal.times(distance * 2.0))
    return mirrored
  }
}

export default Plane

import { IsFloat } from '../utils';
import Vector3D from './Vector3'; // FIXME: circular dependencies Vector2 => Vector3 => Vector2
import Matrix4 from './Matrix4';

/** Class Vector2D
 * Represents a 2D vector with X, Y coordinates
 * @constructor
 *
 * @example
 * new CSG.Vector2D(1, 2);
 * new CSG.Vector3D([1, 2]);
 * new CSG.Vector3D({ x: 1, y: 2});
 */
class Vector2D {
  public _x: number;
  public _y: number;

  constructor(v: Vector2D | number[]);
  constructor(x: number, y: number);

  constructor(x, y?) {
    if (arguments.length === 2) {
      this._x = parseFloat(x)
      this._y = parseFloat(y)
    } else {
      var ok = true
      if (arguments.length === 1) {
        if (typeof (x) === 'object') {
          if (x instanceof Vector2D) {
            this._x = x._x
            this._y = x._y
          } else if (x instanceof Array) {
            this._x = parseFloat(x[0])
            this._y = parseFloat(x[1])
          } else if (('x' in x) && ('y' in x)) {
            this._x = parseFloat(x.x)
            this._y = parseFloat(x.y)
          } else ok = false
        } else {
          var v = parseFloat(x)
          this._x = v
          this._y = v
        }
      } else ok = false
      if (ok) {
        if ((!IsFloat(this._x)) || (!IsFloat(this._y))) ok = false
      }
      if (!ok) {
        throw new Error('wrong arguments')
      }
    }
  }

  static fromAngle(radians: number) {
    return Vector2D.fromAngleRadians(radians)
  }

  static fromAngleDegrees(degrees: number) {
    var radians = Math.PI * degrees / 180
    return Vector2D.fromAngleRadians(radians)
  }

  static fromAngleRadians(radians: number) {
    return Vector2D.Create(Math.cos(radians), Math.sin(radians))
  }

  // This does the same as new Vector2D(x,y) but it doesn't go through the constructor
  // and the parameters are not validated. Is much faster.
  static Create(x: number, y: number) {
    var result = Object.create(Vector2D.prototype) as Vector2D
    result._x = x
    result._y = y
    return result
  }

  get x() {
    return this._x
  }
  get y() {
    return this._y
  }

  set x(v) {
    throw new Error('Vector2D is immutable')
  }
  set y(v) {
    throw new Error('Vector2D is immutable')
  }

  // extend to a 3D vector by adding a z coordinate:
  toVector3D(z: number) {
    return new Vector3D(this._x, this._y, z)
  }

  equals(a: Vector2D) {
    return (this._x === a._x) && (this._y === a._y)
  }

  clone() {
    return Vector2D.Create(this._x, this._y)
  }

  negated() {
    return Vector2D.Create(-this._x, -this._y)
  }

  plus(a: Vector2D) {
    return Vector2D.Create(this._x + a._x, this._y + a._y)
  }

  minus(a: Vector2D) {
    return Vector2D.Create(this._x - a._x, this._y - a._y)
  }

  times(a: number) {
    return Vector2D.Create(this._x * a, this._y * a)
  }

  dividedBy(a: number) {
    return Vector2D.Create(this._x / a, this._y / a)
  }

  dot(a: Vector2D) {
    return this._x * a._x + this._y * a._y
  }

  lerp(a: Vector2D, t: number) {
    return this.plus(a.minus(this).times(t))
  }

  length() {
    return Math.sqrt(this.dot(this))
  }

  distanceTo(a: Vector2D) {
    return this.minus(a).length()
  }

  distanceToSquared(a: Vector2D) {
    return this.minus(a).lengthSquared()
  }

  lengthSquared() {
    return this.dot(this)
  }

  unit() {
    return this.dividedBy(this.length())
  }

  cross(a: Vector2D) {
    return this._x * a._y - this._y * a._x
  }

  // returns the vector rotated by 90 degrees clockwise
  normal() {
    return Vector2D.Create(this._y, -this._x)
  }

  // Right multiply by a 4x4 matrix (the vector is interpreted as a row vector)
  // Returns a new Vector2D
  multiply4x4(matrix4x4: Matrix4) {
    return matrix4x4.leftMultiply1x2Vector(this)
  }

  transform(matrix4x4: Matrix4) {
    return matrix4x4.leftMultiply1x2Vector(this)
  }

  angle() {
    return this.angleRadians()
  }

  angleDegrees() {
    var radians = this.angleRadians()
    return 180 * radians / Math.PI
  }

  angleRadians() {
    // y=sin, x=cos
    return Math.atan2(this._y, this._x)
  }

  min(p: Vector2D) {
    return Vector2D.Create(
      Math.min(this._x, p._x), Math.min(this._y, p._y))
  }

  max(p: Vector2D) {
    return Vector2D.Create(
      Math.max(this._x, p._x), Math.max(this._y, p._y))
  }

  toString() {
    return '(' + this._x.toFixed(5) + ', ' + this._y.toFixed(5) + ')'
  }

  abs() {
    return Vector2D.Create(Math.abs(this._x), Math.abs(this._y))
  }
}

export default Vector2D

import Vector3D from './Vector3';
import { getTag } from '../constants';
import Matrix4 from './Matrix4'

// # class Vertex
// Represents a vertex of a polygon. Use your own vertex class instead of this
// one to provide additional features like texture coordinates and vertex
// colors. Custom vertex classes need to provide a `pos` property
// `flipped()`, and `interpolate()` methods that behave analogous to the ones
// FIXME: And a lot MORE (see plane.fromVector3Ds for ex) ! This is fragile code
// defined by `Vertex`.
class Vertex {
  private tag: number;

  constructor(public pos: Vector3D) {
    this.pos = pos
  }

  // create from an untyped object with identical property names:
  static fromObject(obj: Vertex) {
    var pos = new Vector3D(obj.pos)
    return new Vertex(pos)
  }

  // Return a vertex with all orientation-specific data (e.g. vertex normal) flipped. Called when the
  // orientation of a polygon is flipped.
  flipped() {
    return this
  }

  getTag() {
    var result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  }

  // Create a new vertex between this vertex and `other` by linearly
  // interpolating all properties using a parameter of `t`. Subclasses should
  // override this to interpolate additional properties.
  interpolate(other: Vertex, t: number) {
    var newpos = this.pos.lerp(other.pos, t)
    return new Vertex(newpos)
  }

  // Affine transformation of vertex. Returns a new Vertex
  transform(matrix4x4: Matrix4) {
    var newpos = this.pos.multiply4x4(matrix4x4)
    return new Vertex(newpos)
  }

  toString() {
    return this.pos.toString()
  }
}

export default Vertex

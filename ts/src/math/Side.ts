import Vector2D from './Vector2'
import Vertex from './Vertex2'
import Vertex3 from './Vertex3'
import Polygon from './Polygon3'
import { getTag } from '../constants'
import Matrix4 from './Matrix4'
class Side {
  private tag: number;

  constructor(public vertex0: Vertex, public vertex1: Vertex) {
    if (!(vertex0 instanceof Vertex)) throw new Error('Assertion failed')
    if (!(vertex1 instanceof Vertex)) throw new Error('Assertion failed')
    this.vertex0 = vertex0
    this.vertex1 = vertex1
  }

  static fromObject(obj: Side) {
    var vertex0 = Vertex.fromObject(obj.vertex0)
    var vertex1 = Vertex.fromObject(obj.vertex1)
    return new Side(vertex0, vertex1)
  }

  static _fromFakePolygon(polygon: Polygon) {
    // this can happen based on union, seems to be residuals -
    // return null and handle in caller
    if (polygon.vertices.length < 4) {
      return null
    }
    var vert1Indices = []
    var pts2d = polygon.vertices.filter(function (v, i) {
      if (v.pos.z > 0) {
        vert1Indices.push(i)
        return true
      }
      return false
    })
      .map(function (v) {
        return new Vector2D(v.pos.x, v.pos.y)
      })
    if (pts2d.length !== 2) {
      throw new Error('Assertion failed: _fromFakePolygon: not enough points found')
    }
    var d = vert1Indices[1] - vert1Indices[0]
    if (d === 1 || d === 3) {
      if (d === 1) {
        pts2d.reverse()
      }
    } else {
      throw new Error('Assertion failed: _fromFakePolygon: unknown index ordering')
    }
    var result = new Side(new Vertex(pts2d[0]), new Vertex(pts2d[1]))
    return result
  }

  toString() {
    return this.vertex0 + ' -> ' + this.vertex1
  }

  toPolygon3D(z0: number, z1: number) {
    //console.log(this.vertex0.pos)
    const vertices = [
      new Vertex3(this.vertex0.pos.toVector3D(z0)),
      new Vertex3(this.vertex1.pos.toVector3D(z0)),
      new Vertex3(this.vertex1.pos.toVector3D(z1)),
      new Vertex3(this.vertex0.pos.toVector3D(z1))
    ]
    return new Polygon(vertices)
  }

  transform(matrix4x4: Matrix4) {
    var newp1 = this.vertex0.pos.transform(matrix4x4)
    var newp2 = this.vertex1.pos.transform(matrix4x4)
    return new Side(new Vertex(newp1), new Vertex(newp2))
  }

  flipped() {
    return new Side(this.vertex1, this.vertex0)
  }

  direction() {
    return this.vertex1.pos.minus(this.vertex0.pos)
  }

  getTag() {
    var result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  }

  lengthSquared() {
    let x = this.vertex1.pos.x - this.vertex0.pos.x
    let y = this.vertex1.pos.y - this.vertex0.pos.y
    return x * x + y * y
  }

  length() {
    return Math.sqrt(this.lengthSquared())
  }
}

export default Side

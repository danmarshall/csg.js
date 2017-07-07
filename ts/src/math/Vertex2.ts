import Vector2D from './Vector2'
import { getTag } from '../constants'

class Vertex {
  private tag: number;

  constructor(public pos: Vector2D) {
    this.pos = pos
  }

  static fromObject(obj: Vertex) {
    return new Vertex(new Vector2D(obj.pos._x, obj.pos._y))
  }

  toString() {
    return '(' + this.pos.x.toFixed(5) + ',' + this.pos.y.toFixed(5) + ')'
  }

  getTag() {
    var result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  }
}

export default Vertex

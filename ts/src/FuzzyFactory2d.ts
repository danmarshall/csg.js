import FuzzyFactory from './FuzzyFactory'
import { EPS } from './constants'
import Side from './math/Side'
import Vertex from './math/Vertex2'

class FuzzyCAGFactory {
  private vertexfactory: FuzzyFactory<Vertex>;

  constructor() {
    this.vertexfactory = new FuzzyFactory<Vertex>(2, EPS)
  }

  getVertex(sourcevertex: Vertex) {
    let elements = [sourcevertex.pos._x, sourcevertex.pos._y]
    let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  }

  getSide(sourceside: Side) {
    let vertex0 = this.getVertex(sourceside.vertex0)
    let vertex1 = this.getVertex(sourceside.vertex1)
    return new Side(vertex0, vertex1)
  }
}

export default FuzzyCAGFactory

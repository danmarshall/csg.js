import { EPS } from './constants'
import Polygon from './math/Polygon3'
import FuzzyFactory from './FuzzyFactory'
import Vertex3 from './math/Vertex3'
import Plane from './math/Plane'
import { Shared } from './math/Polygon3'

// ////////////////////////////////////
class FuzzyCSGFactory {
  private vertexfactory: FuzzyFactory<Vertex3>;
  private planefactory: FuzzyFactory<Plane>;
  private polygonsharedfactory;

  constructor() {
    this.vertexfactory = new FuzzyFactory<Vertex3>(3, EPS)
    this.planefactory = new FuzzyFactory<Plane>(4, EPS)
    this.polygonsharedfactory = {}
  }

  getPolygonShared(sourceshared: Shared) {
    let hash = sourceshared.getHash()
    if (hash in this.polygonsharedfactory) {
      return this.polygonsharedfactory[hash]
    } else {
      this.polygonsharedfactory[hash] = sourceshared
      return sourceshared
    }
  }

  getVertex(sourcevertex: Vertex3) {
    let elements = [sourcevertex.pos._x, sourcevertex.pos._y, sourcevertex.pos._z]
    let result = this.vertexfactory.lookupOrCreate(elements, function (els) {
      return sourcevertex
    })
    return result
  }

  getPlane(sourceplane: Plane) {
    let elements = [sourceplane.normal._x, sourceplane.normal._y, sourceplane.normal._z, sourceplane.w]
    let result = this.planefactory.lookupOrCreate(elements, function (els) {
      return sourceplane
    })
    return result
  }

  getPolygon(sourcepolygon: Polygon) {
    let newplane = this.getPlane(sourcepolygon.plane)
    let newshared = this.getPolygonShared(sourcepolygon.shared)
    let _this = this
    let newvertices = sourcepolygon.vertices.map(function (vertex) {
      return _this.getVertex(vertex)
    })
    // two vertices that were originally very close may now have become
    // truly identical (referring to the same Vertex object).
    // Remove duplicate vertices:
    let newverticesDedup = []
    if (newvertices.length > 0) {
      let prevvertextag = newvertices[newvertices.length - 1].getTag()
      newvertices.forEach(function (vertex) {
        let vertextag = vertex.getTag()
        if (vertextag !== prevvertextag) {
          newverticesDedup.push(vertex)
        }
        prevvertextag = vertextag
      })
    }
    // If it's degenerate, remove all vertices:
    if (newverticesDedup.length < 3) {
      newverticesDedup = []
    }
    return new Polygon(newverticesDedup, newshared, newplane)
  }
}

export default FuzzyCSGFactory

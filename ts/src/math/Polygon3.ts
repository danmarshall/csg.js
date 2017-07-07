import Vector3D from './Vector3'
import Vertex from './Vertex3'
import Matrix4x4 from './Matrix4'
import { _CSGDEBUG, EPS, getTag, areaEPS } from '../constants'
import { fnSortByIndex } from '../utils'
import Plane from './Plane'
import CSG from '../CSG'; // because of circular dependencies
import OrthoNormalBasis from './OrthoNormalBasis'
import CAG from '../CAG'
import { fromPointsNoCheck } from '../CAGFactories'; // circular dependencies

// # class Polygon
// Represents a convex polygon. The vertices used to initialize a polygon must
// be coplanar and form a convex loop. They do not have to be `Vertex`
// instances but they must behave similarly (duck typing can be used for
// customization).
//
// Each convex polygon has a `shared` property, which is shared between all
// polygons that are clones of each other or were split from the same polygon.
// This can be used to define per-polygon properties (such as surface color).
//
// The plane of the polygon is calculated from the vertex coordinates
// To avoid unnecessary recalculation, the plane can alternatively be
// passed as the third argument
class Polygon {
  private cachedBoundingSphere: [Vector3D, number];
  private cachedBoundingBox: Vector3D[];

  constructor(public vertices: Vertex[], public shared?: Shared, public plane?: Plane) {
    this.vertices = vertices
    if (!shared) shared = Polygon.defaultShared
    this.shared = shared
    // let numvertices = vertices.length;

    if (arguments.length >= 3) {
      this.plane = plane
    } else {
      this.plane = Plane.fromVector3Ds(vertices[0].pos, vertices[1].pos, vertices[2].pos)
    }

    if (_CSGDEBUG) {
      this.checkIfConvex()
    }
  }

  // create from an untyped object with identical property names:
  static fromObject(obj) {
    let vertices = obj.vertices.map(function (v) {
      return Vertex.fromObject(v)
    })
    let shared = Polygon.Shared.fromObject(obj.shared)
    let plane = Plane.fromObject(obj.plane)
    return new Polygon(vertices, shared, plane)
  }

  // check whether the polygon is convex (it should be, otherwise we will get unexpected results)
  checkIfConvex() {
    if (!Polygon.verticesConvex(this.vertices, this.plane.normal)) {
      Polygon.verticesConvex(this.vertices, this.plane.normal)
      throw new Error('Not convex!')
    }
  }

  setColor(r: number, g: number, b: number, a?: number);
  setColor(rgba: number[]);
  setColor(args) {
    let newshared = Polygon.Shared.fromColor.apply(this, arguments)
    this.shared = newshared
    return this
  }

  getSignedVolume() {
    let signedVolume = 0
    for (let i = 0; i < this.vertices.length - 2; i++) {
      signedVolume += this.vertices[0].pos.dot(this.vertices[i + 1].pos
        .cross(this.vertices[i + 2].pos))
    }
    signedVolume /= 6
    return signedVolume
  }

  // Note: could calculate vectors only once to speed up
  getArea() {
    let polygonArea = 0
    for (let i = 0; i < this.vertices.length - 2; i++) {
      polygonArea += this.vertices[i + 1].pos.minus(this.vertices[0].pos)
        .cross(this.vertices[i + 2].pos.minus(this.vertices[i + 1].pos)).length()
    }
    polygonArea /= 2
    return polygonArea
  }

  // accepts array of features to calculate
  // returns array of results
  getTetraFeatures(features: string[]) {
    let result: number[] = []
    features.forEach(function (feature) {
      if (feature === 'volume') {
        result.push(this.getSignedVolume())
      } else if (feature === 'area') {
        result.push(this.getArea())
      }
    }, this)
    return result
  }

  // Extrude a polygon into the direction offsetvector
  // Returns a CSG object
  extrude(offsetvector: Vector3D) {

    let newpolygons = []

    let polygon1 = this as Polygon;
    let direction = polygon1.plane.normal.dot(offsetvector)
    if (direction > 0) {
      polygon1 = polygon1.flipped()
    }
    newpolygons.push(polygon1)
    let polygon2 = polygon1.translate(offsetvector)
    let numvertices = this.vertices.length
    for (let i = 0; i < numvertices; i++) {
      let sidefacepoints = []
      let nexti = (i < (numvertices - 1)) ? i + 1 : 0
      sidefacepoints.push(polygon1.vertices[i].pos)
      sidefacepoints.push(polygon2.vertices[i].pos)
      sidefacepoints.push(polygon2.vertices[nexti].pos)
      sidefacepoints.push(polygon1.vertices[nexti].pos)
      let sidefacepolygon = Polygon.createFromPoints(sidefacepoints, this.shared)
      newpolygons.push(sidefacepolygon)
    }
    polygon2 = polygon2.flipped()
    newpolygons.push(polygon2)
    return CSG.fromPolygons(newpolygons)
  }

  translate(offset: Vector3D | number[]) {
    return this.transform(Matrix4x4.translation(offset))
  }

  // returns an array with a Vector3D (center point) and a radius
  boundingSphere() {
    if (!this.cachedBoundingSphere) {
      let box = this.boundingBox()
      let middle = box[0].plus(box[1]).times(0.5)
      let radius3 = box[1].minus(middle)
      let radius = radius3.length()
      this.cachedBoundingSphere = [middle, radius]
    }
    return this.cachedBoundingSphere
  }

  // returns an array of two Vector3Ds (minimum coordinates and maximum coordinates)
  boundingBox() {
    if (!this.cachedBoundingBox) {
      let minpoint: Vector3D, maxpoint: Vector3D
      let vertices = this.vertices
      let numvertices = vertices.length
      if (numvertices === 0) {
        minpoint = new Vector3D(0, 0, 0)
      } else {
        minpoint = vertices[0].pos
      }
      maxpoint = minpoint
      for (let i = 1; i < numvertices; i++) {
        let point = vertices[i].pos
        minpoint = minpoint.min(point)
        maxpoint = maxpoint.max(point)
      }
      this.cachedBoundingBox = [minpoint, maxpoint]
    }
    return this.cachedBoundingBox
  }

  flipped() {
    let newvertices = this.vertices.map(function (v) {
      return v.flipped()
    })
    newvertices.reverse()
    let newplane = this.plane.flipped()
    return new Polygon(newvertices, this.shared, newplane)
  }

  // Affine transformation of polygon. Returns a new Polygon
  transform(matrix4x4: Matrix4x4) {
    let newvertices = this.vertices.map(function (v) {
      return v.transform(matrix4x4)
    })
    let newplane = this.plane.transform(matrix4x4)
    if (matrix4x4.isMirroring()) {
      // need to reverse the vertex order
      // in order to preserve the inside/outside orientation:
      newvertices.reverse()
    }
    return new Polygon(newvertices, this.shared, newplane)
  }

  toString() {
    let result = 'Polygon plane: ' + this.plane.toString() + '\n'
    this.vertices.map(function (vertex) {
      result += '  ' + vertex.toString() + '\n'
    })
    return result
  }

  // project the 3D polygon onto a plane
  projectToOrthoNormalBasis(orthobasis: OrthoNormalBasis) {
    let points2d = this.vertices.map(function (vertex) {
      return orthobasis.to2D(vertex.pos)
    })

    let result = fromPointsNoCheck(points2d)
    let area = result.area()
    if (Math.abs(area) < areaEPS) {
      // the polygon was perpendicular to the orthnormal plane. The resulting 2D polygon would be degenerate
      // return an empty area instead:
      result = new CAG()
    } else if (area < 0) {
      result = result.flipped()
    }
    return result
  }

  //FIXME: WHY is this for 3D polygons and not for 2D shapes ?
  /**
   * Creates solid from slices (Polygon) by generating walls
   * @param {Object} options Solid generating options
   *  - numslices {Number} Number of slices to be generated
   *  - callback(t, slice) {Function} Callback function generating slices.
   *          arguments: t = [0..1], slice = [0..numslices - 1]
   *          return: Polygon or null to skip
   *  - loop {Boolean} no flats, only walls, it's used to generate solids like a tor
   */
  solidFromSlices(options: { numslices: number, callback: (t: number, slice: number) => Polygon, loop: boolean }) {

    let polygons: Polygon[] = [],
      csg: CSG = null,
      prev: Polygon = null,
      bottom:Polygon = null,
      top = null,
      numSlices = 2,
      bLoop = false,
      fnCallback: (t: number, slice: number) => Polygon,
      flipped = null

    if (options) {
      bLoop = Boolean(options['loop'])

      if (options.numslices) { numSlices = options.numslices }

      if (options.callback) {
        fnCallback = options.callback
      }
    }
    if (!fnCallback) {
      let square = Polygon.createFromPoints([
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
      ])
      fnCallback = function (t: number, slice: number) {
        return t === 0 || t === 1 ? square.translate([0, 0, t]) : null
      }
    }
    for (let i = 0, iMax = numSlices - 1; i <= iMax; i++) {
      csg = fnCallback.call(this, i / iMax, i)
      if (csg) {
        if (!(csg instanceof Polygon)) {
          throw new Error('Polygon.solidFromSlices callback error: Polygon expected')
        }
        csg.checkIfConvex()

        if (prev) { // generate walls
          if (flipped === null) { // not generated yet
            flipped = prev.plane.signedDistanceToPoint(csg.vertices[0].pos) < 0
          }
          this._addWalls(polygons, prev, csg, flipped)
        } else { // the first - will be a bottom
          bottom = csg
        }
        prev = csg
      } // callback can return null to skip that slice
    }
    top = csg

    if (bLoop) {
      let bSameTopBottom = bottom.vertices.length === top.vertices.length &&
        bottom.vertices.every(function (v, index) {
          return v.pos.equals(top.vertices[index].pos)
        })
      // if top and bottom are not the same -
      // generate walls between them
      if (!bSameTopBottom) {
        this._addWalls(polygons, top, bottom, flipped)
      } // else - already generated
    } else {
      // save top and bottom
      // TODO: flip if necessary
      polygons.unshift(flipped ? bottom : bottom.flipped())
      polygons.push(flipped ? top.flipped() : top)
    }
    return CSG.fromPolygons(polygons)
  }
  /**
   *
   * @param walls Array of wall polygons
   * @param bottom Bottom polygon
   * @param top Top polygon
   */
  _addWalls(walls: Polygon[], bottom: Polygon, top: Polygon, bFlipped: boolean) {
    let bottomPoints = bottom.vertices.slice(0) // make a copy
    let topPoints = top.vertices.slice(0) // make a copy
    let color = top.shared || null

    // check if bottom perimeter is closed
    if (!bottomPoints[0].pos.equals(bottomPoints[bottomPoints.length - 1].pos)) {
      bottomPoints.push(bottomPoints[0])
    }

    // check if top perimeter is closed
    if (!topPoints[0].pos.equals(topPoints[topPoints.length - 1].pos)) {
      topPoints.push(topPoints[0])
    }
    if (bFlipped) {
      bottomPoints = bottomPoints.reverse()
      topPoints = topPoints.reverse()
    }

    let iTopLen = topPoints.length - 1
    let iBotLen = bottomPoints.length - 1
    let iExtra = iTopLen - iBotLen// how many extra triangles we need
    let bMoreTops = iExtra > 0
    let bMoreBottoms = iExtra < 0

    let aMin: { index: number, len: number }[] = [] // indexes to start extra triangles (polygon with minimal square)
    // init - we need exactly /iExtra/ small triangles
    for (let i = Math.abs(iExtra); i > 0; i--) {
      aMin.push({
        len: Infinity,
        index: -1
      })
    }

    let len
    if (bMoreBottoms) {
      for (let i = 0; i < iBotLen; i++) {
        len = bottomPoints[i].pos.distanceToSquared(bottomPoints[i + 1].pos)
        // find the element to replace
        for (let j = aMin.length - 1; j >= 0; j--) {
          if (aMin[j].len > len) {
            aMin[j].len = len
            aMin['index'] = j
            break
          }
        } // for
      }
    } else if (bMoreTops) {
      for (let i = 0; i < iTopLen; i++) {
        len = topPoints[i].pos.distanceToSquared(topPoints[i + 1].pos)
        // find the element to replace
        for (let j = aMin.length - 1; j >= 0; j--) {
          if (aMin[j].len > len) {
            aMin[j].len = len
            aMin['index'] = j
            break
          }
        } // for
      }
    } // if
    // sort by index
    aMin.sort(fnSortByIndex)
    let getTriangle = function addWallsPutTriangle(pointA, pointB, pointC, color) {
      return new Polygon([pointA, pointB, pointC], color)
      // return bFlipped ? triangle.flipped() : triangle;
    }

    let bpoint = bottomPoints[0]
    let tpoint = topPoints[0]
    let secondPoint
    let nBotFacet
    let nTopFacet // length of triangle facet side
    for (let iB = 0, iT = 0, iMax = iTopLen + iBotLen; iB + iT < iMax;) {
      if (aMin.length) {
        if (bMoreTops && iT === aMin[0].index) { // one vertex is on the bottom, 2 - on the top
          secondPoint = topPoints[++iT]
          // console.log('<<< extra top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
          walls.push(getTriangle(
            secondPoint, tpoint, bpoint, color
          ))
          tpoint = secondPoint
          aMin.shift()
          continue
        } else if (bMoreBottoms && iB === aMin[0].index) {
          secondPoint = bottomPoints[++iB]
          walls.push(getTriangle(
            tpoint, bpoint, secondPoint, color
          ))
          bpoint = secondPoint
          aMin.shift()
          continue
        }
      }
      // choose the shortest path
      if (iB < iBotLen) { // one vertex is on the top, 2 - on the bottom
        nBotFacet = tpoint.pos.distanceToSquared(bottomPoints[iB + 1].pos)
      } else {
        nBotFacet = Infinity
      }
      if (iT < iTopLen) { // one vertex is on the bottom, 2 - on the top
        nTopFacet = bpoint.pos.distanceToSquared(topPoints[iT + 1].pos)
      } else {
        nTopFacet = Infinity
      }
      if (nBotFacet <= nTopFacet) {
        secondPoint = bottomPoints[++iB]
        walls.push(getTriangle(
          tpoint, bpoint, secondPoint, color
        ))
        bpoint = secondPoint
      } else if (iT < iTopLen) { // nTopFacet < Infinity
        secondPoint = topPoints[++iT]
        // console.log('<<< top: ' + secondPoint + ', ' + tpoint + ', bottom: ' + bpoint);
        walls.push(getTriangle(
          secondPoint, tpoint, bpoint, color
        ))
        tpoint = secondPoint
      };
    }
    return walls
  }

  static Shared: typeof Shared;
  static defaultShared: Shared;


  static verticesConvex(vertices, planenormal) {
    let numvertices = vertices.length
    if (numvertices > 2) {
      let prevprevpos = vertices[numvertices - 2].pos
      let prevpos = vertices[numvertices - 1].pos
      for (let i = 0; i < numvertices; i++) {
        let pos = vertices[i].pos
        if (!Polygon.isConvexPoint(prevprevpos, prevpos, pos, planenormal)) {
          return false
        }
        prevprevpos = prevpos
        prevpos = pos
      }
    }
    return true
  }

  // Create a polygon from the given points
  static createFromPoints(points: number[][], shared?: Shared, plane?: Plane, ...args) {
    let normal: Vector3D
    if (arguments.length < 3) {
      // initially set a dummy vertex normal:
      normal = new Vector3D(0, 0, 0)
    } else {
      normal = plane.normal
    }
    let vertices = []
    points.map(function (p) {
      let vec = new Vector3D(p)
      let vertex = new Vertex(vec)
      vertices.push(vertex)
    })
    let polygon: Polygon
    if (arguments.length < 3) {
      polygon = new Polygon(vertices, shared)
    } else {
      polygon = new Polygon(vertices, shared, plane)
    }
    return polygon
  }

  // calculate whether three points form a convex corner
  //  prevpoint, point, nextpoint: the 3 coordinates (Vector3D instances)
  //  normal: the normal vector of the plane
  static isConvexPoint(prevpoint, point, nextpoint, normal) {
    let crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point))
    let crossdotnormal = crossproduct.dot(normal)
    return (crossdotnormal >= 0)
  }

  static isStrictlyConvexPoint(prevpoint, point, nextpoint, normal) {
    let crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point))
    let crossdotnormal = crossproduct.dot(normal)
    return (crossdotnormal >= EPS)
  }
}

// # class Polygon.Shared
// Holds the shared properties for each polygon (currently only color)
// Constructor expects a 4 element array [r,g,b,a], values from 0 to 1, or null
export class Shared {
  private tag: number;

  constructor(private color: number[]) {
    if (color !== null) {
      if (color.length !== 4) {
        throw new Error('Expecting 4 element array')
      }
    }
    this.color = color
  }

  static fromObject(obj) {
    return new Polygon.Shared(obj.color)
  }

  // Create Polygon.Shared from a color, can be called as follows:

  // let s = Polygon.Shared.fromColor(r,g,b [,a])
  static fromColor(r: number, g: number, b: number, a?: number);

  // let s = Polygon.Shared.fromColor([r,g,b [,a]])
  static fromColor(rgba: number[]);

  static fromColor(args) {
    let color
    if (arguments.length === 1) {
      color = arguments[0].slice() // make deep copy
    } else {
      color = []
      for (let i = 0; i < arguments.length; i++) {
        color.push(arguments[i])
      }
    }
    if (color.length === 3) {
      color.push(1)
    } else if (color.length !== 4) {
      throw new Error('setColor expects either an array with 3 or 4 elements, or 3 or 4 parameters.')
    }
    return new Polygon.Shared(color)
  }

  getTag() {
    let result = this.tag
    if (!result) {
      result = getTag()
      this.tag = result
    }
    return result
  }
  // get a string uniquely identifying this object
  getHash() {
    if (!this.color) return 'null'
    return this.color.join('/')
  }
}

Polygon.Shared = Shared;

Polygon.defaultShared = new Polygon.Shared(null)

export default Polygon

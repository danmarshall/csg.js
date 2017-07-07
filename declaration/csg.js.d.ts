declare module 'csg.js/src/math/Vector2' {
	import Vector3D from 'csg.js/src/math/Vector3';
	import Matrix4 from 'csg.js/src/math/Matrix4'; class Vector2D {
	    _x: number;
	    _y: number;
	    constructor(v: Vector2D | number[]);
	    constructor(x: number, y: number);
	    static fromAngle(radians: number): Vector2D;
	    static fromAngleDegrees(degrees: number): Vector2D;
	    static fromAngleRadians(radians: number): Vector2D;
	    static Create(x: number, y: number): Vector2D;
	    x: number;
	    y: number;
	    toVector3D(z: number): Vector3D;
	    equals(a: Vector2D): boolean;
	    clone(): Vector2D;
	    negated(): Vector2D;
	    plus(a: Vector2D): Vector2D;
	    minus(a: Vector2D): Vector2D;
	    times(a: number): Vector2D;
	    dividedBy(a: number): Vector2D;
	    dot(a: Vector2D): number;
	    lerp(a: Vector2D, t: number): Vector2D;
	    length(): number;
	    distanceTo(a: Vector2D): number;
	    distanceToSquared(a: Vector2D): number;
	    lengthSquared(): number;
	    unit(): Vector2D;
	    cross(a: Vector2D): number;
	    normal(): Vector2D;
	    multiply4x4(matrix4x4: Matrix4): Vector2D;
	    transform(matrix4x4: Matrix4): Vector2D;
	    angle(): number;
	    angleDegrees(): number;
	    angleRadians(): number;
	    min(p: Vector2D): Vector2D;
	    max(p: Vector2D): Vector2D;
	    toString(): string;
	    abs(): Vector2D;
	}
	export default Vector2D;

}
declare module 'csg.js/src/utils' {
	import Vector2D from 'csg.js/src/math/Vector2'; function fnNumberSort(a: number, b: number): number; function fnSortByIndex(a: {
	    index: number;
	}, b: {
	    index: number;
	}): number; const IsFloat: (n: number) => boolean; const solve2Linear: (a: number, b: number, c: number, d: number, u: number, v: number) => number[]; function insertSorted<T>(array: T[], element: T, comparefunc: (a: T, b: T) => number): void; const interpolateBetween2DPointsForY: (point1: Vector2D, point2: Vector2D, y: number) => number;
	export { fnNumberSort, fnSortByIndex, IsFloat, solve2Linear, insertSorted, interpolateBetween2DPointsForY };

}
declare module 'csg.js/src/math/Vector3' {
	import Matrix4 from 'csg.js/src/math/Matrix4'; class Vector3D {
	    _x: number;
	    _y: number;
	    _z: number;
	    rotateZ: (angle: number) => Vector3D;
	    constructor(v: Vector3D | number[]);
	    constructor(x: number, y: number);
	    constructor(x: number, y: number, z: number);
	    static Create(x: number, y: number, z: number): Vector3D;
	    x: number;
	    y: number;
	    z: number;
	    clone(): Vector3D;
	    negated(): Vector3D;
	    abs(): Vector3D;
	    plus(a: Vector3D): Vector3D;
	    minus(a: Vector3D): Vector3D;
	    times(a: number): Vector3D;
	    dividedBy(a: number): Vector3D;
	    dot(a: Vector3D): number;
	    lerp(a: Vector3D, t: number): Vector3D;
	    lengthSquared(): number;
	    length(): number;
	    unit(): Vector3D;
	    cross(a: Vector3D): Vector3D;
	    distanceTo(a: Vector3D): number;
	    distanceToSquared(a: Vector3D): number;
	    equals(a: Vector3D): boolean;
	    multiply4x4(matrix4x4: Matrix4): Vector3D;
	    transform(matrix4x4: Matrix4): Vector3D;
	    toString(): string;
	    randomNonParallelVector(): Vector3D;
	    min(p: Vector3D): Vector3D;
	    max(p: Vector3D): Vector3D;
	}
	export default Vector3D;

}
declare module 'csg.js/src/math/Line2' {
	import Vector2D from 'csg.js/src/math/Vector2';
	import Matrix4 from 'csg.js/src/math/Matrix4'; class Line2D {
	    private normal;
	    w: number;
	    constructor(normal: Vector2D, w: number);
	    static fromPoints(p1: Vector2D, p2: Vector2D): Line2D;
	    reverse(): Line2D;
	    equals(l: Line2D): boolean;
	    origin(): Vector2D;
	    direction(): Vector2D;
	    xAtY(y: number): number;
	    absDistanceToPoint(point: Vector2D): number;
	    intersectWithLine(line2d: Line2D): Vector2D;
	    transform(matrix4x4: Matrix4): Line2D;
	}
	export default Line2D;

}
declare module 'csg.js/src/constants' {
	 const _CSGDEBUG: boolean; const defaultResolution2D = 32; const defaultResolution3D = 12; const EPS = 0.00001; const angleEPS = 0.1; const areaEPS: number; const all = 0; const top = 1; const bottom = 2; const left = 3; const right = 4; const front = 5; const back = 6; let staticTag: number; const getTag: () => number;
	export { _CSGDEBUG, defaultResolution2D, defaultResolution3D, EPS, angleEPS, areaEPS, all, top, bottom, left, right, front, back, staticTag, getTag };

}
declare module 'csg.js/src/math/Plane' {
	import Vector3D from 'csg.js/src/math/Vector3';
	import Line3D from 'csg.js/src/math/Line3';
	import Matrix4 from 'csg.js/src/math/Matrix4'; class Plane {
	    normal: Vector3D;
	    w: number;
	    private tag;
	    constructor(normal: Vector3D, w: number);
	    static fromObject(obj: Plane): Plane;
	    static fromVector3Ds(a: Vector3D, b: Vector3D, c: Vector3D): Plane;
	    static anyPlaneFromVector3Ds(a: Vector3D, b: Vector3D, c: Vector3D): Plane;
	    static fromPoints(a: Vector3D, b: Vector3D, c: Vector3D): Plane;
	    static fromNormalAndPoint(normal: Vector3D, point: Vector3D): Plane;
	    flipped(): Plane;
	    getTag(): number;
	    equals(n: Plane): boolean;
	    transform(matrix4x4: Matrix4): Plane;
	    splitLineBetweenPoints(p1: Vector3D, p2: Vector3D): Vector3D;
	    intersectWithLine(line3d: Line3D): Vector3D;
	    intersectWithPlane(plane: Plane): Line3D;
	    signedDistanceToPoint(point: Vector3D): number;
	    toString(): string;
	    mirrorPoint(point3d: Vector3D): Vector3D;
	}
	export default Plane;

}
declare module 'csg.js/src/math/Line3' {
	import Vector3D from 'csg.js/src/math/Vector3';
	import Matrix4 from 'csg.js/src/math/Matrix4';
	import Plane from 'csg.js/src/math/Plane'; class Line3D {
	    point: Vector3D;
	    direction: Vector3D;
	    constructor(point: Vector3D, direction: Vector3D);
	    static fromPoints(p1: Vector3D, p2: Vector3D): Line3D;
	    static fromPlanes(p1: Plane, p2: Plane): Line3D;
	    intersectWithPlane(plane: Plane): Vector3D;
	    clone(line: Line3D): Line3D;
	    reverse(): Line3D;
	    transform(matrix4x4: Matrix4): Line3D;
	    closestPointOnLine(point: Vector3D): Vector3D;
	    distanceToPoint(point: Vector3D): number;
	    equals(line3d: Line3D): boolean;
	}
	export default Line3D;

}
declare module 'csg.js/src/math/OrthoNormalBasis' {
	import Vector2D from 'csg.js/src/math/Vector2';
	import Vector3D from 'csg.js/src/math/Vector3';
	import Line2D from 'csg.js/src/math/Line2';
	import Line3D from 'csg.js/src/math/Line3';
	import Plane from 'csg.js/src/math/Plane';
	import Matrix4x4 from 'csg.js/src/math/Matrix4'; class OrthoNormalBasis {
	    plane: Plane;
	    private planeorigin;
	    private u;
	    private v;
	    constructor(plane?: Plane, rightvector?: Vector3D);
	    static GetCartesian(xaxisid: string, yaxisid: string): OrthoNormalBasis;
	    static Z0Plane(): OrthoNormalBasis;
	    getProjectionMatrix(): Matrix4x4;
	    getInverseProjectionMatrix(): Matrix4x4;
	    to2D(vec3: Vector3D): Vector2D;
	    to3D(vec2: Vector2D): Vector3D;
	    line3Dto2D(line3d: Line3D): Line2D;
	    line2Dto3D(line2d: Line2D): Line3D;
	    transform(matrix4x4: Matrix4x4): OrthoNormalBasis;
	}
	export default OrthoNormalBasis;

}
declare module 'csg.js/src/math/Matrix4' {
	import Vector3D from 'csg.js/src/math/Vector3';
	import Vector2D from 'csg.js/src/math/Vector2';
	import Plane from 'csg.js/src/math/Plane'; class Matrix4x4 {
	    private elements;
	    constructor(elements?: number[]);
	    plus(m: Matrix4x4): Matrix4x4;
	    minus(m: Matrix4x4): Matrix4x4;
	    multiply(m: Matrix4x4): Matrix4x4;
	    clone(): Matrix4x4;
	    rightMultiply1x3Vector(v: Vector3D): Vector3D;
	    leftMultiply1x3Vector(v: Vector3D): Vector3D;
	    rightMultiply1x2Vector(v: Vector2D): Vector2D;
	    leftMultiply1x2Vector(v: Vector2D): Vector2D;
	    isMirroring(): boolean;
	    static unity: () => Matrix4x4;
	    static rotationX: (degrees: number) => Matrix4x4;
	    static rotationY: (degrees: number) => Matrix4x4;
	    static rotationZ: (degrees: number) => Matrix4x4;
	    static rotation: (rotationCenter: Vector3D, rotationAxis: Vector3D, degrees: number) => Matrix4x4;
	    static translation: (v: number[] | Vector3D) => Matrix4x4;
	    static mirroring: (plane: Plane) => Matrix4x4;
	    static scaling: (v: Vector3D) => Matrix4x4;
	}
	export default Matrix4x4;

}
declare module 'csg.js/src/mutators' {
	 const addTransformationMethodsToPrototype: (prot: any) => void; const addCenteringToPrototype: (prot: any, axes: any) => void;
	export { addTransformationMethodsToPrototype, addCenteringToPrototype };

}
declare module 'csg.js/src/math/Vertex3' {
	import Vector3D from 'csg.js/src/math/Vector3';
	import Matrix4 from 'csg.js/src/math/Matrix4'; class Vertex {
	    pos: Vector3D;
	    private tag;
	    constructor(pos: Vector3D);
	    static fromObject(obj: Vertex): Vertex;
	    flipped(): this;
	    getTag(): number;
	    interpolate(other: Vertex, t: number): Vertex;
	    transform(matrix4x4: Matrix4): Vertex;
	    toString(): string;
	}
	export default Vertex;

}
declare module 'csg.js/src/connectors' {
	import Vector3D from 'csg.js/src/math/Vector3';
	import Line3D from 'csg.js/src/math/Line3';
	import Matrix4x4 from 'csg.js/src/math/Matrix4';
	export class Connector {
	    private point;
	    private axisvector;
	    private normalvector;
	    constructor(point: Vector3D | number[], axisvector: Vector3D | number[], normalvector: Vector3D | number[]);
	    normalized(): Connector;
	    transform(matrix4x4: Matrix4x4): Connector;
	    getTransformationTo(other: Connector, mirror: boolean, normalrotation: number): Matrix4x4;
	    axisLine(): Line3D;
	    extend(distance: number): Connector;
	}
	export default Connector;

}
declare module 'csg.js/src/math/Vertex2' {
	import Vector2D from 'csg.js/src/math/Vector2'; class Vertex {
	    pos: Vector2D;
	    private tag;
	    constructor(pos: Vector2D);
	    static fromObject(obj: Vertex): Vertex;
	    toString(): string;
	    getTag(): number;
	}
	export default Vertex;

}
declare module 'csg.js/src/optionParsers' {
	 const parseOption: (options: any, optionname: any, defaultvalue: any) => any; const parseOptionAs3DVector: (options: any, optionname: any, defaultvalue: any) => any; const parseOptionAs3DVectorList: (options: any, optionname: any, defaultvalue: any) => any; const parseOptionAs2DVector: (options: any, optionname: any, defaultvalue: any) => any; const parseOptionAsFloat: (options: any, optionname: any, defaultvalue: any) => number; const parseOptionAsInt: (options: any, optionname: any, defaultvalue: any) => any; const parseOptionAsBool: (options: any, optionname: any, defaultvalue: any) => any;
	export { parseOption, parseOptionAsInt, parseOptionAsFloat, parseOptionAsBool, parseOptionAs3DVector, parseOptionAs2DVector, parseOptionAs3DVectorList };

}
declare module 'csg.js/src/math/Side' {
	import Vector2D from 'csg.js/src/math/Vector2';
	import Vertex from 'csg.js/src/math/Vertex2';
	import Polygon from 'csg.js/src/math/Polygon3';
	import Matrix4 from 'csg.js/src/math/Matrix4'; class Side {
	    vertex0: Vertex;
	    vertex1: Vertex;
	    private tag;
	    constructor(vertex0: Vertex, vertex1: Vertex);
	    static fromObject(obj: Side): Side;
	    static _fromFakePolygon(polygon: Polygon): Side;
	    toString(): string;
	    toPolygon3D(z0: number, z1: number): Polygon;
	    transform(matrix4x4: Matrix4): Side;
	    flipped(): Side;
	    direction(): Vector2D;
	    getTag(): number;
	    lengthSquared(): number;
	    length(): number;
	}
	export default Side;

}
declare module 'csg.js/src/math/Path2' {
	import Vector2D from 'csg.js/src/math/Vector2';
	import CAG from 'csg.js/src/CAG';
	import CSG from 'csg.js/src/CSG';
	import Matrix4 from 'csg.js/src/math/Matrix4'; class Path2D {
	    private closed;
	    private lastBezierControlPoint;
	    private points;
	    constructor(points: (Vector2D | number[])[], closed?: boolean);
	    static arc: (options: any) => Path2D;
	    concat(otherpath: Path2D): Path2D;
	    appendPoint(point: Vector2D): Path2D;
	    appendPoints(points: Vector2D[]): Path2D;
	    close(): Path2D;
	    rectangularExtrude(width: number, height: number, resolution: number): CSG;
	    expandToCAG(pathradius: number, resolution: number): CAG;
	    innerToCAG(): CAG;
	    transform(matrix4x4: Matrix4): Path2D;
	    appendBezier(controlpoints: Vector2D[], options: any): Path2D;
	    appendArc(endpoint: Vector2D | number[], options: any): Path2D;
	}
	export default Path2D;

}
declare module 'csg.js/src/math/lineUtils' {
	import Vector2D from 'csg.js/src/math/Vector2'; const linesIntersect: (p0start: Vector2D, p0end: Vector2D, p1start: Vector2D, p1end: Vector2D) => boolean;
	export { linesIntersect };

}
declare module 'csg.js/src/FuzzyFactory' {
	 class FuzzyFactory<T> {
	    private lookuptable;
	    private multiplier;
	    constructor(numdimensions: number, tolerance: number);
	    lookupOrCreate(els: number[], creatorCallback: (els: number[]) => T): T;
	}
	export default FuzzyFactory;

}
declare module 'csg.js/src/FuzzyFactory2d' {
	import Side from 'csg.js/src/math/Side';
	import Vertex from 'csg.js/src/math/Vertex2'; class FuzzyCAGFactory {
	    private vertexfactory;
	    constructor();
	    getVertex(sourcevertex: Vertex): Vertex;
	    getSide(sourceside: Side): Side;
	}
	export default FuzzyCAGFactory;

}
declare module 'csg.js/src/primitives2d' {
	import CAG from 'csg.js/src/CAG'; const circle: (options: any) => CAG; const ellipse: (options: any) => CAG; const rectangle: (options: any) => CAG; const roundedRectangle: (options: any) => CAG; const fromCompactBinary: (bin: any) => CAG;
	export { circle, ellipse, rectangle, roundedRectangle, fromCompactBinary };

}
declare module 'csg.js/src/CAGFactories' {
	import CAG from 'csg.js/src/CAG';
	import Vector2D from 'csg.js/src/math/Vector2'; const fromObject: (obj: any) => CAG; const fromPointsNoCheck: (points: Vector2D[]) => CAG;
	export { fromObject, fromPointsNoCheck };

}
declare module 'csg.js/src/CAG' {
	import OrthoNormalBasis from 'csg.js/src/math/OrthoNormalBasis';
	import Vertex2D from 'csg.js/src/math/Vertex2';
	import Vector2D from 'csg.js/src/math/Vector2';
	import Vector3D from 'csg.js/src/math/Vector3';
	import Polygon from 'csg.js/src/math/Polygon3';
	import Path2D from 'csg.js/src/math/Path2';
	import Side from 'csg.js/src/math/Side';
	import Matrix4 from 'csg.js/src/math/Matrix4';
	import CSG from 'csg.js/src/CSG'; class CAG {
	    sides: Side[];
	    isCanonicalized: boolean;
	    static Vertex: typeof Vertex2D;
	    static Side: typeof Side;
	    static circle: (options: any) => CAG;
	    static ellipse: (options: any) => CAG;
	    static rectangle: (options: any) => CAG;
	    static roundedRectangle: (options: any) => CAG;
	    static fromCompactBinary: (bin: any) => CAG;
	    static fromPointsNoCheck: (points: Vector2D[]) => CAG;
	    static fromObject: (obj: any) => CAG;
	    constructor();
	    /** Construct a CAG from a list of `Side` instances.
	     * @param {Side[]} sides - list of sides
	     * @returns {CAG} new CAG object
	     */
	    static fromSides(sides: Side[]): CAG;
	    static fromFakeCSG(csg: CSG): CAG;
	    /** Construct a CAG from a list of points (a polygon).
	     * The rotation direction of the points is not relevant.
	     * The points can define a convex or a concave polygon.
	     * The polygon must not self intersect.
	     * @param {points[]} points - list of points in 2D space
	     * @returns {CAG} new CAG object
	     */
	    static fromPoints: (points: (Vector2D | number[])[]) => CAG;
	    toString(): string;
	    _toCSGWall(z0: number, z1: number): CSG;
	    _toVector3DPairs(m: Matrix4): Vector3D[][];
	    _toPlanePolygons(options: any): Polygon[];
	    _toWallPolygons(options: any): Polygon[];
	    /**
	     * Convert to a list of points.
	     * @return {points[]} list of points in 2D space
	     */
	    toPoints(): Vector2D[];
	    union(cag: CAG | CAG[]): CAG;
	    subtract(cag: CAG | CAG[]): CAG;
	    intersect(cag: CAG | CAG[]): CAG;
	    transform(matrix4x4: Matrix4): CAG;
	    area(): number;
	    flipped(): CAG;
	    getBounds(): Vector2D[];
	    isSelfIntersecting(debug?: any): boolean;
	    expandedShell(radius: number, resolution: number): CAG;
	    expand(radius: number, resolution: number): CAG;
	    contract(radius: number, resolution: number): CAG;
	    extrudeInOrthonormalBasis(orthonormalbasis: OrthoNormalBasis, depth: number, options?: any): CSG;
	    extrudeInPlane(axis1: string, axis2: string, depth: number, options: any): CSG;
	    extrude(options: any): CSG;
	    /** Extrude to into a 3D solid by rotating the origin around the Y axis.
	     * (and turning everything into XY plane)
	     * @param {Object} options - options for construction
	     * @param {Number} [options.angle=360] - angle of rotation
	     * @param {Number} [options.resolution=defaultResolution3D] - number of polygons per 360 degree revolution
	     * @returns {CSG} new 3D solid
	     */
	    rotateExtrude(options: any): CSG;
	    check(): void;
	    canonicalized(): CAG;
	    /** Convert to compact binary form.
	     * See CAG.fromCompactBinary.
	     * @return {CompactBinary}
	     */
	    toCompactBinary(): {
	        'class': string;
	        sideVertexIndices: Uint32Array;
	        vertexData: Float64Array;
	    };
	    getOutlinePaths(): Path2D[];
	    overCutInsideCorners(cutterradius: number): CAG;
	}
	export default CAG;

}
declare module 'csg.js/src/math/Polygon3' {
	import Vector3D from 'csg.js/src/math/Vector3';
	import Vertex from 'csg.js/src/math/Vertex3';
	import Matrix4x4 from 'csg.js/src/math/Matrix4';
	import Plane from 'csg.js/src/math/Plane';
	import CSG from 'csg.js/src/CSG';
	import OrthoNormalBasis from 'csg.js/src/math/OrthoNormalBasis';
	import CAG from 'csg.js/src/CAG'; class Polygon {
	    vertices: Vertex[];
	    shared: Shared;
	    plane: Plane;
	    private cachedBoundingSphere;
	    private cachedBoundingBox;
	    constructor(vertices: Vertex[], shared?: Shared, plane?: Plane);
	    static fromObject(obj: any): Polygon;
	    checkIfConvex(): void;
	    setColor(r: number, g: number, b: number, a?: number): any;
	    setColor(rgba: number[]): any;
	    getSignedVolume(): number;
	    getArea(): number;
	    getTetraFeatures(features: string[]): number[];
	    extrude(offsetvector: Vector3D): CSG;
	    translate(offset: Vector3D | number[]): Polygon;
	    boundingSphere(): [Vector3D, number];
	    boundingBox(): Vector3D[];
	    flipped(): Polygon;
	    transform(matrix4x4: Matrix4x4): Polygon;
	    toString(): string;
	    projectToOrthoNormalBasis(orthobasis: OrthoNormalBasis): CAG;
	    /**
	     * Creates solid from slices (Polygon) by generating walls
	     * @param {Object} options Solid generating options
	     *  - numslices {Number} Number of slices to be generated
	     *  - callback(t, slice) {Function} Callback function generating slices.
	     *          arguments: t = [0..1], slice = [0..numslices - 1]
	     *          return: Polygon or null to skip
	     *  - loop {Boolean} no flats, only walls, it's used to generate solids like a tor
	     */
	    solidFromSlices(options: {
	        numslices: number;
	        callback: (t: number, slice: number) => Polygon;
	        loop: boolean;
	    }): CSG;
	    /**
	     *
	     * @param walls Array of wall polygons
	     * @param bottom Bottom polygon
	     * @param top Top polygon
	     */
	    _addWalls(walls: Polygon[], bottom: Polygon, top: Polygon, bFlipped: boolean): Polygon[];
	    static Shared: typeof Shared;
	    static defaultShared: Shared;
	    static verticesConvex(vertices: any, planenormal: any): boolean;
	    static createFromPoints(points: number[][], shared?: Shared, plane?: Plane, ...args: any[]): Polygon;
	    static isConvexPoint(prevpoint: any, point: any, nextpoint: any, normal: any): boolean;
	    static isStrictlyConvexPoint(prevpoint: any, point: any, nextpoint: any, normal: any): boolean;
	}
	export class Shared {
	    private color;
	    private tag;
	    constructor(color: number[]);
	    static fromObject(obj: any): Shared;
	    static fromColor(r: number, g: number, b: number, a?: number): any;
	    static fromColor(rgba: number[]): any;
	    getTag(): number;
	    getHash(): string;
	}
	export default Polygon;

}
declare module 'csg.js/src/FuzzyFactory3d' {
	import Polygon from 'csg.js/src/math/Polygon3';
	import Vertex3 from 'csg.js/src/math/Vertex3';
	import Plane from 'csg.js/src/math/Plane';
	import { Shared } from 'csg.js/src/math/Polygon3'; class FuzzyCSGFactory {
	    private vertexfactory;
	    private planefactory;
	    private polygonsharedfactory;
	    constructor();
	    getPolygonShared(sourceshared: Shared): any;
	    getVertex(sourcevertex: Vertex3): Vertex3;
	    getPlane(sourceplane: Plane): Plane;
	    getPolygon(sourcepolygon: Polygon): Polygon;
	}
	export default FuzzyCSGFactory;

}
declare module 'csg.js/src/trees' {
	 class Tree {
	    private polygonTree;
	    private rootnode;
	    constructor(polygons: any);
	    invert(): void;
	    clipTo(tree: any, alsoRemovecoplanarFront?: any): void;
	    allPolygons(): any[];
	    addPolygons(polygons: any): void;
	}
	export default Tree;

}
declare module 'csg.js/src/math/polygonUtils' {
	 const reTesselateCoplanarPolygons: (sourcepolygons: any, destpolygons: any) => void;
	export { reTesselateCoplanarPolygons };

}
declare module 'csg.js/src/Properties' {
	import { Connector } from 'csg.js/src/connectors'; class Properties {
	    cube: Properties;
	    sphere: Properties;
	    cylinder: Properties;
	    roundedCylinder: Properties;
	    roundedCube: Properties;
	    center: any;
	    facecenters: Connector[];
	    facepoint: any;
	    start: any;
	    end: any;
	    facepointH: any;
	    facepointH90: any;
	    _transform(matrix4x4: any): Properties;
	    _merge(otherproperties: any): Properties;
	    static transformObj(source: any, result: any, matrix4x4: any): void;
	    static cloneObj(source: any, result: any): void;
	    static addFrom(result: any, otherproperties: any): void;
	}
	export default Properties;

}
declare module 'csg.js/src/CSG' {
	import Polygon from 'csg.js/src/math/Polygon3';
	import OrthoNormalBasis from 'csg.js/src/math/OrthoNormalBasis';
	import CAG from 'csg.js/src/CAG';
	import Properties from 'csg.js/src/Properties'; class CSG {
	    static _CSGDEBUG: boolean;
	    static defaultResolution2D: any;
	    static defaultResolution3D: any;
	    static EPS: any;
	    static angleEPS: any;
	    static areaEPS: any;
	    static all: any;
	    static top: any;
	    static bottom: any;
	    static left: any;
	    static right: any;
	    static front: any;
	    static back: any;
	    static staticTag: any;
	    static getTag: any;
	    static Vector2D: any;
	    static Vector3D: any;
	    static Vertex: any;
	    static Plane: any;
	    static Polygon: any;
	    static Polygon2D: any;
	    static Line2D: any;
	    static Line3D: any;
	    static Path2D: any;
	    static OrthoNormalBasis: any;
	    static Matrix4x4: any;
	    static Connector: any;
	    static Properties: any;
	    static sphere: any;
	    static cube: any;
	    static roundedCube: any;
	    static cylinder: any;
	    static roundedCylinder: any;
	    static cylinderElliptic: any;
	    static polyhedron: any;
	    static fromCompactBinary: any;
	    static fromObject: any;
	    static fromSlices: any;
	    static toPointCloud: any;
	    polygons: Polygon[];
	    properties: Properties;
	    isCanonicalized: boolean;
	    isRetesselated: boolean;
	    private cachedBoundingBox;
	    scale: any;
	    translate: any;
	    constructor();
	    /** @return {Polygon[]} The list of polygons. */
	    toPolygons(): Polygon[];
	    /**
	     * Return a new CSG solid representing the space in either this solid or
	     * in the given solids. Neither this solid nor the given solids are modified.
	     * @param {CSG[]} csg - list of CSG objects
	     * @returns {CSG} new CSG object
	     * @example
	     * let C = A.union(B)
	     * @example
	     * +-------+            +-------+
	     * |       |            |       |
	     * |   A   |            |       |
	     * |    +--+----+   =   |       +----+
	     * +----+--+    |       +----+       |
	     *      |   B   |            |       |
	     *      |       |            |       |
	     *      +-------+            +-------+
	     */
	    union(csg: any): any;
	    unionSub(csg: any, retesselate: any, canonicalize: any): CSG;
	    unionForNonIntersecting(csg: any): CSG;
	    /**
	     * Return a new CSG solid representing space in this solid but
	     * not in the given solids. Neither this solid nor the given solids are modified.
	     * @param {CSG[]} csg - list of CSG objects
	     * @returns {CSG} new CSG object
	     * @example
	     * let C = A.subtract(B)
	     * @example
	     * +-------+            +-------+
	     * |       |            |       |
	     * |   A   |            |       |
	     * |    +--+----+   =   |    +--+
	     * +----+--+    |       +----+
	     *      |   B   |
	     *      |       |
	     *      +-------+
	     */
	    subtract(csg: any): CSG;
	    subtractSub(csg: any, retesselate: any, canonicalize: any): CSG;
	    /**
	     * Return a new CSG solid representing space in both this solid and
	     * in the given solids. Neither this solid nor the given solids are modified.
	     * @param {CSG[]} csg - list of CSG objects
	     * @returns {CSG} new CSG object
	     * @example
	     * let C = A.intersect(B)
	     * @example
	     * +-------+
	     * |       |
	     * |   A   |
	     * |    +--+----+   =   +--+
	     * +----+--+    |       +--+
	     *      |   B   |
	     *      |       |
	     *      +-------+
	     */
	    intersect(csg: any): CSG;
	    intersectSub(csg: CSG, retesselate?: boolean, canonicalize?: boolean): CSG;
	    /**
	     * Return a new CSG solid with solid and empty space switched.
	     * This solid is not modified.
	     * @returns {CSG} new CSG object
	     * @example
	     * let B = A.invert()
	     */
	    invert(): CSG;
	    transform1(matrix4x4: any): CSG;
	    /**
	     * Return a new CSG solid that is transformed using the given Matrix.
	     * Several matrix transformations can be combined before transforming this solid.
	     * @param {CSG.Matrix4x4} matrix4x4 - matrix to be applied
	     * @returns {CSG} new CSG object
	     * @example
	     * var m = new CSG.Matrix4x4()
	     * m = m.multiply(CSG.Matrix4x4.rotationX(40))
	     * m = m.multiply(CSG.Matrix4x4.translation([-.5, 0, 0]))
	     * let B = A.transform(m)
	     */
	    transform(matrix4x4: any): CSG;
	    toString(): string;
	    expand(radius: any, resolution: any): any;
	    contract(radius: any, resolution: any): CSG;
	    stretchAtPlane(normal: any, point: any, length: any): any;
	    expandedShell(radius: any, resolution: any, unionWithThis: any): any;
	    canonicalized(): CSG;
	    reTesselated(): CSG;
	    /**
	     * Returns an array of Vector3D, providing minimum coordinates and maximum coordinates
	     * of this solid.
	     * @returns {Vector3D[]}
	     * @example
	     * let bounds = A.getBounds()
	     * let minX = bounds[0].x
	     */
	    getBounds(): any;
	    mayOverlap(csg: any): boolean;
	    cutByPlane(plane: any): CSG;
	    connectTo(myConnector: any, otherConnector: any, mirror: any, normalrotation: any): CSG;
	    setShared(shared: any): CSG;
	    setColor(args: any): CSG;
	    toCompactBinary(): {
	        'class': string;
	        numPolygons: number;
	        numVerticesPerPolygon: Uint32Array;
	        polygonPlaneIndexes: Uint32Array;
	        polygonSharedIndexes: Uint32Array;
	        polygonVertices: Uint32Array;
	        vertexData: Float64Array;
	        planeData: Float64Array;
	        shared: any[];
	    };
	    getTransformationAndInverseTransformationToFlatLying(): any[];
	    getTransformationToFlatLying(): any;
	    lieFlat(): CSG;
	    projectToOrthoNormalBasis(orthobasis: OrthoNormalBasis): CAG;
	    sectionCut(orthobasis: any): CAG;
	    fixTJunctions(): CSG;
	    toTriangles(): any[];
	    /**
	     * Returns an array of values for the requested features of this solid.
	     * Supported Features: 'volume', 'area'
	     * @param {String[]} features - list of features to calculate
	     * @returns {Float[]} values
	     * @example
	     * let volume = A.getFeatures('volume')
	     * let values = A.getFeatures('area','volume')
	     */
	    getFeatures(features: any): any;
	    /** Construct a CSG solid from a list of `Polygon` instances.
	     * @param {Polygon[]} polygons - list of polygons
	     * @returns {CSG} new CSG object
	     */
	    static fromPolygons(polygons: any): CSG;
	}
	export default CSG;

}
declare module 'csg.js/csg' {
	import CSG from 'csg.js/src/CSG';
	import CAG from 'csg.js/src/CAG';
	export { CSG, CAG };

}
declare module 'csg.js/src/math/Polygon2' {
	import CAG from 'csg.js/src/CAG'; class Polygon2D extends CAG {
	    constructor(points: any);
	}
	export default Polygon2D;

}
declare module 'csg.js/src/CSGFactories' {
	import CSG from 'csg.js/src/CSG'; function fromSlices(options: any): CSG; function fromObject(obj: any): CSG; function fromCompactBinary(bin: any): CSG;
	export { fromSlices, fromObject, fromCompactBinary };

}
declare module 'csg.js/src/primitives3d' {
	import CSG from 'csg.js/src/CSG'; const cube: (options: any) => CSG; const sphere: (options: any) => CSG; const cylinder: (options: any) => CSG; const roundedCylinder: (options: any) => CSG; const cylinderElliptic: (options: any) => CSG; const roundedCube: (options: any) => CSG; const polyhedron: (options: any) => CSG;
	export { cube, sphere, roundedCube, cylinder, roundedCylinder, cylinderElliptic, polyhedron };

}
declare module 'csg.js/src/debugHelpers' {
	import CSG from 'csg.js/src/CSG'; const _default: {
	    toPointCloud: (csg: any, cuberadius: any) => CSG;
	};
	export default _default;

}

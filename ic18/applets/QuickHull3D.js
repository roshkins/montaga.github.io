(function(){
'use strict';var turnIntoCSList=function(a){return{ctype:"list",value:a}},realCSNumber=function(a){return{ctype:"number",value:{real:a,imag:0}}},t0,t1;function p(a){console.log(a,t1-t0)}var QuickHull3D=function(a){this.pointBuffer=[];this.minVertices=[];this.maxVertices=[];this.vertexPointIndices=[];this.faces=[];this.discardedFaces=[];this.horizon=[];this._claimed=new VertexList;this._unclaimed=new VertexList;void 0!==a&&this.build(a)};QuickHull3D.INDEXED_FROM_ONE=2;
QuickHull3D.INDEXED_FROM_ZERO=4;QuickHull3D.POINT_RELATIVE=8;QuickHull3D.prototype.debug=!1;QuickHull3D.prototype._findIndex=-1;QuickHull3D.NONCONVEX_WRT_LARGER_FACE=1;QuickHull3D.NONCONVEX=2;QuickHull3D.DOUBLE_PRECISION=2.220446049250313E-16;QuickHull3D.AUTOMATIC_TOLERANCE=-1;QuickHull3D.prototype.explicitTolerance=QuickHull3D.AUTOMATIC_TOLERANCE;QuickHull3D.prototype.getDistanceTolerance=function(){return this.tolerance};
QuickHull3D.prototype.setExplicitDistanceTolerance=function(a){this.explicitTolerance=a};QuickHull3D.prototype.getExplicitDistanceTolerance=function(){return this.explicitTolerance};QuickHull3D.prototype._addPointToFace=function(a,b){a.face=b;null===b.outside?this._claimed.add(a):this._claimed.insertBefore(a,b.outside);b.outside=a};QuickHull3D.prototype._removePointFromFace=function(a,b){a===b.outside&&(b.outside=null!==a.next&&a.next.face===b?a.next:null);this._claimed.delete(a)};
QuickHull3D.prototype._removeAllPointFromFace=function(a){if(null===a.outside)return null;for(var b=a.outside;null!==b.next&&b.next.face===a;)b=b.next;this._claimed.delete(a.outside,b);b.next=null;return a.outside};
QuickHull3D.prototype.build=function(a,b){var c="number"===typeof a[0]?a.length/3:a.length;void 0===b&&(b=c);if(4>b)throw Error("Less than 4 input points specified");if(c<b)throw Error("Coordinate array too small for specified number of points");this._initBuffers(b);this._setPoints(a);this._buildHull()};
QuickHull3D.prototype.triangulate=function(){var a=1E3*this.charLength*this.constructor.DOUBLE_PRECISION;this.newFaces=[];this.faces.forEach(function(b){b.mark===FO.VISIBLE&&FO.triangulate(b,this.newFaces,a)},this);this.faces=this.faces.concat(this.newFaces)};QuickHull3D.prototype.getVertices=function(){return this.vertexPointIndices.map(function(a){a=this.pointBuffer[a];return turnIntoCSList([realCSNumber(a.point.x),realCSNumber(a.point.y),realCSNumber(a.point.z)])},this)};
QuickHull3D.prototype.getFaces=function(a){void 0===a&&(a=0);return this.faces.map(function(b){return this._getFaceIndices(b,a)},this)};QuickHull3D.prototype._findHalfEdge=function(a,b){for(var c=this.faces.length,e,d=0;d<c;d++)if(e=FO.findEdge(this.faces[d],a,b),null!==e)return e;return null};
QuickHull3D.prototype._setHull=function(a,b,c,e){this.initBuffers(b);this.setPoints(a,b);this._computeMaxAndMin();for(var d,f=0;f<e;f++){a=FO.create(this.pointBuffer,c[f]);b=a.halfEdge0;do d=this._findHalfEdge(b.head,HEO.tail(b)),null!==d&&HEO.setOpposite(b,d),b=b.next;while(b!==a.halfEdge0);this.faces.push(a)}};QuickHull3D.prototype._printPoints=function(){this.pointBuffer.forEach(function(a){console.log(a.point.x+" "+a.point.y+" "+a.point.z)})};
QuickHull3D.prototype._initBuffers=function(a){this.vertexPointIndices=[];for(var b=this.pointBuffer.length;b<a;b++)this.pointBuffer.push(new Vertex);this.faces=[];this._claimed.clear();this.numberOfFaces=0;this.numberOfPoints=a};QuickHull3D.prototype._setPoints=function(a){"number"===typeof a[0]?this.pointBuffer.forEach(function(b,c){b.point=new Vector(a[3*c+0],a[3*c+1],a[3*c+2]);b.index=c}):this.pointBuffer.forEach(function(b,c){b.point=a[c];b.index=c})};
QuickHull3D.prototype._computeMaxAndMin=function(){for(var a=VectorOperations.copy(this.pointBuffer[0].point),b=VectorOperations.copy(this.pointBuffer[0].point),c=0;3>c;c++)this.maxVertices[c]=this.minVertices[c]=this.pointBuffer[0];this.pointBuffer.forEach(function(c){var d=c.point,f=d.x,g=d.y,d=d.z;f>a.x?(a.x=f,this.maxVertices[0]=c):f<b.x&&(b.x=f,this.minVertices[0]=c);g>a.y?(a.y=g,this.maxVertices[1]=c):g<b.y&&(b.y=g,this.minVertices[1]=c);d>a.z?(a.z=d,this.maxVertices[2]=c):d<b.z&&(b.z=d,this.minVertices[2]=
c)},this);this.charLength=Math.max(a.x-b.x,a.y-b.y,a.z-b.z);this.tolerance=this.explicitTolerance===this.constructor.AUTOMATIC_TOLERANCE?3*this.constructor.DOUBLE_PRECISION*(Math.max(Math.abs(a.x),Math.abs(b.x))+Math.max(Math.abs(a.y),Math.abs(b.y))+Math.max(Math.abs(a.z),Math.abs(b.z))):this.explicitTolerance};QuickHull3D.MAP_XYZ=["x","y","z"];
QuickHull3D.prototype._createInitialSimplex=function(){var a=0,b=0,c,e;this.constructor.MAP_XYZ.forEach(function(c,d){c=this.maxVertices[d].point[c]-this.minVertices[d].point[c];c>a&&(a=c,b=d)},this);if(a<=this.tolerance)throw Error("Input points appear to be coincident");c=[this.maxVertices[b],this.minVertices[b]];var d=VectorOperations.sub(c[1].point,c[0].point),f=0,g,d=VectorOperations.normalize(d);this.pointBuffer.forEach(function(a){if(a.index!==c[0].index&&a.index!==c[1].index){var b=VectorOperations.sub(a.point,
c[0].point),b=VectorOperations.cross(d,b),e=VectorOperations.abs2(b);e>f&&(f=e,c[2]=a,g=b)}});if(Math.sqrt(f)<=100*this.tolerance)throw Error("Input points appear to be colinear");g=VectorOperations.normalize(g);var h=0,l=VectorOperations.scalproduct(c[2].point,g);this.pointBuffer.forEach(function(a){if(a.index!==c[0].index&&a.index!==c[1].index&&a.index!==c[2].index){var b=Math.abs(VectorOperations.scalproduct(a.point,g)-l);b>h&&(h=b,c[3]=a)}});if(h<100*this.tolerance)throw Error("Input points appear to be coplanar");
this.debug&&(console.log("Initial vertices"),c.forEach(function(a){console.log(a.index+" : ",a.point)}));var k=[],m;if(0>VectorOperations.scalproduct(c[3].point,g)-l)for(k.push(FO.createTriangle(c[0],c[1],c[2])),k.push(FO.createTriangle(c[3],c[1],c[0])),k.push(FO.createTriangle(c[3],c[2],c[1])),k.push(FO.createTriangle(c[3],c[0],c[2])),e=0;3>e;e++)m=(e+1)%3,HEO.setOpposite(FO.getEdge(k[e+1],1),FO.getEdge(k[m+1],0)),HEO.setOpposite(FO.getEdge(k[e+1],2),FO.getEdge(k[0],m));else for(k.push(FO.createTriangle(c[0],
c[2],c[1])),k.push(FO.createTriangle(c[3],c[0],c[1])),k.push(FO.createTriangle(c[3],c[1],c[2])),k.push(FO.createTriangle(c[3],c[2],c[0])),e=0;3>e;e++)m=(e+1)%3,HEO.setOpposite(FO.getEdge(k[e+1],0),FO.getEdge(k[m+1],1)),HEO.setOpposite(FO.getEdge(k[e+1],2),FO.getEdge(k[0],(3-e)%3));this.faces=k;this.pointBuffer.forEach(function(a){var b=this.tolerance,d;a.index!==c[0].index&&a.index!==c[1].index&&a.index!==c[2].index&&a.index!==c[3].index&&(k.forEach(function(c){var e=FO.distanceToPlane(c,a.point);
e>b&&(d=c,b=e)}),void 0!==d&&this._addPointToFace(a,d))},this)};QuickHull3D.prototype._getNumberOfVertices=function(){};QuickHull3D.prototype._getVertexPointIndices=function(){};QuickHull3D.prototype._getNumberOfFaces=function(){};
QuickHull3D.prototype._getFaceIndices=function(a,b){var c=0===(b&this.constructor.CLOCKWISE);b=0!==(b&this.constructor.POINT_RELATIVE);var e=a.halfEdge0,d,f=[];do d=e.head.index,b&&(d=this.vertexPointIndices[d]),d++,f.push(realCSNumber(d)),e=c?e.next:e.previous;while(e!==a.halfEdge0);return turnIntoCSList(f)};
QuickHull3D.prototype._resolveUnclaimedPoints=function(a){var b,c,e,d,f,g,h=a.length,l;for(f=this._unclaimed.head;null!==f;f=g){g=f.next;b=this.tolerance;c=null;for(d=0;d<h&&!(e=a[d],e.mark===FO.VISIBLE&&(l=FO.distanceToPlane(e,f.point),l>b&&(b=l,c=e),b>1E3*this.tolerance));d++);null!==c?(this._addPointToFace(f,c),this.debug&&f.index===this._findIndex&&console.log(this._findIndex+" CLAIMED BY "+FO.getVertexString(c))):this.debug&&f.index===this._findIndex&&console.log(this._findIndex+" DISCARDED")}};
QuickHull3D.prototype._removeAllPointsFromFace=function(a){if(null===a.outside)return null;for(var b=a.outside;null!==b.next&&b.next.face===a;)b=b.next;this._claimed.delete(a.outside,b);b.next=null;return a.outside};QuickHull3D.prototype._deleteFacePoints=function(a,b){a=this._removeAllPointsFromFace(a);if(null!==a)if(null===b)this._unclaimed.addAll(a);else for(var c=a;null!==c;c=a)a=c.next,FO.distanceToPlane(b,c.point)>this.tolerance?this._addPointToFace(c,b):this._unclaimed.add(c)};
QuickHull3D.prototype._oppFaceDistance=function(a){return FO.distanceToPlane(a.face,a.opposite.face.centroid)};
QuickHull3D.prototype._doAdjacentMerge=function(a,b){var c=a.halfEdge0,e=!0,d,f;do{d=HEO.oppositeFace(c);f=!1;if(b===this.constructor.NONCONVEX){if(this._oppFaceDistance(c)>-this.tolerance||this._oppFaceDistance(c.opposite)>-this.tolerance)f=!0}else a.area>d.area?this._oppFaceDistance(c)>-this.tolerance?f=!0:this._oppFaceDistance(c.opposite)>-this.tolerance&&(e=!1):this._oppFaceDistance(c.opposite)>-this.tolerance?f=!0:this._oppFaceDistance(c)>-this.tolerance&&(e=!1);if(f){this.debug&&console.log("  merging "+
FO.getVertexString(a)+"  and  "+FO.getVertexString(d));b=FO.mergeAdjacentFace(a,c,this.discardedFaces);for(c=0;c<b;c++)this._deleteFacePoints(this.discardedFaces[c],a);this.debug&&console.log("  result: "+FO.getVertexString(a));return!0}c=c.next}while(c!==a.halfEdge0);e||(a.mark=FO.NON_CONVEX);return!1};
QuickHull3D.prototype._calculateHorizon=function(a,b,c,e){this._deleteFacePoints(c,null);c.mark=FO.DELETED;this.debug&&console.log("Visiting face "+FO.getVertexString(c));c=null===b?b=FO.getEdge(c,0):b.next;var d;do d=HEO.oppositeFace(c),d.mark===FO.VISIBLE&&(FO.distanceToPlane(d,a)>this.tolerance?this._calculateHorizon(a,c.opposite,d,e):(e.push(c),this.debug&&console.log("Adding horizon edge "+HEO.getVertexString(c)))),c=c.next;while(c!==b)};
QuickHull3D.prototype._addAdjoiningFace=function(a,b){a=FO.createTriangle(a,HEO.tail(b),b.head);this.faces.push(a);HEO.setOpposite(FO.getEdge(a,-1),b.opposite);return FO.getEdge(a,0)};QuickHull3D.prototype._addNewFaces=function(a,b,c){this.newFaces=[];var e=null,d=null;this.horizon.forEach(function(a){a=this._addAdjoiningFace(b,a);this.debug&&console.log("new face: "+FO.getVertexString(a.face));null!==e?HEO.setOpposite(a.next,e):d=a;this.newFaces.push(a.face);e=a},this);HEO.setOpposite(d.next,e)};
QuickHull3D.prototype._nextPointToAdd=function(){if(this._claimed.isEmpty())return null;var a=this._claimed.head.face,b=null,c=0,e,d;for(e=a.outside;null!==e&&e.face===a;e=e.next)d=FO.distanceToPlane(a,e.point),d>c&&(c=d,b=e);return b};
QuickHull3D.prototype._addPointToHull=function(a){this.horizon=[];this._unclaimed.clear();this.debug&&console.log("Adding point:",a.index,"\n which is "+FO.distanceToPlane(a.face,a.point)+"above face "+FO.getVertexString(a.face));this._removePointFromFace(a,a.face);this._calculateHorizon(a.point,null,a.face,this.horizon);this.newFaces=[];this._addNewFaces(this.newFaces,a,this.horizon);this.newFaces.forEach(function(a){if(a.mark===FO.VISIBLE)for(;this._doAdjacentMerge(a,this.constructor.NONCONVEX_WRT_LARGER_FACE););
},this);this.newFaces.forEach(function(a){if(a.mark===FO.NON_CONVEX)for(a.mark=FO.VISIBLE;this._doAdjacentMerge(a,this.constructor.NONCONVEX););},this);this._resolveUnclaimedPoints(this.newFaces)};QuickHull3D.prototype._buildHull=function(){var a=0,b;this._computeMaxAndMin();for(this._createInitialSimplex();null!==(b=this._nextPointToAdd());)this._addPointToHull(b),a++,this.debug&&console.log("Iteration "+a+" done");this._reindexFacesAndVertices();this.debug&&console.log("Hull done")};
QuickHull3D.prototype._markFaceVertices=function(a,b){var c=a.halfEdge0;do c.head.index=b,c=c.next;while(c!==a.halfEdge0)};
QuickHull3D.prototype._reindexFacesAndVertices=function(){this.pointBuffer.forEach(function(a){a.index=-1});this.numberOfFaces=0;var a=[];this.faces.forEach(function(b){b.mark===FO.VISIBLE&&(a.push(b),this._markFaceVertices(b,0),this.numberOfFaces++)},this);this.faces=a;this.numberOfVertices=0;this.pointBuffer.forEach(function(a,c){0===a.index&&(this.vertexPointIndices[this.numberOfVertices]=c,a.index=this.numberOfVertices++)},this)};QuickHull3D.prototype._checkFaceConvexity=function(a,b){};
QuickHull3D.prototype._checkFaces=function(a){};QuickHull3D.prototype._check=function(a){};var Vector=function(a,b,c){this.x=a;this.y=b;this.z=c},VectorOperations={DOUBLE_PRECISION:2.220446049250313E-16,add:function(a,b){return new Vector(a.x+b.x,a.y+b.y,a.z+b.z)},sub:function(a,b){return new Vector(a.x-b.x,a.y-b.y,a.z-b.z)},scalmult:function(a,b){return new Vector(a*b.x,a*b.y,a*b.z)},scaldiv:function(a,b){return new Vector(b.x/a,b.y/a,b.z/a)},abs2:function(a){return a.x*a.x+a.y*a.y+a.z*a.z},abs:function(a){return Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z)},distance2:function(a,b){var c=a.x-b.x,
e=a.y-b.y;a=a.z-b.z;return c*c+e*e+a*a},distance:function(a,b){var c=a.x-b.x,e=a.y-b.y;a=a.z-b.z;return Math.sqrt(c*c+e*e+a*a)},normalize:function(a){var b=a.x*a.x+a.y*a.y+a.z*a.z,c=2*VectorOperations.DOUBLE_PRECISION,e=b-1;return e>c||e<-2*c?(b=Math.sqrt(b),new Vector(a.x/b,a.y/b,a.z/b)):new Vector(a.x,a.y,a.z)},scalproduct:function(a,b){return a.x*b.x+a.y*b.y+a.z*b.z},cross:function(a,b){return new Vector(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x)},zerovector:function(){return new Vector(0,
0,0)},copy:function(a){return new Vector(a.x,a.y,a.z)}};var HalfEdge=function(a,b){this.head=a;this.face=b},HalfEdgeOperations={},HEO=HalfEdgeOperations;HEO.setOpposite=function(a,b){a.opposite=b;b.opposite=a};HEO.tail=function(a){return null!==a.previous?a.previous.head:null};HEO.oppositeFace=function(a){return null!==a.opposite?a.opposite.face:null};HEO.getVertexString=function(a){var b=HEO.tail(a);return null!==b?b.index+"-"+a.head.index:"?-"+a.head.index};
HEO.length=function(a){var b=HEO.tail(a);return null!==b?VectorOperations.abs(VectorOperations.sub(a.head.point,b.point)):-1};HEO.lengthSquared=function(a){var b=HEO.tail(a);return null!==b?VectorOperations.abs2(VectorOperations.sub(a.head.point,b.point)):-1};var Vertex=function(a,b,c,e){0===arguments.length?this.point=turnIntoCSList([]):(this.point=turnIntoCSList([a,b,c]),this.index=e);this.previous=this.next=null};var VertexList=function(){this.head=this.tail=null};VertexList.prototype.clear=function(){this.head=this.tail=null};VertexList.prototype.add=function(a){null===this.head?this.head=a:this.tail.next=a;a.previous=this.tail;a.next=null;this.tail=a};VertexList.prototype.addAll=function(a){null===this.head?this.head=a:this.tail.next=a;for(a.previous=this.tail;null!==a.next;)a=a.next;this.tail=a};
VertexList.prototype.delete=function(a,b){void 0===b&&(b=a);null===a.previous?this.head=b.next:a.previous.next=b.next;null===b.next?this.tail=a.previous:b.next.previous=a.previous};VertexList.prototype.insertBefore=function(a,b){a.previous=b.previous;null===b.previous?this.head=a:b.previous.next=a;a.next=b;b.previous=a};VertexList.prototype.isEmpty=function(){return null===this.head};VertexList.prototype.length=function(){for(var a=0,b=this.head;null!==b;b=b.next)a++;return a};var FaceOperations={},FO=FaceOperations,Face=function(){this.mark=FO.VISIBLE;this.outside=null};FO.VISIBLE=1;FO.NON_CONVEX=2;FO.DELETED=3;FO.computeCentroid=function(a){var b=a.halfEdge0;a.centroid=VectorOperations.zerovector();do a.centroid=VectorOperations.add(a.centroid,b.head.point),b=b.next;while(b!==a.halfEdge0);a.centroid=VectorOperations.scaldiv(a.numberOfVertices,a.centroid)};
FO.computeNormal=function(a,b){var c,e,d;d=a.halfEdge0.next;c=d.next;e=a.halfEdge0.head.point;var f=d.head.point,f=VectorOperations.sub(e,f);a.normal=VectorOperations.zerovector();for(a.numberOfVertices=2;c!==a.halfEdge0;)d=f,f=c.head.point,f=VectorOperations.sub(e,f),a.normal=VectorOperations.add(a.normal,VectorOperations.cross(d,f)),c=c.next,a.numberOfVertices++;a.area=VectorOperations.abs(a.normal);a.normal=VectorOperations.scaldiv(a.area,a.normal);if(void 0!==b&&a.area<b){c=null;b=0;e=a.halfEdge0;
do d=e.lengthSqr(),d>b&&(c=e,b=d),e=e.next;while(e!==a.halfEdge0);e=c.head.point;c=HEO.tail(c).point;b=Math.sqrt(b);b=VectorOperations.scaldiv(b,VectorOperations.sub(e,c));c=VectorOperations.scalproduct(b,a.normal);a.normal=VectorOperations.sub(a.normal,VectorOperations.scalmul(c,b))}};FO.getEdge=function(a,b){for(a=a.halfEdge0;0<b;)b--,a=a.next;for(;0>b;)b++,a=a.previous;return a};
FO.findEdge=function(a,b,c){var e=a.halfEdge0;do{if(e.head.index===c.index){if(HEO.tail(e).index===b.index)return e;break}e=e.next}while(e!==a.halfEdge);return null};FO.distanceToPlane=function(a,b){return VectorOperations.scalproduct(a.normal,b)-a.planeOffset};FO.getVertexString=function(a){for(var b=a.halfEdge0.head.index,c=a.halfEdge0.next;c!==a.halfEdge0;)b+=" "+c.head.index,c=c.next;return b};
FO.getVertexIndices=function(a){var b=[],c=a.halfEdge0;do b.push(c.head.index),c=c.next;while(c!==a.halfEdge0);return b};
FO._checkConsistency=function(a){var b=a.halfEdge0,c=0,e=0;if(3>a.numberOfVertices)throw Error("degenerate face: "+FO.getVertexString(a));do{var d=b.opposite;if(null===d)throw Error("face "+FO.getVertexString(a)+": unreflected half edge "+HEO.getVertexString(b));if(d.opposite!==b)throw Error("face "+FO.getVertexString(a)+": opposite half edge "+HEO.getVertexString(d)+" has opposite "+d.opposite.getVertexString());if(d.head!==HEO.tail(b)||b.head!==HEO.tail(d))throw Error("face "+FO.getVertexString(a)+
": half edge "+HEO.getVertexString(b))+" reflected by "+HEO.getVertexString(d);var f=d.face;if(null===f)throw Error("face "+FO.getVertexString(a)+": no face on half edge "+HEO.getVertexString(d));if(f.mark===FO.DELETED)throw Error("face "+FO.getVertexString(a)+": opposite face "+FO.getVertexString(f)+" not on hull");d=Math.abs(FO.distanceToPlane(a,b.head.point));d>c&&(c=d);e++;b=b.next}while(b!==a.halfEdge0);if(e!==a.numberOfVertices)throw Error("face "+FO.getVertexString(a)+" numVerts="+a.numberOfVertices+
" should be "+e);};
FO.mergeAdjacentFace=function(a,b,c){var e=0,d=HEO.oppositeFace(b);c[e++]=d;d.mark=FO.DELETED;for(var f=b.opposite,g=b.previous,h=b.next,l=f.previous,f=f.next;HEO.oppositeFace(g)===d;)g=g.previous,f=f.next;for(;HEO.oppositeFace(h)===d;)l=l.previous,h=h.next;for(d=f;d!==l.next;d=d.next)d.face=a;b===a.halfEdge0&&(a.halfEdge0=h);b=FO._connectHalfEdges(a,l,h);null!==b&&(c[e++]=b);b=FO._connectHalfEdges(a,g,f);null!==b&&(c[e++]=b);FO._computeNormalAndCentroid(a);FO._checkConsistency(a);return e};
FO.getSquaredArea=function(a,b,c){a=HEO.tail(b).point;var e=b.head.point,d=c.head.point;c=e.x-a.x;b=e.y-a.y;var f=e.z-a.z,e=d.x-a.x,g=d.y-a.y,d=d.z-a.z;a=b*d-f*g;f=f*e-c*d;c=c*g-b*e;return a*a+f*f+c*c};
FO.triangulate=function(a,b,c){if(!(4>a.numberOfVertices)){for(var e=a.halfEdge0.head,d=a.halfEdge0.next,f=d.opposite,g=null,h,d=d.next;d!==a.halfEdge0.previous;d=d.next)h=FO.createTriangle(e,d.previous.head,d.head,c),HEO.setOpposite(h.halfEdge0.next,f),HEO.setOpposite(h.halfEdge0.previous,d.opposite),f=h.halfEdge0,b.push(h),null===g&&(g=h);d=new HalfEdge(a.halfEdge0.previous.previous.head,a);HEO.setOpposite(d,f);d.previous=a.halfEdge0;d.previous.next=d;d.next=a.halfEdge0.previous;d.next.previous=
d;FO.computeNormalAndCentroid(a,c);FO.checkConsistency(a);for(a=g;null!==a;a=a.next)FO.checkConsistency(a)}};FO._computeNormalAndCentroid=function(a,b){var c;FO.computeNormal(a,b);FO.computeCentroid(a);a.planeOffset=VectorOperations.scalproduct(a.normal,a.centroid);if(void 0!==b){b=0;c=a.halfEdge0;do b++,c=c.next;while(c!==a.halfEdge0);if(b!==a.numberOfVertices)throw Error("Face "+FO.getVertexString(a)+" should be "+a.numberOfVertices);}};
FO._connectHalfEdges=function(a,b,c){var e=null,d=HEO.oppositeFace(c);HEO.oppositeFace(b)===d?(b===a.halfEdge0&&(a.halfEdge0=c),3===d.numberOfVertices?(a=c.opposite.previous.opposite,d.mark=FO.DELETED,e=d):(a=c.opposite.next,d.halfEdge0===a.previous&&(d.halfEdge0=a),a.previous=a.previous.previous,a.previous.next=a),c.previous=b.previous,c.previous.next=c,c.opposite=a,a.opposite=c,FO._computeNormalAndCentroid(d)):(b.next=c,c.previous=b);return e};
FO.create=function(a,b){var c=new Face,e=null;b.forEach(function(b){b=new HalfEdge(a[b],c);null!==e?(b.previous=e,e.next=b):c.halfEdge0=b;e=b});c.halfEdge0.previous=e;e.next=c.halfEdge0;FO._computeNormalAndCentroid(c);return c};FO.createTriangle=function(a,b,c,e){e=e||0;var d=new Face;a=new HalfEdge(a,d);b=new HalfEdge(b,d);c=new HalfEdge(c,d);a.previous=c;a.next=b;b.previous=a;b.next=c;c.previous=b;c.next=a;d.halfEdge0=a;FO._computeNormalAndCentroid(d,e);return d};var FaceList=function(){};FaceList.prototype.clear=function(){this._head=this._tail=null};FaceList.prototype.add=function(a){};FaceList.prototype.first=function(){};FaceList.prototype.isEmpty=function(){};CindyJS.registerPlugin(1,"QuickHull3D",function(a){a.defineFunction("convexhull3d",1,function(b){var c=a.evaluateAndVal(b[0]),e=c.value.length;b=[];for(var d,f=0;f<e;f++)d=c.value[f].value,b.push(new Vector(d[0].value.real,d[1].value.real,d[2].value.real));c=new QuickHull3D;c.build(b);b={ctype:"list",value:c.getVertices()};c={ctype:"list",value:c.getFaces()};return{ctype:"list",value:[b,c]}})});
}).call(this);//# sourceMappingURL=QuickHull3D.js.map


function Quaternion(v, s) {
  //-----------------------------------
  // this.v - vector part of quaternion
  // this.s - real part of quaternion
  this.v = v;
  this.s = s;
}


Quaternion.prototype.mul = function (r) {
  // Multiply this quaternion with quaternion r
  var new_s = this.s*r.s - numeric.dot(this.v, r.v);
  var i = r.s*this.v[0] + r.v[0]*this.s - r.v[1]*this.v[2] + r.v[2]*this.v[1]
  var j = r.s*this.v[1] + r.v[0]*this.v[2] - r.v[1]*this.s + r.v[2]*this.v[0]
  var k = r.s*this.v[2] + r.v[0]*this.v[1] - r.v[1]*this.v[0] + r.v[2]*this.s

  return new Quaternion([i,j,k], new_s);
};

Quaternion.prototype.smult = function (scalar) {
  // Multiply quaternion with scalar value
  this.v[0] = this.v[0] * scalar;
  this.v[1] = this.v[1] * scalar;
  this.v[2] = this.v[2] * scalar;
  this.s =  this.s * scalar;

  return this;
};

Quaternion.prototype.getCrossMatrix = function(vec) {
  // Returns matrix which represents cross product
  var vecx = [
    [0, -vec[2], vec[1]],
    [vec[2], 0, -vec[0]],
    [-vec[1], vec[0], 0]
  ];
  return vecx;
};

Quaternion.prototype.normalize = function(){
  // Normalize quaternion to be of length 1
  var l = Math.sqrt(this.v[0]*this.v[0] + this.v[1]*this.v[1] + this.v[2]*this.v[2] + this.s*this.s);
  if (l == 0) {
    return new Quaternion([0, 0, 0], 1);
  }
  l = 1 / l;

  return this.smult(l);
};

Quaternion.prototype.toMatrix = function(q) {
  // Returns rotation matrix from quaternion
  var v = this.v;
  var s = this.s;
  var x11 = 1 - 2*v[1]*v[1] - 2*v[2]*v[2];
  var x12 = 2*v[0]*v[1] - 2*s*v[2];
  var x13 = 2*v[0]*v[2] + 2*v[1]*s;
  var x21 = 2*v[0]*v[1] + 2*s*v[2];
  var x22 = 1 - 2*v[0]*v[0] - 2*v[2]*v[2];
  var x23 = 2*v[2]*v[1] - 2*s*v[0];
  var x31 = 2*v[0]*v[2] - 2*v[1]*s;
  var x32 = 2*v[2]*v[1] + 2*s*v[0];
  var x33 = 1 - 2*v[1]*v[1] - 2*v[0]*v[0];

  return [
    [x11,x12,x13],
    [x21,x22,x23],
    [x31,x32,x33]];
};

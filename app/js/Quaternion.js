function Quaternion(v, s) {
  this.v = v;
  this.s = s;
}

Quaternion.prototype.getQ = function() {

}

Quaternion.prototype.mul = function (q) {
  var new_s = this.s*q.s - numeric.dot(this.v, q.v);
  var v1 = numeric.mul(this.s, q.v);
  var v2 = numeric.mul(q.s, this.v);
  var v3 = numeric.dot(this.getCrossMatrix(this.v), q.v);
  var new_v = numeric.add(numeric.add(v1, v2), v3);

  return new Quaternion(new_v, new_s);
};

Quaternion.prototype.smult = function (scalar) {
  this.v[0] = this.v[0] * scalar;
  this.v[1] = this.v[1] * scalar;
  this.v[2] = this.v[2] * scalar;
  this.s =  this.s * scalar;

  return this;
};

Quaternion.prototype.vmult = function(v){
  var x = this.s*v[0] - this.v[2]*v[1] + this.v[1]*v[2];
  var y = this.v[2]*v[0] + this.s*v[1] - this.v[0]*v[2];
  var z = -this.v[1]*v[0] + this.v[0]*v[1] + this.s*v[2];
  var s = -this.v[0]*v[0] - this.v[1]*v[1] - this.v[2]*v[2];

  var quat = new Quaternion([x, y, z], s);

  return quat;
};

Quaternion.prototype.getCrossMatrix = function(vec) {
  var vecx = [
    [0, -vec[2], vec[1]],
    [vec[2], 0, -vec[0]],
    [-vec[1], vec[0], 0]
  ];
  return vecx;
};

Quaternion.prototype.normalize = function(){
  var l = Math.sqrt(this.v[0]*this.v[0]+this.v[1]*this.v[1]+this.v[2]*this.v[2]+this.s*this.s);
  if (l == 0) {
    return new Quaternion([0, 0, 0], 1);
  }
  l = 1 / l;

  return this.smult(l);
};

Quaternion.prototype.toMatrix = function(q) {
  var v = this.v;
  var s = this.s;
  var x11 = 1 - 2*v[1]*v[1] - 2*v[2]*v[2];
  var x12 = 2*v[0]*v[1] - 2*s*v[2];
  var x13 = 2*v[0]*v[2] + 2*v[1]*s;
  var x21 = x12;
  var x22 = 1 - 2*v[0]*v[0] - 2*v[2]*v[2];
  var x23 = 2*v[2]*v[1] - 2*s*v[0];
  var x31 = x13;
  var x32 = x23;
  var x33 = 1 - 2*v[1]*v[1] - 2*v[0]*v[0];

  return [
    [x11,x12,x13],
    [x21,x22,x23],
    [x31,x32,x33]];
};

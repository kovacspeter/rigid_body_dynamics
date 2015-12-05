function RB(particle) {
  // -----------------------------------------------------
  //     Constant:
  // this.mass;      float
  // this.Ibody;     matrix3
  // this.Ibodyinv;  matrix3
  // -----------------------------------------------------
  //     State:
  // this.x;         float3    Position
  // this.R;         matrix3   Rotation
  // this.P;         float3    Linear momentum = m v
  // this.L;         float3    Angular momentum = I omega
  // -----------------------------------------------------
  //     Derived:
  // this.Iinv;      matrix3
  // this.v;         float3
  // this.omega;     float3
  // -----------------------------------------------------
  //     Computed:
  // this.force;     float3
  // this.torque;    float3
  // -----------------------------------------------------
  this.particles = [particle];
  this.force = [0, 0, 0];
  this.torque = [0, 0, 0];
  this.R = numeric.identity(3);
  particle.rb = this;
  this.mass = particle.mass;
  this.P = [0, 0, 0];
  this.L = [0, 0, 0];
  this.updateCenterOfMass();
  this.updateInertia();
  this.computeAux();
}

RB.prototype.computeAux = function() {
  this.v = numeric.div(this.P, this.mass);
  this.Iinv = numeric.dot(numeric.dot(this.R, this.Ibodyinv), numeric.transpose(this.R));
  this.omega = numeric.dot(this.Iinv, this.L);
}
RB.prototype.update = function(dt) {
  //TODO tu aktualne rpacujem
  // this.computeAux();
  // this.renormalizeR();
  // this.updateForce();
  // this.updateTorque();
  // this.integrateEuler(dt);
  this.computeCollisions();
  this.integrateBody(dt);
}

RB.prototype.integrateBodies = function(dt) {
  //TODO tu aktualne pracujem.
  // numeric.addeq(this.x, numeric.mul(this.v, dt));
  // var m = numeric.dot(this.getCrossMatrix(this.omega), this.R);
  // numeric.addeq(this.R, numeric.mul(m, dt));
  //
  // numeric.addeq(this.P, numeric.mul(this.force, dt));
  // numeric.addeq(this.L, numeric.mul(this.torque, dt));
  //
  // this.force = [0, 0, 0];
  // this.torque = [0, 0, 0];
//   for (var i = 0; i < this.particles.length; i++) {
//     var particle = this.particles[i];
//     if (particle.mass >= 0) {
//       // INERTIA
//       var r = numeric.sub(this.x, particle.x);
//       var outer = [
//         [r[0] * r[0], r[0] * r[1], r[0] * r[2]],
//         [r[1] * r[0], r[1] * r[1], r[1] * r[2]],
//         [r[2] * r[0], r[2] * r[1], r[2] * r[2]]
//       ];
//       var inner = numeric.mul(numeric.sum(numeric.pow(r, [2, 2, 2])), numeric.identity(3));
//       var diff = numeric.sub(inner, outer);
//       particle.Ibody = numeric.addeq(particle.Ibody, numeric.mul(particle.mass, diff));
//       particle.Ibodyinv = pinv(particle.Ibody);
//
//       // COMPUTE AUX
//       particle.v = numeric.div(particle.P, particle.mass);
//       particle.Iinv = numeric.dot(numeric.dot(particle.R, particle.Ibodyinv), numeric.transpose(particle.R));
//       particle.omega = numeric.dot(particle.Iinv, particle.L);
//
//
//       // INTEGRATE EULER
//       numeric.addeq(particle.x, numeric.mul(particle.v, dt));
//       var m = numeric.dot(particle.getCrossMatrix(particle.omega), particle.R);
//       numeric.addeq(particle.R, numeric.mul(m, dt));
//
//       numeric.addeq(particle.P, numeric.mul(particle.force, dt));
//       numeric.addeq(particle.L, numeric.mul(particle.torque, dt));
//       particle.force = [0, 0, 0];
//       particle.torque = [0, 0, 0];
//     }
//   }
//   this.updateCenterOfMass();
//   //TODO
}
//
RB.prototype.applyForce = function(f) {
  numeric.addeq(this.force, f);
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    p.applyForce(numeric.div(f, this.mass));
  }
}
//

RB.prototype.integrateEuler = function(dt) {
  numeric.addeq(this.x, numeric.mul(this.v, dt));
  var m = numeric.dot(this.getCrossMatrix(this.omega), this.R);
  numeric.addeq(this.R, numeric.mul(m, dt));

  numeric.addeq(this.P, numeric.mul(this.force, dt));
  numeric.addeq(this.L, numeric.mul(this.torque, dt));

  this.force = [0, 0, 0];
  this.torque = [0, 0, 0];
}
RB.prototype.renormalizeR = function() {
  var v0 = [this.R[0][0], this.R[1][0], this.R[2][0]];
  this.normalize(v0);
  var v1 = [this.R[0][1], this.R[1][1], this.R[2][1]];
  this.normalize(v1);
  var v2 = numeric.dot(this.getCrossMatrix(v0), v1);
  v1 = numeric.dot(this.getCrossMatrix(v2), v0);
  this.R[0][0] = v0[0];
  this.R[0][1] = v1[0];
  this.R[0][2] = v2[0];
  this.R[1][0] = v0[1];
  this.R[1][1] = v1[1];
  this.R[1][2] = v2[1];
  this.R[2][0] = v0[2];
  this.R[2][1] = v1[2];
  this.R[2][2] = v2[2];
}
RB.prototype.integrateBody = function(dt) {
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    if (p.mass >= 0) {
      p.integrateEuler(dt);
      p.renormalizeR();
      p.computeAux();
    }
  }
}

RB.prototype.computeCollisions = function() {
  //TODO
  for (var i = 0; i < this.particles.length; i++) {
    var particle = this.particles[i];
    if (particle.x[0] < particle.r) {
      particle.P[0] = Math.abs(particle.P[0]);
    }
    else if (particle.x[0] > Canvas.SIZE.WIDTH - particle.r){
      particle.P[0] = -Math.abs(particle.P[0]);
    }

    if (particle.x[1] < particle.r) {
      particle.P[1] = Math.abs(particle.P[1]);
    }
    else if (particle.x[1] > Canvas.SIZE.HEIGHT - particle.r){
      particle.P[1] = -Math.abs(particle.P[1]);
    }
    // if (particle.x[0] < particle.r) {
    //   particle.applyForce([0, Math.abs(particle.P[0]), 0]);
    //   particle.P[0] = 0;
    // } else if (particle.x[0] > Canvas.SIZE.WIDTH - particle.r) {
    //   particle.applyForce([0, -Math.abs(particle.P[0]), 0]);
    //   particle.P[0] = 0;
    // }
    //
    // if (particle.x[1] < particle.r) {
    //   particle.applyForce([0, Math.abs(particle.P[1]), 0]);
    //   particle.P[1] = 0;
    // } else if (particle.x[1] > Canvas.SIZE.HEIGHT - particle.r) {
    //   particle.applyForce([0, -Math.abs(particle.P[1]), 0]);
    //   particle.P[1] = 0;
    // }
  }
};

RB.prototype.draw = function(context, color) {
  for (p in this.particles) {
    this.particles[p].draw(context, color);
  }
};

RB.prototype.updateCenterOfMass = function() {
  var pos = [0, 0, 0];
  for (var p in this.particles) {
    var particle = this.particles[p];
    numeric.addeq(pos, numeric.mul(particle.x, particle.mass));
  }
  numeric.diveq(pos, this.mass)
  this.x = pos;
  for (var p in this.particles) {
    var particle = this.particles[p];
    particle.bx = numeric.sub(this.x, particle.x);
  }
};



RB.prototype.updateTorque = function() {
  var torque = [0, 0, 0];
  for (var p in this.particles) {
    var particle = this.particles[p];
    numeric.addeq(torque, particle.torque);
  }
  this.torque = torque;
};

RB.prototype.updateForce = function() {
  var force = [0, 0, 0];
  for (var p in this.particles) {
    numeric.addeq(force, this.particles[p].force);
  }
  this.force = force;
};

RB.prototype.updateInertia = function() {
  var J = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ];
  for (var p in this.particles) {
    var particle = this.particles[p];
    var r = numeric.sub(this.x, particle.x);
    var rT = numeric.transpose(r);
    var outer = [
      [r[0] * r[0], r[0] * r[1], r[0] * r[2]],
      [r[1] * r[0], r[1] * r[1], r[1] * r[2]],
      [r[2] * r[0], r[2] * r[1], r[2] * r[2]]
    ];
    var inner = numeric.mul(numeric.sum(numeric.pow(r, [2, 2, 2])), numeric.identity(3));
    var diff = numeric.sub(inner, outer);
    particle.Ibody = numeric.mul(particle.mass, diff);
    numeric.addeq(J, particle.Ibody);
  }
  this.Ibody = J;
  this.Ibodyinv = numeric.inv(this.inertiaTensor);
};

RB.prototype.isOverlap = function(rb) {
  for (var i in this.particles) {
    p1 = this.particles[i];
    for (var j in rb.particles) {
      p2 = rb.particles[j];
      var dist = Math.sqrt(numeric.sum(numeric.pow(numeric.sub(p1.x, p2.x), [2, 2, 2])));
      if (dist <= (p1.r + p2.r)) {
        return true;
      }
    }
  }
  return false;
};

RB.prototype.getCrossMatrix = function(vec) {
  var vecx = [
    [0, -vec[2], vec[1]],
    [vec[2], 0, -vec[0]],
    [-vec[1], vec[0], 0]
  ];
  return vecx;
};
RB.prototype.getMass = function() {
	return this.mass;
};
RB.prototype.getParticle = function(x, y, z) {
  for (var p in this.particles) {
    var particle = this.particles[p];
    if (particle.isInside(x, y, z)) {
      return particle;
    }
  }
  return null;
};
RB.prototype.getPosition = function() {
	return this.x;
};

RB.prototype.join = function(rb) {
  for (p in rb.particles) {
    var particle = rb.particles[p];
    this.particles.push(particle);
    this.mass += particle.mass;
    particle.rb = this;
  }
  this.updateCenterOfMass();
  this.computeAux();
};
RB.prototype.normalize = function(v) {
  var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  v[0] /= l;
  v[1] /= l;
  v[2] /= l;
}

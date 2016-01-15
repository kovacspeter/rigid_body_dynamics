function Particle(radius, position) {
	// -----------------------------------------------------
	//     Constant:
	// this.r;         float    radius
	// this.mass;      float
	// this.Ibody;     matrix3
	// this.Ibodyinv;  matrix3
	// -----------------------------------------------------
	//     State:
	// this.x;         float3    Position
	// this.bx         float3    Local Position in Body System
	// this.R;         matrix3   Rotation
	// this.P;         float3    Linear momentum = m v
	// this.L;         float3    Angular momentum = I omega
	// -----------------------------------------------------
	//     Derived:
	// this.I					 float3		Moment of Inertia
	// this.Iinv;      matrix3
	// this.v;         float3
	// this.omega;     float3		--> #DISCUSS: IS angular velocity of the particle really needed?
	// -----------------------------------------------------
	//     Computed:
	// this.force;     float3
	// this.torque;    float3
	// -----------------------------------------------------
	this.rb = undefined;
	this.force = [0, 0, 0]; // DELETE?
	this.torque = [0, 0, 0]; // DELETE?
	this.omega = [0, 0, 0]; // DELETE?
	this.bx = [0, 0, 0];
	this.x = position;
	this.R = numeric.identity(3); // DELETE?
	this.P = [0, 0, 0]; // DELETE?
	this.L = [0, 0, 0]; // DELETE?
	this.I = 0;  // DELETE?
	this.setSphere(radius, position);
}
Particle.DENSITY = 1 / ((4 / 3) * Math.PI * 1000);		// for r = 10, mass should be = 1
Particle.LAST_ID = 0;

Particle.prototype.setSphere = function (r) {
	this.r = r;
	this.mass = this.computeMass();
	this.Ibody = [
		[2 * this.mass * Math.pow(this.r, 2) / 5, 0, 0],
		[0, 2 * this.mass * Math.pow(this.r, 2) / 5, 0],
		[0, 0, 2 * this.mass * Math.pow(this.r, 2) / 5]
	];
	this.Ibodyinv = numeric.inv(this.Ibody);
};

Particle.prototype.draw = function (context, color) {
	drawCircle(context, this.getPosition(), this.r, color);
};

Particle.prototype.drawCentre = function (context) {
	drawX(context, this.getPosition(), 6, '#777');
	drawLine(context, this.rb.getPosition(), this.getPosition(), '#222', 1);
};

Particle.prototype.computeMass = function () {
	var volume = (4 / 3) * Math.PI * Math.pow(this.r, 3);
	return Particle.DENSITY * volume;
};

Particle.prototype.getCrossMatrix = function (vec) {
	var vecx = [
		[0, -vec[2], vec[1]],
		[vec[2], 0, -vec[0]],
		[-vec[1], vec[0], 0]
	];
	return vecx;
};
Particle.prototype.getDistanceFromCenterOfMass = function () {
	return Math.sqrt(this.bx[0] * this.bx[0] + this.bx[1] * this.bx[1] + this.bx[2] * this.bx[2]);
};
Particle.prototype.getKineticEnergy = function () {
	return (this.I * (this.rb.omega[0] * this.rb.omega[0] + this.rb.omega[1] * this.rb.omega[1])) / 2;
};
Particle.prototype.getMass = function () {
	return this.mass;
};
Particle.prototype.getMomentum = function () {
	return this.P;
};
Particle.prototype.getPosition = function () {
	if (this.rb) {
		return numeric.add(this.rb.x, numeric.dot(this.rb.q.normalize().toMatrix(), this.bx))
	} else {
		return this.x;
	}
};
Particle.prototype.getRadius = function () {
	return this.r;
};
Particle.prototype.getVelocity = function () {
	return this.v;
};
Particle.prototype.isInside = function (x, y, z) {
	var sub = numeric.sub([x, y, z], this.getPosition());
	var power = numeric.pow(sub, [2, 2, 2]);
	var sum = numeric.sum(power);
	// console.log(this.r - Math.sqrt(sum) >= 0);
	return this.r - Math.sqrt(sum) >= 0;
};

Particle.prototype.applyForce = function(force) {
	numeric.addeq(this.rb.force, force);
	numeric.addeq(this.rb.torque, numeric.dot(this.getCrossMatrix(numeric.sub(this.rb.x, this.getPosition())), force));
};

function pinv(A) {
	var z = numeric.svd(A), foo = z.S[0];
	var U = z.U, S = z.S, V = z.V;
	var m = A.length, n = A[0].length, tol = Math.max(m, n) * numeric.epsilon * foo, M = S.length;
	var i, Sinv = new Array(M);
	for (i = M - 1; i !== -1; i--) {
		if (S[i] > tol)
			Sinv[i] = 1 / S[i];
		else
			Sinv[i] = 0;
	}
	return numeric.dot(numeric.dot(V, numeric.diag(Sinv)), numeric.transpose(U));
}
;

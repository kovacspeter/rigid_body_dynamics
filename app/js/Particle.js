function Particle(r, position, density) {
	//-----------------------------------
	// this.rb    	 - rigid body to which particle belongs
	// this.bx       - relative position form center of mass of this.rb
	// this.x        - actual position of particle(on canvas)
	// this.r        - radius of this particle(sphere)
	// this.Ibody    - inertia tensor of this particle
	// this.Ibodyinv - inversed this.Ibody
	// this.mass     - weight of this particle
	this.rb = undefined;
	this.bx = [0, 0, 0];
	this.x = position;
	this.r = r;
	this.density = density;
	this.mass = this.computeMass();
	this.Ibody = [
		[2 * this.mass * Math.pow(this.r, 2) / 5, 0, 0],
		[0, 2 * this.mass * Math.pow(this.r, 2) / 5, 0],
		[0, 0, 2 * this.mass * Math.pow(this.r, 2) / 5]
	];
	this.Ibodyinv = numeric.inv(this.Ibody);
}
Particle.DENSITY = 1 / ((4 / 3) * Math.PI * 1000);		// for r = 10, mass should be = 1
Particle.LAST_ID = 0;

Particle.prototype.draw = function (context, color) {
	// Draws circle representing particle on canvas
	drawCircle(context, this.getPosition(), this.r, color);
};
/**
 * Draws particle center and line to center of mass of object
 * to which particle belongs on canvas
 */
Particle.prototype.drawCentre = function (context) {
	drawX(context, this.getPosition(), 6, '#777');
	drawLine(context, this.rb.getPosition(), this.getPosition(), '#222', 1);
};
/**
 * Computes mass of rigid body
 */
Particle.prototype.computeMass = function () {
	return this.density * this.getVolume();
};

/**
 * Returns matrix which represents cross product
 */
Particle.prototype.getCrossMatrix = function (vec) {
	var vecx = [
		[0, -vec[2], vec[1]],
		[vec[2], 0, -vec[0]],
		[-vec[1], vec[0], 0]
	];
	return vecx;
};
Particle.prototype.getDensity = function() {
	return this.density;
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
Particle.prototype.getVolume = function () {
	return (4 / 3) * Math.PI * Math.pow(this.r, 3);
};

Particle.prototype.setDensity = function(density) {
	this.density = density;
	this.rb.mass -= this.mass;
	this.mass = this.computeMass();
	this.rb.mass += this.mass;
}

/**
 * Returns wether point (x,y,z) is inside this parcile(sphere)
 *
 * @param x,y,z  coordinates of point
 * @returns {bool} Wether is point in this particle(sphere)
 */
Particle.prototype.isInside = function (x, y, z) {
	var sub = numeric.sub([x, y, z], this.getPosition());
	var power = numeric.pow(sub, [2, 2, 2]);
	var sum = numeric.sum(power);
	return this.r - Math.sqrt(sum) >= 0;
};

/**
 * Applies force on this particular particle.
 *
 * @param {array} (x,y,z) vector of force beeing applied.
 */
Particle.prototype.applyForce = function(force) {
	// Applies force on particle
	numeric.addeq(this.rb.force, force);
	numeric.addeq(this.rb.torque, numeric.dot(this.getCrossMatrix(numeric.sub(this.getPosition(), this.rb.x)), force));
};

/**
 * Calculate pseudoinverse matrix.
 *
 * @param {array of arrays} Matrix from which we want pseudoinverse matrix.
 * @returns {array of arrays} Pseudoinverse matrix of input.
 */
function pinv(A) {
	// Returns pseudoinverse matrix of matrix A
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
};

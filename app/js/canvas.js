function Canvas(canvasElement) {
	/* Properties */
	this.state = null;
	this.objects = [];
	this.canvasElement = canvasElement;
	this.context = this.canvasElement[0].getContext("2d");
	this.mouseButtonPressed = false;
	this.mouseButtonClickCoords = {
		x: 0,
		y: 0
	};

	/* Call init methods */
	this.initMouseListeners();
}
Canvas.STATES = {
	NONE: 0,
	ADDING_PARTICLE: 1,
	APPLYING_FORCE: 3
};
Canvas.SIZE = {
	WIDTH: 800,
	HEIGHT: 600
};
Canvas.NUM_STEPS = 1;

Canvas.prototype.setMouseButtonClickCoords = function (evt) {
	this.mouseButtonClickCoords.x = evt.pageX - this.canvasElement.offset().left;
	this.mouseButtonClickCoords.y = evt.pageY - this.canvasElement.offset().top;
};
Canvas.prototype.createParticle = function (evt) {
	var x = evt.pageX - this.canvasElement.offset().left;
	var y = evt.pageY - this.canvasElement.offset().top;
	var mouseVector = [x - this.mouseButtonClickCoords.x, y - this.mouseButtonClickCoords.y];

	//setRadius of new Particle
	var particleRadius = numeric.norm2(mouseVector);
	if (particleRadius < 10) { //Minimal size of particle
		particleRadius = 10;
	} else if (particleRadius > 100) { //Maximal size of particle
		particleRadius = 100;
	}
	var particle = new Particle(particleRadius, [this.mouseButtonClickCoords.x, this.mouseButtonClickCoords.y, 0]);
	return particle;
};
Canvas.prototype.crateRigidBody = function (evt) {
	// First create particle
	var particle = this.createParticle(evt);
	// Each particle belongs to some rigid body
	var rb = new RB(particle);

	var overlaping = [];
	// If bodies are overlaping after creation merge them into one RB
	for (var o in this.objects) {
		if (this.objects[o].isOverlap(rb)) {
			overlaping.push(this.objects[o]);
		}
	}
	if (overlaping.length > 0) {
		rb.join(overlaping);
	}

	// Delete merged bodies
	var new_objects = [];
	for (o in this.objects) {
		if (this.objects[o].particles.length != 0) {
			new_objects.push(this.objects[o]);
		}
	}
	this.objects = new_objects;
	// Put new (possibly merged) object into objects
	this.objects.push(rb);
};
Canvas.prototype.applyForce = function (evt) {
	var x = evt.pageX - this.canvasElement.offset().left
	var y = evt.pageY - this.canvasElement.offset().top
	for (i in this.objects) {
		var object = this.objects[i];
		var particle = object.getParticle(this.mouseButtonClickCoords.x, this.mouseButtonClickCoords.y, 0);
		if (particle != null) {
			//set Force vector
			var force = [this.mouseButtonClickCoords.x - x, this.mouseButtonClickCoords.y - y, 0];
			force = numeric.div(force, 100 / object.getMass()); // force scaled according to mass of the rigid body
			particle.applyForce(force);
		}
	}
};

Canvas.prototype.act = function (evt) {
	switch (this.state) {
		case Canvas.STATES.ADDING_PARTICLE:
			this.crateRigidBody(evt);
			break;

		case Canvas.STATES.APPLYING_FORCE:
			this.applyForce(evt);
			break;

		default:
			//TODO ??
	}
	;

	this.state = null;
};
Canvas.prototype.getCollideObjects = function () {
	var collideObjects = [];
	for (var objectsI = 0; objectsI < this.objects.length; objectsI++) {
		for (var objectsJ = objectsI + 1; objectsJ < this.objects.length; objectsJ++) {
			var object1 = this.objects[objectsI];
			var object2 = this.objects[objectsJ];
			for (var particlesI = 0; particlesI < object1.particles.length; particlesI++) {
				for (var particlesJ = 0; particlesJ < object2.particles.length; particlesJ++) {
					var particle1 = object1.particles[particlesI];
					var particle2 = object2.particles[particlesJ];
					var distVector = numeric.sub(particle1.getPosition(), particle2.getPosition());
					var distance = numeric.norm2(distVector);
					if (distance < (particle1.getRadius() + particle2.getRadius())) {
						collideObjects.push({
							objectIndex1: objectsI,
							objectIndex2: objectsJ,
							particleIndex1: particlesI,
							particleIndex2: particlesJ,
							distance: {vector: distVector, length: distance}
						});
					}
				}
			}
		}
	}
	return collideObjects;
};
Canvas.prototype.update = function () {
	for (var o in this.objects) {
		var obj = this.objects[o];
		obj.update();
	}

 /*
	var collideObjects = this.getCollideObjects();
	for (var i = 0; i < collideObjects.length; i++) {
		var object1 = this.objects[collideObjects[i].objectIndex1];
		var particle1 = object1.particles[collideObjects[i].particleIndex1];
		var object2 = this.objects[collideObjects[i].objectIndex2];
		var particle2 = object2.particles[collideObjects[i].particleIndex2];
		var nVector = numeric.div(collideObjects[i].distance.vector, collideObjects[i].distance.length);
		var k = (particle1.getRadius() + particle2.getRadius()) - collideObjects[i].distance.length; // size of intersection
		numeric.addeq(object1.x, [nVector[0]*(k/(object1.mass + object2.mass))*object2.mass, nVector[1]*(k/(object1.mass + object2.mass))*object2.mass, 0]);
		numeric.addeq(object2.x, [-nVector[0]*(k/(object1.mass + object2.mass))*object1.mass, -nVector[1]*(k/(object1.mass + object2.mass))*object1.mass, 0]);
		k = -2 * ((object1.v[0] - object2.v[0]) * nVector[0] + (object1.v[1] - object2.v[1]) * nVector[1]) / (1 / object1.mass + 1 / object2.mass);
		particle1.applyForce(numeric.mul(nVector, k));
		particle2.applyForce(numeric.mul(nVector, -k));
	}
	*/
};
Canvas.prototype.render = function (dt) {
	this.context.clearRect(0, 0, this.canvasElement[0].width, this.canvasElement[0].height);
	for (var i = 0; i < this.objects.length; i++) {
		this.objects[i].draw(this.context, 'black');
	}
};

Canvas.prototype.initMouseListeners = function () {
	this.canvasElement.mousedown(function (evt) {
		this.setMouseButtonClickCoords(evt);
		this.mouseButtonPressed = true;
	}.bind(this));

	this.canvasElement.mousemove(function (evt) {
		if (this.mouseButtonPressed) {
			if (this.state === Canvas.STATES.ADDING_PARTICLE) {
				var particle = this.createParticle(evt);
				this.render();
				particle.draw(this.context, 'black');
			} else if (this.state === Canvas.STATES.APPLYING_FORCE) {
				var x = evt.pageX - this.canvasElement.offset().left
				var y = evt.pageY - this.canvasElement.offset().top
				this.render(0);
				drawLine(this.context, [x, y], [this.mouseButtonClickCoords.x, this.mouseButtonClickCoords.y], '#0000aa', 2);
			}
		}
	}.bind(this));

	this.canvasElement.mouseup(function (evt) {
		this.act(evt);
		Canvas.state = Canvas.STATES.NONE;
		this.mouseButtonPressed = false;
		App.resetButtons();
	}.bind(this));
};

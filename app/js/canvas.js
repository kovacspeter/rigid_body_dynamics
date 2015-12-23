function Canvas(canvasElement) {
	/* Properties */
	this.state = null;
	this.objects = [];
	this.canvasElement = canvasElement;
	this.context = this.canvasElement[0].getContext("2d");
	this.mouseButtonPressed = false;
	this.mouseButtonClickCoords = {x: 0, y: 0};

	/* Call init methods */
	this.initMouseListeners();
}

Canvas.STATES = {
	NONE: 0,
	CREATING_RIGIDBODY: 1,
	MOVING_RIGIDBODY: 2,
	APPLYING_FORCE: 3,
	DELETING_RIGIDBODY: 4
};
Canvas.SIZE = {WIDTH: 800, HEIGHT: 600};
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
	if (particleRadius < 10) {	//Minimal size of particle
		particleRadius = 10;
	}
	else if (particleRadius > 100) {	//Maximal size of particle
		particleRadius = 100;
	}
	var particle = new Particle();
	particle.setSphere(particleRadius, [this.mouseButtonClickCoords.x, this.mouseButtonClickCoords.y, 0], numeric.identity(3));
	return particle;
};
Canvas.prototype.crateRigidBody = function (evt) {
	var particle = this.createParticle(evt);
	var rb = new RB(particle);
	var isOverlap = false;
	for (o in this.objects) {
		if (this.objects[o].isOverlap(rb)) {
			this.objects[o].join(rb);
			isOverlap = true;
		}
	}
	if (!isOverlap) {
		this.objects.push(rb);
	}
};

Canvas.prototype.moveRigidBody = function (evt) {
	// body...
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
			force = numeric.mul(force, 1/1000 * Math.pow(object.getMass(), 3/2));
			particle.applyForce(force);
		}
	}
};

Canvas.prototype.deleteRigidBody = function (evt) {
	//TODO prerobit aktualne nefunguje
	var x = evt.pageX - this.canvasElement.offset().left
	var y = evt.pageY - this.canvasElement.offset().top
	var pos = new Position(x, y, 0);
	for (i in this.objects) {
		if (this.objects[i].isInSphere(pos)) {
			this.objects.splice(i, 1);
			break;
		}
	}
};

Canvas.prototype.act = function (evt) {
	switch (this.state) {
		case Canvas.STATES.CREATING_RIGIDBODY:
			this.crateRigidBody(evt);
			break;

		case Canvas.STATES.MOVING_RIGIDBODY:
			this.moveRigidBody(evt);
			break;

		case Canvas.STATES.DELETING_RIGIDBODY:
			this.deleteRigidBody(evt);
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

Canvas.prototype.render = function (dt) {

	var dt2 = dt / Canvas.NUM_STEPS;
	for (var j = 0; j < Canvas.NUM_STEPS; j++) {
		for (var o in this.objects) {
			var obj = this.objects[o];
			obj.update(dt2);
		}
		//TODO collision here
		this.context.clearRect(0, 0, this.canvasElement[0].width, this.canvasElement[0].height);
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].draw(this.context, 'black');
		}
	}
};

Canvas.prototype.initMouseListeners = function () {
	this.canvasElement.mousedown(function (evt) {
		this.setMouseButtonClickCoords(evt);
		this.mouseButtonPressed = true;
	}.bind(this));

	this.canvasElement.mousemove(function (evt) {
		if (this.mouseButtonPressed) {
			if (this.state === Canvas.STATES.CREATING_RIGIDBODY) {
				var particle = this.createParticle(evt);
				this.render(0);
				particle.draw(this.context, 'black');
			}
			else if (this.state === Canvas.STATES.APPLYING_FORCE) {
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
	}.bind(this));
};

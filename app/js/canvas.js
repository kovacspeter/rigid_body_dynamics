function Canvas(canvasElement) {
	/* Properties */
	this.state = null;
	this.objects = [];
	this.canvasElement = canvasElement;
	this.context = this.canvasElement[0].getContext("2d");
	this.mouseButtonPressed = false;

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

Canvas.prototype.crateRigidBody = function (evt) {
	var x = evt.pageX - this.canvasElement.offset().left;
	var y = evt.pageY - this.canvasElement.offset().top;
	var particle = new Particle();
	particle.setSphere(10, 1, [x, y, 0], numeric.identity(3));
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
		var particle = this.objects[i].getParticle(x, y, 0);
		if (particle != null) {
			// particle.applyForce([0.05, 0.05, 0]);
			this.objects[i].applyForce([0.05, 0.05, 0]);
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
	};

	this.state = null;
};

Canvas.prototype.render = function (dt) {

	var dt2 = dt / Canvas.NUM_STEPS;
	for (var j = 0; j < Canvas.NUM_STEPS; j++) {
		for (var o in this.objects) {
			var obj = this.objects[o];
			obj.update(dt2);
		} //TODO collision here
		this.context.clearRect(0, 0, this.canvasElement[0].width, this.canvasElement[0].height);
		for (var i = 0; i < this.objects.length; i++) {
			this.objects[i].draw(this.context, 'black');
		}
	}
};

Canvas.prototype.initMouseListeners = function () {
	this.canvasElement.mousedown(function (evt) {
		this.act(evt);
	}.bind(this));

	this.canvasElement.mousemove(function (evt) {
		//this.act(evt);
		if (Canvas.state === Canvas.STATES.CREATING_RIGIDBODY) {
			this.createRigidBody(evt);
		}
	}.bind(this));

	this.canvasElement.mouseup(function (evt) {
		Canvas.state = Canvas.STATES.NONE;
	}.bind(this));
};

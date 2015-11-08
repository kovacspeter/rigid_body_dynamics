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

Canvas.prototype.crateRigidBody = function (evt) {
	// if (Canvas.state === Canvas.STATES.CREATING_SPHERE) {
	// 	var x = evt.pageX - this.canvasElement.offset().left;
	// 	var y = evt.pageY - this.canvasElement.offset().top;
	// 	var newPosition = new Position(x, y, 0);
	// 	var radius = newPosition.distance(this.objects[this.objects.length-1].getPosition());
	// 	this.objects[this.objects.length-1].setRadius(radius);
	// } else {
	// 	var x = evt.pageX - this.canvasElement.offset().left;
	// 	var y = evt.pageY - this.canvasElement.offset().top;
	// 	this.objects.push(new Sphere(new Position(x, y, 0), Sphere.DEFAULT_RADIUS));
	// 	this.state = Canvas.STATES.CREATING_SPHERE;
	// } TODO nevime na co je toto ak to nemas ty k niecomu tak to odstran

	var x = evt.pageX - this.canvasElement.offset().left;
	var y = evt.pageY - this.canvasElement.offset().top;
	var sphere = new Sphere(new Position(x, y, 0), Sphere.DEFAULT_RADIUS);
	var rb = new RigidBody(sphere);
	var isCollision = false;
	for (o in this.objects) {
		if (this.objects[o].isCollision(rb)) {
			this.objects[o].join(rb);
			isCollision = true;
		}
	}
	if (!isCollision) {
		this.objects.push(rb);
	}
};

Canvas.prototype.moveRigidBody = function (evt) {
	// body...
};

Canvas.prototype.applyForce = function (evt) {
	var x = evt.pageX - this.canvasElement.offset().left
	var y = evt.pageY - this.canvasElement.offset().top
	var point = new Position(x, y, 0);
	for (i in this.objects) {
		var sphere = this.objects[i].getSphere(point)
		if (sphere != null) {
			this.objects[i].applyForce(sphere, 1, 1);
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

Canvas.prototype.render = function () {
	this.context.clearRect(0, 0, this.canvasElement[0].width, this.canvasElement[0].height);
	for (var i = 0; i < this.objects.length; i++) {
		this.objects[i].draw(this.context, 'black');
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

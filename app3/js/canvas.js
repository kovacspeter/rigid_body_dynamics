function drawCircle(context, position, radius, color) {
	context.beginPath();
	context.arc(position.x, position.y, radius, 0, 2 * Math.PI);
	context.fillStyle = color;
	context.fill();
	context.stroke();
}

function drawLine(context, fromPosition, toPosition, color, width) {
	context.beginPath();
	context.lineWidth = width;
	context.strokeStyle = color;
	context.moveTo(fromPosition[0], fromPosition[1]);
	context.lineTo(toPosition[0], toPosition[1]);
	context.stroke();
}

function Canvas(canvasElement) {
	/* Properties */
	this.state = null;
	this.action = false;
	this.objects = [];
	this.canvasElement = canvasElement;
	this.context = this.canvasElement[0].getContext("2d");
	this.mouseButtonPressed = false;
	
	/* Call init methods */
	this.initMouseListeners();
}

Canvas.STATES = {NONE: 0, CREATING_SPHERE: 1, MOVING_SPHERE: 2, APPLYING_FORCE: 3};
Canvas.SIZE = {WIDTH: 800, HEIGHT: 600};

Canvas.prototype.createSphere = function (evt) {
	if (Canvas.state === Canvas.STATES.CREATING_SPHERE) {
		var x = evt.pageX - this.canvasElement.offset().left;
		var y = evt.pageY - this.canvasElement.offset().top;
		var newPosition = new Position(x, y, 0);
		var radius = newPosition.distance(this.objects[this.objects.length-1].getPosition());
		this.objects[this.objects.length-1].setRadius(radius);
	} else {
		var x = evt.pageX - this.canvasElement.offset().left;
		var y = evt.pageY - this.canvasElement.offset().top;
		this.objects.push(new Sphere(new Position(x, y, 0), Sphere.DEFAULT_RADIUS));
		this.state = Canvas.STATES.CREATING_SPHERE;
	}
};

Canvas.prototype.moveSphere = function (evt) {
	// body...
};

Canvas.prototype.applyForce = function (evt) {
	// body...
};

Canvas.prototype.deleteSphere = function (evt) {
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
	switch (this.action) {

		case "createSphere":
			this.createSphere(evt);
			break;

		case "moveSphere":
			this.moveSphere(evt);
			break;

		case "deleteSphere":
			this.deleteSphere(evt);
			break;

		case "applyForce":
			this.applyForce(evt);
			break;

		default:
			//TODO
	};

	this.action = false;
};

Canvas.prototype.render = function () {
	this.context.clearRect(0, 0, this.canvasElement[0].width, this.canvasElement[0].height);
	for (var i = 0; i < this.objects.length; i++) {
		drawCircle(this.context, this.objects[i].position, this.objects[i].radius, 'black');
	}
};

Canvas.prototype.initMouseListeners = function () {
	this.canvasElement.mousedown(function (evt) {
		//this.act(evt);
		this.createSphere(evt);
	}.bind(this));
	
	this.canvasElement.mousemove(function (evt) {
		//this.act(evt);
		if (Canvas.state === Canvas.STATES.CREATING_SPHERE) {
			this.createSphere(evt);
		}
	}.bind(this));
	
	this.canvasElement.mouseup(function (evt) {
		Canvas.state = Canvas.STATES.NONE;
	}.bind(this));
};

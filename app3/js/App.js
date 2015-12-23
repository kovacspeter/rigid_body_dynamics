function init(canvas, menu) {
  new App($('#' + canvas), $('#' + menu));
};

function App(canvasElement, menu) {
  this.menu = menu;
  this.canvasElement = canvasElement;
  this.canvas = new Canvas(canvasElement);
  this.control = this.initControls(this.menu);
	this.lastTimerTick = Date.now();
	
	this.run();
};

App.prototype.initControls = function(where) {

  this.createButton(where, 'Create Sphere', 'createSphere', function() {
    this.canvas.action = "createSphere";
  }.bind(this));

  this.createButton(where, 'Move Sphere', 'moveSphere', function() {
    this.canvas.action = "moveSphere";
  }.bind(this));

  this.createButton(where, 'Delete Sphere', 'deleteSphere', function() {
    this.canvas.action = "deleteSphere";
  }.bind(this));

  this.createButton(where, 'Apply Force', 'applyForce', function() {
    this.canvas.action = "applyForce";
  }.bind(this));
};

App.prototype.createButton = function(where, text, id, func){
  var button = $("<button/>", {
    id: id,
    text: text,
    click: func
  });

  where.append(button);
  return button;
};

App.prototype.run = function() {
	var nowTimerTick = Date.now();
	for (var i=0; i < this.canvas.objects.length; i++) {
		this.canvas.objects[i].move(nowTimerTick - this.lastTimerTick);
	}
	this.lastTimerTick = nowTimerTick;
	
	var collideObjects = [];
	for (var i=0; i < this.canvas.objects.length; i++) {
		for (var j=i+1; j < this.canvas.objects.length; j++) {
			var dx = this.canvas.objects[i].position.x - this.canvas.objects[j].position.x;
			var dy = this.canvas.objects[i].position.y - this.canvas.objects[j].position.y;
			var dist = Math.sqrt(dx*dx + dy*dy);
			if (dist < (this.canvas.objects[i].getRadius() + this.canvas.objects[j].getRadius())) {
				collideObjects.push({objectIndex1: i, objectIndex2: j, dx: dx, dy: dy, dist: dist});
			}
		}
	}
	for (var i=0; i < collideObjects.length; i++) {
		var object1 = this.canvas.objects[collideObjects[i].objectIndex1];
		var object2 = this.canvas.objects[collideObjects[i].objectIndex2];
		var nx = collideObjects[i].dx / collideObjects[i].dist;
		var ny = collideObjects[i].dy / collideObjects[i].dist;
		var k = (object1.getRadius() + object2.getRadius()) - collideObjects[i].dist; //velkost prieniku
		object1.position.move(nx*k/2, ny*k/2, 0);
		object2.position.move(-nx*k/2, -ny*k/2, 0);
		
		k = -2 * ((object1.speed.x - object2.speed.x) * nx + (object1.speed.y - object2.speed.y) * ny) / (1/object1.m + 1/object2.m);
		object1.accelerate(k*nx/object1.m, k*ny/object1.m);
		object2.accelerate(-k*nx/object2.m, -k*ny/object2.m);
	}
	
	this.canvas.render();
	window.requestAnimationFrame(this.run.bind(this));
};

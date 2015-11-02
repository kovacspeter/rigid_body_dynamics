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
	this.canvas.render();
	window.requestAnimationFrame(this.run.bind(this));
};

function init(canvasID, menuID, inspectorID) {
  new App($('#' + canvasID), $('#' + menuID), $('#' + inspectorID));
};

function App($canvasElement, $menu, $inspector) {
  this.menu = $menu;
  this.canvasElement = $canvasElement;
  this.canvas = new Canvas($canvasElement);
  this.control = this.initControls(this.menu);
	this.lastTimerTick = Date.now();
	this.objectInspector = new Inspector($inspector);
	this.run();
};

App.prototype.initControls = function(where) {

  states = Canvas.STATES;

  this.createButton(where, 'Create Rigid Body', 'createRigidBody', function() {
    this.canvas.state = states.CREATING_RIGIDBODY;
  }.bind(this));

  this.createButton(where, 'Move Rigid Body', 'moveRigidBody', function() {
    this.canvas.state = states.MOVING_RIGIDBODY;
  }.bind(this));

  this.createButton(where, 'Delete Rigid Body', 'deleteRigidBody', function() {
    this.canvas.state = states.DELETING_RIGIDBODY;
  }.bind(this));

  this.createButton(where, 'Apply Force', 'applyForce', function() {
    this.canvas.state = states.APPLYING_FORCE;
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
  if (this.canvas.state == null) {
  	var nowTimerTick = Date.now();
    this.canvas.render(nowTimerTick - this.lastTimerTick);
  	this.lastTimerTick = nowTimerTick;
  } else {
    this.lastTimerTick = Date.now();
  }
	this.objectInspector.refresh(this.canvas.objects);
	
	window.requestAnimationFrame(this.run.bind(this));
};

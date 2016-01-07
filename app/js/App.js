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

  var states = Canvas.STATES;

  this.createButton(where, 'Add particle', 'plus', 'addParticle', function() {
    this.canvas.state = states.ADDING_PARTICLE;
  }.bind(this));

  this.createButton(where, 'Apply Force', 'hand-right', 'applyForce', function() {
    this.canvas.state = states.APPLYING_FORCE;
  }.bind(this));
};

App.prototype.createButton = function(where, text, icon, id, clickFunction){
  var button = $("<button/>", {
    id: id,
    html: '<i class="glyphicon glyphicon-'+icon+'"></i> ' + text,
    click: function(){
			clickFunction();
			$(this).addClass('active');
		}
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

/* GLOBAL METHODS */
App.resetButtons = function() {
	$('#menu').find('button').removeClass('active');
};
function init(canvas) {
  new App(document.getElementById(canvas))
};

function App(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  this.control = this.initControls();
  console.log('hura');
};

App.prototype.initControls = function() {
  
};

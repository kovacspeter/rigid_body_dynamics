function init(canvas, menu) {
  new App($('#' + canvas), $('#' + menu))
};

function App(canvas, menu) {
  this.menu = menu;
  this.canvas = canvas;
  this.context = canvas[0].getContext("2d");
  this.control = this.initControls();
  console.log(canvas);
};

App.prototype.initControls = function() {
  this.createButton(this.menu, 'lala', 'lala', function() {console.log('lala');})
};

App.prototype.createButton = function(where, text, id, func){
  var button = $("<button/>", {
    id: id,
    text: text
  });

  where.append(button);
  where.on("click", "button#" + id, func);

}

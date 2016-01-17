var App = {
	init: function (canvasID, menuID, inspectorID) {
		App.menu = $('#' + menuID);
		App.canvasElement = $('#' + canvasID);
		App.canvas = new Canvas(App.canvasElement);
		App.control = App.initControls(this.menu);
		App.objectInspector = new Inspector($('#' + inspectorID));
		App.run();
	},
	initControls: function (where) {
		App.createButton(where, 'Add particle', 'plus', 'addParticle', function () {
			App.canvas.state = Canvas.STATES.ADDING_PARTICLE;
		});

		App.createButton(where, 'Apply Force', 'hand-right', 'applyForce', function () {
			App.canvas.state = Canvas.STATES.APPLYING_FORCE;
		});
	},
	createButton: function (where, text, icon, id, clickFunction) {
		var button = $("<button/>", {
			id: id,
			html: '<i class="glyphicon glyphicon-' + icon + '"></i> ' + text,
			click: function () {
				clickFunction();
				$(this).addClass('active');
			}
		});

		where.append(button);
		return button;
	},
	resetButtons: function() {
		App.menu.find('button').removeClass('active');
	},
	run: function () {
		if (App.canvas.state == null) {
			App.canvas.update();
			App.canvas.render();
		}
		App.objectInspector.refresh(App.canvas.objects);

		window.requestAnimationFrame(App.run);
	}
};
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
		App.createButton(where, 'Add particle', 'plus', 'addParticle', function ($button) {
			App.resetButtons();
			if (App.canvas.state == Canvas.STATES.ADDING_PARTICLE) {
				App.canvas.state = Canvas.STATES.NONE;
			} else {
				App.canvas.state = Canvas.STATES.ADDING_PARTICLE;
				$button.addClass('active');
			}
		});

		App.createButton(where, 'Apply Force', 'hand-right', 'applyForce', function ($button) {
			App.resetButtons();
			if (App.canvas.state == Canvas.STATES.APPLYING_FORCE) {
				App.canvas.state = Canvas.STATES.NONE;
			} else {
				App.canvas.state = Canvas.STATES.APPLYING_FORCE;
				$button.addClass('active');
			}
		});
		
		App.menu.append(
			$('<div></div>').addClass('input-group').html('<span class="input-group-addon">Material Density</span><input type="text" id="material-density" class="form-control" placeholder="'+Particle.DENSITY+' (1 / ((4 / 3) * Math.PI * 1000))">')		
		);
	},
	createButton: function (where, text, icon, id, clickFunction) {
		var button = $("<button/>", {
			id: id,
			html: '<i class="glyphicon glyphicon-' + icon + '"></i> ' + text,
			click: function () {
				clickFunction($(this));
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
			App.objectInspector.refresh(App.canvas.objects);
		}

		window.requestAnimationFrame(App.run);
	}
};
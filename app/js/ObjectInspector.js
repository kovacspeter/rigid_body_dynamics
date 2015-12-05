function Inspector($inspectorElement) {
	this.$element = $inspectorElement;
	this.$element.append($('<ul></ul>').addClass('inspector-container'));

	this.$element.find('.toggleSection').siblings().hide();
	this.$element.find('.toggleSection').click(function(e){
		$(this).siblings().slideToggle();
		$(this).parent().toggleClass('active');
		return false;
	});
};

Inspector.prototype.addBodyContainer = function(i) {
	var $bodyContainer = $('<div></div>').addClass('rigidBody-container').attr('id', 'rigidBody-container-'+i).hide();
	this.initPropertyContainer($bodyContainer);
	this.initParticlesContainer($bodyContainer);
	
	this.$element.find('.inspector-container').append(
		$('<li></li>').append(
			$('<a href="#"></a>').addClass('toggleSection').text('Rigid Body '+i).click(function(){
				$(this).siblings().slideToggle();
				$(this).parent().toggleClass('active');
				return false;
			})
		).append($bodyContainer)
	);
	
	return $bodyContainer;
};

Inspector.prototype.addParticleContainer = function(i, j) {
	var $particleContainer = $('<li></li>').addClass('particle-container').attr('id', 'particle-container-'+i+'-'+j);
	$particleContainer.append(
	  $('<a href="#"></a>').addClass('toggleSection').text('Sphere '+j).click(function(){
			$(this).siblings().slideToggle();
			$(this).parent().toggleClass('active');
			return false;
		})
	).append(
		$('<div></div>').hide().append(
			$('<div></div>').addClass('property').append(
				$('<span></span>').addClass('label').text('Position:')
			).append(
				$('<div></div>').addClass('container-fluid').append(
					$('<div></div>').addClass('row').append(
						$('<div></div>').addClass('col-xs-6').append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('X')
							).append(
								$('<input type="text" />').addClass('form-control position-x')
							)
						)
					).append(
						$('<div></div>').addClass('col-xs-6').append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('Y')
							).append(
								$('<input type="text" />').addClass('form-control position-y')
							)
						)
					)
				)
			)
		).append(
			$('<div></div>').addClass('property').append(
				$('<div></div>').addClass('container-fluid').append(
					$('<div></div>').addClass('row').append(
						$('<div></div>').addClass('col-xs-6').append(
							$('<span></span>').addClass('label').text('Radius')
						).append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('r')
							).append(
								$('<input type="text" />').addClass('form-control radius')
							)
						)
					).append(
						$('<div></div>').addClass('col-xs-6').append(
							$('<span></span>').addClass('label').text('Mass')
						).append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('m')
							).append(
								$('<input type="text" />').addClass('form-control mass')
							)
						)
					)
				)
			)
		).append(
			$('<div></div>').addClass('property').append(
				$('<span></span>').addClass('label').text('Velocity:')
			).append(
				$('<div></div>').addClass('container-fluid').append(
					$('<div></div>').addClass('row').append(
						$('<div></div>').addClass('col-xs-6').append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('X')
							).append(
								$('<input type="text" />').addClass('form-control velocity-x')
							)
						)
					).append(
						$('<div></div>').addClass('col-xs-6').append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('Y')
							).append(
								$('<input type="text" />').addClass('form-control velocity-y')
							)
						)
					)
				)
			)
		)
	);
	
	this.$element.find('#rigidBody-container-'+i).find('.rigidBody-particles-container').append($particleContainer);
	return $particleContainer;
};

Inspector.prototype.initPropertyContainer = function($bodyContainer) {
	$bodyContainer.append($('<span></span>').addClass('sectionHeader').html('<i class="glyphicon glyphicon-info-sign"> Properties</i>'));
	var $propertyContainer = $('<div></div>').addClass('rigidBody-properties-container');
	
	$propertyContainer.append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Center position:')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control position-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control position-y')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<span></span>').addClass('label').text('Inertia')
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('I')
						).append(
							$('<input type="text" />').addClass('form-control inertia')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<span></span>').addClass('label').text('Mass')
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('m')
						).append(
							$('<input type="text" />').addClass('form-control mass')
						)
					)
				)
			)
		)
	);
	
	$bodyContainer.append($propertyContainer);
};

Inspector.prototype.initParticlesContainer = function($bodyContainer) {
	$bodyContainer.append($('<span></span>').addClass('sectionHeader').html('<i class="glyphicon glyphicon-folder-open"> Particles</i>'));
	var $particlesContainer = $('<ul></ul>').addClass('rigidBody-particles-container');
	$bodyContainer.append($particlesContainer);
};

Inspector.prototype.refresh = function(objects){
	for (var i in objects) {
		var object = objects[i];
		var $bodyContainer = this.$element.find('#rigidBody-container-'+i); 
		if ($bodyContainer.length === 0) {
			$bodyContainer = this.addBodyContainer(i);
		}
		this.updateBodyValues(object, $bodyContainer);
		
		for (var j in object.particles) {
			var particle = object.particles[j];
			var $particleContainer = $bodyContainer.find('#particle-container-'+i+'-'+j);
			if ($particleContainer.length === 0) {
				$particleContainer = this.addParticleContainer(i, j);
			}
			this.updateParticleValues(particle, $particleContainer);
		}
	}
};

Inspector.prototype.updateBodyValues = function(object, $bodyContainer) {
	$bodyContainer.find('.rigidBody-properties-container').find('input.position-x').val(object.getPosition()[0]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.position-y').val(object.getPosition()[1]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.inertia').val('...');
	$bodyContainer.find('.rigidBody-properties-container').find('input.mass').val(object.getMass());
};

Inspector.prototype.updateParticleValues = function(particle, $particleContainer) {
	$particleContainer.find('input.position-x').val(particle.getPosition()[0]);
	$particleContainer.find('input.position-y').val(particle.getPosition()[1]);
	$particleContainer.find('input.radius').val(particle.getRadius());
	$particleContainer.find('input.mass').val(particle.getMass());
	$particleContainer.find('input.velocity-x').val(particle.getVelocity()[0]);
	$particleContainer.find('input.velocity-y').val(particle.getVelocity()[1]);
};
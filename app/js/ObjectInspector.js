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

Inspector.prototype.addBodyContainer = function(id) {
	var $bodyContainer = $('<div></div>').addClass('rigidBody-container').attr('id', 'rigidBody-container-'+id).data('id', id).hide();
	this.initPropertyContainer($bodyContainer);
	this.initParticlesContainer($bodyContainer);
	
	this.$element.find('.inspector-container').append(
		$('<li></li>').append(
			$('<a href="#"></a>').addClass('toggleSection').text('Rigid Body').click(function(){
				$(this).siblings().slideToggle();
				$(this).parent().toggleClass('active');
				return false;
			})
		).append($bodyContainer)
	);
	return $bodyContainer;
};

Inspector.prototype.addParticleContainer = function(id, parentID) {
	var $particleContainer = $('<li></li>').addClass('particle-container').attr('id', 'particle-container-'+id).data('id', id);
	$particleContainer.append(
	  $('<a href="#"></a>').addClass('toggleSection').text('Particle').click(function(){
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
	
	this.$element.find('#rigidBody-container-'+parentID).find('.rigidBody-particles-container').append($particleContainer);
	return $particleContainer;
};

Inspector.prototype.initPropertyContainer = function($bodyContainer) {
	$bodyContainer.append($('<span></span>').addClass('sectionHeader').html('<i class="glyphicon glyphicon-info-sign"> Properties</i>'));
	var $propertyContainer = $('<div></div>').addClass('rigidBody-properties-container');
	
	$propertyContainer.append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Center of mass:')
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
			$('<span></span>').addClass('label').text('Force vector:')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control force-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control force-y')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Momentum:')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control momentum-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control momentum-y')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Acceleration:')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control acceleration-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-6').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control acceleration-y')
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
	var existedObjectIDs = [];
	for (var i in objects) {
		var object = objects[i];
		existedObjectIDs.push(object.ID);
		var $bodyContainer = this.$element.find('#rigidBody-container-' + object.ID);
		if ($bodyContainer.length === 0) {
			$bodyContainer = this.addBodyContainer(object.ID);
		}
		this.updateBodyValues(object, $bodyContainer);

		var existedParticleIDs = [];
		for (var j in object.particles) {
			var particle = object.particles[j];
			existedParticleIDs.push(particle.ID);
			var $particleContainer = $bodyContainer.find('#particle-container-' + particle.ID);
			if ($particleContainer.length === 0) {
				$particleContainer = this.addParticleContainer(particle.ID, object.ID);
			}
			this.updateParticleValues(particle, $particleContainer);
		}
		$bodyContainer.find('.particle-container').each(function () {
			if (existedParticleIDs.indexOf($(this).data('id')) < 0) {
				$(this).remove();
			}
		});
	}
	
	
	// Remove non-existed rigid bodies
	var $element = this.$element;
	this.$element.find('.rigidBody-container').each(function () {
		if (existedObjectIDs.indexOf($(this).data('id')) < 0) {
			var activeParticleID = -1;
			if ($(this).closest('li').hasClass('active')) {
				activeParticleID = $(this).find('.particle-container').eq(0).data('id');
			}
			$(this).closest('li').remove();
			if ((activeParticleID >= 0) && (!$element.find('#particle-container-' + activeParticleID).closest('.rigidBody-container').closest('li').hasClass('active'))) {
				$element.find('#particle-container-' + activeParticleID).closest('.rigidBody-container').siblings('.toggleSection').click();
			}
		}
	});
};

Inspector.prototype.updateBodyValues = function(object, $bodyContainer) {
	$bodyContainer.find('.rigidBody-properties-container').find('input.position-x').val(object.getPosition()[0]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.position-y').val(object.getPosition()[1]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.force-x').val(object.getForce()[0]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.force-y').val(object.getForce()[1]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.momentum-x').val(object.getMomentum()[0]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.momentum-y').val(object.getMomentum()[1]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.velocity-x').val(object.getVelocity()[0]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.velocity-y').val(object.getVelocity()[1]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.acceleration-x').val(object.getAcceleration()[0]);
	$bodyContainer.find('.rigidBody-properties-container').find('input.acceleration-y').val(object.getAcceleration()[1]);
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
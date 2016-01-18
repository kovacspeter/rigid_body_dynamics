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
						$('<div></div>').addClass('col-xs-4').append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('X')
							).append(
								$('<input type="text" />').addClass('form-control position-x')
							)
						)
					).append(
						$('<div></div>').addClass('col-xs-4').append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('Y')
							).append(
								$('<input type="text" />').addClass('form-control position-y')
							)
						)
					).append(
						$('<div></div>').addClass('col-xs-4').append(
							$('<div></div>').addClass('input-group').append(
								$('<span></span>').addClass('input-group-addon').text('Z')
							).append(
								$('<input type="text" />').addClass('form-control position-z')
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
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<span></span>').addClass('label').text('Mass')
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('m')
						).append(
							$('<input type="text" />').addClass('form-control mass')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<span></span>').addClass('label').text('Volume')
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('V')
						).append(
							$('<input type="text" />').addClass('form-control volume')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<span></span>').addClass('label').text('Density')
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('ρ')
						).append(
							$('<input type="text" />').addClass('form-control density')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Center of mass p(t):')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control position-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control position-y')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Z')
						).append(
							$('<input type="text" />').addClass('form-control position-z')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Orientation q(t):')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-3').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('i')
						).append(
							$('<input type="text" />').addClass('form-control orientation-i')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-3').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('j')
						).append(
							$('<input type="text" />').addClass('form-control orientation-j')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-3').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('k')
						).append(
							$('<input type="text" />').addClass('form-control orientation-k')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-3').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('s')
						).append(
							$('<input type="text" />').addClass('form-control orientation-s')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Linear velocity v(t):')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control velocity-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control velocity-y')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Z')
						).append(
							$('<input type="text" />').addClass('form-control velocity-z')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Angular velocity ω(t):')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control angularVelocity-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control angularVelocity-y')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Z')
						).append(
							$('<input type="text" />').addClass('form-control angularVelocity-z')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Inertia tensor J(t):')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('xx')
						).append(
							$('<input type="text" />').addClass('form-control inertia-xx')
						)
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('yx')
						).append(
							$('<input type="text" />').addClass('form-control inertia-yx')
						)
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('zx')
						).append(
							$('<input type="text" />').addClass('form-control inertia-zx')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('xy')
						).append(
							$('<input type="text" />').addClass('form-control inertia-xx')
						)
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('yy')
						).append(
							$('<input type="text" />').addClass('form-control inertia-yy')
						)
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('zy')
						).append(
							$('<input type="text" />').addClass('form-control inertia-zy')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('xz')
						).append(
							$('<input type="text" />').addClass('form-control inertia-xz')
						)
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('yz')
						).append(
							$('<input type="text" />').addClass('form-control inertia-yz')
						)
					).append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('zz')
						).append(
							$('<input type="text" />').addClass('form-control inertia-zz')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Linear Momentum P(t):')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control momentum-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control momentum-y')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Z')
						).append(
							$('<input type="text" />').addClass('form-control momentum-z')
						)
					)
				)
			)
		)
	).append(
		$('<div></div>').addClass('property').append(
			$('<span></span>').addClass('label').text('Angular Momentum P(t):')
		).append(
			$('<div></div>').addClass('container-fluid').append(
				$('<div></div>').addClass('row').append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('X')
						).append(
							$('<input type="text" />').addClass('form-control angularMomentum-x')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Y')
						).append(
							$('<input type="text" />').addClass('form-control angularMomentum-y')
						)
					)
				).append(
					$('<div></div>').addClass('col-xs-4').append(
						$('<div></div>').addClass('input-group').append(
							$('<span></span>').addClass('input-group-addon').text('Z')
						).append(
							$('<input type="text" />').addClass('form-control angularMomentum-z')
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
				$element.find('#particle-container-' + activeParticleID).closest('.rigidBody-container').show().closest('li').addClass('active');
			}
		}
	});
};

Inspector.prototype.updateBodyValues = function(object, $bodyContainer) {
	this.write($bodyContainer, 'mass', object.getMass());
	this.write($bodyContainer, 'volume', object.getVolume());
	this.write($bodyContainer, 'density', object.getDensity(), true);
	
	var objectPosition = object.getPosition();
	this.write($bodyContainer, 'position-x', objectPosition[0]);
	this.write($bodyContainer, 'position-y', objectPosition[0]);
	this.write($bodyContainer, 'position-z', objectPosition[0]);
	
	var objectOrientation = object.getOrientation();
	this.write($bodyContainer, 'orientation-i', objectOrientation.v[0]);
	this.write($bodyContainer, 'orientation-j', objectOrientation.v[1]);
	this.write($bodyContainer, 'orientation-k', objectOrientation.v[2]);
	this.write($bodyContainer, 'orientation-s', objectOrientation.s);
	
	var objectLinearVelocity = object.getVelocity();
	this.write($bodyContainer, 'velocity-x', objectLinearVelocity[0]);
	this.write($bodyContainer, 'velocity-y', objectLinearVelocity[1]);
	this.write($bodyContainer, 'velocity-z', objectLinearVelocity[2]);
	
	var objectAngularVelocity = object.getAngularVelocity();
	this.write($bodyContainer, 'angularVelocity-x', objectAngularVelocity[0]);
	this.write($bodyContainer, 'angularVelocity-y', objectAngularVelocity[1]);
	this.write($bodyContainer, 'angularVelocity-z', objectAngularVelocity[2]);
	
	var objectInertiaTensor = object.getInertiaTensor();
	this.write($bodyContainer, 'inertia-xx', objectInertiaTensor[0][0], true);
	this.write($bodyContainer, 'inertia-xy', objectInertiaTensor[0][1], true);
	this.write($bodyContainer, 'inertia-xz', objectInertiaTensor[0][2], true);
	this.write($bodyContainer, 'inertia-yx', objectInertiaTensor[1][0], true);
	this.write($bodyContainer, 'inertia-yy', objectInertiaTensor[1][1], true);
	this.write($bodyContainer, 'inertia-yz', objectInertiaTensor[1][2], true);
	this.write($bodyContainer, 'inertia-zx', objectInertiaTensor[2][0], true);
	this.write($bodyContainer, 'inertia-zy', objectInertiaTensor[2][1], true);
	this.write($bodyContainer, 'inertia-zz', objectInertiaTensor[2][2], true);
	
	var objectMomentum = object.getMomentum();
	this.write($bodyContainer, 'momentum-x', objectMomentum[0]);
	this.write($bodyContainer, 'momentum-y', objectMomentum[1]);
	this.write($bodyContainer, 'momentum-z', objectMomentum[2]);
	
	var objectAngularMomentum = object.getAngularMomentum();
	this.write($bodyContainer, 'angularMomentum-x', objectAngularMomentum[0]);
	this.write($bodyContainer, 'angularMomentum-y', objectAngularMomentum[1]);
	this.write($bodyContainer, 'angularMomentum-z', objectAngularMomentum[2]);
};

Inspector.prototype.updateParticleValues = function(particle, $particleContainer) {
	var particlePosition = particle.getPosition();
	$particleContainer.find('input.position-x').val(particlePosition[0]);
	$particleContainer.find('input.position-y').val(particlePosition[1]);
	$particleContainer.find('input.position-z').val(particlePosition[2]);
	$particleContainer.find('input.radius').val(particle.getRadius());
	$particleContainer.find('input.mass').val(particle.getMass());
};

Inspector.prototype.write = function($bodyContainer, inputClass, value, noRound) {
	if (!(noRound)) {
		value = Math.round(value * 1000) / 1000;
	}
	$bodyContainer.find('.rigidBody-properties-container').find('input.'+inputClass).val(value);
};
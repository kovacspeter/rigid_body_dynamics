function Inspector($inspectorElement) {
	this.$element = $inspectorElement;
	this.$element.find('.toggleSection').siblings().hide();
	this.$element.find('.toggleSection').click(function(e){
		$(this).siblings().slideToggle();
		$(this).parent().toggleClass('active');
		return false;
	});
};
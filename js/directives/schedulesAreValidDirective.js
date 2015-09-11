app.directive('schedulesAreValid', function(dataService, Schedule) {
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			ctrl.$validators.schedulesAreValid = function(modelValue, viewValue) {
				return validateNotEmpty(modelValue) && validateSchedulesFromText(modelValue);
			};

			var validateNotEmpty = function(text) {
				return !!text.trim();
			};

			var validateSchedulesFromText = function(text) {
				var lines = text.match(/.+/gm);
				var schedules = lines.map(function(line) { return new Schedule(line); });
				return schedules.every(function(schedule) {	return schedule.isValid(); });
			};
		}
	};
});
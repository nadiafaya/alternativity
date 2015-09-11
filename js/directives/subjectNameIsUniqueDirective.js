app.directive('subjectNameIsUnique', function(dataService) {
	return {
		require: 'ngModel',
		link: function(scope, elem, attrs, ctrl) {
			ctrl.$validators.subjectNameIsUnique = function(modelValue, viewValue) {
				var value = modelValue.trim();
				return !value || !_.findWhere(dataService.subjects, { name: value });
			};
		}
	};
});
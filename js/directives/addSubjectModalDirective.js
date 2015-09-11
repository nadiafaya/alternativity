app.directive('addSubjectModal', function(Subject, dataService) {
	return {
		restrict: 'C',
		replace: true,
		templateUrl: '../views/addSubjectModalView.html',
		link: function(scope, element) {
			scope.closeModal = function() {
				element.modal('hide');
			};
		},
		controller: function($scope) {
			$scope.subject = {
				name: '',
				scheduleText: ''
			};

			$scope.addSubject = function() {
				if (!$scope.subjectForm.$errors) {
					createSubject();
					$scope.closeModal();
					clearSubject();
				}
			};

			$scope.cancel = function() {
				clearSubject();
			};

			var createSubject = function() {
				var subject = new Subject($scope.subject);
				if (subject.isValid()) {
					dataService.addSubject(subject);
				}
			};

			var clearSubject = function() {
				$scope.subject = {
					name: '',
					scheduleText: ''
				};
			};
		}
	}
});
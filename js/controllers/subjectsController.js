app.controller('subjectsController', function($scope, dataService, Subject) {

	$scope.subjects = dataService.subjects;

	$scope.selectedSubject = _.first($scope.subjects);

	$scope.showSubjectDetail = function(subject) {
		$scope.selectedSubject = subject;
	};

	$scope.scheduleHasDay = function(schedule, day) {
		return _.any(schedule.days, { name: day });
	};

	$scope.getScheduleDayDetailText = function(schedule, day) {
		var dayDetail = _.find(schedule.days, { name: day });
		if (dayDetail) {
			return dayDetail.turn + ' (' + dayDetail.startHour + ':' + dayDetail.endHour + ')';
		}
	};
});
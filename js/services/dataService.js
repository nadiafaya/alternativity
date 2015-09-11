app.service('dataService', function(localStorageService) {
	var service = {};

	service.subjects = localStorageService.get('subjects') || [];

	service.alternatives = localStorageService.get('alternatives') || [];

	service.addSubject = function(subject) {
		service.subjects.push(subject);
		localStorageService.set('subjects', service.subjects);
	};

	return service;
});
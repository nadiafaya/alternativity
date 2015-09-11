app.service('localStorageService', function() {
	var service = {};

	var objectKeyMap = {
		'subjects': '_alternativity_subjects',
		'alternatives': '_alternativity_picked_alternatives'
	};

	service.get = function(obj) {
		return JSON.parse(localStorage.getItem(objectKeyMap[obj]));
	};

	service.set = function(obj, data) {
		return localStorage.setItem(objectKeyMap[obj], JSON.stringify(data));
	};

	return service;
});
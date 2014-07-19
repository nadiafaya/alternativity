var foundAlternativesController = (function() {
	var foundAlternativesController = {};

	foundAlternativesController.generateDOM = function() {
		cleanOldDOM();
		createAlternativeViews();
	};

	var cleanOldDOM = function() {
		cleanAlternativeViews();
	};

	var cleanAlternativeViews = function() {
		var alternativesViews = document.querySelectorAll('.alternativesViews .alternative');
		for (var i = 0; i < alternativesViews.length; i++) {
			alternativesViews[i].remove();
		}
	};

	var createAlternativeViews = function() {
		for (var i = 0; i < inscription.alternatives.length; i++) {
			new AlternativeView(inscription.alternatives[i], i);
		}
	};

	return foundAlternativesController;
})();


var AlternativeView = function(alternative, index) {
	var viewHtml = {};

	var init = function() {
		cloneDummyHtml();
		addTitle();
		paintAlternativeDays();
	};

	var cloneDummyHtml = function() {
		var dummyHtml = document.querySelector('.alternativesViews .dummy');
		viewHtml = dummyHtml.cloneNode(true); //deep
		viewHtml.classList.remove('dummy');
		viewHtml.classList.add('alternative');
		document.querySelector('.alternativesViews').appendChild(viewHtml);
	};

	var addTitle = function() {
		var alternativeTitle = viewHtml.querySelector('h4');
		alternativeTitle.innerText = 'Alternativa ' + (index + 1);
	};

	var paintAlternativeDays = function() {
		for (var i = 0; i < alternative.length; i++) {
			var alternativeSubject = alternative[i];
			for (var j = 0; j < alternativeSubject.schedule.days.length; j++) {
				var day = alternativeSubject.schedule.days[j];
				var dayField = viewHtml.querySelector('tr[rel="'+day.turn+'"] td.'+day.name);
				dayField.style.backgroundColor = alternativeSubject.subject.color;
				dayField.innerText = alternativeSubject.subject.shortName;
				dayField.title = alternativeSubject.subject.name;
			}
		}
	};

	init();
};

var AlternativeSubject = function(subject) {
	var alternativeSubject = {};
	var listElement = {};

	var init = function() {
		createListElement();
	};

	var createListElement = function() {
		listElement = document.createElement('li');
		listElement.classList.add('list-group-item');
		listElement.innerText = subject.name;
		listElement.style.backgroundColor = subject.color;
		document.querySelector('.alternativesSubjects ul').appendChild(listElement);
	};

	init();
	return alternativeSubject;
};

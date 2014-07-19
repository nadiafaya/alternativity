var foundAlternativesController = (function() {
	var foundAlternativesController = {};
	var alternativeViewList = [];

	foundAlternativesController.generateDOM = function() {
		cleanAlternativeViews();
		createAlternativeViews();
	};

	foundAlternativesController.unpickStarInAlternatives = function(starNumber) {
		for (var i = 0; i < alternativeViewList.length; i++) {
			alternativeViewList[i].unpickStar(starNumber);
		};
	};

	foundAlternativesController.showOnlyPickedAlternatives = function() {
		for (var i = 0; i < alternativeViewList.length; i++) {
			alternativeViewList[i].hideIfNotPicked();
		};
	};

	foundAlternativesController.showAllAlternatives = function() {
		for (var i = 0; i < alternativeViewList.length; i++) {
			alternativeViewList[i].show();
		};
	};

	var cleanAlternativeViews = function() {
		var alternativesViews = document.querySelectorAll('.alternativesViews .alternative');
		for (var i = 0; i < alternativesViews.length; i++) {
			alternativesViews[i].remove();
		}
		alternativeViewList = [];
	};

	var createAlternativeViews = function() {
		for (var i = 0; i < inscription.alternatives.length; i++) {
			var alternativeView = new AlternativeView(inscription.alternatives[i], i);
			alternativeViewList.push(alternativeView);
		}
	};

	return foundAlternativesController;
})();


var AlternativeView = function(alternative, index) {
	var alternativeView = {};
	var viewHtml = {};
	var starsHtml = {};

	var init = function() {
		cloneDummyHtml();
		addTitle();
		paintAlternativeDays();
		paintStars();
		attachStarsEvent();
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
		for (var i = 0; i < alternative.schedules.length; i++) {
			var alternativeSubject = alternative.schedules[i];
			for (var j = 0; j < alternativeSubject.schedule.days.length; j++) {
				var day = alternativeSubject.schedule.days[j];
				var dayField = viewHtml.querySelector('tr[rel="'+day.turn+'"] td.'+day.name);
				dayField.style.backgroundColor = alternativeSubject.subject.color;
				dayField.innerText = alternativeSubject.subject.shortName;
				dayField.title = alternativeSubject.subject.name;
			}
		}
	};

	var paintStars = function() {
		var starButtons = viewHtml.querySelectorAll('.pickAlternativeStars .star');
		for (var i = 0; i < starButtons.length; i++) {
			starsHtml[(i+1).toString()] = starButtons[i];
		}
		for (var i = 0; i < starButtons.length; i++) {
			starButtons[i].addEventListener('click', starClicked);
			if (alternative.pickedNumber) {
				pickStar(alternative.pickedNumber);
			}
		}
	};

	var attachStarsEvent = function() {
	};

	var starClicked = function() {
		var starNumber = this.dataset.starnumber;
		if (alternative.pickedNumber === starNumber) {
			alternativeView.unpickStar(starNumber);
		} else {
			foundAlternativesController.unpickStarInAlternatives(starNumber);
			var numbers = ['1','2','3'];
			numbers.splice(numbers.indexOf(starNumber),1);
			for (var i = 0; i < numbers.length; i++) {
				alternativeView.unpickStar(numbers[i]);
			};
			pickStar(starNumber);
		}
	};

	var pickStar = function(starNumber) {
		starsHtml[starNumber].classList.add('picked');
		alternative.pickedNumber = starNumber;
		inscription.persistPickedAlternatives();
	};

	alternativeView.unpickStar = function(starNumber) {
		var star = starsHtml[starNumber];
		star.classList.remove('picked');
		if (alternative.pickedNumber === starNumber) {
			alternative.pickedNumber = "";
			inscription.persistPickedAlternatives();
		}
	};

	alternativeView.hideIfNotPicked = function() {
		if (!alternative.pickedNumber) {
			viewHtml.style.display = 'none';
		}
	};

	alternativeView.show = function() {
		viewHtml.style.display = 'block';
	};

	init();
	return alternativeView;
};
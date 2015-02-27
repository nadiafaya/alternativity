var foundAlternativesController = (function() {
	var foundAlternativesController = {};
	var alternativeViewList = [];
	var pickedAlternativesButtonOn = false;

	foundAlternativesController.generateDOM = function() {
		cleanAlternativeViews();
		createAlternativeViews();
		toggleEmptyText(!inscription.alternatives.length);
		updateBadgeCount();
		togglePickedAlternativesButton();
		filterIfPickedAlternatives();
	};

	foundAlternativesController.unpickStarInAlternatives = function(starNumber) {
		for (var i = 0; i < alternativeViewList.length; i++) {
			alternativeViewList[i].unpickStar(starNumber);
		};
	};

	foundAlternativesController.showOnlyPickedAlternatives = function() {
		pickedAlternativesButtonOn = true;
		var hiddenCount = 0;
		for (var i = 0; i < alternativeViewList.length; i++) {
			var hidden = alternativeViewList[i].hideIfNotPicked();
			hidden? hiddenCount++ : hiddenCount;
		};
		toggleEmptyText(hiddenCount == alternativeViewList.length);
	};

	foundAlternativesController.showAllAlternatives = function() {
		pickedAlternativesButtonOn = false;
		for (var i = 0; i < alternativeViewList.length; i++) {
			alternativeViewList[i].show();
		};
		toggleEmptyText(false);
	};

	var cleanAlternativeViews = function() {
		var alternativesViews = document.querySelectorAll('.alternativesViews .alternative');
		for (var i = 0; i < alternativesViews.length; i++) {
			alternativesViews[i].parentNode.removeChild(alternativesViews[i]);
		}
		alternativeViewList = [];
	};

	var createAlternativeViews = function() {
		for (var i = 0; i < inscription.alternatives.length; i++) {
			var alternativeView = new AlternativeView(inscription.alternatives[i], i);
			alternativeViewList.push(alternativeView);
		}
	};

	var toggleEmptyText = function(value) {
		var emptyText = document.querySelector('#alternatives #noAlternatives') ;
		emptyText.textContent = getEmptyText();
        emptyText.style.display = value? 'block' : 'none';
	};

	var getEmptyText = function() {
		if (!inscription.subjects.length) {
			return 'Agregá materias para ver las alternativas que se generan.';
		}

		if (!inscription.alternatives.length) {
			if (anyFilterIsBeignUsed()) {
				return 'No se encontraron alternativas para los filtros seleccionados.';
			}
			return 'No se encontraron alternativas para los horarios de las materias ingresadas. \nVerificá que los horarios sean correctos. \nProbá con deshabilitar los horarios de una materia si queres ver alternativas sin esa materia.';
		}

		if (pickedAlternativesButtonOn) {
			return 'No se encontraron alternativas elegidas. Clickea el botón "Mostrar todas" y selecciona una estrella en alguna alternativa';
		}
	};

	var anyFilterIsBeignUsed = function() {
		var filterGroups = [inscription.availableDays, inscription.availableTurns, inscription.availableTurnsInDays];
		return filterGroups.some(filterGroupIsBeignUsed);
	};
	
	var filterGroupIsBeignUsed = function(filterGroup) {
		for(var prop in filterGroup){
			var value = filterGroup[prop];
			if (typeof value != "boolean") {
				return filterGroupIsBeignUsed(value);
			}
			if (!value) { 
                return true;
            }
		}
		return false;
	};

	var updateBadgeCount = function() {
		var badge = document.getElementById('alternativesBadge');
		badge.textContent = inscription.alternatives.length;
		badge.className = inscription.alternatives.length? 'badge' : 'hidden';
	};

	var filterIfPickedAlternatives = function() {
		if (pickedAlternativesButtonOn) {
			foundAlternativesController.showOnlyPickedAlternatives();
		}
	};

	var togglePickedAlternativesButton = function() {
		var pickedAlternativesButton = document.querySelector('#showPickedAlternatives');
		if (inscription.alternatives.length) {
			pickedAlternativesButton.style.display = 'block';
		} else {
			pickedAlternativesButton.style.display = 'none';
			if (pickedAlternativesButtonOn) {
				pickedAlternativesButton.click();
			}
		}
		pickedAlternativesButton.style.display = inscription.alternatives.length? 'block' : 'none';
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
		alternativeTitle.textContent = 'Alternativa ' + (index + 1);
	};

	var paintAlternativeDays = function() {
		for (var i = 0; i < alternative.schedules.length; i++) {
			var alternativeSubject = alternative.schedules[i];
			for (var j = 0; j < alternativeSubject.schedule.days.length; j++) {
				var day = alternativeSubject.schedule.days[j];
				var dayField = viewHtml.querySelector('tr[rel="'+day.turn+'"] td.'+day.name);
				dayField.style.backgroundColor = alternativeSubject.subject.color;
				dayField.innerHTML += alternativeSubject.subject.name + ' ' + day.startHour + ':' + day.endHour + '<br>';
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
			}
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
			return true;
		}
	};

	alternativeView.show = function() {
		viewHtml.style.display = 'block';
	};

	init();
	return alternativeView;
};
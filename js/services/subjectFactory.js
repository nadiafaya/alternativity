app.factory('Subject', function(Schedule) {
	
	var Subject = function(options) {
		this.name = options.name.trim();
		this.schedules = parseTextIntoSchedules(options.scheduleText);
		this.shortName = makeShortName(this.name);
	};

	Subject.prototype.isValid = function() {
		return !!this.name && this.schedules.every(function(schedule) {
			return schedule.isValid();
		});
	};

	var parseTextIntoSchedules = function(schedulesText) {
		schedulesText = cleanAccents(schedulesText);
		var lines = schedulesText.match(/.+/gm);
		return lines.map(function(line) {
			return new Schedule(line);
		});
	};

	var cleanAccents = function(text) {
        var accentTranslations = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
        };
        if (text) {
            text = text.replace(/\u00E1/g, 'a')
                .replace(/\u00E9/g, 'e')
                .replace(/\u00ED/g, 'i')
                .replace(/\u00F3/g, 'o')
                .replace(/\u00FA/g, 'u');
	        text = text.replace(/[á,é,í,ó,ú,Á,É,Í,Ó,Ú]/g, function(match){ 
	            return accentTranslations[match];
	        });
	        return text;
        } else{
            return '';
        }
    };

    var makeShortName = function(name) {
        return cleanAccents(name).match(/\b(\w)|[A-Z]/g).join('').toUpperCase();
    };

	return (Subject);
});
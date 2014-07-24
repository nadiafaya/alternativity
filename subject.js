var subjectColors = {
    availableColors: ['#75CAEB', '#A01CFF', '#FF851B', '#28B62C','#158CBA', '#FF4136'],
    getColor: function() {
        if (this.availableColors.length) {
            return this.availableColors.pop();
        } else{
            // random color
            return '#'+Math.floor(Math.random()*16777215).toString(16);
        }
    }
};

var Day = function (params) {
    this.name = params.name || ''; // Lu,Ma,Mi,Ju,Vi,Sá
    this.turn = params.turn || ''; // m, t, n
};

var Schedule = function () {
    this.days = [];
    this.active = true;
};

var Subject = function (params) {
    var subject = {}; 
    var schedulesText = cleanAccents(params.schedules); // Esto es por "Sábado"
    subject.name = params.name || '';
    subject.shortName = makeShortName();
    subject.color = subjectColors.getColor();
    subject.schedules = [];
    subject.isOptional = params.isOptional || false;

    function parseSchedulesText () {
        var parsedSchedules = schedulesText.match(/\w\d\d\d\d.*/gm);
        for (var i = 0; i < parsedSchedules.length; i++) {
            var schedule = new Schedule();
            var parsedDays = parsedSchedules[i].match(/(Lu|Ma|Mi|Ju|Vi|Sa)\((m|t|n)\)/g); // Lu(m)
            for (var j = 0; j < parsedDays.length; j++) {
                var dayName = parsedDays[j].match(/Lu|Ma|Mi|Ju|Vi|Sa/g)[0];
                var dayTurn = parsedDays[j].match(/m|t|n/g)[0];
                var day = new Day({
                    name: dayName,
                    turn: dayTurn
                });
                schedule.days.push(day);
            }
            subject.schedules.push(schedule);
        }
    }

    function cleanAccents (text) {
        if (text) {
            return text.replace(/\u00E1/g, 'a')
                .replace(/\u00E9/g, 'e')
                .replace(/\u00ED/g, 'i')
                .replace(/\u00F3/g, 'o')
                .replace(/\u00FA/g, 'u');
        } else{
            return '';
        }
    }

    function makeShortName () {
        var accentTranslations = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U'
        };
        var cleanName = subject.name.replace(/[á,é,í,ó,ú,Á,É,Í,Ó,Ú]/g, function(match){ 
            return accentTranslations[match];
        });
        return cleanName.match(/\b(\w)|[A-Z]/g).join('').toUpperCase();
    }

    parseSchedulesText();
    return subject;
};

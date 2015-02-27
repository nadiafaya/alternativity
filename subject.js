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
    this.startHour = params.startHour || 1;
    this.endHour = params.endHour || 5;
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
    subject.errorLog = "";

    function parseSchedulesText () {
        var lines = schedulesText.match(/.+/gm);
        if (!lines || !lines.length) {
            logEmptyTextError();
            return;
        } 
        for (var i = 0; i < lines.length; i++) {
            var schedule = new Schedule();
            var days = lines[i].split(' ');
            if (!days || !days.length) {
                logError();
                return;
            }
            for (var j = 0; j < days.length; j++) {
                var parsedDay = /(Lu|Ma|Mi|Ju|Vi|Sa)\s*\((m|t|n)\)(\d):(\d)/g.exec(days[j]);
                if (!parsedDay || parsedDay.length < 5) {
                    logBadFormatError(days[j], lines[i]);
                    return;
                }
                var day = new Day({
                    name: parsedDay[1],
                    turn: parsedDay[2],
                    startHour: parseInt(parsedDay[3], 10),
                    endHour: parseInt(parsedDay[4], 10)
                });
                schedule.days.push(day);
            }
            subject.schedules.push(schedule);
        }
    }

    function logEmptyTextError () {
        subject.errorLog = "No se pudo encontrar ningún horario. Ingresá los horarios en el campo 'Horarios de materia'";
    }

    function logBadFormatError (day, line) {
        subject.errorLog = "Hubo un error al leer el día '"+ day +"' en la siguiente línea: '"+ line +"'. Ingresá los horarios con la forma 'Lu(n)0:5'";
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

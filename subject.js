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
    this.code = '';
    this.building = '';
};

var regExps = {
  day: "(Lu|Ma|Mi|Ju|Vi|Sa)",
  code: "(.*)",
  turn: "\\((m|t|n)\\)",
  hour: "(\\d)",
  building: "(MEDRANO|CAMPUS)"
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
            var scheduleRegexp = new RegExp(
                regExps.code + "?\\s*" +
                regExps.day + "\\s*" +
                regExps.turn +
                regExps.hour + ":" + regExps.hour +
                "\\s*(" +
                regExps.day + "\\s*" +
                regExps.turn +
                regExps.hour + ":" + regExps.hour +
                ")?" +
                "\\s*(" +
                regExps.building +
                ")?"
            );
            var parsedText = scheduleRegexp.exec(lines[i]);
            if (!parsedText || !parsedText.length || parsedText.length < 5) {
                logError();
                return;
            }
            schedule.code = (parsedText[1] && parsedText[1].trim()) || "";
            var day = new Day({
                name: parsedText[2],
                turn: parsedText[3],
                startHour: parseInt(parsedText[4], 10),
                endHour: parseInt(parsedText[5], 10)
            });
            schedule.days.push(day);
            if (parsedText[7] && parsedText[8] && parsedText[9] && parsedText[10]) {
                var day2 = new Day({
                    name: parsedText[7],
                    turn: parsedText[8],
                    startHour: parseInt(parsedText[9], 10),
                    endHour: parseInt(parsedText[10], 10)
                });
                schedule.days.push(day2);
            }
            schedule.building = (parsedText[11] && parsedText[11].trim()) || "";
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

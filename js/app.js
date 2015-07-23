var app = angular.module('alternativity', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: 'views/homeView.html'
    })
    .when('/subjects', {
      templateUrl: 'views/subjectsView.html',
      controllerUrl: 'views/subjectsController.js'
    });
}]);
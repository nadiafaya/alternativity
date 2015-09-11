var app = angular.module('alternativity', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/home', {
      templateUrl: 'views/homeView.html'
    })
    .when('/subjects', {
      templateUrl: 'views/subjectsView.html',
      controller: 'subjectsController'
    })
    .otherwise({
    	redirectTo: '/home'
    });
}]);
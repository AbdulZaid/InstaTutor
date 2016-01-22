// MODULE
var myApp = angular.module('myApp', ['ngRoute', 'firebase']);



// //CONFIGURATION
myApp.config(function ($routeProvider) {
	$routeProvider  
		.when('/main', {
			templateUrl: 'views/main.html',
			controller: 'mainController',
			loginRequired: true //
		})
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupCtrl',
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl',
		})

		.otherwise({ redirectTo: '/login' })

});

//FACTORY
myApp.factory('Auth', ['$firebaseAuth', function ($firebaseAuth) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
	return  $firebaseAuth(ref);
}])


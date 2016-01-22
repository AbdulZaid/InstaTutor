// Main MODULE... ui.bootstrap is for dropdown menus of bootstrap etc.. router is for states
var myApp = angular.module('myApp', ['ngRoute', 'firebase','ui.bootstrap','ui.router']);


//CONFIGURATION using Ui.router instead of ngRoute
myApp.config(function ($stateProvider, $urlRouterProvider) {
	// For any unmatched url, redirect to /state1
	// $urlRouterProvider.otherwise('views/main.html' )
	// Now set up the states
	$stateProvider
		.state('main', {
	    	url: "/home",
	    	controller: 'mainController',
	    	templateUrl: "views/main.html",
	        data: {
	            requireLogin: true
	        }
	    })
	    .state('signup', {
	    	url: "/signup",
	    	controller: 'SignupCtrl',
	    	templateUrl: "views/signup.html"

	    })
	    .state('login', {
	    	url: "/login",
	    	controller: 'LoginCtrl',
	    	templateUrl: "views/login.html"
	    })
})

//FACTORY
myApp.factory('Auth', ['$firebaseAuth', function ($firebaseAuth) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
	return  $firebaseAuth(ref);
}])


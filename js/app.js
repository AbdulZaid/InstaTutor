// Main MODULE... ui.bootstrap is for dropdown menus of bootstrap etc.. router is for states
var myApp = angular.module('myApp', ['ngRoute', 'firebase','ui.bootstrap','ngAnimate','ui.router','ngMaterial','ngAria','ngMessages']);

// for ui-router
myApp.run(["$rootScope", "$state", function($rootScope, $state) {
	$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
		// We can catch the error thrown when the $requireAuth promise is rejected
		// and redirect the user back to the home page
		if (error === "AUTH_REQUIRED") {
			console.log("directing for auth")
			$state.go("login");
		}
	});
}]);

//CONFIGURATION using Ui.router instead of ngRoute
myApp.config(function ($stateProvider, $urlRouterProvider) {
	// For any unmatched url, redirect to /state1
	// $urlRouterProvider.otherwise('home' )
	// Now set up the states
	$stateProvider
		.state('main', {
	    	url: "/home",
	    	controller: 'mainController',
	    	templateUrl: "views/main.html",
	        data: {
	            requireLogin: true,
	        },
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				"currentAuth": ["Auth", function(Auth) {
				  // $waitForAuth returns a promise so the resolve waits for it to complete
				  console.log("waiting for auth")
				  return Auth.$waitForAuth();
				}]
			},
			resolve: {
			    // controller will not be loaded until $requireAuth resolves
			    // Auth refers to our $firebaseAuth wrapper in the example above
			    "currentAuth": ["Auth", function(Auth) {
			      // $requireAuth returns a promise so the resolve waits for it to complete
			      // If the promise is rejected, it will throw a $stateChangeError (see above)
			      console.log("requiring auth")
			      return Auth.$requireAuth();
			    }]
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
	    .state('editProfile', {
	    	url: "/editProfile",
	    	controller: 'ProfileCtrl',
	    	templateUrl: "views/profile.html",
	    	resolve: {
			    // controller will not be loaded until $requireAuth resolves
			    // Auth refers to our $firebaseAuth wrapper in the example above
			    "currentAuth": ["Auth", function(Auth) {
			      // $requireAuth returns a promise so the resolve waits for it to complete
			      // If the promise is rejected, it will throw a $stateChangeError (see above)
			      console.log("requiring auth")
			      return Auth.$requireAuth();
			    }]
			}
	    })
})

//FACTORY
myApp.factory('Auth', ['$firebaseAuth', function ($firebaseAuth) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
	return  $firebaseAuth(ref);
}])



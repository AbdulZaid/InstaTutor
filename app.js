// MODULE
var myApp = angular.module('myApp', ['ngRoute', 'firebase']);



// //CONFIGURATION
myApp.config(function ($routeProvider) {
	$routeProvider  
		.when('/signup', {
			templateUrl: 'views/signup.html',
			controller: 'SignupCtrl',
		})

		.when('/login', {
			templateUrl: 'views/login.html',
			controller: 'LoginCtrl',
		})

});

//FACTORY
myApp.factory('Auth', ['$firebaseAuth', function ($firebaseAuth) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
	return  $firebaseAuth(ref);
}])

// CONTROLLERS
myApp.controller('AuthCtrl', ['$scope','Auth', '$log', function ($scope, Auth, $log) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
	//keep track of user auth changes
	Auth.$onAuth(function(authData) {
	  if (authData) {
	    console.log("Authenticated with uid:", authData.uid);
	    $scope.authData = authData;
	  } else {
	    console.log("Client unauthenticated.")
	    $scope.authData = authData;
	   }
	})

	$scope.logout = function() {
		Auth.$unauth();
	}

}])

myApp.controller('mainController', ['$scope', function ($scope, $log, $filter, $location) {


}]);

myApp.controller('LoginCtrl', ['$scope','Auth', function ($scope, Auth) {
	$scope.login = function() {
		Auth.$authWithPassword({
		  "email": $scope.email,
		  "password": $scope.password
		}, function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    console.log("Authenticated successfully with payload:", authData);
		  }
		})
	}

}]);

myApp.controller('SignupCtrl', ['$scope','Auth', function ($scope, Auth) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com");

		$scope.create = function() {
			ref.createUser({
			  email    : $scope.email,
			  password : $scope.password
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			  }
			});
	    }
}]);

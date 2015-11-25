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

myApp.controller('mainController', ['$scope','Auth', function ($scope, Auth, $location) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
	var authData = Auth.$getAuth();

	var postsRef = ref.child("posts");

	$scope.postMessage = function() {
		// var name = name
		postsRef.push().set({
    		"authorID": authData.uid,
    		"author": $scope.author,
    		"title": "The Turing Machine",
    		"content": $scope.textModel
  		},
  		function(error) {
	    	if (error) {
	    	alert("Data could not be saved." + error);
	  		} else {
	    		alert("Data saved successfully.");
	  		}
		});
	}

}]);

myApp.controller('LoginCtrl', ['$scope','Auth','$location', function ($scope, Auth, $location) {
	$scope.login = function() {
		Auth.$authWithPassword({
		  "email": $scope.email,
		  "password": $scope.password
		}, function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    console.log("Authenticated successfully with payload:", authData.uid);
		  }
		})
	}

}]);

myApp.controller('SignupCtrl', ['$scope','Auth','$location', function ($scope, Auth, $location) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com");
		var isNewUser = true

		$scope.create = function() {
			ref.createUser({
			  // "name": $scope.name,	
			  "email": $scope.email,
			  "password": $scope.password
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			  }
			})
	    }

	    ref.onAuth(function(authData) {
		    if (authData && isNewUser) {
			    // save the user's profile into the database so we can list users,
			    // use them in Security and Firebase Rules, and show profiles
			    ref.child("users").child(authData.uid).set({
			      provider: authData.provider,
			      name: getName(authData)
			    });
		    }
		});
		// find a suitable name based on the meta info given by each provider
		function getName(authData) {
		  switch(authData.provider) {
		     case 'password':
		       return authData.password.email.replace(/@.*/, '');
		     case 'twitter':
		       return authData.twitter.displayName;
		     case 'facebook':
		       return authData.facebook.displayName;
		  }
		}
}]);

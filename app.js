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

myApp.controller('mainController', ['$scope','Auth','$firebaseArray', function ($scope, Auth, $firebaseArray,$location) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com/messages");
	var authData = Auth.$getAuth();

	var postsRef = ref.child("posts");

	$scope.postMessage = function() {
		// var name = name
		postsRef.push().set({
    		"authorID": authData.uid,
    		"author": $scope.author,
    		"title": $scope.title,
    		"content": $scope.textModel
  		},
  		function(error) {
	    	if (error) {
	    		alert("Data could not be saved." + error);
	  		} else {
	    		alert("Data saved successfully.");
	  		}
		});
	};


	// Get a database reference to our posts
	// var ref = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
	// // Attach an asynchronous callback to read the data at our posts reference
	// ref.on("child_added", function(snapshot, prevChildKey) {
	//   var newPost = snapshot.val();
	//   console.log("Author: " + newPost.author);
	//   console.log("Author ID : " + newPost.authorID);
	//   console.log("Title: " + newPost.title);
	//   console.log("Content: " + newPost.content);
	// }, function (errorObject) {
	//   console.log("The read failed: " + errorObject.code);
	// });


	var refOne = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");

	  // create a synchronized array
	  // click on `index.html` above to see it used in the DOM!
	  $scope.posts = $firebaseArray(refOne);





















	// // Attach an asynchronous callback to read the data at our posts reference
	// 	refOne.on("child_added", function(snapshot) {
	// 	  $scope.postsToShow = snapshot.val();
	// 	  console.log( $scope.postsToShow);
	// 	  postsFunc($scope.postsToShow)
	// 	});

 //    var postsFunc = function(postsData) {
 //    	$scope.listMe = postsData
 //    	console.log($scope.listMe + " Finally");
 //    	addThem($scope.listMe)
 //    	// return $scope.listMe;
 //    }

 //    $scope.listOfPosts = []
 //    var addThem = function(post) {
 //    	$scope.listOfPosts.push(post)
 //    	console.log($scope.listOfPosts);

 //    	// return $scope.listOfPosts
 //    }
 //    console.log($scope.listOfPosts);

 //   	  // $scope.items = $scope.listMe;
	//   console.log("The read failed: " + $scope.listOfPosts);




	// var listMe = {
	// 	"author": "hey",
	// 	"Name": "hss"
	// }
 //   	$scope.items = listMe;

	// 	ref.orderByChild("messages").on("child_added", function(snapshot) {
	// 	  var newPost = snapshot.val();
	// 	  return console.log("Post is titled as " + snapshot.val().title + " by " + snapshot.val().author + " ");
	// 	});

	// 	ref.orderByKey().on("child_added", function(snapshot) {
	// 	  var newPost = snapshot.val();
	// 	  console.log("Post is titled as " + snapshot.val().title + " by " + snapshot.val().author + " ");
	// 	});

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
			}),
			ref.onAuth(function(authData) {
			    if (authData && isNewUser) {
				    // save the user's profile into the database so we can list users,
				    // use them in Security and Firebase Rules, and show profiles
				    ref.child("users").child(authData.uid).set({
				      provider: authData.provider,
				      name: getName(authData)
				    });
			    }
			})
	    }


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

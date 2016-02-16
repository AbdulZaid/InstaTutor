// Main MODULE... ui.bootstrap is for dropdown menus of bootstrap etc.. router is for states
var myApp = angular.module('myApp', ['ngRoute', 'firebase','ui.bootstrap','ngAnimate','ui.router','ngMaterial','ngAria','ngMessages','ngMdIcons']);

// for ui-router
myApp.run(["$rootScope", "$state","Auth", function($rootScope, $state, Auth) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com");
		var authData = ref.getAuth();

		//keep track of user auth changes
		Auth.$onAuth(function(authData) {
		  if (authData) {
		    console.log("Authenticated with uiiiiiiid:", authData.uid);
		    authData = authData;
		    $state.go("main");
			// event.preventDefault();
		  } else {
		    console.log("Clienttttttttt unauthenticated.")
		    authData = authData;
		    $state.go("login")
		   }
		})

		//redirect to login if not logged in some pages ( successful attempt. )
		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
			// We can catch the error thrown when the $requireAuth promise is rejected
			// and redirect the user back to the home page
			if (error === "AUTH_REQUIRED") {
				console.log("directing for auth")
				$state.go("login");
				event.preventDefault();
			}
		});

	//attempt to redirect on state change but not usful for now.
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
		// if (toState.module === 'private' && !authData ) {
	 //        // If logged in and transitioning to a logged out page:
	 //        event.preventDefault();
	 //        $state.go('login');
	 //    } 
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
	    	views: {
		        // the main template will be placed here (relatively named)
		        '': { 
		        	templateUrl: 'views/main.html',
		        	controller: 'mainController'
		        	},
		        // the child views will be defined here (absolutely named)
		        'postArea@main': { 
		        	templateUrl: 'views/main-post.html',
		        	controller: 'PostCtrl' 
		    	},
		    	'assignmentsArea@main': {
		    		templateUrl: 'views/main-assignments.html',
		    		controller: 'AssignmentCtrl'
		    	}
		    },

	    	module: "private", //custom attributes will be used later.
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
	    	templateUrl: "views/signup.html",
	    	module: "public",

	    })	    
	    .state('login', {
	    	url: "/login",
	    	controller: 'LoginCtrl',
	    	templateUrl: "views/login.html",
	    	module: "public",
	    })
	    .state('editProfile', {
	    	url: "/editProfile",
	    	// views: {
		    //     // the main template will be placed here (relatively named)
		    //     '': { 
		    //     	templateUrl: 'views/profile.html',
		    //     	controller: 'ProfileCtrl'
		    //     	},
		    //     // the child views will be defined here (absolutely named)
		    //     'postArea@main': { 
		    //     	templateUrl: 'views/messages.html',
		    //     	controller: 'MessagesListCtrl' 
		    // 	},
		    // },
	    	controller: 'ProfileCtrl',
	    	templateUrl: "views/profile.html",
	    	module: "private",
			resolve: {
				// controller will not be loaded until $waitForAuth resolves
				// Auth refers to our $firebaseAuth wrapper in the example above
				currentAuth: ["Auth", function(Auth) {
				  // $waitForAuth returns a promise so the resolve waits for it to complete
				  console.log("waiting for auth you dumbass")
				  return Auth.$waitForAuth();
				}]
			},
			resolve: {
			    // controller will not be loaded until $requireAuth resolves
			    // Auth refers to our $firebaseAuth wrapper in the example above
			    currentAuth: ["Auth", function(Auth) {
			      // $requireAuth returns a promise so the resolve waits for it to complete
			      // If the promise is rejected, it will throw a $stateChangeError (see above)
			      console.log("requiring auth you idiot")
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

myApp.factory('Users', ['$firebaseAuth','$firebaseObject','$firebaseArray', function ($firebaseAuth, $firebaseObject, $firebaseArray) {
	var usersRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
	var usersArray = $firebaseArray(usersRef)

	var Users = {
		getUser: function(uid) {
			return $firebaseObject(usersRef.child(uid))
		},
		getName: function(uid) {
			return usersArray.$getRecord(uid).name
		},
		getProfile: function(uid) {
			return usersArray.$getRecord(uid)//for retrieving data in profilePage
		}
	}

	return  Users;
}])



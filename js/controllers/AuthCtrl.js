// CONTROLLERS
myApp.controller('AuthCtrl', ['$scope','Auth', '$log','$rootScope','$state', function ($scope, Auth, $log, $rootScope, $state) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com");
	var isAuth = $rootScope.authData
	//keep track of user auth changes
	Auth.$onAuth(function(authData) {
	  if (authData) {
	    $scope.authData = authData;
	  } 
	})

	$scope.login = function() {
		Auth.$authWithPassword({
		  "email": $scope.email,
		  "password": $scope.password
		}).then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		  $state.go("dashboard.main")
		}).catch(function(error) {
		  console.error("Authentication failed:", error);
		});
	}
	
	$scope.logout = function() {
		console.log("Logging out and directing to landing: ");
		Auth.$onAuth(function(authData) {
		  if (!authData) {
		    console.log("User is unauthenticated");
		    $scope.authData = authData;
            $state.go("login")
		    $state.reload();
			// $state.go('login', {}, {reload: true});

		  } 
		})
		Auth.$unauth();
	}

	$scope.isCollapsed = false;
	
}])
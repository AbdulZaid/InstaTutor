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
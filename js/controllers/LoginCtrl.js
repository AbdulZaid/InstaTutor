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
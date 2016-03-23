myApp.controller('LoginCtrl', ['$scope','Auth','$location', function ($scope, Auth, $location) {
	$scope.login = function() {
		Auth.$authWithPassword({
		  "email": $scope.email,
		  "password": $scope.password
		}).then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		}).catch(function(error) {
		  console.error("Authentication failed:", error);
		});
	}

}]);
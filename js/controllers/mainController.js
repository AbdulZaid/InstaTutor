myApp.controller('mainController', ['$scope','Auth','Users', '$firebaseArray', function ($scope, Auth, Users, $firebaseArray, $location) {

	var usersRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  	$scope.authData = Auth.$getAuth()

	$scope.usersArray = $firebaseArray(usersRef);

	$scope.usersArray.$loaded(function() {
		$scope.currentUserType = Users.getUserType($scope.authData.uid);
	})

}])

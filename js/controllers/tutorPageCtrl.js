myApp.controller('tutorPageCtrl', ['$scope','Users','Auth','$location','$firebaseAuth','$firebaseArray','$firebaseObject','$mdBottomSheet','$mdSidenav','$mdDialog',
	function ($scope, Users, Auth, $location, $firebaseAuth, $firebaseArray, $firebaseObject, $mdBottomSheet, $mdSidenav, $mdDialog) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com/users")
		$scope.authData = Auth.$getAuth();
		$scope.usersInfo = {}
  		$scope.profileObject = $firebaseObject(ref);
  		$scope.isTutor = false
  		$scope.isStudent = false
  		console.log($scope.authData.uid)
  		/*
  		* The problem is solved by creating a gloabl object usersInfo, and then assigning it to the 
  		* object retrived by the method getProfile.
  		*/
		$scope.profileObject.$loaded( //to solve the problem with loading data before using it.
		    function() {
				$scope.usersInfo = Users.getProfile($scope.authData.uid) // here is the problem always
				// console.log(Users.getUser($scope.authData.uid))
				// console.log(Users.getProfile($scope.authData.uid))
				// console.log(Users.getName($scope.authData.uid))
				if(Users.getUserType($scope.authData.uid) === "Tutor") {
		  			$scope.isTutor = true
		  		}  else {
  					$scope.isStudent = true
		  		}
				$scope.user = {
					title: $scope.usersInfo.handle, 
					email: $scope.usersInfo.email,
					firstName: $scope.usersInfo.name,
					lastName: $scope.usersInfo.profile.lastName,
					company: $scope.usersInfo.profile.company,
					address: $scope.usersInfo.profile.address,
					city: $scope.usersInfo.profile.city,
					state: $scope.usersInfo.profile.state,
					biography: $scope.usersInfo.profile.biography,
					postalCode: $scope.usersInfo.profile.postalCode,
				};
		  });
	}])

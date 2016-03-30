myApp.controller('SignupCtrl', ['$scope','Auth','$location','$firebaseAuth','$state', function ($scope, Auth, $location, $firebaseAuth, $state) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com");
		var isNewUser = true
		$scope.authObj = $firebaseAuth(ref);

		// assign values for ng-repeat and ng-model for the html selector options
		$scope.userTypes = [{
			label: 'Student'
		  }, {
			label: 'Tutor'
		}],

		$scope.create = function() {

			$scope.authObj.$createUser({
			  email: $scope.email,
			  password: $scope.password,
			}).then(function(userData) {
				console.log("User " + userData.uid + " created successfully!");

				return $scope.authObj.$authWithPassword({
					email: $scope.email,
					password: $scope.password
				});
			  
			}).then(function(authData) {
			  console.log("Logged in as:", authData.uid);
			  $state.go("main")

				ref.child("users").child(authData.uid).set({
					  provider: authData.provider,
					  email: $scope.email,
					  password: $scope.password,
					  name: getName(authData),
					  handle: $scope.handle,
					  type: $scope.userType, //from the ng-model and ng-repeat in html file.      
					  profile: {
						title: " ",
						email: " ",
						firstName: " ",
						lastName: " ",
						company: " ",
						address: " ",
						city: " ",
						state: " ",
						biography: " ",
						postalCode: " "
					  }
					});
			}).catch(function(error) {
			  console.error("Error: ", error);
			});
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
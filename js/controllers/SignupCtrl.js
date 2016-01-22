myApp.controller('SignupCtrl', ['$scope','Auth','$location', function ($scope, Auth, $location) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com");
		var isNewUser = true

		// assign values for ng-repeat and ng-model for the html selector options
		$scope.userTypes = [{
			value: 'user_1',
		   	label: 'Student'
		  }, {
		    value: 'user_2',
		    label: 'Tutor'
		}],

		$scope.create = function() {
			ref.createUser({
			  "handle": $scope.handle,	
			  "email": $scope.email,
			  "password": $scope.password,
			  "type": $scope.userLists.label
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
				      name: getName(authData),
				      handle: $scope.handle,
				      type: $scope.userLists.label //from the ng-model and ng-repeat in html file.
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
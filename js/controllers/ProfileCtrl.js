myApp.controller('ProfileCtrl', ['$scope','Auth','$location','$firebaseAuth','$firebaseArray',
	function ($scope, Auth, $location, $firebaseAuth, $firebaseArray) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com/users");
		$scope.authData = Auth.$getAuth();
		var isNewUser = true
		$scope.users = $firebaseArray(ref);




		ref.on("child_added", function(snapshot, prevChildKey) {
			$scope.newPost = snapshot.val();

			$scope.user = {
				title: $scope.newPost.handle,
				email: '',
				firstName: $scope.newPost.name,
				lastName: '',
				company: '',
				address: '',
				city: ' ',
				state: '',
				biography: '',
				postalCode: ''
			};
		});



  		$scope.title = 'Save';

	    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
	    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
	    'WY').split(' ').map(function(state) {
	        return {abbrev: state};
	      })

	    $scope.profileData = ref.child($scope.authData.uid).child("profile");
	    $scope.updateProfile = function() {
	    	$scope.profileData.update({
	      	  title: $scope.user.title,
		      email: $scope.user.email,
		      firstName: $scope.user.firstName,
		      lastName: $scope.user.lastName,
		      company: $scope.user.company,
		      address: $scope.user.address,
		      city: $scope.user.city,
		      state: $scope.user.state,
		      biography: $scope.user.biography,
		      postalCode: $scope.user.postalCode
	    	}, function(error, authData) {
	    		if (error) {
	    			console.log("Data for profile couldn't be saved" + error)
	    		} else {
	    			console.log("Data for profile was saved successfully " + $scope.authData.uid)
	    		}
	    	})
	    }
  
	}])
	.config(function($mdThemingProvider) {

	    // Configure a dark theme with primary foreground yellow

	    $mdThemingProvider.theme('docs-dark', 'default')
	      .primaryPalette('blue')
	      // .dark();

	  });

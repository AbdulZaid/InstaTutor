myApp.controller('ProfileCtrl', ['$scope','Users','Auth','$location','$firebaseAuth','$firebaseArray','$firebaseObject',
	function ($scope, Users, Auth, $location, $firebaseAuth, $firebaseArray, $firebaseObject) {
		$scope.authData = Auth.$getAuth();
		var ref = new Firebase("https://homeworkmarket.firebaseio.com/users")

		console.log(Users.getUser($scope.authData.uid))
		console.log(Users.getProfile($scope.authData.uid))
		$scope.usersInfo = Users.getProfile($scope.authData.uid)
		$scope.user = {
			title: $scope.usersInfo.handle, 
			email: $scope.usersInfo.email, //contunue here and retreive data
			firstName: $scope.usersInfo.name,
			lastName: $scope.usersInfo.profile.lastName,
			company: $scope.usersInfo.profile.company,
			address: $scope.usersInfo.profile.address,
			city: $scope.usersInfo.profile.city,
			state: $scope.usersInfo.profile.state,
			biography: $scope.usersInfo.profile.biography,
			postalCode: $scope.usersInfo.profile.postalCode,
		};

		// ref.on("child_added", function(snapshot, previousChild) {
		// 	$scope.newPost = snapshot.val();
		// 	$scope.tutorProfileData = snapshot.child("profile").val()
		// 	// console.log($scope.profileData)
		// 	// console.log($scope.newPost)
		// 	$scope.user = {
		// 		title: $scope.newPost.handle, 
		// 		email: $scope.newPost.email, //contunue here and retreive data
		// 		firstName: $scope.newPost.name,
		// 		lastName: $scope.tutorProfileData.lastName,
		// 		company: $scope.tutorProfileData.company,
		// 		address: $scope.tutorProfileData.address,
		// 		city: $scope.tutorProfileData.city,
		// 		state: $scope.tutorProfileData.state,
		// 		biography: $scope.tutorProfileData.biography,
		// 		postalCode: $scope.tutorProfileData.postalCode,
		// 	};
		// });


  		$scope.title = 'Save';

	    $scope.states = ('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS ' +
	    'MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI ' +
	    'WY').split(' ').map(function(state) {
	        return {abbrev: state};
	      })

	    // // $scope.profileData = usersObject.$scope.authData.uid
	    // // console.log( $scope.profileData )
	    $scope.profileData = ref.child($scope.authData.uid).child("profile")
	    var sh = $firebaseObject($scope.profileData)
	    console.log("IIIDDDDD " + $scope.authData.uid)
	    // console.log(sh.address)
	    $scope.updateProfile = function(authData) {


	    	$scope.profileData.set({
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

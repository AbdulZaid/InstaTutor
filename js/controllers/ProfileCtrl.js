myApp.controller('ProfileCtrl', ['$scope','Users','Auth','$location','$firebaseAuth','$firebaseArray','$firebaseObject','$mdBottomSheet','$mdSidenav','$mdDialog',
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
				$scope.menu = [
			    {
			      link : '',
			      title: 'Profile',
			      icon: 'dashboard',
			      direct: 'dashboard.myProfile',
			      show: true
			    },
			    {
			      link : '',
			      title: 'My Jobs',
			      icon: 'message',
			      direct: 'dashboard.myAssignments',
			      show: $scope.isStudent
			    },
			   	{
			      link : '',
			      title: 'My Work',
			      icon: 'message',
			      direct: 'dashboard.myJobs',
			      show: $scope.isTutor 
			    },
			    {
			      link : '',
			      title: 'My Bookmarks',
			      icon: 'bookmark',
			      direct: 'dashboard.myJobs',
			      show: $scope.isTutor 
			    },
			    {
			      link : '',
			      title: 'Proposals',
			      icon: 'message',
			      direct: 'dashboard.myProposals',
			      show: $scope.isStudent
			    },
			    {
			      link : '',
			      title: 'Messages',
			      icon: 'message',
			      direct: 'dashboard.myProfile',
			      show: true
			    }
			  ];
			  $scope.admin = [
			    {
			      link : '',
			      title: 'Trash',
			      icon: 'delete'
			    },
			    {
			      link : 'showListBottomSheet($event)',
			      title: 'Settings',
			      icon: 'settings'
			    }
			  ];
		  });

		$scope.toggleSidenav = function(menuId) {
		    $mdSidenav(menuId).toggle();
		  };

		  $scope.showListBottomSheet = function($event) {
		    $scope.alert = '';
		    $mdBottomSheet.show({
		      template: '<md-bottom-sheet class="md-list md-has-header"> <md-subheader>Settings</md-subheader> <md-list> <md-item ng-repeat="item in items"><md-item-content md-ink-ripple flex class="inset"> <a flex aria-label="{{item.name}}" ng-click="listItemClick($index)"> <span class="md-inline-list-icon-label">{{ item.name }}</span> </a></md-item-content> </md-item> </md-list></md-bottom-sheet>',
		      controller: 'ListBottomSheetCtrl',
		      targetEvent: $event
		    }).then(function(clickedItem) {
		      $scope.alert = clickedItem.name + ' clicked!';
		    });
		  };


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
	    // console.log("IIIDDDDD " + $scope.authData.uid)
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
	    $mdThemingProvider.theme('default') //#4db6ac
		    .primaryPalette('teal', {
		      'default': '600', // by default use shade 400 from the pink palette for primary intentions
		      'hue-1': '700', // use shade 100 for the <code>md-hue-1</code> class
		      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
		      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
		    })
		    .accentPalette('indigo');

	  });

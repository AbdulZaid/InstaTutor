myApp.controller('SideNavCtrl', ['$scope','Users','Auth','$location','$firebaseAuth','$firebaseArray','$firebaseObject','$mdBottomSheet','$mdSidenav','$mdDialog','$state',
	function ($scope, Users, Auth, $location, $firebaseAuth, $firebaseArray, $firebaseObject, $mdBottomSheet, $mdSidenav, $mdDialog, $state) {
		var ref = new Firebase("https://homeworkmarket.firebaseio.com/users")
		$scope.authData = Auth.$getAuth();
  		$scope.profileObject = $firebaseObject(ref);
  		$scope.isTutor = false
  		$scope.isStudent = false
  		if($scope.authData) {
  			$scope.profileObject.$loaded( 
		    	function() {

					if(Users.getUserType($scope.authData.uid) === "Tutor") {
			  			$scope.isTutor = true
			  		}  else {
						$scope.isStudent = true
			  		}
					$scope.menu = [
						{
					      link : '',
					      title: 'Dashboard',
					      icon: 'dashboard',
					      direct: 'dashboard.main',
					      show: true
					    },
					    {
					      link : '',
					      title: 'List of posted jobs',
					      icon: 'view_list',
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
					      title: 'Explore Tutors',
					      icon: 'explore',
					      direct: 'dashboard.exploreTutors',
					      show: $scope.isStudent
					    },
					    {
					      link : '',
					      title: 'Proposals',
					      icon: 'work',
					      direct: 'dashboard.myProposals',
					      show: $scope.isStudent
					    },
					    {
					      link : '',
					      title: 'Messages',
					      icon: 'message',
					      direct: 'dashboard.messages',
					      show: true
					    },
					    {
					      link : '',
					      title: 'My Bookmarks',
					      icon: 'bookmark',
					      direct: 'dashboard.myJobs',
					      show: $scope.isTutor 
					    },
					];

					$scope.managementList = [
					  	{
					      link : '',
					      title: 'Profile',
					      icon: 'dashboard',
					      direct: 'dashboard.myProfile',
					      show: true
					    },
					    {
					      link : '',
					      title: 'Settings',
					      direct: 'dashboard.settings',
					      icon: 'settings'
					    }
					];
			})
  		} else {
  			$state.go('login')
  		}


}])

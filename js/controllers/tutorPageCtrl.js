myApp.controller('tutorPageCtrl', ['$scope','Users','Auth','$location','$firebaseAuth','$firebaseArray','$firebaseObject','$mdSidenav','$timeout',
	function ($scope, Users, Auth, $location, $firebaseAuth, $firebaseArray, $firebaseObject, $mdSidenav, $timeout) {
		var tutorRef = new Firebase("https://homeworkmarket.firebaseio.com/users")
		$scope.authData = Auth.$getAuth();

		$scope.tutorsArray = $firebaseArray(tutorRef);

		$scope.user = null;
		$scope.tutors = [];
		$scope.name = null;
		$scope.tutorID = null;
		//get list of all tutors from DB
		$scope.tutorsArray.$loaded(function() {
			tutorRef.orderByChild('type').equalTo('Tutor').on('value', function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
					$scope.name = childSnapshot.val().handle;
					$scope.tutorID = childSnapshot.key();
					$scope.tutors.push({
						id: $scope.tutorID,
						name: $scope.name
					})
				})
			})
		})
		//query/load the data for the DOM.
		$scope.loadUsers = function() {
			// Use timeout to simulate a 650ms request.
			return $timeout(function() {
			  $scope.tutors =  $scope.tutors  || [
			    { id: 1, name: 'Scooby Doo' },
			    { id: 2, name: 'Shaggy Rodgers' },
			    { id: 3, name: 'Fred Jones' },
			    { id: 4, name: 'Daphne Blake' },
			    { id: 5, name: 'Velma Dinkley' }
			  ];
			}, 650);
		};
	}])

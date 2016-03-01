myApp.controller('NotifyCtrl', ['$scope','Auth','Users','$interval','$firebaseObject','$firebaseArray','$mdDialog', 
	function ($scope, Auth, Users, $interval, $firebaseObject, $firebaseArray, $mdDialog) {
  		var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  		$scope.authData = Auth.$getAuth()
  		var authorID = $scope.authData.uid

		authorRef.child(authorID).child("notifications").on('child_added', function(snapshot) { 
          console.log(snapshot.val());
          alert("hey you got proposal from ")
        });

		$scope.title = 'Title';
  		$scope.badgeNum = 1000;
  		$scope.warn = function(){
    		return $scope.badgeNum > 1004; 
  		}
  		$interval(function(){
    		$scope.badgeNum++;
  		}, 1000)
}]);

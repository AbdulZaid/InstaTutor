myApp.controller('NotifyCtrl', ['$scope','Auth','Users','$interval','$firebaseObject','$firebaseArray','$mdDialog', 
	function ($scope, Auth, Users, $interval, $firebaseObject, $firebaseArray, $mdDialog) {
		var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
		var authData = Auth.$getAuth()
    var key
    var authorID
    if(authData !== null) {
        var authorID = authData.uid
        authorRef.child(authorID).child("notifications").orderByKey().limitToLast(1).on('child_added', function(snapshot) { 
        key = snapshot.key()
        if(!snapshot.val().viewed) {
          $scope.alertColor = 'red'
        }
      }); 
    }
    
    $scope.reset = function() {
      authorRef.child(authorID).child("notifications").child(key).update({
        "viewed": true
      })
      $scope.alertColor = 'white'
    } 

		$scope.title = 'Title';
		$scope.badgeNum = 1000;
		$scope.warn = function(){
  		return $scope.badgeNum > 1004; 
		}
		$interval(function(){
  		$scope.badgeNum++;
		}, 1000)
}]);

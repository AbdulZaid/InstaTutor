myApp.controller('submissionPageCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','$stateParams','focus', '$location', '$anchorScroll', 'ngToast','$state',  function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, $stateParams, focus, $location, $anchorScroll, ngToast, $state) {

   	$scope.jobID = $stateParams.jobID.split("").reverse().join("");
    $scope.postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID);
  	$scope.authData = Auth.$getAuth();
    $scope.postObject = $firebaseObject($scope.postsRef)

    $scope.postObject.$loaded().then(function() {
      	$scope.currentUser = Users.getProfile($scope.authData.uid);

    	$scope.sendMessage = function() {
    		$scope.messageContent = $scope.message
    		$scope.authorName = $scope.currentUser.name
    		var messageTime  = Firebase.ServerValue.TIMESTAMP

    		$scope.postsRef.child("messages").push({
    			"messageContent": $scope.messageContent,
    			"authorName": $scope.authorName,
    			"time": messageTime
    		})
    		$scope.message = null
    	}

    })

}]);
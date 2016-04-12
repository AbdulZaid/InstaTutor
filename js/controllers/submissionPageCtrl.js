myApp.controller('submissionPageCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','$stateParams','focus', '$location', '$anchorScroll', 'ngToast','$state',  function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, $stateParams, focus, $location, $anchorScroll, ngToast, $state) {

   	$scope.jobID = $stateParams.jobID.split("").reverse().join("");
    $scope.postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID);
    $scope.messagesRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID + "/messages");
  	$scope.authData = Auth.$getAuth();
    $scope.postObject = $firebaseObject($scope.postsRef)
    $scope.messagesArray = $firebaseObject($scope.messagesRef)
    $scope.studentImagePath = 'images/angular-avatars/avatar-03.png';
    $scope.tutorImagePath = 'images/angular-avatars/avatar-05.png';
    $scope.postObject.$loaded().then(function() {
        $scope.currentUser = Users.getProfile($scope.authData.uid);
        $scope.currentUserName = $scope.currentUser.name
        $scope.currentUserType = $scope.currentUser.type
        if($scope.currentUser.type == "Student") {
            $scope.otherUser = Users.getProfile($scope.postObject.tutorID);
            $scope.otherUserName = $scope.otherUser.name;
            $scope.currentUserImage = true //true when student false when tutor
            $scope.isTutor = true;
        } else {
            $scope.otherUser = Users.getProfile($scope.authData.uid);
            $scope.otherUserName = $scope.otherUser.name;
            $scope.otherUserType = $scope.otherUser.type;
            $scope.isStudent = true
        }





    	$scope.sendMessage = function() {
    		$scope.messageContent = $scope.message
    		var messageTime  = Firebase.ServerValue.TIMESTAMP
    		$scope.postsRef.child("messages").push({
    			"messageContent": $scope.messageContent,
    			"authorName": $scope.currentUserName,
    			"time": messageTime
    		})
    		$scope.message = null
    	}

    })
    $scope.messagesArray.$loaded().then(function() {
        $scope.messages = $scope.messagesArray
        $scope.messagesRef.once("value", function(allMessagesSnapshot) {
            allMessagesSnapshot.forEach(function(messageSnapshot) {
                // Will be called with a messageSnapshot for each child under the /messages/ node
                $scope.messageTime = messageSnapshot.child("time").val();  // e.g. "6:50pm"
                $scope.messageContent = messageSnapshot.child("messageContent").val();  // e.g. "Hola la "
                $scope.authorName = messageSnapshot.child("authorName").val();  // e.g. "Abdul!"
            });
        });

    })

}])

.filter('reverse', function() {
  return function(messagesRef) {
    return messagesRef.slice().reverse();
  };
})


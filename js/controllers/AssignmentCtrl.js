myApp.controller('AssignmentCtrl', ['$scope','Auth','Users','$firebaseArray','$firebaseObject','$mdDialog', '$mdMedia', function ($scope, Auth, Users, $firebaseArray, $firebaseObject, $mdDialog, $mdMedia, $location) {

  var postRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");

	// create a synchronized array
	// click on `index.html` above to see it used in the DOM!
	// var query = refOne.orderByChild("timestamp").limitToLast(10);
	$scope.posts = $firebaseArray(postRef);
	$scope.authData = Auth.$getAuth()
  $scope.author = $firebaseObject(authorRef);
	window.postValue = {}
	$scope.obj = {}
  $scope.status = ' ';
	$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
  $scope.showAdvanced = function(ev) {
    var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
    window.postValue = $scope.posts.$getRecord(ev)
	  $scope.obj = window.postValue
    console.log($scope.obj)

    $mdDialog.show({
      controller: DialogController,
      templateUrl: 'views/assignment.html',
      parent: angular.element(document.body),
      //these are the items inside the object obtained by $getRecord.
      locals: {
      	items: $scope.obj
      },
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: useFullScreen
    })
    .then(function(answer) {
      $scope.status = 'You said the information was "' + answer + '".';
    }, function() {
      $scope.status = 'You cancelled the dialog.';
    });
    $scope.$watch(function() {
      return $mdMedia('xs') || $mdMedia('sm');
    }, function(wantsFullScreen) {
      $scope.customFullscreen = (wantsFullScreen === true);
    });
  };

  $scope.showProposal = function(ev) {
    window.postValue = $scope.posts.$getRecord(ev)
    $scope.obj = window.postValue
    $mdDialog.show({
      templateUrl: 'views/propose.html',
      parent: angular.element(document.body),
      locals: {
        items: $scope.obj
      },
      controller: DialogController,
      targetEvent: ev,
      clickOutsideToClose:true,
    })
  }

  $scope.propose = function(authorID, postID) {
    var tutorID =  $scope.authData.uid
    var authorID = authorID
    var postID = postID
    var time = Firebase.ServerValue.TIMESTAMP
    $scope.author.$loaded(
      function() {
        authorPosts = Users.getPosts(authorID) //to get all the posts of a certain author
        authorCurrentPost = Users.getSpecificPost(authorID, postID)
        tutorName = Users.getName(tutorID)
        authorRef.child(authorID).child("posts").child(authorCurrentPost.$id).child("proposals").push({
          "tutorID": tutorID,
          "tutorName": tutorName,
          // "amount": authorCurrentPost.amount || $scope.counterOffer,
          ".priority": Firebase.ServerValue.TIMESTAMP,
          "time": time,
          "message": $scope.proposalMessage || "New propsal" ,
        })
        //get the key of the proposal to store it in the user notifications.
        authorRef.child(authorID).child("posts").child(authorCurrentPost.$id).child("proposals").orderByKey().limitToLast(1).on('child_added', function(snapshot) {
          key = snapshot.key()  //get a snapshot of the post's key
        });
        //use the above to set with the same proposal key.
        authorRef.child(authorID).child("notifications").child(key).set({
          "tutorID": tutorID,
          "tutorName": tutorName,
          "amount": tutorID,
          ".priority": Firebase.ServerValue.TIMESTAMP,
          "time": time,
          "message": $scope.proposalMessage || "new Propsal" 
        })
        //function to check priorities. 
        authorRef.child(authorID).child("notifications").on('child_added', function(snapshot) { 
          console.log(snapshot.getPriority());
        });
      })
  }

  function DialogController($scope, $mdDialog, items) {
    $scope.items = items //these are the items inside the object obtained by $getRecord.
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
      console.log(answer)
    };

  }

}]);


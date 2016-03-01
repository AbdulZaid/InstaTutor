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


  $scope.propose = function(authorID, postID) {
    var tutorID =  $scope.authData.uid
    var authorID = authorID
    var postID = postID
    $scope.author.$loaded(
      function() {
        authorPosts = Users.getPosts(authorID) //to get all the posts of a certain author
        authorCurrentPost = Users.getSpecificPost(authorID, postID)
        tutorName = Users.getName(tutorID)

        authorRef.child(authorID).child("posts").child(authorCurrentPost.$id).child("proposals").push({
          "tutorID": tutorID,
          "tutorName": tutorName,
          "amount": tutorID
        })

        console.log("tutor ID" + tutorID)
        console.log("Author ID" + authorID)
        console.log($scope.author)
        console.log(authorPosts)
        console.log(authorCurrentPost)
        console.log(tutorName)
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


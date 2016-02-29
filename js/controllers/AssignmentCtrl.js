myApp.controller('AssignmentCtrl', ['$scope','Auth','$firebaseArray','$firebaseObject','$mdDialog', '$mdMedia', function ($scope, Auth, $firebaseArray, $firebaseObject, $mdDialog, $mdMedia, $location) {

	var refOne = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");

	// create a synchronized array
	// click on `index.html` above to see it used in the DOM!
	// var query = refOne.orderByChild("timestamp").limitToLast(10);
	$scope.posts = $firebaseArray(refOne);
	$scope.authData = Auth.$getAuth()
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


  $scope.propose = function(authorID) {
    //do if statements here.
    var tutorID =  $scope.authData.uid
    var authorID = authorID

    console.log("tutor ID" + tutorID)
    console.log(authorID)
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


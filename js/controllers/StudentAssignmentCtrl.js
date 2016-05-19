myApp.controller('StudentAssignmentCtrl', ['$scope','Auth','Users','Toasts', '$state', '$firebaseObject','$firebaseArray','$mdDialog','ngToast', function ($scope, Auth, Users, Toasts, $state, $firebaseObject, $firebaseArray, $mdDialog, ngToast) {
  var userRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  var postRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.userAuth = Auth.$getAuth()
  $scope.userID = $scope.userAuth.uid
  $scope.studentAssignment = $firebaseArray(userRef.child($scope.userID).child("posts"));
  $scope.imagePath = 'images/abdul_img.png';
  $scope.studentImagePath = 'images/angular-avatars/avatar-03.png';
  $scope.tutorImagePath = 'images/angular-avatars/avatar-05.png';

  //compelete to get the tags for dashboard main
  // $scope.studentAssignment.$loaded().then(function(){
  //   $scope.postTags = $scope.studentAssignment
  //   console.log($scope.postTags)
  // })

  $scope.deletePost = function(postID, authorID) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your Job?')
          .textContent('If you delete your job you will not be able to see it again')
          .ariaLabel('Lucky day')
          .targetEvent(postID)
          .ok('Please do it!')
          .cancel('Aoh no');
    $mdDialog.show(confirm).then(function() {
      Toasts.deletePostSuccess();
      userRef.child(authorID).child("posts").child(postID).remove();
      postRef.child(postID).remove();

    }, function() {
      ngToast.create({
        className: 'warning',
        content: 'Unfortunately you attempt to delete was not successful' 
      })
      $scope.status = 'You decided to keep your debt.';
    });


  };


}])

.filter('reverse', function() {
  return function(studentAssignment) {
    return studentAssignment.slice().reverse();
  };
})

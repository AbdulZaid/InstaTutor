myApp.controller('UserAssignmentCtrl', ['$scope','Auth','Users','$firebaseObject','$firebaseArray','$mdDialog', function ($scope, Auth, Users, $firebaseObject, $firebaseArray, $mdDialog) {
  var userRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  $scope.userAuth = Auth.$getAuth()
  $scope.userID = $scope.userAuth.uid
  $scope.userAssignment = $firebaseArray(userRef.child($scope.userID).child("posts"));
  

  //the below code is useless.
  $scope.myAssignments
  $scope.userAssignment.$loaded().then(function(assignmentsRef){
    $scope.myAssignments = $scope.userAssignment
    //this needs to be changed to order data correctly.
    userRef.child($scope.userID).child("posts").orderByKey().on('child_added', function(snapshot) {
      var key = snapshot.key()  //get a snapshot of the post's key

    });
  })




  $scope.assignments = [
    {
      name: 'Janet Perkins', 
      question: 'How the hell is this?', 
      icon: 'message', 
      img: 'images/abdul_img.png', 
      newMessage: true 
    },

    { name: 'Mary Johnson', question:'How the hell is this?', icon: 'description', img: 'images/abdul_img.png', newMessage: false },
    { name: 'Peter Carlsson', question:'How the hell is this?', icon: 'assignment', img: 'images/abdul_img.png', newMessage: false }
  ];
  $scope.goToPerson = function(assignment, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title(assignment.question)
        .textContent(assignment.content)
        .ariaLabel('Person inspect demo')
        .ok('Edit')
        .targetEvent(event)
    );
  };
  $scope.doSecondaryAction = function(event) { //show like an main page and remove post.
    $mdDialog.show(
      $mdDialog.alert()
        .title('DELETE')
        .textContent('Are you sure you want to delete this assignment?')
        .ariaLabel('Secondary click demo')
        .ok("Delete")
        .targetEvent(event)
    );
  };

  $scope.deletePost = function() {
    console.log("deleted")
  }
}])

.filter('reverse', function() {
  return function(userAssignment) {
    return userAssignment.slice().reverse();
  };
})

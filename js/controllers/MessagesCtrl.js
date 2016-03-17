myApp.controller('MessagesCtrl', ['$scope','Auth','Users','$firebaseObject','$firebaseArray','$mdDialog', function ($scope, Auth, Users, $firebaseObject, $firebaseArray, $mdDialog ) {
    
  var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  var postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.authData = Auth.$getAuth()

  $scope.messages = $firebaseArray(authorRef.child($scope.authData.uid).child("notifications"))


  $scope.imagePath = 'images/abdul_img.png';

  $scope.goToPerson = function(message, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title("Message/Proposal from: " + message.tutorName)
        .textContent(message.message)
        .ok('Got It')
        .targetEvent(event)
    );
  };

  //Assign a certain tutor to do the job
  $scope.deal = function(tutorID, proposalID, postID, tutorName) {
    var tutorID = tutorID
    var proposalID = proposalID
    var tutorName = tutorName
    //Change status of proposal to assigned in tutor proposals
    authorRef.child(tutorID).child("tutorProposals").child(proposalID).update({
      "assigned": true
    })
    //Change status of proposal to assigned in students notifications
    authorRef.child($scope.authData.uid).child("notifications").child(proposalID).update({
      "assigned": true
    })

    //Change the status of the proposal in student's posts to assigned 
    authorRef.child($scope.authData.uid).child("posts").child(postID).child("proposals").child(proposalID).update({
      "assigned": true,
    })

    //Change the status of the assignment (post) to assigned 
    authorRef.child($scope.authData.uid).child("posts").child(postID).update({
      "assigned": true,
      "assignedTo": tutorName
    })
    
    //update the posts for public views.
    postsRef.child(postID).update({
      "assigned": true,
      "assignedTo": tutorName
    })

    console.log("hey you, you got a deal on your proposal" + proposalID)
  };

  //reject and remove proposals from DB in both paths.
  $scope.isDisabled = false;
  $scope.reject = function(notificationID, postID) {
    var notificationID = notificationID
    var postID = postID
    authorRef.child($scope.authData.uid).child("notifications").child(notificationID).remove()
    authorRef.child($scope.authData.uid).child("posts").child(postID).child("proposals").child(notificationID).remove()
    // $scope.isDisabled = true;
    return false
  }

}])

.filter('reverse', function() {
  return function(messages) {
    return messages.slice().reverse();
  };
})

.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('altTheme')
      .primaryPalette('blue', {
        'default': '400', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
      })
      .accentPalette('green');

  });
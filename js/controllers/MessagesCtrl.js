myApp.controller('MessagesCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','ngToast', function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, ngToast ) {
    
  var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  var postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.authData = Auth.$getAuth()

  $scope.messages = $firebaseArray(authorRef.child($scope.authData.uid).child("notifications"))


  $scope.imagePath = 'images/abdul_img.png';


  //Assign a certain tutor to do the job
  $scope.deal = function(tutorID, proposalID, postID, tutorName) {
    var tutorID = tutorID
    var proposalID = proposalID
    var tutorName = tutorName
    var postID = postID
    // get the post to add it to tutor work after being assigned.
    var postAssigned = Posts.getSpecificPost(postID) 

    //Change status of proposal to assigned in tutor proposals
    authorRef.child(tutorID).child("tutorProposals").child(proposalID).update({
      "assigned": true
    })
    //Change status of proposal to assigned in students notifications
    authorRef.child($scope.authData.uid).child("notifications").child(proposalID).update({
      "assigned": true,
      "viewed": true
    })
    //add to tutor work now it has been assignd to him/her
    authorRef.child(tutorID).child("myWork").child(postID).set({
        "authorID": $scope.authData.uid,
        "author": postAssigned.author,
        "question": postAssigned.question,
        "content": postAssigned.content,
        "field": postAssigned.field,
        "dueDate": postAssigned.dueDate,
        "amount": postAssigned.amount,
        "assigned": true,
        "assignedTo": tutorName
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
    ngToast.create('hey you, you just agreed on a deal with ' + " " +  tutorName );

  };

  //reject and remove proposals from DB in both paths.
  $scope.isDisabled = false;
  $scope.reject = function(notificationID, postID, tutorName, tutorID) {
    var notificationID = notificationID
    var postID = postID
    var tutorName = tutorName
    var tutorID = tutorID
    //remove info from user and post database
    authorRef.child($scope.authData.uid).child("notifications").child(notificationID).remove()
    authorRef.child($scope.authData.uid).child("posts").child(postID).child("proposals").child(notificationID).remove()
    // authorRef.child($scope.authData.uid).child("posts").child(postID).update({
    //   "status": "open"
    // })
    //remove data from tutor database.
    authorRef.child(tutorID).child("tutorProposals").child(notificationID).remove()
    authorRef.child(tutorID).child("myWork").child(postID).remove()
    // $scope.isDisabled = true;
    ngToast.create({
      className: 'danger',
      content: 'hey you, you just rejected a proposal from ' + tutorName,
    })
    return false
  }


  $scope.showProposal = function(tutorName, amount, message, jobTitle) {
    $mdDialog.show(
      $mdDialog.alert()
        .clickOutsideToClose(true)
        .title('Proposal sent by' +  tutorName + "for job tited " + jobTitle)
        .textContent('Message:' + message + " with amount of" + amount)
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(tutorName)
    );
  };


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
myApp.controller('MessagesCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','ngToast', function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, ngToast ) {
    
  var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  var postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.authData = Auth.$getAuth()


  // for hiding buttons when the proposal is viewd
  $scope.notifications = $firebaseArray(authorRef.child($scope.authData.uid).child("notifications"));
  $scope.studentPosts = $firebaseArray(authorRef.child($scope.authData.uid).child("posts"));
  var studentProposalsRef = new Firebase("https://homeworkmarket.firebaseio.com/users/" + $scope.authData.uid + "/posts");
  $scope.proposalsArray = [] 
      $scope.studentPosts.$loaded().then(function() {
        studentProposalsRef.on("value", function(allMessagesSnapshot) {
          allMessagesSnapshot.forEach(function(snapshot) { 
            if(snapshot.hasChild("proposals")) {
              snapshot.child("proposals").forEach(function(childSnapshot) {
                $scope.proposalsArray.push(childSnapshot.val())
                  console.log($scope.proposalsArray)
                console.log("theres are your proposals")
            })

            } 
            else {
              // $scope.proposalsArray.push(null)
              console.log("You don't have any new proposals")
            }
          })
        })
        return $scope.proposalsArray
      })
  

  // $scope.imagePath = 'images/abdul_img.png';
  $scope.studentImagePath = 'images/angular-avatars/avatar-03.png';
  $scope.tutorImagePath = 'images/angular-avatars/avatar-05.png';


  //Assign a certain tutor to do the job
  $scope.deal = function(tutorID, proposalID, postID, tutorName) {
    var tutorID = tutorID
    var proposalID = proposalID
    var tutorName = tutorName
    var postID = postID
    var time = Firebase.ServerValue.TIMESTAMP
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

    //notify tutor
    authorRef.child(tutorID).child("notifications").child(proposalID).set({
        ".priority": Firebase.ServerValue.TIMESTAMP,
        "time": time,
        "authorID": $scope.authData.uid,
        "author": postAssigned.author,
        "question": postAssigned.question,
        "content": postAssigned.content,
        "field": postAssigned.field,
        "dueDate": postAssigned.dueDate,
        "amount": postAssigned.amount,
        "assigned": true,
        "assignedTo": tutorName,
        "viewed": false,
        "type": "WorkAssigned"
    })



    console.log("hey you, you got a deal on your proposal" + proposalID)
    ngToast.create('hey you, you just agreed on a deal with ' + " " +  tutorName );

  };

  //reject and remove proposals from DB in both paths.
  $scope.reject = function(notificationID, postID, tutorName, tutorID) {
    var notificationID = notificationID
    var postID = postID
    var tutorName = tutorName
    var tutorID = tutorID
    //remove info from user and post database
    authorRef.child($scope.authData.uid).child("notifications").child(notificationID).update({
      "viewed": true,
      // "rejected": true, use this when you implement reject.
    })
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

  $scope.markAsViewed = function(notificationID) {
    console.log(notificationID)
    authorRef.child($scope.authData.uid).child("notifications").child(notificationID).update({
      "viewed": true
    })
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
  return function(notifications) {
    return notifications.slice().reverse();
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
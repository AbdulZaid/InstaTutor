myApp.controller('JobPageCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','$stateParams','focus', '$location', '$anchorScroll', 'ngToast','$state',  function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, $stateParams, focus, $location, $anchorScroll, ngToast, $state) {
  
  $scope.authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  $scope.generalPostsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.authData = Auth.$getAuth();
  $scope.jobID = $stateParams.jobID;
  $scope.postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.jobRef = $firebaseObject($scope.postsRef);
  $scope.usersRef = $firebaseArray($scope.authorRef);
  $scope.proposalsPanel = false;
  $scope.isStudentPost = false
  $scope.imagePath = 'images/abdul_img.png';
  $scope.jobRef.$loaded()
    .then(function() {
      $scope.job = Posts.getSpecificPost($scope.jobID);
      var dueDate = $scope.job.dueDate;
      var datePosted = $scope.job.time;
      //job details
      $scope.authorID = $scope.job.authorID;
      $scope.amount = $scope.job.amount;
      $scope.author = $scope.job.author;
      $scope.question = $scope.job.question;
      $scope.content = $scope.job.content;
      $scope.field = $scope.job.field;
      $scope.dueDate =  moment(dueDate).format('MMMM Do YYYY');
      $scope.assigned = $scope.job.assigned;
      $scope.assignedTo = $scope.job.assignedTo;
      $scope.postedWhen = moment(datePosted).fromNow(true);
      $scope.tags = $scope.job.tags;
      $scope.imageURL = $scope.job.images;
      $scope.postStatus = $scope.job.status
      $scope.proposalFocus = function() {
          // set the location.hash to the id of
          // the element you wish to scroll to.
          $location.hash('price');

          // call $anchorScroll()
          $anchorScroll();
          focus('price');
      };
      //user profile
      var user = Users.getProfile($scope.job.authorID);
      $scope.userName = user.handle;
      
      //show or hide the propose form based on user type.
      $scope.currentUser = Users.getProfile($scope.authData.uid);
      //check if the current user is allowed to view the post
      if($scope.authorID == $scope.authData.uid && $scope.currentUser.type == "Student" || $scope.currentUser.type == "Tutor" ) {
        $scope.isStudentPost = true;
      } 

      if($scope.currentUser.type == "Tutor") {
        $scope.isTutor = true;
      } else {
        $scope.isTutor = false;
      }
      
      // proposal panel control 
      if($scope.currentUser.type == "Student") {
        $scope.proposalsPanel = true;
      }
      $scope.toggleProposalsPanel = function() {
        $scope.proposalsPanel = !$scope.proposalsPanel;
      }
      
      //proposals handler
      $scope.proposalsRef = new Firebase("https://homeworkmarket.firebaseio.com/users/" + $scope.job.authorID +"/posts/" + $scope.jobID +"/proposals/");
      $scope.proposalsArray = $firebaseArray($scope.proposalsRef)
      $scope.proposalsArray.$loaded(function() {
          $scope.numOfProposals = $scope.proposalsArray.length;
      })
      //sort by current tutor propsal
      // $scope.myFilter = function (proposal) { 
      //   console.log(proposal.tutorID)
      //     return proposal.time === $scope.authData.uid || proposal.tutorID !== $scope.authData.uid; 
      // };

    })
    .catch(function(error) {
      console.error("Error:", error);
  });

  //bookmark a post and add it to Tutor bookmarks
  //do a check to see if tutor has already bookmarked this or not.
  $scope.bookmark = function() { 
    $scope.authorRef.child($scope.authData.uid).child("bookmarks").push({
      postURL: '/job/' + $scope.jobID
    })
    ngToast.create({
      className: 'success',
      content: 'hey you, you just bookmarked this post successfully' 
    })  
  }



  $scope.deal = function(tutorID, proposalID, postID, tutorName, proposedAmount) {
    var tutorID = tutorID
    var proposalID = proposalID
    var tutorName = tutorName
    var postID = postID
    var proposedAmount = proposedAmount
    // get the post to add it to tutor work after being assigned.
    var postAssigned = Posts.getSpecificPost(postID) 

    //Change status of proposal to assigned in tutor proposals
    $scope.authorRef.child(tutorID).child("tutorProposals").child(proposalID).update({
      "assigned": true
    })
    //Change status of proposal to assigned in students notifications
    $scope.authorRef.child($scope.authData.uid).child("notifications").child(proposalID).update({
      "assigned": true,
      "viewed": true
    })
    //add to tutor work now it has been assignd to him/her
    $scope.authorRef.child(tutorID).child("myWork").child(postID).set({
        "authorID": $scope.authData.uid,
        "author": postAssigned.author,
        "question": postAssigned.question,
        "content": postAssigned.content,
        "field": postAssigned.field,
        "dueDate": postAssigned.dueDate,
        "amount": proposedAmount || postAssigned.amount,
        "assigned": true,
        "assignedTo": tutorName
    })

    //Change the status of the proposal in student's posts to assigned 
    $scope.authorRef.child($scope.authData.uid).child("posts").child(postID).child("proposals").child(proposalID).update({
      "assigned": true,
    })

    //Change the status of the assignment (post) to assigned 
    $scope.authorRef.child($scope.authData.uid).child("posts").child(postID).update({
      "assigned": true,
      "assignedTo": tutorName,
      "status": "Assigned" 
    })
    
    //update the posts for public views.
    $scope.postsRef.child(postID).update({
      "assigned": true,
      "assignedTo": tutorName,
      "status": "Assigned"
    })

    console.log("hey you, you got a deal on your proposal" + proposalID)
    ngToast.create('hey you, you just agreed on a deal with ' + " " +  tutorName );

  };




  $scope.deleteProposal = function(proposalID, postID) {

    var confirm = $mdDialog.confirm()
          .title('Would you like to delete your proposal?')
          .textContent('If you delete your Proposal, please consider proposing again. ')
          .ariaLabel('Lucky day')
          .targetEvent(postID)
          .ok('Please do it!')
          .cancel('Aoh no');
    $mdDialog.show(confirm).then(function() {
      ngToast.create({
        className: 'success',
        content: 'hey you, you just deleted your proposal successfully' 
      })      
    $scope.authorRef.child($scope.authorID).child("posts").child(postID).child("proposals").child(proposalID).remove()
    $scope.authorRef.child($scope.authData.uid).child("tutorProposals").child(proposalID).remove()
    }, function() {
      ngToast.create({
        className: 'warning',
        content: 'Unfortunately you attempt to delete was not successful' 
      })
      $scope.status = 'You decided to keep your debt.';
    });
  }

  $scope.removePost = function(postID) {
    var confirm = $mdDialog.confirm()
          .title('Are you sure want to remove your Post?')
          .textContent('If you remove your post, please consider posting a new job again. ')
          .ariaLabel('Lucky day')
          .targetEvent(postID)
          .ok('Please do it!')
          .cancel('Aoh no');
    $mdDialog.show(confirm).then(function() {
      ngToast.create({
        className: 'success',
        content: 'hey you, you just deleted your post successfully' 
      })      
    $scope.authorRef.child($scope.authorID).child("posts").child(postID).remove()
    $scope.generalPostsRef.child(postID).remove()
    $state.go('main')
    }, function() {
      ngToast.create({
        className: 'warning',
        content: 'you decided not to remove the post Yay' 
      })
      $scope.status = 'You decided to keep your debt.';
    });
  }
    
    
    
}])



.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('YYYY-MM-DD');
  };
})  

.factory('focus', function($timeout, $window) {
    return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  });



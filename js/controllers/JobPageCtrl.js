myApp.controller('JobPageCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','$stateParams','focus', '$location', '$anchorScroll',  function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, $stateParams, focus, $location, $anchorScroll) {
    
  $scope.authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  $scope.authData = Auth.$getAuth();
  $scope.jobID = $stateParams.jobID;
  $scope.postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.jobRef = $firebaseObject($scope.postsRef);
  $scope.usersRef = $firebaseArray($scope.authorRef);
  $scope.proposalsPanel = false;
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
      var currentUser = Users.getProfile($scope.authData.uid);
      if(currentUser.type == "Tutor") {
        console.log(currentUser.type);
        $scope.userType = true;
      } else {
        $scope.userType = false;
      }
      
      // proposal panel control
        
        if(currentUser.type == "Student")
            {
                $scope.proposalsPanel = true;
            }
        $scope.toggleProposalsPanel = function()
        {
            $scope.proposalsPanel = !$scope.proposalsPanel;
        }
      
      //proposals handler
      var proposalsRef = new Firebase("https://homeworkmarket.firebaseio.com/users/" + $scope.job.authorID +"/posts/" + $scope.jobID +"/proposals/");
      $scope.proposalsArray = $firebaseArray(proposalsRef)
      $scope.proposalsArray.$loaded(function() {
          $scope.numOfProposals = $scope.proposalsArray.length 
      })


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
  }

  $scope.imagePath = 'images/abdul_img.png';
    
    
    
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



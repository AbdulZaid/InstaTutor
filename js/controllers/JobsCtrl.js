myApp.controller('JobsCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog', function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog ) {
    
  var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  var postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.authData = Auth.$getAuth()

  $scope.jobs = $firebaseArray(authorRef.child($scope.authData.uid).child("myWork"))


  $scope.imagePath = 'images/abdul_img.png';


  //Assign a certain tutor to do the job
  $scope.submit = function(tutorID, proposalID, postID, tutorName) {
    var tutorID = tutorID
    var proposalID = proposalID
    var tutorName = tutorName
    var postID = postID
  };

}])

.filter('reverse', function() {
  return function(jobs) {
    return jobs.slice().reverse();
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
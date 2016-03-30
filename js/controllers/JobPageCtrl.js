myApp.controller('JobPageCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','$stateParams',  function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, $stateParams ) {
    
  var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  $scope.authData = Auth.$getAuth()
  $scope.jobID = $stateParams.jobID
  $scope.postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  $scope.jobRef = $firebaseObject($scope.postsRef)
  $scope.jobRef.$loaded()
    .then(function() {
      var job = Posts.getSpecificPost($scope.jobID)
      var dueDate = job.dueDate
      var datePosted = job.time
      $scope.authorID = job.authorID
      $scope.amount = job.amount
      $scope.author = job.author
      $scope.question = job.question
      $scope.content = job.content
      $scope.field = job.field
      $scope.dueDate =  moment(dueDate).format('MMMM Do YYYY');
      $scope.assigned = job.assigned
      $scope.assignedTo = job.assignedTo
      $scope.postedWhen = moment(datePosted).fromNow(true)
      $scope.tags = job.tags
      // console.log($scope.tags)
    })
    .catch(function(error) {
      console.error("Error:", error);
  });
  $scope.imagePath = 'images/abdul_img.png';
}])

.config(function($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function(date) {
    return moment(date).format('YYYY-MM-DD');
  };
})  




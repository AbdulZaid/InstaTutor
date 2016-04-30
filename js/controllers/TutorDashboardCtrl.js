myApp.controller('TutorDashboardCtrl', ['$scope','Auth','Users', '$firebaseArray', function ($scope, Auth, Users, $firebaseArray, $location) {

	var postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
  	$scope.authData = Auth.$getAuth()

	$scope.postsArray = $firebaseArray(postsRef);
	$scope.posts = []
	$scope.postsArray.$loaded(function() {
		$scope.posts = $scope.postsArray;
	})
}])

.filter('reverse', function() {
  return function(posts) {
    return posts.slice().reverse();
  };
})
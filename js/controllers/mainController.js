myApp.controller('mainController', ['$scope','Auth','$firebaseArray', function ($scope, Auth, $firebaseArray, $location) {

	var postRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
	// create a synchronized array
	// click on `index.html` above to see it used in the DOM!
	// var query = refOne.orderByChild("timestamp").limitToLast(10);
	$scope.posts = $firebaseArray(postRef);

}])

.filter('reverse', function() {
  return function(postRef) {
    return postRef.slice().reverse();
  };
})
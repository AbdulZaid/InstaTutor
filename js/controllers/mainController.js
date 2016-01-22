myApp.controller('mainController', ['$scope','Auth','$firebaseArray', function ($scope, Auth, $firebaseArray, $location) {
	var ref = new Firebase("https://homeworkmarket.firebaseio.com/messages");
	var authData = Auth.$getAuth();

	var postsRef = ref.child("posts");

	// COLLAPSE =====================
	$scope.isCollapsed = false;	


	$scope.postMessage = function() {
		postsRef.push().set({
    		"authorID": authData.uid,
    		"author": $scope.author,
    		"title": $scope.title,
    		"content": $scope.textModel
  		},
  		function(error) {
	    	if (error) {
	    		alert("Data could not be saved." + error);
	  		} else {
	    		alert("Data saved successfully.");
	  		}
		});
	};

	var refOne = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
	// create a synchronized array
	// click on `index.html` above to see it used in the DOM!
	$scope.posts = $firebaseArray(refOne);

}]);
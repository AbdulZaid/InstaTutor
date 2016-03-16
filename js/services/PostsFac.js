myApp.factory('Posts', ['$firebaseAuth','$firebaseObject','$firebaseArray', function ($firebaseAuth, $firebaseObject, $firebaseArray) {
	var postRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
	var postsArray = $firebaseArray(postRef)
	var Posts = {
		getSpecificPost: function(postID) {
			return postsArray.$getRecord(postID)
		}
	}
	return  Posts;
}])
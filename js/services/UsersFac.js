myApp.factory('Users', ['$firebaseAuth','$firebaseObject','$firebaseArray', function ($firebaseAuth, $firebaseObject, $firebaseArray) {
	var usersRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
	var usersArray = $firebaseArray(usersRef)

	var Users = {
		getUser: function(uid) {
			return $firebaseObject(usersRef.child(uid))
		},
		getName: function(uid) {
			return usersArray.$getRecord(uid).name
		},
		getUserType: function(uid) {
			return usersArray.$getRecord(uid).type
		},
		getProfile: function(uid) {
			return usersArray.$getRecord(uid)//for retrieving data in profilePage
		},
		getPosts: function(uid) {
			return $firebaseObject(usersRef.child(uid).child("posts"))
		},
		getSpecificPost: function(uid, postID) {
			return $firebaseObject(usersRef.child(uid).child("posts").child(postID))
		},
		getTutorProposlas: function(uid, proposalID) {
			return $firebaseObject(usersRef.child(uid).child("tutorProposlas").child(proposalID))
		}
	}

	return  Users;
}])
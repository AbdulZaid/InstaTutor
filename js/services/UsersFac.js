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
        getSpecificPostProposals: function(uid, postID) {
            var proposalsRef = new Firebase("https://homeworkmarket.firebaseio.com/users/" + uid +"/posts/" + postID +"/proposals/");
            var proposalsArray = $firebaseArray(proposalsRef)
            proposalsArray.$loaded(function() {
                console.log(proposalsArray.length); // data is loaded here
            })
            return proposalsArray
        },
        // getTutorProposlas: function(uid, proposalID) {
        //  return $firebaseObject(usersRef.child(uid).child("tutorProposlas").child(proposalID))
        // },
        //tutor can't propose to more than one assingment. must Fix.
        hasNotProposed: function(tutorID) {
            var notProposed = true

            usersRef.child(tutorID).child("tutorProposals").once("value", function(snapshot) {
                if(snapshot.hasChildren()) {
                    snapshot.forEach(function(childSnapshot) {
                        // var zag = childSnapshot.val().tutorID.localeCompare(tutorID)
                        console.log(childSnapshot.val().tutorID)
                        if(childSnapshot.val().tutorID.localeCompare(tutorID) == 0) {
                            notProposed = false
                        } else {
                            notProposed = true
                        }
                    })
                } else {
                    notProposed = true
                }
            })
            return notProposed
        }
    }

    return  Users;
}])
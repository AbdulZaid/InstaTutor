myApp.controller('AssignmentCtrl', ['$scope', 'Auth', 'Users', 'Posts', '$firebaseArray', '$firebaseObject', 'ngToast', '$mdDialog', '$mdMedia', 
  function($scope, Auth, Users, Posts, $firebaseArray, $firebaseObject, ngToast, $mdDialog, $mdMedia, $location) {

    var postRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts");
    var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");

    // create a synchronized array
    // click on `index.html` above to see it used in the DOM!
    // var query = refOne.orderByChild("timestamp").limitToLast(10);
    $scope.posts = $firebaseArray(postRef);
    $scope.authData = Auth.$getAuth()
    $scope.author = $firebaseObject(authorRef);
    window.postValue = {}
    $scope.obj = {}
    $scope.status = ' ';
    $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
    $scope.showAdvanced = function(ev, event) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        window.postValue = $scope.posts.$getRecord(ev)
        $scope.obj = window.postValue
        console.log($scope.obj)

        $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, items) {
                    $scope.items = items //these are the items inside the object obtained by $getRecord.
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    }
                },
                templateUrl: 'views/assignment.html',
                parent: angular.element(document.body),
                //these are the items inside the object obtained by $getRecord.
                locals: {
                    items: $scope.obj
                },
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        $scope.$watch(function() {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    $scope.showProposal = function(ev, event) {
        window.postValue = $scope.posts.$getRecord(ev)
        $scope.obj = window.postValue
        $mdDialog.show({
            controller: function DialogController($scope, $mdDialog, items) {
                $scope.items = items //these are the items inside the object obtained by $getRecord.
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                }
            },
            templateUrl: 'views/propose.html',
            parent: angular.element(document.body),
            locals: {
                items: $scope.obj
            },
            targetEvent: ev,
            clickOutsideToClose: true,
        }).then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    }

    $scope.propose = function(authorID, postID) {
        var tutorID = $scope.authData.uid
        var authorID = authorID
        var postID = postID
        var time = Firebase.ServerValue.TIMESTAMP
        var hasNotProposed = Users.hasNotProposed(tutorID, authorID, postID)


        if (Users.getUserType(tutorID) === "Tutor" && hasNotProposed) {
            console.log("I'm a tutor")


            $scope.author.$loaded(
                function() {
                    authorPosts = Users.getPosts(authorID) //to get all the posts of a certain author
                    authorCurrentPost = Posts.getSpecificPost(postID)
                    tutorName = Users.getName(tutorID)
                        // console.log(Users.hasN otProposed(tutorID))

                    //stores the new  tutor proposal inside the current post list of proposals.
                    authorRef.child(authorID).child("posts").child(authorCurrentPost.$id).child("proposals").push({
                        "tutorID": tutorID,
                        "tutorName": tutorName,
                        "amount": $scope.counterOffer || authorCurrentPost.amount,
                        ".priority": Firebase.ServerValue.TIMESTAMP,
                        "time": time,
                        "message": $scope.proposalMessage || "New propsal",
                        "postID": authorCurrentPost.$id,
                        "postField": authorCurrentPost.field,
                        "assigned": false,
                        "viewed": false,
                        "key": null
                    })

                    //get the key of the proposal to store it in the user notifications.
                    authorRef.child(authorID).child("posts").child(authorCurrentPost.$id).child("proposals").orderByKey().limitToLast(1).on('child_added', function(snapshot) {
                        key = snapshot.key() //get a snapshot of the post's key
                    });
                    //add the key to the stored values. This to be used when forEach is used and there's no access to item.$id
                    authorRef.child(authorID).child("posts").child(authorCurrentPost.$id).child("proposals").child(key).update({
                        "key": key
                    })

                    //Stores the proposal as notifications for the student to see anb check.
                    authorRef.child(authorID).child("notifications").child(key).set({
                        "tutorID": tutorID,
                        "tutorName": tutorName,
                        "amount": $scope.counterOffer || authorCurrentPost.amount,
                        ".priority": Firebase.ServerValue.TIMESTAMP,
                        "time": time,
                        "message": $scope.proposalMessage || "new Propsal",
                        "postID": authorCurrentPost.$id,
                        "postField": authorCurrentPost.field,
                        "assigned": false,
                        "viewed": false,
                        "type": "Proposal"
                    })

                    //checks if the user type is a tutor then store the propsal as his/her.
                    if (Users.getUserType(tutorID) === "Tutor") {
                        authorRef.child(tutorID).child("tutorProposals").child(key).set({
                            "tutorID": tutorID,
                            "tutorName": tutorName,
                            "amount": $scope.counterOffer || authorCurrentPost.amount,
                            ".priority": Firebase.ServerValue.TIMESTAMP,
                            "time": time,
                            "message": $scope.proposalMessage || "new Propsal",
                            "postID": authorCurrentPost.$id,
                            "postField": authorCurrentPost.field,
                            "assigned": false,
                            "viewed": false,
                        })
                        ngToast.create({
                            className: 'success',
                            content: 'you just propsed to do ' + authorCurrentPost.author
                        })
                    }

                    //function to check priorities. 
                    authorRef.child(authorID).child("notifications").on('child_added', function(snapshot) {
                        // console.log(snapshot.getPriority());
                    });
                })
        } else {
            console.log("I'm not a tutor or not authorised")
            ngToast.create({
                className: 'danger',
                content: 'you are not authorised to propose, or you have already proposed '
            })
        }
    }

    function DialogController($scope, $mdDialog, items) {
        $scope.items = items //these are the items inside the object obtained by $getRecord.
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
            console.log(answer)
        };

    }

}]);
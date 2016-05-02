myApp.controller('submissionPageCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','$stateParams','focus', '$location', '$anchorScroll', 'ngToast','$state','Upload',  function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, $stateParams, focus, $location, $anchorScroll, ngToast, $state, Upload) {

   	$scope.jobID = $stateParams.jobID.split("").reverse().join(""); //get the post ID
    $scope.authData = Auth.$getAuth();
    //Database refrences.
    $scope.postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID);
    $scope.messagesRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID + "/messages");
    $scope.submissionRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID + "/submission");
    $scope.studentPostsRef = new Firebase("https://homeworkmarket.firebaseio.com/users/"+ $scope.authData.uid + "/posts/" + $scope.jobID);
    
    //manage the DB snapshot and use firebase array or object to use data properly.
    $scope.postObject = $firebaseObject($scope.postsRef)
    $scope.messagesArray = $firebaseObject($scope.messagesRef)
    $scope.submissionObject = $firebaseObject($scope.submissionRef)
    $scope.userPostsObject = $firebaseObject($scope.studentPostsRef)
    
    //images for chat and side nav.
    $scope.studentImagePath = 'images/angular-avatars/avatar-03.png';
    $scope.tutorImagePath = 'images/angular-avatars/avatar-05.png';

    //variables to be used.
    $scope.imagesArray = [];
    var keyMessage
    var keySubmission
    $scope.submittedOrNot //to show if submitted or not to handle submission
    $scope.postStatus //to show status of post

    $scope.postObject.$loaded().then(function() {
        $scope.currentUser = Users.getProfile($scope.authData.uid);
        $scope.currentUserName = $scope.currentUser.name
        $scope.currentUserType = $scope.currentUser.type
        $scope.projectTitle = $scope.postObject.question
        if($scope.currentUser.type == "Student") {
            $scope.otherUser = Users.getProfile($scope.postObject.tutorID);
            $scope.otherUserName = $scope.otherUser.name;
            $scope.currentUserImage = true //true when student false when tutor
            $scope.isStudent = true
        } else {
            $scope.otherUser = Users.getProfile($scope.postObject.authorID);
            $scope.otherUserName = $scope.otherUser.name;
            $scope.otherUserType = $scope.otherUser.type;
            $scope.isTutor = true;
        }

        // upload later on form submit or something similar
        $scope.submit = function(sendMessageOrSubmit) {
            if ( $scope.form.files.$valid && $scope.files) {
                $scope.upload($scope.files, sendMessageOrSubmit);
            } else if (sendMessageOrSubmit) {
                $scope.sendMessage();
            } else {
                $scope.submitJob();
            }
        };

        $scope.upload = function(files, sendMessageOrSubmit) {
            if (files && files.length) {
                for (var i = 0; i < files.length; i++) {
                    Upload.upload({
                        url: "https://tutoring-images.s3.amazonaws.com/", //S3 upload url including bucket name
                        method: 'POST',
                        data: {
                            key: $scope.files[i].name, // the key to store the file on S3, could be file name or customized
                            AWSAccessKeyId: $scope.AWSAccessKeyId,
                            acl: $scope.acl, // sets the access to the uploaded file in the bucket: private, public-read, ...
                            policy: $scope.policy, // base64-encoded json policy (see article below)
                            signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
                            "Content-Type": $scope.files[i].type != '' ? $scope.files[i].type : 'application/octet-stream', // content type of the file (NotEmpty)
                            filename: $scope.files[i].name, // this is needed for Flash polyfill IE8-9
                            file: $scope.files[i]
                        }
                    }).then(function(resp) {
                        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        console.log('https://'+ 's3.amazonaws.com/'+ 'tutoring-images/'+ resp.config.data.file.name);
                        $scope.imageUrl = 'https://'+ 's3.amazonaws.com/'+ 'tutoring-images/'+ resp.config.data.file.name
                        $scope.imageName = resp.config.data.file.name
                        $scope.imageType = resp.config.data.file.type
                        $scope.imageSize = resp.config.data.file.size
                        $scope.imagesArray.push({
                                "imageUrl": $scope.imageUrl,
                                "imageName": $scope.imageName,
                                "imageType": $scope.imageType,
                                "imageSize": $scope.imageSize
                            })

                        console.log(resp);
                        //when attchments are uploaded send the message.
                        if($scope.imagesArray.length == files.length) {
                            if(sendMessageOrSubmit) {
                                $scope.sendMessage();
                            }
                            else {
                                $scope.submitJob();
                            }
                        }
                    }, function(resp) {
                        console.log('Error status: ' + resp.data);
                        ngToast.create({
                            className: 'danger',
                            content: 'You must upload and image, or your image was not uploaded successfully'
                        })
                    }, function(evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                }
            }
        }

        //send a message function.
    	$scope.sendMessage = function() {
            //check if message content is written otherwise throw error.
            if($scope.message) {
                $scope.messageContent = $scope.message
                var messageTime  = Firebase.ServerValue.TIMESTAMP
                $scope.postsRef.child("messages").push({
                    "messageContent": $scope.messageContent,
                    "authorName": $scope.currentUserName,
                    "time": messageTime,
                    "authorType": $scope.currentUserType
                })
                //get the key of the last uploaded messages to use for setting up the attachments
                $scope.postsRef.child("messages").orderByKey().limitToLast(1).on('child_added', function(snapshot) {
                    keyMessage = snapshot.key() //get a snapshot of the post's key
                });

                //check if the user uploaded an attachment to push it to the post DB.
                if($scope.imageUrl != null) {
                    $scope.postsRef.child("messages").child(keyMessage).child("attachments").push({
                        "imagesArray": $scope.imagesArray
                    })
                }
                $scope.message = null;
                $scope.files = null;
            } else {
                console.log("You must include a message")
                return
            }

    	}

        //manage the status of the post.
        $scope.postsRef.on("value", function(snapshot) {
            if(snapshot.val().status == "Accepted") {
                $scope.postStatus = $scope.postObject.status;
            } else {
                $scope.postStatus = $scope.postObject.status;
            }
        })

    })

    //handle messages retreival And attachments if needed to be used in the Ctrl without ng-repeat.
    $scope.messagesArray.$loaded().then(function() {
        $scope.messages = $scope.messagesArray
        $scope.messagesRef.once("value", function(allMessagesSnapshot) {
            allMessagesSnapshot.forEach(function(messageSnapshot) {
                if(messageSnapshot.hasChild("attachments")) {
                    messageSnapshot.child("attachments").forEach(function(attachmentSnapshot) {
                        $scope.attachmentsInMessage = attachmentSnapshot.child("imagesArray").val();
                    }) 
                }
                // Will be called with a messageSnapshot for each child under the /messages/ node
                $scope.messageTime = messageSnapshot.child("time").val();  // e.g. "6:50pm"
                $scope.messageContent = messageSnapshot.child("messageContent").val();  // e.g. "Hola la "
                $scope.authorName = messageSnapshot.child("authorName").val();  // e.g. "Abdul!"
                $scope.authorType = messageSnapshot.child("authorType").val();  // e.g. "Tutor!"
            });
        });

    })

    //submit Job by tutor: 
    //Note that it's now pushing to an array of objects. Think if you want to make it set instead of push,
    //which from now I think it would be better to switch.
    $scope.submitJob = function() {
        var comment = $scope.submissionComment;
        var submissionTitle = $scope.submissionTitle
        var submissionTime  = Firebase.ServerValue.TIMESTAMP;

        //check if message content is written otherwise throw error.
        if($scope.submissionComment && $scope.submissionTitle) {
            $scope.postsRef.child("submission").set({
                "submissionTitle": submissionTitle,
                "submissionComment": comment,
                "time": submissionTime,
                "tutorID": $scope.authData.uid,
                "attachments": '',
                "submittedOrNot": true
            })

            //updated the stauts of the post after the edit has been submitted.
            $scope.postsRef.update({
                "status": "Assgined"
            })

            //get the key of the last uploaded submission to use for setting up the attachments
            $scope.postsRef.child("submission").orderByKey().limitToLast(1).once('child_added', function(snapshot) {
                keySubmission = snapshot.key() //get a snapshot of the post's key
            });
            //check if the user uploaded an attachment to push it to the post DB.
            if($scope.imageUrl != null) {
                $scope.postsRef.child("submission").child("attachments").set({
                    "helpDocuments": $scope.imagesArray
                })
            }
            $scope.submissionComment = null;
            $scope.submissionTitle = null;
            $scope.files = null;
        } else {
            console.log("You must include a title and a comment")
            return
        }

    }

    //handle editing the submitted job and editining it.
    //this function reloads to sync data. Need to find another proper way of doing it.
    // $scope.submittedOrNot = $scope.submissionObject.submittedOrNot;
    $scope.edit = function() {
        $scope.postsRef.child("submission").update({
            "submittedOrNot": false,
        })
        return  
    }
    $scope.submittedOrNot = $scope.submissionObject.submittedOrNot; //set value to false for the above.

    //retreive a submission
    $scope.submittedTitle;
    $scope.submittedComment;
    $scope.submissionAttachments;
    $scope.submissionObject.$loaded().then(function() {
        if($scope.submissionObject != null) {
            $scope.submissionRef.on('value', function(snapshot) {
                //check if has attachments and get them
                if(snapshot.hasChild("attachments")) {
                    snapshot.child("attachments").forEach(function(attachmentSnapshot) {
                        $scope.submissionAttachments = attachmentSnapshot.val()
                    })
                }
                //check if there are comments and get the,
                if(snapshot.hasChild("submissionComment") && snapshot.hasChild("submissionTitle")) {
                    $scope.submittedComment = snapshot.val().submissionComment || "Not submission yet";
                    $scope.submittedTitle = snapshot.val().submissionTitle || "Not submission yet";
                    $scope.submittedOrNot = snapshot.val().submittedOrNot

                } else {
                    $scope.submittedComment =  "Not submission yet",
                    $scope.submittedTitle = "Not submission yet"
                }


            })
        } else {
            $scope.submittedComment =  "Not submission yet",
            $scope.submittedTitle = "Not submission yet"
        }
    })

    //check if job already accepted or not, to hide buttons.
    $scope.acceptedOrNot = false;
    $scope.userPostsObject.$loaded().then(function() {
        $scope.postsRef.on("value", function(snapshot) {
            if(snapshot.val().status == "Accepted") {
                $scope.acceptedOrNot = true;
            } else {
                $scope.acceptedOrNot = false;
            }
        })
    })

    //Student accepts submitted work by tutor
    $scope.acceptSubmission = function() {
        if($scope.currentUser.type == "Student") {
            $scope.postsRef.update({
                "status": "Accepted"
            })
            $scope.studentPostsRef.update({
                "status": "Accepted"
            })
        }
    };

    //Student rejects submitted work by tutor
    $scope.rejectSubmission = function() {

    }

    //remove file
    $scope.remove = function(item) { 
      var index = $scope.files.indexOf(item);
      $scope.files.splice(index, 1);     
    };

}])

.filter('reverse', function() {
  return function(messagesRef) {
    return messagesRef.slice().reverse();
  };
})


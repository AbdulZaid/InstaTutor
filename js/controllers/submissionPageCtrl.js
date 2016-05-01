myApp.controller('submissionPageCtrl', ['$scope','Auth','Users','Posts','$firebaseObject','$firebaseArray','$mdDialog','$stateParams','focus', '$location', '$anchorScroll', 'ngToast','$state','Upload',  function ($scope, Auth, Users, Posts, $firebaseObject, $firebaseArray, $mdDialog, $stateParams, focus, $location, $anchorScroll, ngToast, $state, Upload) {

   	$scope.jobID = $stateParams.jobID.split("").reverse().join("");
    $scope.postsRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID);
    $scope.messagesRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID + "/messages");
    $scope.submissionRef = new Firebase("https://homeworkmarket.firebaseio.com/messages/posts/"+ $scope.jobID + "/submission");
  	$scope.authData = Auth.$getAuth();
    $scope.postObject = $firebaseObject($scope.postsRef)
    $scope.messagesArray = $firebaseObject($scope.messagesRef)
    $scope.submissionObject = $firebaseObject($scope.submissionRef)
    $scope.studentImagePath = 'images/angular-avatars/avatar-03.png';
    $scope.tutorImagePath = 'images/angular-avatars/avatar-05.png';

    $scope.imagesArray = [];
    var key

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
            $scope.otherUser = Users.getProfile($scope.authData.uid);
            $scope.otherUserName = $scope.otherUser.name;
            $scope.otherUserType = $scope.otherUser.type;
            $scope.isTutor = true;
        }

        // upload later on form submit or something similar
        $scope.submit = function() {
            if ( $scope.form.files.$valid && $scope.files) {
                $scope.upload($scope.files);
            } else {
                $scope.sendMessage();
            }
        };

        $scope.upload = function(files) {
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

                        if($scope.imagesArray.length == files.length) {
                            $scope.sendMessage();
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
                key = snapshot.key() //get a snapshot of the post's key
            });

            //check if the user uploaded an attachment to push it to the post DB.
            if($scope.imageUrl != null) {
                $scope.postsRef.child("messages").child(key).child("attachments").push({
                    "imagesArray": $scope.imagesArray
                })
            }
    		$scope.message = null
    	}

    })
    //handle messages retreival 
    $scope.messagesArray.$loaded().then(function() {
        $scope.messages = $scope.messagesArray
        $scope.messagesRef.once("value", function(allMessagesSnapshot) {
            allMessagesSnapshot.forEach(function(messageSnapshot) {
                // Will be called with a messageSnapshot for each child under the /messages/ node
                $scope.messageTime = messageSnapshot.child("time").val();  // e.g. "6:50pm"
                $scope.messageContent = messageSnapshot.child("messageContent").val();  // e.g. "Hola la "
                $scope.authorName = messageSnapshot.child("authorName").val();  // e.g. "Abdul!"
                $scope.authorType = messageSnapshot.child("authorType").val();  // e.g. "Tutor!"
            });
        });

    })
    //submit Job by tutor
    $scope.submitJob = function() {
        this.comment = $scope.submissionComment;
        var submissionTime  = Firebase.ServerValue.TIMESTAMP;
        $scope.postsRef.child("submission").push({
            "submissionComment": this.comment,
            "time": submissionTime,
            "tutorID": $scope.authData.uid,
            "attachments": ''
        })
    }

    //retreive a submission
    $scope.submissionComment
    $scope.submissionObject.$loaded().then(function() {
        $scope.submissionRef.on('value', function(allSubmissionsSnapshot) {
            allSubmissionsSnapshot.forEach(function(snapshot) {
                $scope.submissionComment = snapshot.val().submissionComment
            })

        })
        console.log($scope.submissionComment)
    })



    //remove file
    $scope.remove = function(item) { 
      var index = $scope.files.indexOf(item);
      $scope.files.splice(index, 1);     
    }

}])

.filter('reverse', function() {
  return function(messagesRef) {
    return messagesRef.slice().reverse();
  };
})


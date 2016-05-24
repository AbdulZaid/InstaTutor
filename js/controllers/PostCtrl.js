myApp.controller('PostCtrl', ['$scope', 'Auth', 'Users', 'Toasts', '$firebaseObject', '$firebaseArray', 'ngToast', 'Upload', 
  function($scope, Auth, Users, Toasts, $firebaseObject, $firebaseArray, ngToast, Upload) {
    var messageRef = new Firebase("https://homeworkmarket.firebaseio.com/messages");
    var userRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
    $scope.authData = Auth.$getAuth();
    var postsRef = messageRef.child("posts");
    var profileObject = $firebaseObject(messageRef);
    var authorName
    var key //new post's key

    $scope.tags = [];
    $scope.imagesArray = [];
      
      // colapse of question panel
      $scope.questionDisplayed = true;
      $scope.showQuestion = function()
      {
          $scope.questionDisplayed = true;
      }
      $scope.hideQuestion = function()
      {
          $scope.questionDisplayed = false;
      }
    profileObject.$loaded( //to solve the problem with loading data before using it.
        function() {
            authorName = Users.getName($scope.authData.uid)
        });



    // upload later on form submit or something similar
    $scope.submit = function() {
        if ( $scope.form.files.$valid && $scope.files) {
            $scope.upload($scope.files);
        } else {
            $scope.postMessage();
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
                    console.log('https://'+ 's3.amazonaws.com/'+ 'tutoring-images/uploads/'+ resp.config.data.file.name);
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
                        $scope.postMessage();
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




    // COLLAPSE =====================
    $scope.isCollapsed = false;

    $scope.dueDate = new Date();
    $scope.minDate = new Date(
        $scope.dueDate.getFullYear(),
        $scope.dueDate.getMonth(),
        $scope.dueDate.getDate()
    );

    // Do an if condition to see if the user is a student or not.
    $scope.postMessage = function() {
        var time = Firebase.ServerValue.TIMESTAMP;
        var dueDate
        if($scope.dueDate  && $scope.authData.uid && $scope.question && $scope.textModel && $scope.field && $scope.moneyAmount
            != null) {
            dueDate = $scope.dueDate.toJSON()
        } else {
            dueDate = null
            alert("fix required data please")
            console.log("fix required data please")
            return
        }
        if (Users.getUserType($scope.authData.uid) === "Student") {

            postsRef.push({
                    "authorID": $scope.authData.uid,
                    "author": authorName,
                    "question": $scope.question,
                    "content": $scope.textModel,
                    "field": $scope.field,
                    "dueDate": dueDate,
                    "amount": $scope.moneyAmount,
                    "assigned": false,
                    "assignedTo": false,
                    "time": time,
                    "tags": $scope.tags,
                    "status": 'open',
                    // "images": $scope.imageUrl || ""
                },
                function(error) {
                    if (error) {
                        alert("Data could not be saved." + error);
                    } else {
                        Toasts.newPostToast();
                        //clear fields
                        $scope.question = '';
                        $scope.textModel = '';
                        $scope.field = '';
                        $scope.moneyAmount = null;
                    }
                })
            postsRef.orderByKey().limitToLast(1).on('child_added', function(snapshot) {
                key = snapshot.key() //get a snapshot of the post's key
            });
            userRef.child($scope.authData.uid).child("posts").child(key).set({
                    "key": key,
                    "authorID": $scope.authData.uid,
                    "author": authorName,
                    "question": $scope.question,
                    "content": $scope.textModel,
                    "field": $scope.field,
                    "dueDate": dueDate,
                    "amount": $scope.moneyAmount,
                    "assigned": false,
                    "assignedTo": false,
                    "time": time,
                    "tags": $scope.tags,
                    "status": 'open',
                    // "images": $scope.imageUrl || ""
                },
                function(error) {
                    if (error) {
                        alert("Data could not be saved." + error);
                    } else {
                        Toasts.newPostToast();
                    }
                }) //add new post to user's posts.
            //check if the user uploaded an image to push it to the post DB.
            if($scope.imageUrl != null) {
                postsRef.child(key).child("images").push({
                    // "imageUrl": $scope.imageUrl,
                    // "imageName":  $scope.imageName,
                    // "imageType": $scope.imageType,
                    // "imageSize": $scope.imageSize,
                    "imagesArray": $scope.imagesArray
                }) //add new post to user's posts.
            }
        } else {
            Toasts.newPostToastUnauth();
        }
    };

    $scope.fields = [{
        category: 'Science',
        name: 'Math'
    }, {
        category: 'Science',
        name: 'CMSI'
    }, {
        category: 'Science',
        name: 'Biology'
    }, {
        category: 'Science',
        name: 'Physics'
    }, {
        category: 'Engineering',
        name: 'Electrical Engineering'
    }, {
        category: 'Engineering',
        name: 'Mechanical Engineering'
    }, {
        category: 'Engineering',
        name: 'Software Engineering'
    }, {
        category: 'Engineering',
        name: 'Industrial Engineering'
    }];

    //remove file
    $scope.remove = function(item) { 
      var index = $scope.files.indexOf(item);
      $scope.files.splice(index, 1);     
    };
}])

.config(function($mdDateLocaleProvider) {
        $mdDateLocaleProvider.formatDate = function(date) {
            return moment(date).format('YYYY-MM-DD');
        };
        // $mdDateLocaleProvider.parseDate = function(dateString) {
        //   var m = moment(dateString, 'DD/MM/YYYY', true);
        //   return m.isValid() ? m.toDate() : new Date(NaN);
        // };
    })
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('blue')
            // .dark();

    });
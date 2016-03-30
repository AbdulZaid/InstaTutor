myApp.controller('PostCtrl', ['$scope','Auth','Users','$firebaseObject','$firebaseArray','ngToast','Upload', function ($scope, Auth, Users, $firebaseObject, $firebaseArray, ngToast, Upload ) {
  var messageRef = new Firebase("https://homeworkmarket.firebaseio.com/messages");
  var userRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  $scope.authData = Auth.$getAuth();
  var postsRef = messageRef.child("posts");
  var profileObject = $firebaseObject(messageRef);
  var authorName
  var key //new post's key

  $scope.tags = [];

  profileObject.$loaded( //to solve the problem with loading data before using it.
    function() {
      authorName = Users.getName($scope.authData.uid)
  });

  // COLLAPSE =====================
  $scope.isCollapsed = false; 

    $scope.myDate = new Date();
    $scope.minDate = new Date(
        $scope.myDate.getFullYear(),
        $scope.myDate.getDay() - 1,
        $scope.myDate.getDate());

  // Do an if condition to see if the user is a student or not.
  $scope.postMessage = function() {
    var time = Firebase.ServerValue.TIMESTAMP
    if(Users.getUserType($scope.authData.uid) === "Student") {

      postsRef.push({
          "authorID": $scope.authData.uid,
          "author": authorName,
          "question": $scope.question,
          "content": $scope.textModel,
          "field": $scope.field,
          "dueDate": $scope.dueDate.toJSON(),
          "amount": $scope.moneyAmount,
          "assigned": false,
          "assignedTo": false,
          "time": time,
          "tags": $scope.tags
      },
      function(error) {
        if (error) {
          alert("Data could not be saved." + error);
        } else {
          ngToast.create({
            className: 'success',
            content: 'you just posted a new job successfully' 
          })  
        }
      })
      postsRef.orderByKey().limitToLast(1).on('child_added', function(snapshot) {
        key = snapshot.key()  //get a snapshot of the post's key
      });
      userRef.child($scope.authData.uid).child("posts").child(key).set({  
        "key": key,
        "authorID": $scope.authData.uid,
        "author": authorName,
        "question": $scope.question,
        "content": $scope.textModel,
        "field": $scope.field,
        "dueDate": $scope.dueDate.toJSON(),
        "amount": $scope.moneyAmount,
        "assigned": false,
        "assignedTo": false,
        "time": time,
        "tags": $scope.tags
      }) //add new post to user's posts.
    } else {
      alert("you not a student.")
      ngToast.create({
        className: 'danger',
        content: 'you are not authorised to post a job. '
      })  
    }
  };

  $scope.fields = [
    { category: 'Science', name: 'Math' },
    { category: 'Science', name: 'CMSI' },
    { category: 'Science', name: 'Biology' },
    { category: 'Science', name: 'Physics' },
    { category: 'Engineering', name: 'Electrical Engineering' },
    { category: 'Engineering', name: 'Mechanical Engineering' },
    { category: 'Engineering', name: 'Software Engineering' },
    { category: 'Engineering', name: 'Industrial Engineering' }
  ];
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



myApp.controller('PostCtrl', ['$scope','Auth','Users','$firebaseObject','$firebaseArray', function ($scope, Auth, Users, $firebaseObject, $firebaseArray ) {
  var messageRef = new Firebase("https://homeworkmarket.firebaseio.com/messages");
  var userRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  $scope.authData = Auth.$getAuth();
  var postsRef = messageRef.child("posts");
  var profileObject = $firebaseObject(messageRef);
  var authorName
  var key //new post's key


  profileObject.$loaded( //to solve the problem with loading data before using it.
    function() {
      authorName = Users.getName($scope.authData.uid)
  });

  // COLLAPSE =====================
  $scope.isCollapsed = false; 

  $scope.postMessage = function() {
    postsRef.push({
        "authorID": $scope.authData.uid,
        "author": authorName,
        "question": $scope.question,
        "content": $scope.textModel,
        "field": $scope.field,
        "dueDate": $scope.dueDate.toJSON(),
        "amount": $scope.moneyAmount
    },
    function(error) {
      if (error) {
        alert("Data could not be saved." + error);
      } else {
        alert("Data saved successfully.");
      }
    })
    postsRef.orderByKey().limitToLast(1).on('child_added', function(snapshot) {
      key = snapshot.key()  //get a snapshot of the post's key
    });
    userRef.child($scope.authData.uid).child("posts").push({  
      "key": key,
      "authorID": $scope.authData.uid,
      "author": authorName,
      "question": $scope.question,
      "content": $scope.textModel,
      "field": $scope.field,
      "dueDate": $scope.dueDate.toJSON(),
      "amount": $scope.moneyAmount
    }) //add new post to user's posts.
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



myApp.controller('PostCtrl', ['$scope','Auth','Users','$firebaseArray', function ($scope, Auth, Users, $firebaseArray ) {
  var messageRef = new Firebase("https://homeworkmarket.firebaseio.com/messages");
  $scope.authData = Auth.$getAuth();
  var postsRef = messageRef.child("posts");
  var authorName = Users.getName($scope.authData.uid)
  // COLLAPSE =====================
  $scope.isCollapsed = false; 

  $scope.postMessage = function() {
    postsRef.push().set({
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
    });
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



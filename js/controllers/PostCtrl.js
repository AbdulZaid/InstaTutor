myApp.controller('PostCtrl', ['$scope','Auth','$firebaseArray', function ($scope, Auth, $firebaseArray, $location) {
  var ref = new Firebase("https://homeworkmarket.firebaseio.com/messages");
  var authData = Auth.$getAuth();

  var postsRef = ref.child("posts");

  // COLLAPSE =====================
  $scope.isCollapsed = false; 
  // var date = new Date();

  $scope.postMessage = function() {
    postsRef.push().set({
        "authorID": authData.uid,
        "author": $scope.author,
        "title": $scope.title,
        "content": $scope.textModel,
        "field": $scope.field,
        "dueDate": $scope.dueDate.toJSON()
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
});



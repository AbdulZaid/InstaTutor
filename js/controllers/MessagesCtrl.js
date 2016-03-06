myApp.controller('MessagesCtrl', ['$scope','Auth','Users','$firebaseObject','$firebaseArray', function ($scope, Auth, Users, $firebaseObject, $firebaseArray ) {
    
  var authorRef = new Firebase("https://homeworkmarket.firebaseio.com/users");
  $scope.authData = Auth.$getAuth()

  $scope.messages = $firebaseArray(authorRef.child($scope.authData.uid).child("notifications"))


    $scope.imagePath = 'images/abdul_img.png';
    // $scope.messages = $scope.proposal
    // console.log($scope.messages.tutorName + "walla")
    // $scope.messages = [
    //   {
    //     face : imagePath,
    //     what: 'Brunch this weekend?',
    //     who: 'Min Li Chan',
    //     when: '3:08PM',
    //     notes: " I'll be in your neighborhood doing errands"
    //   }
    //]
}])

.filter('reverse', function() {
  return function(messages) {
    return messages.slice().reverse();
  };
})

.config(function($mdThemingProvider) {

    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('altTheme')
      .primaryPalette('blue', {
        'default': '400', // by default use shade 400 from the pink palette for primary intentions
        'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
        'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
        'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
      })
      .accentPalette('green');

  });
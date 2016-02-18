myApp.controller('UserAssignmentCtrl',['$scope', '$mdDialog', function($scope, $mdDialog) {

  $scope.people = [
    { name: 'Janet Perkins', question: 'How the hell is this?', icon: 'message', img: 'images/abdul_img.png', newMessage: true },
    { name: 'Mary Johnson', question:'How the hell is this?', icon: 'description', img: 'images/abdul_img.png', newMessage: false },
    { name: 'Peter Carlsson', question:'How the hell is this?', icon: 'assignment', img: 'images/abdul_img.png', newMessage: false }
  ];
  $scope.goToPerson = function(person, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .textContent('Inspect ' + person)
        .ariaLabel('Person inspect demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
  $scope.doSecondaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .textContent('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
}]);
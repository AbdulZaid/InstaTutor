myApp.factory('Toasts', ['$firebaseAuth','$firebaseObject','$firebaseArray','$mdToast', function ($firebaseAuth, $firebaseObject, $firebaseArray, $mdToast) {

    var navIsOpen = true;
    var link = "navIsOpen"

	var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    var toastPosition = angular.extend({},last);
    var getToastPosition = function() {
        sanitizePosition();
        return Object.keys(toastPosition)
            .filter(function(pos) { return toastPosition[pos]; })
            .join(' ');
    };
    function sanitizePosition() {
        var current = toastPosition;
        if ( current.bottom && last.top ) current.top = false;
        if ( current.top && last.bottom ) current.bottom = false;
        if ( current.right && last.left ) current.left = false;
        if ( current.left && last.right ) current.right = false;
        last = angular.extend({},current);
    }

	var Toasts = {

	    showCustomToast: function(value) {

	        $mdToast.show({
	          hideDelay   : 3000,
	          position    : 'top right',
	          controller  : 'ToastCtrl',
	          // templateUrl : 'views/toast-template.html',
	          template: '<md-toast >'+
						'<span class="md-toast-text" flex >'+ 'you got a new proposal' + '</span>'+
						'<md-button class="md-highlight" ng-click="openMoreInfo($event,'+ link +')">'+
						  'More info'+
						'</md-button>'+
						'<md-button ng-click="closeToast()">'+
						  'Close'+
						'</md-button>'+
						'</md-toast>',
	          parent: angular.element(document.body),
	          locals      : {three: 3}
	        });
	    },

	    newPostToast : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('thanks for your post')
	            .position(getToastPosition() )
	            .hideDelay(3000)
	        );
	    },

	    deletePostSuccess : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('You just deleted your post successfully' )
	            .position(getToastPosition())
	            .hideDelay(3000)
	            .theme('$mdThemingProvider')
	        );
	    },


	}
	return  Toasts;
}])
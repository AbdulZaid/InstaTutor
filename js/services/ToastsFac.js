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
	            .content('Thanks for your post, please wait for proposals')
	            .position(getToastPosition() )
	            .hideDelay(4000)
	        );
	    },

	    newPostToastUnauth : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('You are not authorised to post a job.')
	            .position(getToastPosition() )
	            .hideDelay(4000)
	        );
	    },
	    
	    newProposalToastSuccess : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('Thanks for your proposal')
	            .position(getToastPosition() )
	            .hideDelay(3000)
	        );
	    },

	    newProposalToastFailure : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('You are not authorised to propose, or you have already proposed')
	            .position(getToastPosition() )
	            .hideDelay(4000)
	        );
	    },

	    newStudentProposalAcceptedToast : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('You just accepted a proposal, go and talk to them')
	            .position(getToastPosition() )
	            .hideDelay(3000)
	        );
	    },

	    newTutorProposalAcceptedToast : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('A student just accepted your proposal')
	            .position(getToastPosition() )
	            .hideDelay(3000)
	        );
	    },

	    newProposalRejectedToast : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('You just rejected a proposal successfully')
	            .position(getToastPosition() )
	            .hideDelay(3000)
	        );
	    },

	    deleteProposalSuccess: function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('Hey you, you just deleted your proposal successfully')
	            .position(getToastPosition() )
	            .hideDelay(3000)
	        );
	    },

	    deleteProposalFailure: function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('You decided not to delete your proposal')
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

	    deletePostFailure : function() {
	        $mdToast.show(
	            $mdToast.simple()
	            .content('You decided not to remove the post Yay' )
	            .position(getToastPosition())
	            .hideDelay(3000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    dealWithTutor : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('hey you, you just agreed on the deal!' )
	            .position(getToastPosition())
	            .hideDelay(3000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    imageHandler : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('You must upload and image, or your image was not uploaded successfully' )
	            .position(getToastPosition())
	            .hideDelay(3000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    bookmark : function () {
	    	$mdToast.show(
	    		$mdToast.simple()
	    		.content('This post was added to your bookmarks')
	    		.position(getToastPosition())
	            .hideDelay(3000)
	            .theme('$mdThemingProvider')
	    	);
	    },


	    jobSubmissionSuccess : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('Your work has been submitted successfully. Wait for student response!')
	            .position(getToastPosition())
	            .hideDelay(4500)
	            .theme('$mdThemingProvider')
	        );
	    },

	    jobSubmissionFaliure : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('unfortunately your work was not posted successfully, Check Internet connection!')
	            .position(getToastPosition())
	            .hideDelay(4000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    jobSubmissionFields : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('Please fill in the required fields.')
	            .position(getToastPosition())
	            .hideDelay(4000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    jobAcceptedSuccess : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('Thank you for your acceptance! Please go and review the tutor.')
	            .position(getToastPosition())
	            .hideDelay(5000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    jobAcceptedFaliure : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('Please check your connection')
	            .position(getToastPosition())
	            .hideDelay(4000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    jobRejectedSuccess : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('You have rejected the submission. Please allow tutors to respond or resubmit.')
	            .position(getToastPosition())
	            .hideDelay(5500)
	            .theme('$mdThemingProvider')
	        );
	    },

	    jobRejectedFaliure : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('Please check your connection')
	            .position(getToastPosition())
	            .hideDelay(4000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    successfulReview : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('Thank you! your review was posted successfully' )
	            .position(getToastPosition())
	            .hideDelay(3000)
	            .theme('$mdThemingProvider')
	        );
	    },

	    unSuccessfulReview : function() {
	    	$mdToast.show(
	            $mdToast.simple()
	            .content('unfortunately your review was not posted successfully')
	            .position(getToastPosition())
	            .hideDelay(3000)
	            .theme('$mdThemingProvider')
	        );
	    },
	}
	return  Toasts;
}])
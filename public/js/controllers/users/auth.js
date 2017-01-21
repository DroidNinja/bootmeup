angular.module('mean.auth').controller('socialAuth', ['$scope', 'Global','$state','$window' ,'TwitterAuth', 'GoogleAuth',
    function ($scope, Global, $state, $window, TwitterAuth, GoogleAuth) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Articles",
        "state": "articles"
    }, {
        "title": "Create New Article",
        "state": "createArticle"
    }];

    $scope.isCollapsed = false;

    $scope.fbAuth = function(){
        // implement your Facebook login strategy here.
        console.log('fb');
        $window.location.href = "/auth/facebook";
    };
    $scope.googleAuth = function(){
        // implement your Google login strategy here.
        $window.location.href = "/auth/google";
    };


}]);
angular.module('mean.auth').controller('signUp', ['$scope', '$window', 'Global','$state', 'SignUp', function ($scope, $window, Global, $state, SignUp) {
    $scope.global = Global;


    $scope.signUp = function(user) {

        var signUp = new SignUp({
            name: user.name,
            email: user.email,
            password : user.password
        });

        signUp.$save(function(response) {
            if(response.status){
                $window.location.href = '/';
            }
            else
            {
                console.log(response.message);
            }
        });
    };


}]);
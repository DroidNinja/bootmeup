
angular.module('mean.auth').service("TwitterAuth", ['$resource', function($resource) {
    return $resource('/auth/twitter');
}]);
angular.module('mean.auth').service("GoogleAuth", ['$resource', function($resource) {
    return $resource('/auth/google');
}]);
angular.module('mean.auth').service("SignOut", ['$resource', function($resource) {
    return $resource('/signout');
}]);
angular.module('mean.auth').service("LogIn", ['$resource', function($resource) {
    return $resource('/users/session');
}]);
angular.module('mean.auth').service("UserInfo", ['$resource', function($resource) {
    return $resource('/users/me');
}]);
angular.module('mean.auth').service("SignUp", ['$resource', function($resource) {
    return $resource('/users');
}]);
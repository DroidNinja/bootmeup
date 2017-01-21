angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === "#_=_") {
        window.location.hash = "#!";
    }
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $http({
        method: 'GET',
        url: '/users/me'
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available

        window.user = response.data;
        console.log('/users/me success');
        //Then init the app
        angular.bootstrap(document, ['mean']);
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        window.user = null;
        console.log('/users/me error');
        //Then init the app
        angular.bootstrap(document, ['mean']);

    });

});

angular.module('homeStart',['ui.router','home','login'])
    .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            template: '<home-page></home-page>'
        })
        .state('login', {
            url: '/login',
            template: '<login-page></login-page>'
        })

})

angular.module('manageApp')
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/start');
        $stateProvider
            .state('start', {
                url: '/start',
                template: '<all-activity-page></all-activity-page>'
            })
            .state('addActivity', {
                url: '/addActivity',
                template: '<add-activity-page></add-activity-page>'
            })
            .state('expert', {
                url: '/expert',
                template: '<expert-page></expert-page>'
            })
            .state('people', {
                url: '/people',
                template: '<people-page></people-page>'
            })
            .state('number', {
                url: '/number',
                template: '<number-page></number-page>'
            })
            .state('edit',{
                url:'/edit/:activityid',
                template:'<edit-page></edit-page>'
            })
            .state('addExpert',{
                url:'/addExpert',
                template:'<add-expert-page></add-expert-page>'
            })

    })

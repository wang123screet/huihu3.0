
angular.module('manageApp')

.controller('ctrlreg',function ($scope,$location) {

        $scope.$on("$viewContentLoaded",function(){ //当新的URL加载完成后，通知myCtrl


            if($location.path().indexOf("edit")==1){
                $scope.state="/edit";
            }else {
                $scope.state=$location.path();
            }

        });
        $scope.$on("$routeChangeStart",function(event,next,current){ //当URL发生改变时，通知myCtrl


        });

        //退出登录
        $scope.logout=function () {
            localStorage.removeItem('isLogin');

            window.location.href='./../index.html';
        }
})
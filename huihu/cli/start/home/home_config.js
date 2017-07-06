
angular.module('home',[])

    .directive('homePage',function () {
        return{
            restrict:"ACE",
            replace:true,
            templateUrl:"./cli/start/home/home_templates.html",
            controller:['$scope','$http','$rootScope','$anchorScroll','$location',function ($scope,$http,$rootScope,$anchorScroll,$location){

                /* 锚点连接 关于我们*/
                $scope.gotous=function ($event) {
                    $("#usLink").addClass("nav_active");
                    $("#homeLink").removeClass("nav_active")
                    $event.preventDefault();
                    $location.hash('about_us');
                    $anchorScroll();
                }
                $scope.gotohome=function ($event) {
                    $("#usLink").removeClass("nav_active");
                    $("#homeLink").addClass("nav_active")
                }


                //获取cookies
                $scope.isLogin=localStorage.getItem('isLogin');



                $scope.activityShow=[];
                $http.get('http://115.159.100.155/api/allactivity')
                    .then(function (response) {
                        $scope.allActivity = response.data.data;

                        //数据库中获取的时间进行转换
                        for(var i=0;i<$scope.allActivity.length;i++){
                            $scope.date=new Date($scope.allActivity[i].data);
                            $scope.deadline=new Date($scope.allActivity[i].deadline);

                            $scope.allActivity[i].data=$scope.date.toLocaleString( )
                            $scope.allActivity[i].deadline=$scope.date.toLocaleString( )

                        }

                        //获取到isdisplay==1的活动
                        for(var i=0;i<$scope.allActivity.length;i++){
                            if($scope.allActivity[i].isdisplay==1){
                                $scope.activityShow.push($scope.allActivity[i]) ;
                            }
                        }
                        console.log($scope.activityShow[0]);
                        //设置轮播显示的图片
                        $('#url1').attr('src',$scope.activityShow[0].logo)
                        $('#url2').attr('src',$scope.activityShow[1].logo)
                        $('#url3').attr('src',$scope.activityShow[2].logo)

                    })




                $(
                    function () {

                        //自动4秒播放
                        $('#myCarousel').carousel(
                            {
                                interval:4000,
                            }
                        );
                        $('.carousel-control').css('line-height',$('.carousel-inner img').height()+'px');
                        $(window).resize(
                            function () {
                                var $height=$('.carousel-inner img').eq(0).height()||
                                    $('.carousel-inner img').eq(1).height()||
                                    $('.carousel-inner img').eq(2).height() ;


                                $('.carousel-control').css('line-height',$height+'px');
                            }
                        )

                    }
                );
            }]
        }
    })
    .run(['$anchorScroll', function($anchorScroll) {
    $anchorScroll.yOffset = 66;
    // 默认向下便宜50px
    // 在此处配置偏移量
}])
    .filter('substring',function () {

       return function (str) {
           if(str.length>=200){
                return str.substring(0,200)+"...";
            }
            return str;

        }
        
    })
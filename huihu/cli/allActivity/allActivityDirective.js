
angular.module('allActivity')
    .directive('allActivityPage',function () {
        return{
            restrict:'ACE',
            replace:true,
            templateUrl:'./allActivity/allActivityTemplate.html',
            controller:['$scope','$http','$state','$timeout','$rootScope','qiniu',function ($scope,$http,$state,$timeout,$rootScope,qiniu){
                console.log(22222222222222222222222);
                $("#view_show").hide();
                $("#view_hide").show();

                $scope.activityf=[];//用于存放显示的活动id
                // 活动展示的时候只能选择3个
                $scope.aa=function ($index,id,show) {
                    //找到活动的下标
                    for(var m=0;m< $scope.allActivity.length;m++){
                        if(id==$scope.allActivity[m].activityid){
                            break;
                        }
                    }

                    //活动是否已经被显示
                    for(var i=0;i<$scope.activityf.length;i++){
                        if(id==$scope.activityf[i]){
                            $scope.allActivity[m].isdisplay=0;
                            $scope.activityf.splice(i,1);//从数组中移除

                            return;
                        }
                    }

                    if($scope.activityf.length==3){
                        $scope.allActivity[m].isdisplay=0;

                        $("#haha").click();
                        $("#show").html("只能选择三个活动进行显示");

                    }else {
                        $scope.activityf.push(id);
                    }
                }
                //去显示
                $scope.showactivity=function () {

                    var data={one:$scope.activityf[0],two:$scope.activityf[1],three:$scope.activityf[2]}

                    if($scope.activityf.length<3){
                        $("#haha").click();
                        $("#show").html("请选择三个活动");
                        return;

                    }


                    $http({
                        url:qiniu._url+'carouselShow',
                        method:'POST',
                        data:data,
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        transformRequest:function (obj) {
                            var str = [];
                            for(var p in obj){
                                str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
                            }
                            return str.join("&");
                        },
                        responseType:'json'

                    }).then(function success(response) {
                        if(response.data.code==1){

                            $("#haha").click();
                            $("#show").html("显示成功,可前往首页查看");
                        }



                    })



                }

                //获取所有活动
                $http.get(qiniu._url+'allactivity')
                    .then(function (response) {

                        $rootScope.allActivity=response.data.data;
                        $("#view_show").show();
                        $("#view_hide").hide();

                        //获取isdisplay==1的活动
                        for(var i=0;i<$scope.allActivity.length;i++){
                            if($scope.allActivity[i].isdisplay==1){
                                    $scope.activityf.push($scope.allActivity[i].activityid);
                            }
                        }

                        //数据库中获取的时间进行转换
                       for(var i=0;i<$scope.allActivity.length;i++){
                           $scope.date=new Date($scope.allActivity[i].data);

                           $scope.allActivity[i].data=$scope.date.toLocaleString( )

                        }



                        //分页
                        var pages=8;
                        $scope.curpage=0;//默认第一页下标为0
                        $scope.itemx=[];//存放分页的

                        for(var i=0,len=$scope.allActivity.length;i<len;i+=pages){
                            $scope.itemx.push($scope.allActivity.slice(i,i+pages));
                        }
                        $scope.totalPage=Math.ceil(($scope.allActivity).length/pages)//总页数从1开始
                        if($scope.curpage>0&&$scope.curpage< $scope.totalPage){

                            $scope.pages = [

                                $scope.curpage - 1,
                                $scope.curpage,
                                $scope.curpage + 1

                            ];

                        }else if($scope.curpage==0&& $scope.totalPage>1){
                            $scope.pages = [
                                $scope.curpage,

                                $scope.curpage + 1]

                        }else if ($scope.curpage ==  $scope.totalPage ) {

                            $scope.pages = [

                                $scope.curpage - 1,

                                $scope.curpage

                            ];
                        }

                    })
                //编辑活动
                $scope.edit=function (activity) {

                    var activityid=activity.activityid
                    $state.go('edit',{activityid:activityid});

                }
                //删除活动
                $scope.deleteActivity=function (activityid) {
                    $("#view_show").hide();
                    $("#view_hide").show();
                    $.confirm({
                        'title'		: '删除活动',
                        'message'	: '是否删除该活动？？',
                        'buttons'	: {
                            'Yes'	: {
                                'class'	: 'blue',
                                'action': function(){
                                    var data={activityid:activityid};
                                    console.log(activityid);
                                    $http({
                                        url:qiniu._url+'deleteActivity',
                                        method:'POST',
                                        data:data,
                                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                                        transformRequest:function (obj) {
                                            var str = [];
                                            for(var p in obj){
                                                str.push(encodeURIComponent(p)+"="+encodeURIComponent(obj[p]));
                                            }
                                            return str.join("&");
                                        },
                                        responseType:'json'

                                    }).then(function success(response) {
                                        $("#view_show").show();
                                        $("#view_hide").hide();
                                        $state.go('start',{},{reload:true});


                                    },function error(response) {
                                        console.log('delete fail');
                                    })

                                 /* $timeout(function(){
                                        $('#myModal').hide();
                                    },1500);   //该函数延迟2秒执行*/
                                }
                            },
                            'No'	: {
                                'class'	: 'gray',
                                'action': function(){
                                    $("#view_show").show();
                                    $("#view_hide").hide();
                                }
                            }
                        }
                    });

                }

            }]
        }
    })


angular.module("people")
    .directive("peoplePage",function () {
        return{
            restrict:"ACE",
            replace:true,
            // template:"<h3>template普通用户</h3>"
            templateUrl:'./people/people_template.html',
            controller:['$scope','$http','$timeout','$state','qiniu',function ($scope,$http,$timeout,$state,qiniu){

                $("#view_show").hide();
                $("#view_hide").show();

                //获取到的普通用户信息
                var data={type:0}
                $http({
                    url:qiniu._url+'user',
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

                }).then(function (response) {
                    if(response.data.code==1){
                        $scope.user=response.data.data;

                        $("#view_show").show();
                        $("#view_hide").hide();


                        var pages=8;
                        $scope.curpage=0;//默认第一页下标为0
                        $scope.itemx=[];//存放分页的

                        for(var i=0,len=$scope.user.length;i<len;i+=pages){
                            $scope.itemx.push($scope.user.slice(i,i+pages));
                        }
                        $scope.totalPage=Math.ceil(($scope.user).length/pages)//总页数从1开始
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



                    }
                })


                //删除普通用户
                $scope.deletePeople=function (phonenum) {
                    var data={type:0,phonenum:phonenum};
                    $.confirm({
                        'title': '删除普通用户',
                        'message': '是否删除该用户？？',
                        'buttons': {
                            'Yes': {
                                'class': 'blue',
                                'action': function () {

                                    $http({
                                        url:qiniu._url+'deleteUser',
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

                                    }).then(function (response) {

                                        if(response.data.code==1){
                                            // $scope.user=response.data.data;
                                            // console.log('delete success');

                                            $state.go('people',{},{reload:true});

                                            $('#myModal').show();
                                             $('#caption').html("删 除 成 功！！！！！");

                                        }else if(response.data.code==2){
                                            $('#myModal').show();
                                            $('#caption').html("删 除 成 功 需 刷 新 浏 览 器！！！！！");
                                        }else {
                                            $('#myModal').show();
                                            $('#caption').html("删 除 失 败！！！！！");

                                        }

                                    })
                                    $timeout(function(){
                                        $('#myModal').hide();
                                    },1500);   //该函数延迟2秒执行

                                }
                            },
                            'No': {
                                'class': 'gray',
                                'action': function () {
                                }	// Nothing to do in this case. You can as well omit the action property.
                            }
                        }
                    })

                }

                $scope.a=function (phonenum) {
                    $scope.q=phonenum;
                }
                //设为专家添加信息==提交
                $scope.save=function () {
                var data={
                    phonenum:$scope.q,
                    position:$("#position").val(),
                    extime:$("#extime").val(),
                    name:$("#name").val(),
                    works:$("#works").val(),
                    description:$("#description").val()
                }
                    $http({
                        url:qiniu._url+'changeExpert',
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

                    }).then(function (response) {
                       if(response.data.code==1){
                            $scope.user=response.data.data;
                            console.log($scope.user);

                           $state.go('people',{},{reload:true});

                           $("#btn_cl").click();
                           $("#Modal").click();

                            $('#myModal').show();
                            $('#caption').html("设 置 成 功！！！！！");

                        }

                        console.log("exchange");
                    })
                    $timeout(function(){
                        $('#myModal').hide();
                    },1500);   //该函数延迟2秒执行

                }

            }]
        }
    })




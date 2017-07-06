
angular.module("expert")
    .directive("expertPage",function () {
        return{
            restrict:"ACE",
            replace:true,
            templateUrl:"./expert/expert_template.html",
            // templateUrl:"hahahahahahah",
            controller:['$scope','$http','$timeout','$state','qiniu',function ($scope,$http,$timeout,$state,qiniu){

                $("#view_show").hide();
                $("#view_hide").show();

                //将专家设为普通用户
                $scope.exchange=function (phonenum) {

                    $.confirm({
                        'title': '专家设为普通用户',
                        'message': '是否将该专家设为普通用户？？',
                        'buttons': {
                            'Yes': {
                                'class': 'blue',
                                'action': function () {
                                    console.log(phonenum);
                                    console.log("将专家设为普通用户")
                                    var info={phonenum:phonenum}
                                    $http({
                                        url:qiniu._url+'changePeople',
                                        method:'POST',
                                        data:info,
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
                                            $scope.expert=response.data.data;
                                            console.log($scope.expert);

                                            $state.go('expert',{},{reload:true});

                                            // alert("设置成功");
                                            console.log("exchange   success")
                                            $('#myModal').show();
                                            $('#caption').html("设 置 成 功！！！！！");
                                            $('#close').click(function () {
                                                $('#myModal').hide();
                                            })

                                        }
                                        console.log("exchange");
                                    })

                                    $timeout(function(){
                                        $('#myModal').hide();
                                    },1500);   //该函数延迟1.5秒执行
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


                var data={type:1}//专家类型1
                //获取到专家信息
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
                        $scope.expert=response.data.data;
                        $("#view_show").show();
                        $("#view_hide").hide();


                        var pages=8;
                        $scope.curpage=0;//默认第一页下标为0
                        $scope.itemx=[];//存放分页的

                        for(var i=0,len=$scope.expert.length;i<len;i+=pages){
                            $scope.itemx.push($scope.expert.slice(i,i+pages));
                        }
                        $scope.totalPage=Math.ceil(($scope.expert).length/pages)//总页数从1开始
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


                //删除专家
                $scope.deleteExpert=function (phonenum) {
                    var data={type:1,phonenum:phonenum};
                    $.confirm({
                        'title': '删除专家',
                        'message': '是否删除该专家？？',
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
                                            $scope.expert=response.data.data;
                                            console.log('delete success');
                                            $state.go('expert',{},{reload:true});
                                            $('#myModal').show();
                                            $('#caption').html("删 除 成 功！！！！！");

                                        }else if(response.data.code==2){
                                            $('#myModal').show();
                                            $('#caption').html("删 除 成 功 需 刷 新 数 据！！！！！");
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

            }]
        }
    })
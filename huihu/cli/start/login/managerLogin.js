
angular.module('login',[])
    .directive('loginPage',function () {

        return{
            restrict:"ACE",
            replace:true,
            templateUrl:"cli/start/login/managerLogin.html",
            controller:['$scope','$http','$rootScope','$state','$timeout',function ($scope,$http,$rootScope,$state,$timeout){



                //回车实现登录
                $scope.enterEvent=function (e) {
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        $scope.submitForm();
                    }
                }
                //登录提交
                    // $scope.state=1;
                $scope.submitForm=function () {
                    console.log("1234567");
                    // alert($scope.usename);

                    $.ajax({
                        url:'http://123.206.109.45/api/PClogin',
                        type:'POST',
                        async:true,
                        data:{usename:$scope.usename,password:$scope.password},
                        // data:$('#loginForm').serialize(),
                        timeout:5000,
                        dataType:'text',
                        success:function(data,textStatus,jqXHR){
                            var json_data=JSON.parse(data);
                            if(json_data==1){
                                $scope.isLogin=true;

                                localStorage.setItem('isLogin',$scope.isLogin);
                                //存入cookies
                                /*$scope.setCookies=function (name,value) {
                                    var Days = 30;
                                    var exp = new Date();
                                    exp.setTime(exp.getTime() + Days*24*60*60*1000);
                                    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
                                }
                                $scope.setCookies('isLogin',true);*/

                                // $.cookie("isLogin", "true", { expires: 1, domain: 'localhost' });

                                window.location.href = './cli/index.html';
                                // $state.go('manage');
                            }
                            else if(json_data==2){

                                $scope.state=0;
                                // alert($scope.state);
                                $('#myModal').show();
                                $('#caption').html("密 码 错 误！！！！！");

                            }else {
                                // $scope.exist=true;
                                // alert("用户不存在")
                                $('#myModal').show();
                                $('#caption').html("用 户 名 不 存 在！！！！！");
                            }

                        }, //succ
                        error:function(xhr,textStatus){
                            console.log()
                            console.log("错误");
                            console.log(xhr);
                            console.log(textStatus);
                        },
                        complete:function(){
                            // console.log("2222222222"+$scope.usename);
                            console.log("ajax结束 "+$scope.usename);
                        }
                    })
                    $timeout(function(){
                        $('#myModal').hide();
                    },3000);   //该函数延迟1.5秒执行


                    /*if($scope.usename==null && $scope.password==null){

                    }
                    if($scope.usename!=null && $scope.password!=null) {
                        $http.get('http://123.206.109.45:3001/users/login/?usename=' + $scope.usename + '&password=' + $scope.password)
                            .then(function successCallback(response) {
                                // 请求成功执行代码
                                alert(response.data.result);

                                if (response.data.result == 1) {
                                    $rootScope.isLogin = true;
                                    // $rootScope.userId=$scope.user_name;
                                    window.location.href = './cli/index.html';
                                } else if (response.data.result == 0) {
                                    alert("该用户不存在")
                                } else if (response.data.result == 2) {
                                    $scope.state=0;
                                    // alert("密码错误")
                                } else {
                                    alert("服务器维护中")
                                }
                            }, function errorCallback(response) {
                                console.log("失败")
                            });
                    }*/
                }
            }]
        }
    })

angular.module('addExpert')
.directive('addExpertPage',function () {
    return{
        restrict:"ACE",
        replace:true,
        templateUrl:"./addExpert/addExpert.html",
        controller:function ($scope,$http,qiniu,$state,$timeout) {
            $("#view_show").show();
            $("#view_hide").hide();

            $('#img').attr('src','./../img/wait.jpg')//默认头像



      //上传图片
            $scope.uploadExpert=function () {
                console.log("upload");
                //点击按钮
                var btnjo=$("#icon");
                var filejo = btnjo.siblings('#uploadFileInput');
                filejo.remove();
                filejo = $('<input accept="image/jpeg,image/jpg,image/png" id="uploadFileInput" type="file" style="display: none">').appendTo(btnjo);
                btnjo.after(filejo);
                filejo.bind('change', function () {
                    var fileobjs = filejo.get(0).files;
                    var domain = qiniu._cfgqn.domain;


                    $http({
                        url:qiniu._cfgqn.uptoken,
                        method:'POST',
                        data:{},
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
                        if (response.data.code == 1) {
                            console.log(response.data.data);
                            token = response.data.data;
                            var f = fileobjs[0];
                            var xhrid =qiniu._pielib.uuid();
                            var xhr = {};
                            xhr.file = f;
                            xhr.id = xhr.file.id = f.id = xhrid;
                            //开始上传
                            xhr = qiniu._pielib.uploadFileQnRd(
                               token,
                                f,
                                function (res) {
                                    //把七牛的返回结果转为标准格式
                                    res['success'] = true;
                                    f.url = res.url = res['file_path'] = domain + res.key;
                                    res['msg'] = 'upload ok.';
                                    $('#photo').attr('value', f.url);
                                    $scope.head = f.url;
                                    // $('#url').show();
                                    $('#img').attr('src', f.url);
                                    console.log("图片上传成功");
                                    console.log($scope.head)
                                },
                                function (f, err) {
                                    alert(f + "error")
                                },
                                function (xhr, status) {
                                    console.log(xhr);
                                },
                                domain
                            );
                        }else {
                            alert("上传失败，后台服务器出现错误")
                        }

                    })




                })
                //模拟刚 添加的按钮被点击
                filejo.click();

            }


            //提交专家信息
            $scope.addExpert=function () {

                var data={
                    name:$scope.name,
                    head:$scope.head,
                    phonenum:$scope.phonenum,
                    password:$scope.password,
                    company:$scope.company,
                    position:$scope.position,
                    works:$scope.works,
                    extime:$scope.extime,
                    description:$scope.description
                }
                console.log(data);

                $http({
                    url:qiniu._url+'addExpert',
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

                        $('#myModal').show();
                        $('#caption').html("添 加 成 功！！！！！");
                        $('#close').click(function () {
                            $('#myModal').hide();
                        })
                       $("#reset").click();
                       $('#img').attr('src','./../img/wait.jpg')//默认头像
                       // $state.go('expert');
                    }else {

                        $('#myModal').show();
                        $('#caption').html("添 加 失 败！！！！！");
                        $('#close').click(function () {
                            $('#myModal').hide();
                        })
                       $("#reset").click();
                       $('#img').attr('src','./../images/wait.jpg')//默认头像
                    }
                })
                $timeout(function(){
                    $('#myModal').hide();
                },1000);   //该函数延迟1.5秒执行

            }
        }
    }

})
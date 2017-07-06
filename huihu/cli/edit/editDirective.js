
angular.module('edit')
    .directive('editPage',function () {
        return{
            restrict:'ACE',
            replace:true,
            templateUrl:'./edit/edit.html',
            controller:['$scope','$http','$state','$stateParams','qiniu','$rootScope','$timeout',function ($scope,$http,$state,$stateParams,qiniu,$rootScope,$timeout){
                $("#view_show").hide();
                $("#view_hide").show();

                $http.get(qiniu._url+"ActivityDetail?activityid="+$stateParams.activityid).then(
                    function success(response) {
                        $scope.res=response.data.data;
                        $scope.editActivity=$scope.res[0];



                        $scope.editActivity.data=new Date($scope.editActivity.data);
                        console.log($scope.editActivity.data);
                        $scope.editActivity.deadline=new Date($scope.editActivity.deadline);
                        $("#imgUrl").attr('src',$scope.editActivity.logo);
                        $scope.logo=$scope.editActivity.logo;
                        //完成图
                        if($scope.editActivity.imgst){
                            $("#show_img").show();
                        }
                        $("#a0").attr('src',$scope.editActivity.imgst);
                        $scope.img0=$scope.editActivity.imgst;
                        $("#a1").attr('src',$scope.editActivity.imgnd);
                        $scope.img1=$scope.editActivity.imgnd;
                        $("#a2").attr('src',$scope.editActivity.imgrd);
                        $scope.img2=$scope.editActivity.imgrd;
                        $("#a3").attr('src',$scope.editActivity.imgth);
                        $scope.img3=$scope.editActivity.imgth;

                        $("#view_show").show();
                        $("#view_hide").hide();

                    }
                )



                //修改图像
                $scope.editIcon=function () {
                    // console.log($scope.editActivity);
                    console.log("upload");
                    //点击按钮
                    var btnjo=$("#icon-btn");
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
                                        $('#url').attr('value', f.url);
                                        $scope.logo = f.url;
                                        $('#imgUrl').attr('src', f.url);
                                        // $scope.editActivity.logo=$scope.logo;
                                        console.log("图片上传成功");
                                        console.log($scope.editActivity.logo)
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
                //活动完成图(多图上传)
                $scope.comIcon=function () {

                    //点击按钮
                    var btnjo=$("#icon-btncom");
                    var filejo = btnjo.siblings('#uploadFileInput');
                    filejo.remove();
                    filejo = $('<input accept="image/jpeg,image/jpg,image/png" id="uploadFileInput" multiple type="file" style="display: none">').appendTo(btnjo);
                    btnjo.after(filejo);
                    filejo.bind('change', function () {
                        var fileobjs = filejo.get(0).files;
                        var domain = qiniu._cfgqn.domain;

                        if(fileobjs.length>4){
                            alert("最多选择四张图片");
                            return
                        }


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
                            if(response.data.code==1){
                                console.log(response.data.data);
                                token=response.data.data;

                                $scope.activity_img=[];

                                for(var y=0;y<fileobjs.length;y++){

                                    ( function (y) {
                                        console.log("y:"+y);

                                        var f= fileobjs[y];
                                        /*随机id*/
                                        var xhrid =qiniu._pielib.uuid();
                                        var xhr = {};
                                        xhr.file = f;
                                        xhr.id = xhr.file.id = f.id = xhrid;


                                        //开始上传
                                        xhr = qiniu._pielib.uploadFileQnRd(
                                            token,f,
                                            function (res) {
                                                //把七牛的返回结果转为标准格式
                                                res['success'] = true;
                                                f.url = res.url = res['file_path'] = domain + res.key;
                                                res['msg'] = 'upload ok.';

                                                console.log(f.url);
                                                $("#show_img").show();
                                                console.log(y)

                                                if(y==0){
                                                  $scope.img0=f.url;
                                                }else if(y==1){
                                                    $scope.img1=f.url;
                                                }else if(y==2){
                                                    $scope.img2=f.url;
                                                }else {
                                                    $scope.img3=f.url;
                                                }


                                                $("#a"+y).attr('src',f.url);



                                                $scope.activity_img.push(f.url);

                                                console.log("完成图片上传成功");

                                            },
                                            function (f, err) {
                                                alert(f + "图片上传失败")
                                            },
                                            function (xhr, status) {
                                                console.log(xhr);
                                            },
                                            domain

                                        );


                                    })(y)
                                    console.log(y);


                                }


                            }else {
                                alert("上传失败，后台服务器出现错误")
                            }


                        })

                    })
                    //模拟刚 添加的按钮被点击
                    filejo.click();

                }
                //提交
                $scope.edit=function () {
                    console.log("edit");

                    //时间转换 2017/4/27 11:41
                    var date =$scope.editActivity.data.toLocaleDateString();

                    var hour=$scope.editActivity.data.getHours()>9?$scope.editActivity.data.getHours():'0'+$scope.data.getHours();
                    var minute=$scope.editActivity.data.getMinutes()>9?$scope.editActivity.data.getMinutes():'0'+$scope.data.getMinutes()

                    var date1 =$scope.editActivity.deadline.toLocaleDateString();
                    var hour1=$scope.editActivity.deadline.getHours()>9?$scope.editActivity.deadline.getHours():'0'+$scope.editActivity.deadline.getHours();
                    var minute1=$scope.editActivity.deadline.getMinutes()>9?$scope.editActivity.deadline.getMinutes():'0'+$scope.editActivity.deadline.getMinutes()

                 $scope.dt=date1+' '+hour1+':'+minute1;

                    $scope.dl=date+' '+hour+':'+minute;

                    var data={
                        activityid:$scope.editActivity.activityid,
                        logo:$scope.logo,
                        title:$scope.editActivity.title,
                        category:$scope.editActivity.category,
                        data:$scope.dl,
                        deadline:$scope.dt,
                        address:$scope.editActivity.address,
                        description:$scope.editActivity.description,
                        imgst:$scope.img0==undefined?'':$scope.img0,
                        imgnd:$scope.img1==undefined?'':$scope.img1,
                        imgrd:$scope.img2==undefined?'':$scope.img2,
                        imgth:$scope.img3==undefined?'':$scope.img3
                    }
                    console.log(data);

                  $.ajax({
                        url:qiniu._url+'edit',
                        type:'POST',
                        async:true,
                        data:data,
                        timeout:5000,
                        dataType:'text',
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        success:function(data,textStatus,jqXHR){
                           var jdata=JSON.parse(data);
                            console.log(jdata);
                            console.log(jdata.data);
                            if(jdata.code==1){

                                $('#myModal').show();
                                $('#caption').html("修 改 成 功！！！！！");
                                $state.go('start',{},{reload:true});

                            }else if(jdata.code==0){

                                $('#myModal').show();
                                $('#caption').html("修 改 失 败！！！！！");
                            }
                        }, //succ
                        error:function(xhr,textStatus){
                            $('#myModal').show();
                            $('#caption').html("修 改 失 败！！！！！");
                        },
                        complete:function(){
                            // console.log("2222222222"+$scope.usename);
                            console.log("ajax结束 ");
                        }
                    })
                    $timeout(function(){
                        $('#myModal').hide();
                        $state.go('start');
                    },1500);   //该函数延迟1.5秒执行

                }

            }]
        }

    })
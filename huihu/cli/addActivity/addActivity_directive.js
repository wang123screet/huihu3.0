
angular.module("addActivity")
    .directive("addActivityPage",function () {
        return{
            restrict:"ACE",
            replace:true,
            templateUrl:"./addActivity/addActivity_template.html",
            controller:function ($scope,$http,qiniu,$timeout,$window,$state) {
                $("#view_show").show();
                $("#view_hide").hide();

                $("#process").hide();
                $('#img').hide();
                $scope.content1=false;
                $scope.content2=true;
                $('#img').attr('src','./../img/wait.jpg');//默认图片
                $scope.x=0;
               $scope.change=function (x) {
                   console.log(x);
               }
               //提交
                $scope.submit=function () {
                    //时间转换 2017/4/27 11:41
                    var date =$scope.data.toLocaleDateString();
                    var hour=$scope.data.getHours()>9?$scope.data.getHours():'0'+$scope.data.getHours();
                    var minute=$scope.data.getMinutes()>9?$scope.data.getMinutes():'0'+$scope.data.getMinutes()

                    var date1 =$scope.endtime.toLocaleDateString();
                    var hour1=$scope.endtime.getHours()>9?$scope.endtime.getHours():'0'+$scope.endtime.getHours();
                    var minute1=$scope.endtime.getMinutes()>9?$scope.endtime.getMinutes():'0'+$scope.endtime.getMinutes()

                    $scope.endtime=date1+' '+hour1+':'+minute1;

                    $scope.data=date+' '+hour+':'+minute;



                  var data={
                      imgurl:$scope.imgurl,
                      title:$scope.title,
                      data:$scope.data,
                      endtime:$scope.endtime,
                      address:$scope.address,
                      type:$scope.x,
                      host:$scope.host,
                      description:$scope.description
                  }

                  console.log(data);

                  if($scope.x==0){
                      $("#test3").show();
                      $("#test3").html("请选择类型");
                      return
                  }else{
                      $("#test3").hide();
                  }

                    $.ajax({
                        url:qiniu._url+'addactivity',
                        type:'POST',
                        async:true,
                        data:data,
                        // data:$('#loginForm').serialize(),
                        timeout:5000,
                        dataType:'text',
                        headers:{'Content-Type':'application/x-www-form-urlencoded'},
                        success:function(data,textStatus,jqXHR){
                            var jdata=JSON.parse(data);
                            console.log(jdata);
                            console.log(jdata.data);
                          if(jdata.code==1){

                              $('#myModal').show();
                              $('#caption').html("添 加 成 功！！！！！");

                              /*$('#close').click(function () {
                                  $('#myModal').hide();
                              })*/
                             /* $state.go('addActivity',{},{reload:true});
                              // $window.location.reload();
                              $("#reset").click();
                              $('#img').attr('src','./../img/wait.jpg');//默认图片*/

                          }else if(jdata.code==0){

                              $('#myModal').show();
                              $('#caption').html("添 加 失 败！！！！！");
                              $('#close').click(function () {
                                  $('#myModal').hide();
                              })
                              $("#reset").click();
                              $('#img').attr('src','./../images/wait.jpg');//默认图片
                          }
                        }, //succ
                        error:function(xhr,textStatus){
                            console.log()
                            console.log("错误");
                            console.log(xhr);
                            console.log(textStatus);
                        },
                        complete:function(){

                            console.log("ajax结束 ");
                        }

                    })

                    $timeout(function(){
                        $('#myModal').hide();
                        $state.go('addActivity',{},{reload:true});
                        // $window.location.reload();
                        $("#reset").click();
                        $('#img').attr('src','./../img/wait.jpg');//默认图片

                    },1500);   //该函数延迟1.5秒执行


                }

            //上传图片
            $scope.uploadIcon=function () {
                console.log("upload");
                //点击按钮
                var btnjo=$("#icon-btn");
                var filejo = btnjo.siblings('#uploadFileInput');
                filejo.remove();
                filejo = $('<input accept="image/jpeg,image/jpg,image/png" id="uploadFileInput" type="file"  style="display: none">').appendTo(btnjo);
                btnjo.after(filejo);
                filejo.bind('change', function () {
                    var fileobjs = filejo.get(0).files;
                    var domain = qiniu._cfgqn.domain;
                    var f = fileobjs[0];
                    // alert("文件大小:"+(f.size / 1024).toFixed(1));
                    if((f.size / 1024).toFixed(1)>1024){
                        $("#haha").click();
                        $("#show").html("请上传小于1M的图片");
                        return
                    }

                    $("#process").show();


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
                                    $("#process").hide();
                                    $('#img').show();
                                    res['success'] = true;
                                    f.url = res.url = res['file_path'] = domain + res.key;
                                    res['msg'] = 'upload ok.';
                                    $('#url').attr('value', f.url);
                                    $scope.imgurl = f.url;
                                    // $('#url').show();
                                    $('#img').attr('src', f.url);
                                    console.log("图片上传成功");
                                    console.log($scope.imgurl)
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



            //表单判断
                /*
                * 主办时间--data
                * 结束时间--endtime*/

                $("#time").blur(function () {
                    var begindate=parseInt(Date.parse(new Date($scope.data))/1000);
                    var nowdate=parseInt(Date.parse(new Date())/1000);
                    // alert($scope.data);
                 if($scope.data==undefined){
                          $("#test1").show();
                          $("#test1").html("请选择完整的日期时间");
                      }else{
                          if(begindate<nowdate){
                              $("#test1").show();
                              $("#test1").html("请选择正确的日期时间");
                              $("#time").focus();
                          }else {
                              $("#test1").hide();
                          }
                      }
                })

                $("#endtime").blur(function () {
                    var begindate=parseInt(Date.parse(new Date($scope.data))/1000);
                    var enddate=parseInt(Date.parse(new Date($scope.endtime))/1000);
                    if(enddate<=begindate){
                        $("#test2").show();
                        $("#test2").html("请选择正确的日期时间");
                        $("#endtime").focus();
                    }else {
                        $("#test2").hide();
                    }

                })






                }
        }
    })
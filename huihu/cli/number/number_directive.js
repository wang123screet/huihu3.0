
angular.module("number")
    .directive('numberPage',function () {
        return{
            restrict:"ACE",
            replace:true,
            templateUrl:"./number/number_template.html",
            controller:function ($scope,$http,qiniu) {
                $("#view_show").hide();
                $("#view_hide").show();
                $scope.page=function (num,item) {
                    var pages=num*4;
                    $scope.curpage=0;//默认第一页下标为0
                    $scope.itemx=[];//存放分页的

                    for(var i=0,len=item.length;i<len;i+=pages){
                        $scope.itemx.push(item.slice(i,i+pages));
                    }

                    $scope.totalPage=Math.ceil(item.length/pages)//总页数从1开始
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



                $http({
                    url:qiniu._url+'signPeople',
                    method:'POST',
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
                        $scope.activityPeoples=response.data.data;
                        $scope.infoSign=response.data.info;
                        $("#view_show").show();
                        $("#view_hide").hide();

                        for(var n=0;n<$scope.activityPeoples.length;n++){
                            $scope.activityPeoples[n].data=parseInt(Date.parse(new Date($scope.activityPeoples[n].data)))
                        }
                        /*sort*/
                        $scope.sortDate=function (obj1,obj2) {
                            var x=obj1.data;
                            var y=obj2.data;
                            if (x < y) {
                                return 1;
                            } else if (x > y) {
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                        $scope.activityPeoples=$scope.activityPeoples.sort($scope.sortDate);
                        $scope.runActivity=[];//未举办的活动
                        $scope.nowDate=parseInt(Date.parse(new Date()));
                        for(var x=0;x<$scope.activityPeoples.length;x++){
                            if($scope.activityPeoples[x].data>$scope.nowDate){
                                $scope.runActivity.push($scope.activityPeoples[x]);
                            }
                        }

                        /*person phonenum info*/
                        $scope.phoneInfo=[];
                        for (var w=0;w<$scope.infoSign.length;w++){


                            if($scope.infoSign[w].activityid===$scope.runActivity[0].activityid){
                                $scope.phoneInfo.push($scope.infoSign[w]);
                            }
                        }

                        $scope.page($scope.runActivity.length,$scope.phoneInfo);
                        if($scope.phoneInfo.length<=$scope.runActivity.length*2){
                            $("#pageSH").hide();
                        }else {
                            $("#pageSH").show();
                        }


                    /*onclick select*/
                        $scope.state=$scope.runActivity[0].activityid;

                        $scope.active=function (id) {

                            // $($event.target).addClass("runactive")
                            $("#run0"+id).addClass("runactive");
                            for (var i=0;i<$scope.runActivity.length;i++){
                                if($scope.runActivity[i].activityid!=id){
                                    $("#run0"+$scope.runActivity[i].activityid).removeClass("runactive")
                                }
                            }
                            $scope.phoneInfo=[]
                            for (var f=0;f<$scope.infoSign.length;f++){
                                if($scope.infoSign[f].activityid===id){
                                    $scope.phoneInfo.push($scope.infoSign[f]);
                                }
                            }
                            $scope.page( $scope.runActivity.length,$scope.phoneInfo);
                            if($scope.phoneInfo.length<=$scope.runActivity.length*3){
                                $("#pageSH").hide();
                            }else {
                                $("#pageSH").show();
                            }



                        }
                        /*表格统计*/
                        $scope.aName=[],$scope.aNum=[]
                        for(var m=0;m<$scope.activityPeoples.length;m++){

                            if(parseInt(new Date($scope.activityPeoples[m].data).getFullYear())>=parseInt(new Date().getFullYear())){
                                $scope.aName.push($scope.activityPeoples[m].title);
                                $scope.aNum.push($scope.activityPeoples[m].signnum || 0)
                            }


                        }
                        Highcharts.chart('container', {

                            title: {
                                text: new Date().getFullYear()+'年活动报名总人数',
                                style: {
                                    fontSize:'1.7em',
                                    fontWeight:  'bold'

                                }
                            },
                            credits: {
                                enabled: false
                            },

                            subtitle: {
                                text: ''
                            },

                            yAxis: {
                                title: {
                                    text: '报名人数',
                                    style: {

                                        color:'#6D869F',
                                        fontSize:'15px',
                                        fontWeight:  'bold'

                                    },
                                },

                                allowDecimals:false,
                            },
                            legend: {
                                // layout: 'vertical',
                                // align: 'bottom',
                                // verticalAlign: 'middle'
                            },

                            plotOptions: {
                                series: {
                                    pointStart:0
                                }
                            },
                            xAxis: {
                                title: {
                                    text: '活动名称',
                                    style: {

                                        color:'#6D869F',
                                        fontSize:'16px',
                                        fontWeight:  'bold'

                                    }
                                },
                                allowDecimals:false,
                                categories: $scope.aName

                            },

                            series: [{
                                name: '总人数',
                                data:$scope.aNum,
                                tooltip: {
                                    shared: true,
                                    useHTML: true,//$scope.aName['{point.x}']
                                    headerFormat:'<div>{point.x}</div><br>',
                                    pointFormat: '<table><tr><td style="color: {series.color}">总人数:</td>' +
                                    '<td style="text-align: right"><b>{point.y}</b></td></tr>',
                                    footerFormat: '</table>',
                                    valueDecimals: 0
                                }
                            }]

                        });

                    }


                    })
                
                
            }
        }
    })


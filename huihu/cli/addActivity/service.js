
angular.module("addActivity")
    .factory('qiniu',function () {
        //上传图片
        //七牛文件接口


        return{
            _cfgqn:{
                uptoken:"http://115.159.100.155/api/qntokenb",
                domain:'http://test.10knet.com/',
            },

            _pielib:{
                uploadFileQnRd:function (token,file,success, error, complete){
                    var useargs = (token.constructor != String);

                    if (useargs) token = arguments.token;
                    if (!token) {
                        __errhdlr(new Error('_pielib.uploadFileQnRd:token undefined.'))
                        return;
                    };

                    if (useargs) file = arguments.file;
                    if (!file) {
                        __errhdlr(new Error('_pielib.uploadFileQnRd:file undefined.'))
                        return;
                    };

//            var domain = _cfg.qn.BucketDomain;///////////////////////////////////////////////

                    var domain = 'http://test.10knet.com/';


                    //准备fromdata
                    var formdata = new FormData();
                    formdata.append('token', token);
                    formdata.append('file', file);
                    //发起上传
                    var set = {
                        url: "http://up.qiniu.com",
                        data: formdata,
                        type: 'POST',
                        processData: false, //屏蔽掉ajax自动header处理
                        contentType: false, //屏蔽掉ajax自动header处理
                    };
                    //添加各种监听函数
                    if (useargs) success = arguments.success;
                    if (success) set.success = success;
                    if (useargs) error = arguments.error;
                    if (error) set.error = error;
                    if (useargs) complete = arguments.complete;
                    if (complete) set.complete = complete;



                    var xhr = $.ajax(set);
                    xhr.file = file;
                    xhr.domain = domain;

                    return xhr;

                },
                uuid:function uniqueId(prefix) {
                    var ts = Number(new Date()).toString(36)
                    var rd = Number(String(Math.random()).replace('.', '')).toString(36);
                    var res = ts + '-' + rd;
                    if
                    (prefix) res = prefix + '-' + res;
                    return res;
                }
            },

            _url:"http://115.159.100.155/api/"


        }




    })
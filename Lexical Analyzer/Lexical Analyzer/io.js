//模块引入
var fs = require('fs');

//读入文件路径处理
var read_file_path = "source code.pas";
console.log("读取文件路径为："+read_file_path);
//输出文件路径处理
var filename_pattern = /([\w\s.]+)(\.pas)/;
var result = read_file_path.match(filename_pattern);
if(result != null){
    var write_file_name = result[1];
    // console.log("write_file_name:"+write_file_name);
}


var read = function(){
    //读取文件
    var read_option={
        encode:"ascii"
    }
    var data = fs.createReadStream(read_file_path,read_option);
    return data;
}

var write = function(output_data,filetype){
    //写入文件
    var write_option={
        flag:'a',//采用追加的方式写入数据
        encode:'utf8'//采用utf8编码写入数据
    }

    fs.appendFile(write_file_name+filetype,output_data,write_option,function(err){
        if(err){
            console.log("文件写入失败");
        }
        else{
            console.log("文件写入成功");
        }
    })
}

exports.read = read;
exports.write = write;

var io = require('./io');
var anaylzer = require('./anaylzer');

var output={

};

var file = io.read();

var dyd_type = ".dyd";
var err_type = ".err";

file.on('data',function(data){
    data=data.toString();
    console.log(data);
    anaylzer.anaylzer(data);
});

file.on('end',function(data){
    console.log("文件读取完毕！");
    // console.log(anaylzer.output_array);
    var output_data="";
    for(var i = 0;i<anaylzer.output_array.length;i++){
        output_data=output_data+anaylzer.output_array[i];
    }
    console.log(output_data);
    io.write(output_data,dyd_type);
    var err_data="";
    for(var i = 0;i<anaylzer.error_array.length;i++){
        err_data=err_data+anaylzer.error_array[i];
    }
    io.write(err_data,err_type);
});




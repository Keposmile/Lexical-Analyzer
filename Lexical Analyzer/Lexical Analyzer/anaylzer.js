var reserve_map = new Map([
    ["begin", "1"],
    ["end","2"],
    ["integer","3"],
    ["if","4"],
    ["then","5"],
    ["else","6"],
    ["function","7"],
    ["read","8"],
    ["write","9"],
    ["=","12"],
    ["<>","13"],
    ["<=","14"],
    ["<","15"],
    [">=","16"],
    [">","17"],
    ["-","18"],
    ["*","19"],
    [":=","20"],
    ["(","21"],
    [")","22"],
    [";","23"],
    ["EOLN","24"],
    ["EOF","25"],
    ["BEGIN","1"],
    ["END","2"],
    ["INTEGER","3"],
    ["IF","4"],
    ["THEN","5"],
    ["ELSE","6"],
    ["FUNCTION","7"],
    ["READ","8"],
    ["WRITE","9"]
]);

var symbol_map = new Map();
var dight_map = new Map();

var space = /[\o\n\t]/;
var dight = /[0-9]/;
var letter = /[a-zA-Z]/;
var output_array = [];
var error_array = [];
var output_standardized = function(symbol,category){
    while(symbol.length<16){
        symbol=" "+symbol;
    }
    // console.log(category);
    while(category.length<2){
        category=" "+category;
    }
    output_array.push(symbol+" "+category+"\n");
    return "";
}

var error = function (line_num,err_info){
        switch (err_info){
            case 1:
                error_array.push(line_num+"  "+"Except a \"=\" after :\n");
                break;
            case 2:
                error_array.push(line_num+"  "+"Unsupported symbol\n");
                break;
            default:
        }
}
var anaylzer= function(data){
    var index = 0;
    var line_num = 1;
    var string_buffer="";
    var thischar=""
    while(index<data.length){
        thischar=data[index];
        if(letter.test(thischar)){
            while(letter.test(thischar)||dight.test(thischar)){
                string_buffer=string_buffer+thischar;
                index++;
                thischar = data[index];
            }
            index--;
            thischar = data[index];
            if(reserve_map.has(string_buffer)){
                string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
            }else{
                if(!symbol_map.has(string_buffer)){
                    symbol_map.set(string_buffer,"10");
                }
                string_buffer=output_standardized(string_buffer,symbol_map.get(string_buffer));
            }
        }
        if(dight.test(thischar)){
            while(dight.test(thischar)){
                string_buffer=string_buffer+thischar;
                index++;
                thischar = data[index];
            }
            index--;
            thischar = data[index];
            if(!dight_map.has(string_buffer)){
                dight_map.set(string_buffer,"11");
            }
            string_buffer=output_standardized(string_buffer,dight_map.get(string_buffer));
        }
        switch(thischar){
            case "<":
                string_buffer=string_buffer+thischar
                index++;
                thischar = data[index];
                if(thischar=="="){//<=
                    string_buffer=string_buffer+thischar;
                    string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                }else if(thischar==">"){//<>
                    string_buffer=string_buffer+thischar;
                    string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                }else{//<
                    index--;
                    thischar = data[index];
                    string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                }
                break;
            case ">":
                string_buffer=string_buffer+thischar
                index++;
                thischar = data[index];
                if(thischar=="="){//>=
                    string_buffer=string_buffer+thischar;
                    string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                }else{//>
                    index--;
                    thischar = data[index];
                    string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                }
                break;
            case ":":
                string_buffer=string_buffer+thischar
                index++;
                thischar = data[index];
                if(thischar=="="){//:=
                    string_buffer=string_buffer+thischar;
                    string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                }else{
                    string_buffer = "";
                    error(line_num,1);
                }
                break;
            case "=":
            case "-":
            case "*":
            case "(":
            case ")":
            case ";":
                string_buffer=string_buffer+thischar;
                string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                break;
            case "\n":
                line_num++;
                string_buffer="EOLN";
                string_buffer=output_standardized(string_buffer,reserve_map.get(string_buffer));
                break;
            case "\r":
            case " ":
                break;
            default:
                if(!(letter.test(thischar)||dight.test(thischar))){
                    console.log(thischar);
                    error(line_num,2);
                }
        }
        index++;
    }
    string_buffer="EOF";
    string_buffer = output_standardized(string_buffer,reserve_map.get(string_buffer));
}
exports.anaylzer = anaylzer;
exports.output_array = output_array;
exports.error_array  = error_array;

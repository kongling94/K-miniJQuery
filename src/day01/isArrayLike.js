//自己封装一个DOM元素获取的函数
function select(selector){
    //为了避免书写过多的JS的DOM操作代码，使用一个变量来操作。也利于以后代码压缩
    var obj = document.querySelectorAll(selector);
    //让他具有each方法
    obj.each=function(callback){
        each(this,callback);
    }
    return obj
}


function isArrayLike(obj){
    //判断传入的obj的类型是不是一个数组
    if(Object.prototype.toString.call(obj)=='[object Array]'){
        return true
    }
    //判断有没有length的属性 并且 length的长度 ，短路运算有length属性才往后继续，没有的话就返回false
    var length='length' in obj && obj.length;
    //判断length的类型是不是number(我可以给length="hehe",这样报错) 如果是在判断它是否大于0 并且 length-1的属性在不在obj内
    return typeof length === 'number' && length>=0 && (length-1) in obj;
}


function each(arr,callback){
    //防止变量提升造成代码错误，将函数内要用到的变量提前定义
    var i,k;
    //首先判断传进来是数组的话 用for循环
    if(isArrayLike(arr)){
        for( i = 0;i<arr.length;i++){
            //利用call改变this的指向
            if(callback.call(arr[i],i,arr[i]) === false) break;
        }
    }
    //判断传进来的是对象的话用for in
    else{
        for( k in arr){
             //利用call改变this的指向
            if(callback.call(arr[k],k,arr[k]) === false) break;
        }
    }
    return arr;
}



//功能与 each 几乎一样, 但是没有考虑跳出循环, 没有考虑 this, 

function map(arr,callback){
    //防止变量提升造成代码错误，将函数内要用到的变量提前定义
    var newArr=[],tmp;
    //首先判断传进来是数组的话 用for循环
    if(isArrayLike(arr)){
        for( i = 0;i<arr.length;i++){
            //tmp接收 callback的返回值作为返回新数组的元素.
            tmp=callback(arr[i],i)
            if(tmp != null){
                newArr.push(tmp)
            }
        }
    }
    //判断传进来的是对象的话用for in
    else{
        for( k in arr){
           //tmp接收 callback的返回值作为返回新数组的元素.
            tmp=callback(arr[k],k)
             if(tmp != null){
                newArr.push(tmp)
            }

        }
    }
    return newArr;
}

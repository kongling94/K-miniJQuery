# 迷你JQuery的封装

## 框架的封装的模块
    jquery
    1, 选择模块
    2, 框架的核心结构( * )
    3, DOM 操作模块
    4, 事件操作模块
    5, 样式属性操作模块
    6, 插件机制
    7, 构建工具( gulp )

## 目前实现的功能为 each、map、isArrayLike

### 获取元素
```
function select( selector ) {          //为了避免书写过多的JS的DOM操作代码，使用一个变量来操作。也利于以后代码压缩
        var obj = document.querySelectorAll( selector ); // 伪数组

        obj.each = function ( callback ) {
            // 要求遍历 obj, 怎么遍历??? 使用 callback 处理伪数组 obj 中的每一个元素
            each( this, callback );
            // this 是什么, 看谁调用的方法
        };

        return obj;
    }
```

###  isArrayLike 的功能代码原理
``` 
1>如何判断对象是一个数组或伪数组
    // 只需要判断 length 属性即可
    // arr
    1> 是不是一个数组
        toString.call() -> '[object Object]' 形式给出
        instanceof 方法也可以实现, 但是在 html 嵌套的页面中会有问题

        Object.prototype.toString.call( arr ) == '[object Array]'

2> 是不是伪数组?
        1) 必须含有 length 属性
            'length' in arr
        2) 判断他是不是数字
            typeof length == 'number'
        3) 因此长度需要 非负
            length >= 0

                    
        var length = 'length' in arr && arr.length;     有没有length的属性 并且 length的长度 ，短路运算有length属性才往后继续，没有的话就返回false
        return typeof length === 'number' && length >= 0;  判断length的类型是不是number(我可以给length="hehe",这样报错) 如果是在判断它是否大于0

    function isArrayLike( obj ) {
        if ( Object.prototype.toString.call( obj ) == '[object Array]' ) {
            return true;
        }
        var length = 'length' in arr && arr.length;
        return typeof length === 'number' && length >= 0;
    } 
```

###  each、map方法的功能实现

``` function each(arr,callback){
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
} ```

(function (window) {
    //提前声明，优化代码
    var arr=[],
        push=arr.push;
    //工厂函数
    function K(selector) {
        //构造函数
        return new K.fn.init(selector)
    }
    //工厂函数原型上有一个构造函数init
    K.fn = K.prototype = {
        constructor: K,
        init: function (selector) {
            //通过借用数组的push方法，让JQuery的实例对象可以直接获取到dom元素
            push.apply( this,K.select(selector) )
        },
        each:function ( callback ) {
            return K.each(this,callback)
        },
        map:function ( callback ) {
            return K.map(this,callback)
        }
    }
    //共享原型
    K.fn.init.prototype = K.fn;

    //添加工具方法

    K.select = function select(selector) {
        return document.querySelectorAll(selector);
    }


    K.isArrayLike = function isArrayLike(obj) {
        //判断传入的obj的类型是不是一个数组
        if (Object.prototype.toString.call(obj) == '[object Array]') {
            return true
        }
        //判断有没有length的属性 并且 length的长度 ，短路运算有length属性才往后继续，没有的话就返回false
        var length = 'length' in obj && obj.length;
        //判断length的类型是不是number(我可以给length="hehe",这样报错) 如果是在判断它是否大于0 并且 length-1的属性在不在obj内
        return typeof length === 'number' && length >= 0 && (length - 1) in obj;
    }


    K.each = function each(arr, callback) {
        //防止变量提升造成代码错误，将函数内要用到的变量提前定义
        var i, k;
        //首先判断传进来是数组的话 用for循环
        if ( K.isArrayLike(arr) ) {
            for (i = 0; i < arr.length; i++) {
                //利用call改变this的指向
                if (callback.call(arr[i], i, arr[i]) === false) break;
            }
        }
        //判断传进来的是对象的话用for in
        else {
            for (k in arr) {
                //利用call改变this的指向
                if (callback.call(arr[k], k, arr[k]) === false) break;
            }
        }
        return arr;
    }


    K.map = function map(arr, callback) {
        //防止变量提升造成代码错误，将函数内要用到的变量提前定义
        var newArr = [],
            tmp;
        //首先判断传进来是数组的话 用for循环
        if ( K.isArrayLike(arr) ) {
            for (i = 0; i < arr.length; i++) {
                //tmp接收 callback的返回值作为返回新数组的元素.
                tmp = callback(arr[i], i)
                if (tmp != null) {
                    newArr.push(tmp)
                }
            }
        }
        //判断传进来的是对象的话用for in
        else {
            for ( k in arr ) {
                //tmp接收 callback的返回值作为返回新数组的元素.
                tmp = callback( arr[k], k )
                if (tmp != null) {
                    newArr.push(tmp)
                }

            }
        }
        return newArr;
    }

    /*这里遇到一个问题，就是在给构造函数上添加方法的时候，每次都需要一个个输入。
    那么有没有什么方法可以将实例方法保存在一个容器内，静态方法保存在另一个容器内，最后直接把这两个容器扔到构造函数上来解决问题
给K加方法是静态 给K.fn加方法是实例方法*/

    //对外公开
    w.K = w.$ = K;

})(window)
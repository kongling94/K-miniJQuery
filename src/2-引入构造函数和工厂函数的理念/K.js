
/*引入工厂函数的感念（工厂就是批量生产东西的地方，所以我们引入一个函数, 利用函数来创建对象, 隐藏关键字new），实现JQuery中的$符号直接使用,但在我们引入工厂 为了避免全局变量的污染 还使用了沙盒（闭包的概念） 最外层用一个自执行函数来包裹
但是相应的我们引入了工厂函数以后，文件中就会存在两个核心的变量，一个最外层的$，一个是内层中的K().在调用的时候就不容易区分使用那一个名称来进行接收~~
如何解决这个问题呢？将这两个函数的原型都指向一个内存地址上，这样在K增加方法的时候 $上也可以使用，这个概念是来自于面向对象中的原型链指向引用类型。 $.prototype=obj、K.prototye=obj 

// JQuery中的处理方法的分析：创建一个工厂函数，在他的原型上添加一个创构造函数的方法 并 将这个构造函数的原型对象指回 JQuery.prototype
这样在全局范围内我们只用使用这一个名字就可以了
function JQuery (selector) {
    //init是真正的构造函数
    return  new JQuery.fn.init(selector);
}
每次都要书写prototype太繁琐。就需要简化他 $.fn=$.prototype 以后写fn就可以了
JQuery.fn=JQuery.prototype={
    constructor:JQuery,
    init:function (selector) {
    }
}
JQuery.fn.init.prototype=JQuery.fn ;  共享原型
window.$=window.JQuery=JQuery ;  对外暴光
*/




(function () {
    
    function $(selector) {
        return new K(selector)
    }


    //创建一个构造函数 命名为K [因为我的姓是K开头的]，利用面向对象的思想，将方法添加到这个自定义构造函数的原型上，让它的实例可以使用原型上的方法
    // 传的参数是我们第一步获取DOM元素用的
    function K(selector) {
        //改写this的指向，并借用数组push的方法，让this=select(selector)
        [].push.apply(this, K.select(selector))
    }
    //给构造函数添加实例方法（必须通过new创建实例对象来调用）
    //往原型上添加each 需要注意的是，现在的each和map方法都是挂载在构造函数K上的，所以我们调用的时候要使用K.each K.map来使用
    K.prototype.each = function (callback) {
        return K.each(this, callback)
    }
    //往原型上添加map
    K.prototype.map = function (callback) {
        return K.map(this, callback)
    }

    //给构造函数K添加静态方法
    K.select = function select(selector) {
        //为了避免书写过多的JS的DOM操作代码，使用一个变量来操作。也利于以后代码压缩
        var obj = document.querySelectorAll(selector);
        //让他具有each方法
        obj.each = function (callback) {
            each(this, callback);
        },
        obj.map = function (callback) {
            map(this, callback);
        }
        return obj
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
        if (K.isArrayLike(arr)) {
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
        if (K.isArrayLike(arr)) {
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
            for (k in arr) {
                //tmp接收 callback的返回值作为返回新数组的元素.
                tmp = callback(arr[k], k)
                if (tmp != null) {
                    newArr.push(tmp)
                }

            }
        }
        return newArr;
    }
})()
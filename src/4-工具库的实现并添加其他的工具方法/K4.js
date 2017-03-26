(function (w) {
    //提前声明，优化代码
    var arr = [],
        push = arr.push;
    //工厂函数
    function K(selector) {
        //在工厂函数K的原型上添加一个构造函数init
        return new K.fn.init(selector)
    }

    //init构造函数上只保留核心的功能，用fn来简化prototype
    K.fn = K.prototype = {
        //因为原型被重新指向一个引用类型，原型链被破坏，需要重新设置constructor
        constructor: K,
        //JQuery是一个伪数组，他具有length属性
        length: 0,
        //真正的构造函数init
        init: function (selector) {
            //如果传入的是0,null,undefined 直接返回
            if (!selector) return this;
            //通过借用数组的push方法，让JQuery的实例对象可以直接获取到dom元素
            push.apply(this, K.select(selector))
        }
    }
    //共享原型 让构造函数的原型===工厂函数的原型
    K.fn.init.prototype = K.fn;

    //工具库的实现
    //利用extend这个方法实现工具库的扩展,原理是将方法放在一个对象中，每次使用的时候对这个对象遍历 查找有没有对象要使用的方法，有的话返回
    K.extend = K.fn.extend = function (obj) {
        for (var k in obj) {
            this[k] = obj[k]
        }
        return this
    }

    //静态方法的添加
    K.extend({
        select: function (selector) {
            return document.querySelectorAll(selector);
        },

        isArrayLike: function (obj) {
            //判断传入的obj的类型是不是一个数组
            if (Object.prototype.toString.call(obj) == '[object Array]') {
                return true
            }
            //判断有没有length的属性 并且 length的长度 ，短路运算有length属性才往后继续，没有的话就返回false
            var length = 'length' in obj && obj.length;
            //判断length的类型是不是number(我可以给length="hehe",这样报错) 如果是在判断它是否大于0 并且 length-1的属性在不在obj内
            return typeof length === 'number' && length >= 0 && (length - 1) in obj;
        },

        each: function (arr, callback) {
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
        },

        map: function (arr, callback) {
            var i, k;
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
    })

    //这里有一个问题 在书写的时候 静态方法要写在上面，因为他里面带有完成的程序编码，而我们的实例方法是拿静态方法中已经写好的代码来执行的，所以是简化的，可以写成下面这种：

    //实例方法的添加

    K.fn.extend({
        each: function (callback) {
            return K.each(this, callback)
        },

        map: function (callback) {
            return K.map(this, callback)
        },
    })

    //添加toArray方法 让伪数组转为真正的数组
    K.fn.extend({
        toArray: function () {
            //要返回一个真正的数组，并且this指向每一个dom元素
            return this.map(function (v) {
                return v
            })
        },

        //添加get方法      
        get: function (index) {
        //index为空 遍历他并返回真正的数组
            if(index===undefined){
                return this.toArray()
            }
            //index为负数，从后往前查找
            if(index<0){
                return this[this.length+index]
            }
            //index为正数 返回对应索引的内容
            else{
                return this[index]
            }
        },
        first:function () {
           /* //this指向构造函数init，constructor指向工厂函数K，调用K就能创建一个实例对象
            var obj = this.constructor();
            //调用上面的get方法
            var dom = this.get(0);
            obj[0]=dom;
            obj.length=1;
            return obj */
            //既然下面封装了一个eq方法有判断和获取，我们就不需要在进行单独条件判断
            return this.eq(0)
        },
        last:function () {
            return this.eq(-1)
         },
         eq:function(index) {
             var obj = this.constructor();
             //判断index为空，直接返回，后续代码不执行
             if(index==null)return obj;

             var dom=this.get(index);
             //判断dom有没有内容，没有内容返回false不执行内部代码
             if(dom){
                 obj[0]=dom;
                 obj.length=1;
             }
             return obj
         }

    })





    //对外公开
    w.K = w.$ = K;

})(window)
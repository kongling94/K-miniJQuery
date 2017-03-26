
1. dom 操作( * )
1.1 创建 HTML 标签的办法( 创建 DOM 的办法 )
    1, 提供一个 HTML 格式的字符串
        function parseHTML ( html ) {
            // 返回 DOM 对象
            // 算法: 
            // '<div></div>'
            // '<div style=".....">12345612345623<span></span>....</div>'
            // '<div></div><div></div>'
            // 寻找一个容器, 将字符串设置为该容器的 innerHTML 属性. 然后再将该对象从容器中取出
            // 并返回即可得到我们的需要

            // 1, 准备一个容器( div )
            // 2, 将字符串设置到该容器的 innerHTML 中
            // 3, 将里面的 DOM 元素取出来
            // 

        }

        问题: childNodes, children
        一般在获得元素的时候有两套方法: 1> nextSibling, 2> nextElementSibling
        在 dom 中, 元素是指标签, 而节点是指任意的东西.
        <span>123</span>
        span 没有子元素, 但是有子节点
        children 来访问的时候, 指检查元素 而 childNodes 描述的是 子节点.

    2, 将其转换成 DOM 对象
    3, 由于使用 K 构造函数, 将其转换成 K 对象
        怎样使用
        $( '<div></div>' )
        K( '<div></div>' )

        1) 如何将 parseHTML 加入到框架中
        2) 如果判断传入是选择器还是 html 字符串

    将代码分解到多个文件中

    重构代码
    


    
1.2 appendTo
    jq 语法
        $( ... ).appendTo( ???选择器, dom 对象, jq 对象 )
    含义:
        将前面的这个 jq 对象中的每一个 DOM 元素 加到 目标元素的子代元素的结尾处
    首先实现一个
        前面是一个 DOM 元素, 后面是一个 dom 元素的请况
        K.fn.appendTo = function ( dom ) {
            dom.appendChild( this[ 0 ] );
            return this;
        }
    接下来整理一下, 考虑前面是多个元素的情况, 例如: I( '<div></div><div></div><div></div>' ).appendTo( dom元素 )
    
     K.fn.appendTo=function (dom){
        //参数dom是接收的父容器，this是我们写的html标签，他是K的实例
        return this.each(function(){
            dom.appendChild(this)
        })
    }
    
    考虑右边如果是一个 DOM 数组应该如何处理
        在 DOM 元素中, 标签只允许有一个父元素
        左边是多个 DOM, 右边也是多个 DOM
        先考虑左边是一个 DOM 元素, 右边是 多个 DOM 元素

        K.fn.appendTo=function(arr){
            //appendTo最终要返回的是我们加入到页面中的元素信息，所有要有一个变量来进行接收,在这里定义两个变量，一个接收if中的元素，另一个接收else中的元素
            var tmp=[],tmpNodes;
            for(var i=0;i<arr.length;i++){
            //进行if判断，来看i是不是最后的值，如果是，就将this替换到最后
                if(i==arr.length-1){
                    tmp.push(this[0]);
                    arr[i].appendChild(this[0])
            //如果不是，那就克隆this[0]
                }else{
                    tmpNodes=this[0].cloneNode(true);
                    tmp.push(tempNodes);
                    arr[i].appendChild(tmpNodes)
                }
            }
            return tmp
        }

        简化代码段 在编程中如果有if else的判断，一般情况下 可以使用三元运算来代替，实现简化代码段

         K.fn.appendTo=function(arr){
            //appendTo最终要返回的是我们加入到页面中的元素信息，所有要有一个变量来进行接收,在这里定义两个变量，一个接收if中的元素，另一个接收else中的元素
            var tmp=[],tmpNodes;
            for(var i=0;i<arr.length;i++){
                //先执行三元的判断，然后执行相对应条件的代码，再赋值给左边的tmpNodes
                tmpNodes=i==arr.length-1?this[0]:this[0].cloneNode(true);
                //将tmpNodes存入tmp中
                tmp.push(tmpNodes)
                //将获得的值循环放入arr中
                arr[i].appendChild(tmpNodes)
            }
            return tmp
        }


    左边是多个, 右边也是多个==>直接外层再嵌套一个循环


     K.fn.appendTo=function(arr){
            //appendTo最终要返回的是我们加入到页面中的元素信息，所有要有一个变量来进行接收,在这里定义两个变量，一个接收if中的元素，另一个接收else中的元素
            var tmp=[],tmpNodes;
            for(var j=0;j<this.length;j++){
                for(var i=0;i<arr.length;i++){
                    //先执行三元的判断，然后执行相对应条件的代码，再赋值给左边的tmpNodes
                    tmpNodes=i==arr.length-1?this[j]:this[j].cloneNode(true);
                    //将tmpNodes存入tmp中
                    tmp.push(tmpNodes)
                    //将获得的值循环放入arr中
                    arr[i].appendChild(tmpNodes)
                }
            }
            return tmp
        }
// function parseHTML(html) {
//     //创建一个div容器，他的innerHTML是我们传入的html的参数
//     var divs = document.createElement('div');
//     divs.innerHTML = html;
//     var arr = [];
//     //讲容器内的子节点依次传入空数组中
//     for (var i = 0; i < div.childNodes.length; i++) {
//         arr.push(divs.childNodes[i])
//     }
//     return arr;
// }

(function (w) {
    //提前声明，优化代码
    var arr = [],
        push = arr.push;

    /*dom操作的方法
    appendTo()
    append()
    prependTo()
    prepent()
    insertAfter()
    after()
    insertBefore()
    before()
    nextAll()
    next()
    prevA()
    prev()
    parent
    sibilings()
    */
    K.parseHTML = function (html) {
            //创建一个div容器，他的innerHTML是我们传入的html的参数
            var div = document.createElement('div');
            div.innerHTML = html;
            var arr = [];
            //将容器内的子节点依次传入空数组中
            for (var i = 0; i < div.childNodes.length; i++) {
                arr.push(div.childNodes[i])
            }
            return arr;
        },
        /* //注意：这是一个在实例上的方法
         K.fn.appendTo=function (dom){
             //参数dom是接收的父容器，this是我们写的html标签，他是K的实例
             // dom.appendChild(this[0]);
             // return this;
             return this.each(function(){
                 dom.appendChild(this)
             })
         } */
        K.fn.appendTo = function (arr) {
            //appendTo最终要返回的是我们加入到页面中的元素信息，所有要有一个变量来进行接收,在这里定义两个变量，一个接收if中的元素，另一个接收else中的元素
            var tmp = [],
                tmpNodes;
            for (var j = 0; j < this.length; j++) {
                for (var i = 0; i < arr.length; i++) {
                    //先执行三元的判断，然后执行相对应条件的代码，再赋值给左边的tmpNodes
                    tmpNodes = i == arr.length - 1 ? this[j] : this[j].cloneNode(true);
                    //将tmpNodes存入tmp中
                    tmp.push(tmpNodes)
                    //将获得的值循环放入arr中
                    arr[i].appendChild(tmpNodes)
                }
            }
            return tmp
        }



})(window)
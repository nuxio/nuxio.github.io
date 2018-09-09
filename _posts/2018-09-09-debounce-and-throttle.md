---
layout: post
title:  "函数节流与函数去抖"
date:   2018-09-09 16:27:30 +0800
categories: JavaScript
---

## 需求背景：  
某些事件（比如mousemove）会频繁触发，其对应的事件处理函数会频繁执行，DOM操作或者资源加载等大量重复的行为会导致UI停顿甚至浏览器崩溃。

**函数去抖（debounce）：**调用动作n秒后才执行对应的函数，如果在这n秒内又调用则重置执行时间  
*（如果用手指一直向下按一个弹簧，它不会弹起直到你松手为止。）*  

简单实现：  
```js
function debounce(func, delay){
    var timer = null;
    return function () {
        var ctx = this;
        var args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            func.call(ctx, args);
            timer = null;
        }, delay);
    }
}
```

调用方法：  
```js
document.body.addEventListener('mousemove', debounce(function () {
    alert(1);
}, 300));
```

**函数节流（throttle）：**设定一个执行周期，调用的时刻大于等于周期时间，则执行该动作  
*（水龙头拧紧，一滴一滴的滴水）*  

简单实现：
```js
function throttle(func, delay) {
    var last = 0;
    return function () {
        var current = new Date().getTime();
        if(current - last >= delay) {
            func.call(this, arguments);
            last = current;
        }
    }
}
```

调用方法与debounce同理。另外，`requestAnimationFrame`方法也可以达到`throttle`方法的效果，而且在实现动画的时候更为顺畅。
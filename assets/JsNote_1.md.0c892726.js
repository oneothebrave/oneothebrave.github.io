import{o as l,c as a,a as i,b as e}from"./app.2a123ea2.js";const r='{"title":"【第一章】什么是JavaScript","description":"","frontmatter":{},"headers":[{"level":2,"title":"1.1 简短的历史回顾","slug":"_1-1-简短的历史回顾"},{"level":2,"title":"1.2 JavaScript实现","slug":"_1-2-javascript实现"},{"level":3,"title":"1.2.1 ECMAScript","slug":"_1-2-1-ecmascript"},{"level":3,"title":"1.2.2 DOM","slug":"_1-2-2-dom"},{"level":3,"title":"1.2.3 BOM","slug":"_1-2-3-bom"}],"relativePath":"JsNote/1.md","lastUpdated":1622717899390}',t={},c=i("h1",{id:"【第一章】什么是javascript"},[i("a",{class:"header-anchor",href:"#【第一章】什么是javascript","aria-hidden":"true"},"#"),e(" 【第一章】什么是JavaScript")],-1),n=i("h2",{id:"_1-1-简短的历史回顾"},[i("a",{class:"header-anchor",href:"#_1-1-简短的历史回顾","aria-hidden":"true"},"#"),e(" 1.1 简短的历史回顾")],-1),p=i("p",null,"随着 Web 日益流行，但网页变得越来越大、越来越复杂，为验证简单的表单而需要大量与服务器的往返通信成为用户的痛点。",-1),u=i("p",null,"1995 年，网景公司的Brendan Eich与Sun 公司合作开发了一种在客户端和服务器端都使用的叫LiveScript的脚本语言，为蹭Java的热度，改名为 JavaScript。JavasScriot1.0很成功，于是微软也大力参与进web来了,发布了 IE3，其中包含自己名为 JScript（叫这个名字是为了避免与网景发生许可纠纷)的JavaScript 实现。",-1),s=i("p",null,[e("现在，两个版本的JavaScript（Netscape Navigator 中的 JavaScript，以及 IE 中的 JScript）的存在让JavaScript的规范化问题突显了。于是"),i("a",{href:"https://zh.wikipedia.org/wiki/ECMAScript",target:"_blank",rel:"noopener noreferrer"},"标准ECMA-262"),e("就被制定起来了。")],-1),d=i("p",null,"自此以后，各家浏览器均以 ECMAScript 作为自己 JavaScript 实现的依据，虽然具体实现各有不同。",-1),o=i("h2",{id:"_1-2-javascript实现"},[i("a",{class:"header-anchor",href:"#_1-2-javascript实现","aria-hidden":"true"},"#"),e(" 1.2 JavaScript实现")],-1),h=i("h4",{id:"javascript的组成："},[i("a",{class:"header-anchor",href:"#javascript的组成：","aria-hidden":"true"},"#"),e(" JavaScript的组成：")],-1),v=i("p",null,[i("img",{src:"/assets/note-1-2.2460d446.png",alt:"JavaScript的组成"})],-1),S=i("h3",{id:"_1-2-1-ecmascript"},[i("a",{class:"header-anchor",href:"#_1-2-1-ecmascript","aria-hidden":"true"},"#"),e(" 1.2.1 ECMAScript")],-1),M=i("p",null,"ECMA-262是一个标准，ECMAScript是ECMA-262 定义的语言。ECMA-262描述了ECMAScript的",-1),A=i("ul",null,[i("li",null,"语法"),i("li",null,"类型"),i("li",null,"语句"),i("li",null,"关键字"),i("li",null,"保留字"),i("li",null,"操作符"),i("li",null,"全局对象")],-1),E=i("p",null,"ECMAScript 只是对实现这个规范描述的所有方面的一门语言的称呼。",-1),C=i("p",null,"JavaScript 实现了ECMAScript，而 Adobe ActionScript 同样也实现了 ECMAScript。ECMAScript并不局限于 Web 浏览器，Web 浏览器只是 ECMAScript 实现可能存在的一种宿主环境。宿主环境（如Node.js 和即将被淘汰 的 Adobe Flash）提供ECMAScript 的基准实现和与环境自身交互必需的扩展（如DOM）。",-1),J=i("p",null,"ECMA-262就像一个标准文档，ECMAScript就像一个由标准文档定义的规范接口，JavaScript就像一个具体实现。",-1),O=i("div",{class:"tip custom-block"},[i("p",{class:"custom-block-title"},"类比一下："),i("p",null,"ECMA-262：国家规定的大楼的建筑规范"),i("p",null,"ECMAScript：所有符合规定的大楼的称呼"),i("p",null,"JavaScript：某个开发商在建造完‘标准’大楼的前提上，给每个楼层额外装了监控")],-1),m=i("h3",{id:"_1-2-2-dom"},[i("a",{class:"header-anchor",href:"#_1-2-2-dom","aria-hidden":"true"},"#"),e(" 1.2.2 DOM")],-1),b=i("p",null,"Document Object Model：提供与网页内容交互的方法和接口",-1),_=i("p",null,"DOMLevel1：映射文档目录结构",-1),f=i("p",null,"DOMLevel2：新增以下内容",-1),D=i("ul",null,[i("li",null,"DOM 视图：描述追踪文档不同视图（如应用 CSS 样式前后的文档）的接口"),i("li",null,"DOM 事件：描述事件及事件处理的接口"),i("li",null,"DOM 样式：描述处理元素 CSS 样式的接口"),i("li",null,"DOM 遍历和范围：描述遍历和操作 DOM 树的接口")],-1),j=i("p",null,"DOMLevel3：新增以下内容",-1),g=i("ul",null,[i("li",null,"DOM Load and Save：以统一的方式加载和保存文档的方法"),i("li",null,"DOMValidation：验证文档")],-1),k=i("h3",{id:"_1-2-3-bom"},[i("a",{class:"header-anchor",href:"#_1-2-3-bom","aria-hidden":"true"},"#"),e(" 1.2.3 BOM")],-1),L=i("p",null,"Browser Object Model。提供与浏览器交互的方法和接口使用BOM，开发者可以操控浏览器显示内容之外的部分:",-1),B=i("ul",null,[i("li",null,"弹出新浏览器窗口的能力"),i("li",null,"移动、缩放和关闭浏览器窗口的能力"),i("li",null,"navigator 对象，提供关于浏览器的详尽信息"),i("li",null,"location 对象，提供浏览器加载页面的详尽信息"),i("li",null,"screen 对象，提供关于用户屏幕分辨率的详尽信息"),i("li",null,"performance 对象，提供浏览器内存占用、导航行为和时间统计的详尽信息"),i("li",null,"对 cookie 的支持"),i("li",null,"其他自定义对象，如 XMLHttpRequest 和 IE 的 ActiveXObject")],-1);t.render=function(i,e,r,t,w,N){return l(),a("div",null,[c,n,p,u,s,d,o,h,v,S,M,A,E,C,J,O,m,b,_,f,D,j,g,k,L,B])};export default t;export{r as __pageData};

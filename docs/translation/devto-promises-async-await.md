> 本篇文章是怀着赞许与尊敬从[Lydia Hallie](https://dev.to/lydiahallie)的文章中翻译而来的，[原文](https://dev.to/lydiahallie/javascript-visualized-promises-async-await-5gke)写的实在是太性感了
>

你是否有过这样的经历，跑一段JS代码，但它就是不按你预期地运行？看起来就像是一些函数被随机地，在不可预测的时间被执行了，或者执行被延迟了。那你可能正在与ES6引入的新特性打交道：**Promise** . 中文译名：期约

Promise是什么？为什么要用它？它到底是怎么工作的？如何使用它?

往下看之前最好先看看[*事件循环*](/devto-jseventloop) 的原理. 如果你还没看过.



## 介绍

在编写JavaScript时，我们经常不得不处理依赖于其他任务的任务！假设我们想要获取一张图像，对其进行压缩，应用过滤器，然后将其保存。

我们需要做的第一件事，就是获取我们想要编辑的图像。*getImage* 函数可以解决这个问题！只有在成功加载该图像之后，我们才能将该值传递给 *resizeImage* 函数。当图像成功调整大小时，我们希望在 *applyFilter* 函数中对图像应用过滤器。在压缩图像并添加筛选器后，我们希望保存图像并让用户知道一切工作正常！

最后，我们会得到这样的结果：

![PAA-1](D:\oneothebrave.github.io\docs\images\PAA-1.png)

虽然这么做也可以，但我们最终得到了许多嵌套的回调函数，它们依赖于前面的回调函数，这简直是回调地狱，这样的代码很难懂也很难维护。

幸运的是，现在我们有了Promise，让我们来看看什么是Promiss，以及它在这样的情况下可以如何帮助我们！



## Promise语法

我们可以使用一个接受回调函数的 *Promise构造函数* 来创建 *Promise* :

![PAA-2](D:\oneothebrave.github.io\docs\images\PAA-2.gif)

等等，这是返回了个什么玩意儿？

***Promise*** 是一个对象，包含着一个 **status**([[PromiseStatus]]) 属性和一个 **value**([[PromiseValue]])属性。从上面的动图中你可以看见 *[[PromiseStatus]]* 的值为 "pending"，*Promise* 的值为 *undefined* .

别担心--你不永远不必与此对象交互，甚至不能访问[[PromiseStatus]]和[[PromiseValue]]属性！但是，在使用Promises时，这些属性的值很重要。

> 译者注：期约的状态是私有的，不能直接通过 JavaScript 检测到。这主要是为了避免根据读取到
>
> 的期约状态，以同步方式处理期约对象。另外，期约的状态也不能被外部 JavaScript 代码修改。这与不
>
> 能读取该状态的原因是一样的：期约故意将异步行为封装起来，从而隔离外部的同步代码。

*Promise* 的状态[[PromiseStatus]]有以下三种：

- ⏳ *pending* : promise既没有被兑现(fulfilled)，也没有被拒绝(rejected) , promise依旧悬而未决
- ✅ *fulfilled* ：promise已经被兑现(fulfilled)，一切都很顺利，没有发生任何错误
- ❌ *rejected* : promise已经被拒绝(rejected), 什么事情出错了

> 译者举例子：想象你叫了一辆滴滴，把从平台接单到司机把你送到目的地当做一个Promise,就是你和平台立下一个期约，约定在那个时间段内，平台派车把你送到目的地。
>
> 在你下单后，直到你被送到目的地前，这个状态都一直是 *pending*， 因为你还没有到目的地(promise还没有被兑现)，你也没有"到不了目的地"(promise还没有出错)
>
> 然后接下来会出现两种情况：
>
> 1. 你被安全地送到了目的地，promise被兑现，状态改成fulfilled
>
> 2. 司机接到电话，说他老婆突然要生孩子了，司机作为一个好男人，决定要去医院，不去接你了，取消了订单。
>
>    或者司机突然发现他没老婆，但是他开的是百度造的车，半路给你带到莆田系医院去了等等等等，总之就是出现问题了，那么promise的状态就成了rejected，因为promise没有被完成。

在上面的例子中，我们只是简单地传了一个回调函数 `() => {}` 给 *Promise* 构造器。然而，这个回调函数实际上接受两个参数：第一个参数常常被称作 `resolve` 或者 `res` , 是当 *Promise* 的状态应当改为 *fulfilled* 时触发。第二个参数常常被称作 `reject` 或者 `rej` , 是当 *Promise* 的状态应当改为 *reject* 时触发，表示有什么东西出错了

![PAA-3](D:\oneothebrave.github.io\docs\images\PAA-3.png)

让我看看调用 `resolve` 或者`reject` 方法时会输出什么：

![PAA-4](D:\oneothebrave.github.io\docs\images\PAA-4.gif)

不错！我们终于知道如何摆脱 *pending* 状态和 *undefined* 值！如果我们调用了 `res` 函数，那么 *promise* 的状态就是 "fulfilled"，如果我们调用了`rej` 函数，那么 *promise* 的状态就是"rejected"。而*promise* 的值，既[[PromiseValue]]的值，就是我们传给 `res` 或者`rej`的值。

好了，现在我们对如何控制那个模糊的 *Promise* 对象有了更多的了解。但是它是用来做什么的呢？

在介绍部分中，我展示了一个示例，在该示例中，我们获取图像、压缩它、应用过滤器，并保存它！最终，这变成了一个疯狂嵌套回调的乱七八糟的局面。

幸运的是，*Promise* 可以帮助我们解决这个问题！首先，让我们重写整个代码块，以便每个函数返回一个 *Promise*。

如果图像已加载，并且一切正常，那就调用`res`来处理promise吧！否则，如果在加载文件时出现错误，那就调用`rej`来处理promise吧.![PAA-5](D:\oneothebrave.github.io\docs\images\PAA-5.png)

让我们看看当我们在终端中运行这段代码时会发生什么！

![PAA-6](D:\oneothebrave.github.io\docs\images\PAA-6.gif)

棒！正如我们预期的那样，返回了一个promise，其中包含已解析数据的值。

然后呢？我们不关心整个Promise对象，我们只关心数据的值！幸运的是，有一些内置的方法可以获得promise的值。对于promise，我们可以附加3种方法：

- `.then()`: 在promise执行`resolve`之后被执行
- `.catch()`: 在promise执行`reject`之后被执行
- `.finally()`: 无论promise执行`resolve`或者是`reject`，都会被执行

![PAA-7](D:\oneothebrave.github.io\docs\images\PAA-7.png)

`.then`方法接受传递给`resolve`方法的值

![PAA-8](D:\oneothebrave.github.io\docs\images\PAA-8.gif)

`.catch`方法接受传递给`reject`方法的值

![PAA-9](D:\oneothebrave.github.io\docs\images\PAA-9.gif)

终于，我们得到了在没有整个Promise对象的情况下由Promise生成的值！我们现在可以用这个值做任何我们想做的事情。

------

仅供参考，当您知道promise将始终`resolve`或始终`reject`时，您可以使用要reject或resolve promise的值编写Promise.resolve或Promise.reject！（翻译不明白，太难翻译了，还是看图吧）

![PAA-10](D:\oneothebrave.github.io\docs\images\PAA-10.png)

接下来你会经常看到这种语法

------

在*getImage*示例中，我们最终不得不嵌套多个回调才能运行它们。幸运的是，`.then` 处理程序可以帮助我们！

`.then` 方法本身的返回值也是一个promise值(注意是返回值哦，传给 *.then* 的是promise 的value，不是promise)，这意味着我们可以链接任意多个`.then`：前一个*then*回调的结果将作为参数传递给下一个*then*回调！

![PAA-11](D:\oneothebrave.github.io\docs\images\PAA-11.png)

在*getImage*示例中，我们可以链接多个*then*回调，以便将处理后的图像传递给下一个函数！我们得到的不是许多嵌套的回调，而是一个干净的*then*链。

![PAA-12](D:\oneothebrave.github.io\docs\images\PAA-12.png)

完美！这个写法可比之前的好多了

------

## （宏）任务队列和微任务队列



现在我们对如何创造 *promise* 以及如何从 *promise* 中提取值有了更多的了解。让我们再向脚本中添加一些代码，然后再次运行它：

![PAA-13](D:\oneothebrave.github.io\docs\images\PAA-13.gif)

等等，发生了什么！🤯

首先，“Start!” 被打印出来，这个没问题。然而第二个被打印出来的值居然是 "End!" ，而不是promise的resolve的值，"Promise!" 最后才被打印出来，发生了什么？

我们终于看到了 *promise* 的真正力量！虽然JavaScript是单线程的，但我们可以使用 *promise* 添加异步行为！

------

等等，我[事件循环](/devto-jseventloop)呢?难道我们不能使用浏览器原生的方法(如setTimeout)来创建某种异步行为吗？

当然可以！不过，在事件循环中，其实有两种类型的队列：**（宏）任务队列** 和 **微任务队列**，（宏）任务队列用于（宏）任务，微任务队列用于微任务。

那么什么是（宏）任务，什么又是微任务呢？常见的如下表所示，包括但不限于

| （宏）任务 | setTimeout` | `setInterval` | `setImmediate              |
| :--------- | -------------------------------------------------------- |
| 微任务     | Promise callback` | `process.nextTick` | `queueMicrotask |


> 本篇文章是怀着赞许与尊敬从[Lydia Hallie](https://dev.to/lydiahallie)的文章中翻译而来的，[原文](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)比这精彩地多
>

事件循环(Event loop)是JavaScript开发人员避不开的一件事，一开始理解起来可能有点困惑(反正我是挺困惑的)。原作者Lydia Hallie是个视觉学习者，以下所有的gif都是她做的，非常生动。

首先，什么是事件循环，你为什么需要了解它？

众所周知，JavaScript是单线程的 : 一次只能运行一个任务。通常来说好像没什么大不了的。但想象一下，你正在运行一项耗时30秒的任务，是的，这个任务耗时30秒，然后才能运行其他任务(默认情况下，JavaScript在浏览器的主线程上运行，因此整个UI界面就“咔”地卡住了)，现在都1202年了，没有人想要一个速度慢、反应迟钝的网站。

幸运的是，浏览器为我们提供了JavaScript引擎本身不提供的一些功能：Web API。其中包括 **setTimeout**, DOM API, HTTP API等等。这可以帮助我们创建一些异步，非阻塞行为。

当我们调用一个函数时，它会被添加进 *调用栈* (call stack)里,调用栈是JS引擎的一部分，不是特定于浏览器的，栈是**先进后出**的。当函数返回了值之后，这个函数就会从栈中弹出。

![eventLoop-1](D:\oneothebrave.github.io\docs\images\eventLoop-1.gif)

这里先是*greet*函数被推进调用栈里，然后返回“Hello”，**当函数返回值了之后，就会从栈中弹出**，因此 *greet* 函数被弹出栈。然后往下执行到 *respond* 函数， *respond* 函数返回一个 *setTimeout函数*， 因为这是栈，先进后出，所以会先把 *setTimeout* 函数弹出栈再弹出 *respond* , *setTimeout* 函数是由Web API提供的，它让我们在不阻塞主线程的情况下延迟执行任务。我们传递给 *setTimeout* 的回调函数：箭头函数 `() => {return 'Hey'}` 被添加到Web API. 与此同时， *setTimeout* 函数和 *respond* 函数从堆栈中弹出，它们都返回了自己的值！

![eventLoop-2](D:\oneothebrave.github.io\docs\images\eventLoop-2.gif)

在Web API中，有一个计时器，它的运行时间和我们传递给它的第二个参数 1000ms 一样长。回调不会立即添加到调用堆栈中，而是传递给称为***队列***的东西。

![eventLoop-3](D:\oneothebrave.github.io\docs\images\eventLoop-3.gif)

这可能是令人困惑的部分：这并不意味着回调函数在1000ms之后被添加到调用栈之中(因此返回值)，尽管若没有上面这张图，看起来就像这样，但是并不是，队列在其中也有它的戏份。而是在1000ms之后回调函数会被添加进 *队列*  。但这是一个队列，函数必须等待被执行。

接下来就来到了我们一直等待的部分..是时候让*事件循环*(Event Loop)完成其唯一的任务了：**将队列与调用栈联系起来！*如果调用栈是空的，也就是说之前所有被调用的函数都已经返回了他们的值并且已经被弹出了调用栈，那么队列中的*第一项* 将被添加进调用栈中。在这种情况下，没有调用任何其他函数，这意味着当回调函数是队列中的第一个项目时，调用堆栈为空。![eventLoop-4](D:\oneothebrave.github.io\docs\images\eventLoop-4.gif)

回调函数被添加进调用栈，被调用并返回一个值，然后从堆栈中弹出。![eventLoop-5](D:\oneothebrave.github.io\docs\images\eventLoop-5.gif)

事件循环的整体思想就介绍完了。整理一下就是：**同步执行的函数被运行时会被立刻推进调用栈中，然后执行函数，返回值，最后从调用栈中被弹出。而异步函数会被添加进Web API中，等待设置的时间后会进入队列，一直等待，直到调用栈为空，然后被推入调用栈，返回值，从堆栈中弹出。**接下里看一个例子，运行之前先想想会输出什么结果。

```js
const foo = () => console.log("First");
const bar = () => setTimeout(() => console.log("Second"), 500);
const baz = () => console.log("Third");

bar();
foo();
baz();
```

让我们来看看在浏览器运行这段代码时发生了什么：

![eventLoop-6](D:\oneothebrave.github.io\docs\images\eventLoop-6.gif)

1. 我们调用了 *bar* 函数。*bar* 函数返回一个 *setTimeout* 函数
2. 我们传给 *setTimeout* 的回调函数被添加进Web API, *setTimeout* 函数和 *bar* 被弹出堆栈
3. Web API中的计时器在计时的同时， *foo* 函数被调用并输出 "First". *foo* 返回(undefined), *baz* 被调用，回调函数进入队列
4. *baz* 输出 ”Third“. 事件循环在 *baz* 返回值后发现堆栈是空的，于是此时回调函数被添加进堆栈
5. 堆栈输出 “Second”



于是我们最终得到的结果是:

```js
First
Third
Second
```



翻译中添加了一下我自己的理解，并不是完全按照原文翻译的，可能有语句不通或者理解不准确的情况，详细文章可以移步[原作者的文章](https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif)。


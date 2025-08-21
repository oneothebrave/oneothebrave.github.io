# setState是同步还是异步？

setState这个函数本身只是一个普通的调用执行的函数，肯定是同步的。



所谓的同步还是异步其实就是看调用setState之后，**是否会立即触发一次组件重渲染**，而不是 state 是否“立即生效”。state 在任何场景中都不会在函数体中立刻改变。



结论：在react17及以前，在react可调度的范围内是异步的，反之同步。

Q：什么是react可调度范围内？

A：react合成事件，生命周期函数

Q：什么是react合成事件？

A：**React 的合成事件是 React 封装的一套跨浏览器的事件系统。它使用事件委托（统一绑定在根节点），并模拟了原生事件 API。 这样可以统一处理机制、提升性能，同时解决浏览器兼容性问题**，它在所有浏览器中都具有一致的行为。如onClick、onChange等由 React 包装的事件

Q: 什么是react可调度范围外？

A：宏任务(setTimeout, setInterval)， 微任务(promise), 或直接在DOM元素上绑定的原生事件



✅但是，  **在react18之后，setState无论在什么情况下都是异步的！！**！



| 场景                                                        | 是否异步         | 是否自动批处理          | `state` 是否立即更新可读 | 会触发几次渲染（多次 setState）             |
| ----------------------------------------------------------- | ---------------- | ----------------------- | ------------------------ | ------------------------------------------- |
| ✅ React 合成事件（如 `onClick`）                            | ✅ 是             | ✅ 是                    | ❌ 不能立即读取（是旧的） | 1 次（多次合并）                            |
| ✅ `setTimeout` / `setInterval`                              | ✅ 是             | ✅ 是                    | ❌ 是旧的（闭包）         | 1 次（同一宏任务内） 🔁 多次 if 多个 timeout |
| ✅ `Promise.then()` / `async/await`                          | ✅ 是             | ✅ 是                    | ❌ 是旧的                 | 1 次（同一个微任务）                        |
| ✅ React 生命周期方法（`useEffect`, `componentDidMount` 等） | ✅ 是             | ✅ 是                    | ❌ 是旧的                 | 1 次                                        |
| ⚠️ 多个宏任务（多个 `setTimeout`、多个 `await`）             | ✅ 是             | ❌ 否（批处理无效）      | ❌ 是旧的                 | 多次                                        |
| ⚠️ 原生 DOM 事件（`addEventListener`）                       | ✅ 是             | ✅ 是（React 18 才支持） | ❌ 是旧的                 | 1 次（React 18） 多次（React 17）           |
| ✅ 同步函数内多次调用 `setState(fn)`                         | ✅ 是             | ✅ 是                    | ❌ 是旧的（不会中断执行） | 1 次                                        |
| ❗ 使用 `flushSync()` 包裹                                   | ❌ 否（强制同步） | ❌ 否                    | ✅ 可立即读取             | 每次都立即触发渲染                          |

从上表可以看出:

1. state的值一直都是旧值(flushSync除外)
2. setState只是触发一次更新请求，不会中断下面代码的执行或立即重渲染组件
3. 如果遇到多个setTimeOut中都有setState的情况，React会在每个setState执行之后 继续执行后续 JS（无中断），并“安排”一次重渲染，渲染完成之后继续下一次重渲染...



什么是自动批处理？

多个 `setState` 在一次任务（事件、微任务、effect 等）中执行时，**React 会合并这些状态更新，只触发一次渲染**。

- `React 17` 只在合成事件 & 生命周期中支持
- `React 18` 在大多数异步场景中都自动支持（Promise、setTimeout、原生事件等）



> 在 React 18 中，`setState` 在所有场景（包括原生事件、setTimeout、Promise 等）都是异步的，并且大多数情况下都支持自动批处理，只会在**跨多个宏任务时才拆分成多次渲染**。





# useMemo和useCallback的区别

| 对比维度     | useMemo                                    | useCallback                                   |
| ------------ | ------------------------------------------ | --------------------------------------------- |
| 作用         | 缓存**计算结果**                           | 缓存**函数引用**                              |
| 返回值       | 某个**值（可能是对象、数组、数字）**       | 一个**函数**                                  |
| 用于         | 避免**重复计算**                           | 避免**函数地址变化导致子组件重新渲染**        |
| 依赖变化时   | 重新执行函数，返回新值                     | 返回一个新函数（闭包）                        |
| 常见配合使用 | 用在依赖复杂对象的组件中（props、context） | 搭配 `React.memo` 优化子组件 props 传入的函数 |



总结：`useMemo` 是用来缓存复杂**计算的结果**，避免在每次渲染时都重新计算；`useCallback` 则是用来**缓存函数的引用**，避免因为函数地址变了导致子组件不必要的更新。



| 错误说法                 | 为什么错                                                     |
| ------------------------ | ------------------------------------------------------------ |
| `useCallback` 能提升性能 | ❌ 不一定，**频繁创建函数并不一定有性能问题**，加了还可能占内存 |
| `useMemo` 能避免组件渲染 | ❌ 它只避免了值重复计算，不能阻止组件本身的 render            |



# 什么是虚拟DOM，为什么使用虚拟DOM？

React中的虚拟DOM是React内部用的JS对象树，用于描述UI状态。当首次渲染React组件时，就会创建一个虚拟DOM树，当组件的状态发生变化时，React会创建一个新的虚拟DOM树，然后将新的树与之前的树进行对比，用找到差异来更新实际DOM的部分。这样只修改真正变化的部分，提高性能，将多个更新批处理，还能减少重渲染的次数。缺点：在非常具体、高度优化的场景中，它的性能可能不如手动 DOM 操作



# 事件机制

React 事件机制

React的事件和普通的HTML事件有什么不同？

React 组件中怎么做事件代理？它的原理是什么？



原生的HTML事件是将事件绑定在每个目标元素上，在捕获阶段从根节点开始往下捕获，直到目标元素，然后触发目标元素的事件，接着往上冒泡直到根元素。

React的事件机制是通过合成事件和事件委托实现的。React采用事件委托机制，将事件绑定在根节点，当浏览器触发事件之后，react不会在目标元素或者其父元素上直接触发回调，而是先与原生事件类似，经过捕获冒泡，当事件冒泡到根节点，react会拦截这个原生事件，然后构建合成事件对象SynthnicEvent，这个对象封装了原生事件属性比如target，currentTarget等。由于React在构建Fiber树时，如果发现绑定了事件，就会把事件处理器存到Fiber节点上 ，于是当事件冒泡到根节点时，react根据fiber树从目标向上收集绑定的事件回调，接着按顺序手动执行捕获->目标->冒泡阶段的回调。所以React的事件流是“可控的模拟事件流”，而不是直接使用浏览器事件流。



# React如何获取组件对应的DOM元素？

1. 通过使用useRef()  例如：

```jsx
import { useRef, useEffect } from "react"

function MyComponent(){
	const myRef = useRef(null);
  
  useEffect(() => {
    myRef.current.focus();
  }, []);
  
  return (
  	<input ref={myRef} />
  )
}
```

2. 类组件的createRef()

3. 通过使用useImperativeHandle自定义由ref暴露出来的句柄

4. 回调Ref

   ```jsx
   function MyComponent() {
     let inputEle = null;
     
     function setInputEle(ele) {
       inputEle = ele;	
     }
     
     useEffect(() => {
       inputEle.focus();
     }, []);
     
     return <input ref={setInputRef} />;
     
   }
   ```

​	

> # **为什么回调ref可以绑定dom元素？**
>
> 譬如有这么一段：
>
> ```jsx
> <input ref={(el) => console.log(el)}>
> ```
>
> 传给ref的就是一个回调函数。在虚拟DOM(Fiber)上，这个函数会被传给FiberNode的ref属性：
>
> ```js
> FiberNode {
>   type: "input",
>   stateNode: <真实DOM>, // commit 阶段创建
>   ref: (el) => console.log(el)  // 你的回调函数
> }
> 
> ```
>
> 在render阶段，Fiber会生成一棵新的Fiber树，但不会直接调用ref，只是在内存中准备好数据
>
> 回调ref不会在渲染阶段绑定DOM，而是等到commit阶段
>
> -------------------
>
> 在commit阶段，开始**挂载DOM**和**更新ref**
>
> 核心源码在 `react-reconciler/src/ReactFiberCommitWork.js`：
>
> （简化版）
>
> ```js
> function commitAttachRef(finishedWork: Fiber) {
>   const ref = finishedWork.ref;  
>   if (ref !== null) {
>     const instance = finishedWork.stateNode; // 真实DOM或class实例
> 
>     if (typeof ref === 'function') {
>       ref(instance);  // ✅ 调用你的回调，传入真实DOM
>     } else {
>       ref.current = instance;
>     }
>   }
> }
> ```
>
> ps: `finishedWork` 在 **渲染完成但未提交**时，**指向 workInProgress 树的根节点**。提交完成后，才会被置为null
>
> 由上可以看到，当FiberNode的ref的类型是function时，也就是传给ref的是个回调ref时，会走ref(instance)，这个instance就是真实DOM.
>
> 因此，**回调 ref 可以绑定 DOM 的本质原因是**：
>
> ​			React 在 **commit 阶段**已经拿到了真实 DOM，然后**显式调用**你的回调函数，把 DOM 节点作为参数传给你。
>
> 下方的else分支就是当使用的是useRef时的情况，将DOM赋值给了ref.current
>
> ## 回调 ref 的优势是什么？
>
> 因为 **回调 ref 的调用是同步的**，你可以在 **ref 变化的瞬间**执行副作用(也就是回调函数里你自己写的东西)，而 `useRef` 不会。
>
> ps：在 commit 阶段：
>
> - React 会先调用 `logRef(null)` 卸载旧 DOM。
> - 再调用 `logRef(newDom)` 绑定新 DOM。



# 对React的插槽(Portals)的理解，如何使用，有哪些使用场景？ 

React 提供了 `ReactDOM.createPortal(children, container, key?)` 方法，允许你**将某段 JSX 内容渲染到与当前组件 DOM 层级不同的位置**。
 返回值是一个 **React 元素**，在 React 的虚拟 DOM 树(Fiber)中仍然属于原来的父组件，但真实 DOM 会挂载到你指定的 `container` 节点中。**Portals 只改变真实 DOM 挂载点，不会改变 React 虚拟 DOM 树(Fiber)结构，事件冒泡仍然沿 React 树传播**（即走react的事件机制）。

使用场景：

1. 模拟对话框/弹窗

		   2. 悬浮层组件，如Tooltip, Popover
		   2.  跨react树渲染。在 React 应用和非 React 应用混合时，可能需要将 React 组件渲染到非 React 管理的 DOM 节点



# 在 React 中如何避免不必要的 render？

从开发者的角度来说：

1. React.memo : 记忆化函数组件， props不变则跳过渲染
2. useMemo / useCallaback : 缓存计算结果和函数引用， 避免子组件不必要更新
3. 拆分组件： 缩小渲染范围
4. 避免匿名函数和内敛对象： 防止每次生成新引用导致子组件渲染

```jsx
// ❌ 每次 render 生成新对象，导致子组件重新渲染
<Child style={{ color: 'red' }} />

// ✅ 提前定义
const style = useMemo(() => ({ color: 'red' }), []);
<Child style={style} />

```



从react内部优化的机制来说：

React 在 Reconciliation 阶段会对比 **current Fiber 树**和**workInProgress Fiber 树**。

如果某个节点 props/state/context 没有变化，React 会**直接复用之前的 Fiber**，跳过更新。



# React中什么是受控组件和非控组件

核心区别在于 **表单数据由谁管理**

1. 受控组件  （需要实时校验或表单联动使用）

​	表单元素的值由 React **状态（state）** 控制。

- 表单的 **value** 始终等于 React 组件的 state。
- 用户输入会触发 `onChange` → 更新 state → React 重新渲染 → 表单显示新值。
- 数据源是 **React 的 state**，UI 和数据是单向绑定的。

2. 非受控组件   （简单表单使用）

​	表单元素的值**由 DOM 自己管理**，React 不直接控制它的值，而是通过 **ref** 读取

- 表单的值不是通过 state 绑定的，而是直接存储在 DOM 元素内部。
- 当需要拿到表单值时，通过 `ref` 获取。
- React 只负责渲染，不负责存储和同步表单值。

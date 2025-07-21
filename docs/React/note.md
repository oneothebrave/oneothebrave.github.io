
# 【React 笔记】




## 为什么JSX里原先的class属性要改成className

因为JSX是一个**JavaScript对象**，其中的属性，比如:alt="xxxxx" class="xxx" 等会被储存进键值对中，但是由于class是JS里的关键词，所以不能直接用class，而是改成驼峰式的写法className。stroke-width也要被strokeWidth取代，不能出现“-”

## 为什么维护一个状态不能用局部变量

1. **局部变量无法在多次渲染中持久保存。** 当React再次渲染这个组件时，它会从头开始渲染--不会考虑之前对局部变量的任何更改。
2. **更改局部变量不会触发渲染。** React没有意识到它需要使用新数据再次渲染组件

  因此，要使用新数据更新组件，需要做两件事：

1. **保留** 渲染之间的数据
2. **触发** React使用新数据渲染组件(重新渲染)

## React组件渲染是指什么

在 React 中，“组件的渲染” 是一个核心概念，它指的是：

> ***将 React 组件的 JSX 描述转换为浏览器可以显示的 DOM 元素的过程。***

🧠 更具体一点地说，**组件渲染 = React 执行函数组件（或类组件） → 得到 JSX → React 把 JSX 转换为真实 DOM**

### ✅ 一个简单例子：

```js
function Hello() {
  return <h1>Hello, world!</h1>;
}

ReactDOM.render(<Hello />, document.getElementById('root'));
```

👉 这里的渲染流程如下：

1.  **ReactDOM.render()** 被调用；
    
2.  React 创建 `<Hello />` 组件的实例；
    
3.  调用 `Hello()` 函数，拿到返回的 **JSX**；
    
4.  React 把 JSX 转换为 DOM（浏览器能识别的 HTML 元素）；
    
5.  把 DOM 插入到页面中 `#root` 节点里。
    

----------

### 🔄 如果组件的 props、state、context 发生变化：

> React 会触发“重新渲染”：

1.  比如你通过 `setState()` 改变了状态；
    
2.  React 检测到状态变化；
    
3.  重新执行组件函数，生成新的 JSX；
    
4.  React 用 **Diff 算法** 找出新的 JSX 和旧的 JSX 有哪些不同（这就是 Virtual DOM 的工作）；
    
5.  最后只更新必要的 DOM 节点，提高性能。
    

----------

### 🎯 总结一句话：

> React 的渲染过程 = 把组件函数执行 → 得到 JSX → 把 JSX 转换成真实 DOM → 放到页面上（或更新已有的 DOM）


## useState() 的原理

useState() 内部会维护一个数组state，这个数组会**按顺序**保存需要维护的值，每次渲染时，React会通过[**调用顺序**]来匹配每个useState和state[]中的正确位置。以下是模拟实现代码:
```js
let state = [];
let stateIndex = 0;

function useState(initialValue) {
	const currentIndex = stateIndex;
	
	if (state[currentIndex] === undefined) { // 第一次
		state[currentIndex] = initialValue;
	}
	
	function setState(newValue) {
		state[currentIndex] = newValue;
		render(); // 重新渲染组件
	}

	stateIndex ++;

	return [state[currentIndex], setState]
}

function render() {
	console.log('-----重新渲染组件------');
	stateIndex = 0;
	MyComponent();  // 函数组件
	console.log('------渲染结束------')
}
```

##  关于state不得不说的事

 - React 会使 state 的值始终“固定”在一次渲染的各个事件处理函数内部
 -  React会**同时更新**多个 非刻意触发（如点击） 引起的state的变化，从而不会触发太多的重新渲染.这就是**批处理**
 - state的变化（调用setXxxx），是在告诉React，下次重新渲染时，**用state的这个新状态**。所以调用setXxx并不会立即改变state的值
 - 应把所有存放在 state 中的 JavaScript 对象都视为**不可变**的，无论变量是数字类型，字符串类型，布尔类型这些在JS中本身就不可更改的类型，还是数组，对象可更改的。 都应该用新的值去**替换**它们，而不是去改变它们本身
 - 状态与渲染树中的组件位置相关:**只要同一个组件还被渲染在 UI 树的相同位置，React 就会保留它的 state。** 如果它被移除，或者一个不同的组件被渲染在相同的位置，那么 React 就会丢掉它的 state。
		 - 🧠如何定义 **同一个组件？** 即：React是怎么判断“两个组件是同一个”的？
		   React主要依据: **组件的“类型” + "key"是否一致** 来判断。“key"不多赘述。 
		  - 🧠“组件的类型”指的是什么？
		     简单说：**组件的类型就是它的定义函数本身**。 例如：
		     ``
		     function A() { return <div>A</div>; } ``
		  -  ``function B() { return <div>B</div>; }
		        ``
		        A和B就是两个完全不同的函数。 再比如：
	```js
	
	function Counter(props) {
	  return <div>{props.value}</div>;
	}
	
	const el1 = <Counter value={1} />;
	const el2 = <Counter value={2} />;
	```
	虽然 `props.value` 不一样，但类型是同一个组件函数 `Counter`，因此React 会复用组件，只更新 props，不会重建组件或清除内部 state
        
    JS 层面就是这样比较的：
      ```
	  if (prevElement.type === nextElement.type) {
	  // 同类型，复用组件
	} else {
	  // 不同类型，卸载旧组件，挂载新组件
	}
	  ```

- 当传给setState的参数是**更新函数**的时候，也只是‘安排’下一轮的状态要变，并不会立即更新state的值

  ```js
  const [count, setCount] = useState(0);
  
  function handleClick(){
      setCount(prev => prev + 1);  // 告诉 React 下一轮用 prev + 1
    	console.log(count);          // 输出当前这一轮的 count 值（0）
  }
  ```

  ```js
  const [count, setCount] = useState(0);
  
  function handleClick(){
      setCount(count + 1);      // 告诉 React 下一轮用 1
    	console.log(count);       // 输出当前这一轮的 count 值（也是0）
  }
  ```

  `count` 是 React **当前函数组件作用域里的一份快照值**，即旧值（闭包中的 `count`）

  #### 那函数式更新的优势是什么？

  函数式更新的 **好处是：无论你闭包里是旧的还是新的值，React 会帮你拿最新状态计算**，比如：

  ```
  jsx复制编辑setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  ```

  这样你就能连续加 2，哪怕这两句都在同一个闭包中。

  但打印 `count` 仍然是旧值，因为打印的是**这次 render 中的值**，而不是 React 内部“即将”更新的状态。





## 渲染和提交

 1. **触发**一次渲染

	 - 组件**初次渲染**
	 - 组件(或者其祖先之一)的**状态发生了改变**

 2. **渲染**组件
	 1. React会再次调用你的函数
	 2. 函数会返回新的JSX快照
	 3. React会更新界面以匹配返回的快照
 3. **提交**到DOM
	 - **React 仅在渲染之间存在差异时才会更改 DOM 节点**




##  useReducer

 - 为什么叫Reducer? 因为它是以数组上的reduce()函数命名的。reduce()函数的功能就是将数组中的多个值”累加“成一个值，传给reduce()的函数称为"reducer": 接收**目前的**结果(**状态**)和当前的值(**action**)，返回下一个结果(**状态**)
 - 与useState不同，它不是通过设置状态来告诉React”新的状态是什么，你给我用新的状态去替换原先的状态“。而是dispatch一个action来指明”用户刚刚做了什么“。（状态更新逻辑则保存在其他地方，也就是你要自己写的Recuder函数）
 - 每次调用dispatch(action)， 就会执行reducer(state, action)来生成新的状态，并**重新触发渲染**




##  useRef

 - 组件不会在每次更改ref.current的值时重新渲染
 - React会在每次重新渲染之间保留ref，这点就跟state一样
 - 当一条信息用于渲染时，将它保存在 state 中。当一条信息仅被事件处理器需要，并且更改它不需要重新渲染时，使用 ref 可能会更高效
 - 可以想象useRef是这么实现的:
	 ```
	 // React 内部  
	function useRef(initialValue) {  
		const [ref, unused] = useState({ current: initialValue });  
		return ref;  
	}
	```
	
 - 用 <div ref={myRef}>将对该节点的引用放入myRef.current中来操纵DOM元素



## useEffect

 -  Effect 允许你指定由渲染本身，而不是特定事件引起的副作用。其在提交结束后，页面更新后运行
 - useState(), useReduce(), useRef() 是纯计算， useEffect()不是纯计算，它是由**渲染引起的副作用**
 - 每当组件渲染时，React会先更新页面，然后再运行useEffect中的代码。换句话说，useEffect会**"延迟"一段代码的运行，直到渲染结果反映在页面上**
 - 通过将 DOM 更新封装在 Effect 中，你可以让 React 先更新页面，然后再运行 Effect。
 - 依赖数组可以包含多个依赖项。只有当你指定的 **所有** 依赖项的值都与上一次渲染时完全相同，React 才会跳过重新运行该 Effect。React 使用 [`Object.is`]来比较依赖项的值
 -  依赖项:
   ```
	   useEffect(() => {  
		// 这里的代码会在每次渲染后运行  
		});  


		useEffect(() => {  
			// 这里的代码只会在组件挂载（首次出现）时运行  
		}, []);  


		useEffect(() => {  
			// 这里的代码不但会在组件挂载时运行，而且当 a 或 b 的值自上次渲染后发生变化后也会运行  
		}, [a, b]);
   ```
 - 在useEffect()中返回一个函数，该函数被称为清理函数，React 会在每次 Effect **重新运行之前**调用清理函数，并在**组件卸载**（被移除）时最后一次调用清理函数
 - 全局变量不能作为响应式
 - useRef返回的ref对象可以作为依赖项,但是ref.current不能
   ```





## memo

#### `memo(Component, arePropsEqual?)`

memo将 一个组件包裹在其中，返回一个**记忆化**的版本，允许你的组件在 props 没有改变的情况下跳过重新渲染，即使父组件重新渲染了，它也不会被重新渲染，不过它仍是一个组件，所以当自己的state或正在使用的context发生更改，组件也会重新渲染。memoization 只与从父组件传递给组件的 props 有关

arePropsEqual: 传一个函数，返回当前的props与新的props是否相同的boolean值。通常不需要手动写，默认使用Object.is()比较，因此如果props是对象或者数组，那么由于Object.is是浅比较(Object.is({}, {})返回false)，则即使它们每个元素都相同，React 仍会认为它已更改



总结：`React.memo` 是一个高阶组件，用于对**函数组件进行记忆化处理**。它通过对传入的 props 进行**浅比较**，如果 props 没有变化，就会跳过子组件的重新渲染。这能显著优化**重渲染开销大的子组件**，比如静态列表项、复杂图表等


















































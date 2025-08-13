# 为什么要引入Fiber？

旧的React采用的是“递归更新虚拟DOM”，在遇到大组件树时：

- 一旦开始diff -> 必须同步执行到底 ->浏览器无法打断
- 阻塞主线程，打字卡顿，按钮无响应

Fiber目标：

- 可中断
- 支持优先级
- 并发更新
- 更好的错误处理



# 什么是Fiber？

Fiber是React内部用来表示组件状态和更新的一个“工作单元”

每个组件,DOM元素，文本节点都被表示为一个**Fiber Node**， 它就是一个JS对象，长这样：

```js
const fiberNode = {
  tag: 0,         // 当前组件类型或 DOM 标签
  key: null,      // 组件 key，用于 diff
  type: 'div',    //表示节点类型（函数组件、类组件、DOM）
  stateNode: DOMElement,  //对应的真实 DOM 或类组件实例，函数组件没有实例
  child: null,
  sibling: null,
  return: null,  // 父级 Fiber 节点
  pendingProps: {},
  memoizedProps: {},
  memoizedState: {},  // 存储组件的状态信息，对于函数组件是 Hook 链表，对于类组件是 state 对象
  updateQueue: null,
  alternate: null,  // 用于实现双缓存机制
  flags: 0,
  subtreeFlags: 0,
  lanes: 0,
  ...
};

```



比如这样子的一个组件：

```js
function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

- React 会为 App 创建一个 Fiber 节点（`type=App`）
- 为<div>创建一个Fiber子节点
- 每次setCount触发，Fiber会重新构建对应树，并进行对比

那么完整的 Fiber 树结构就是：

```js
{
  // App 组件节点
  type: App,
  tag: FunctionComponent,
  updateQueue: null,  // 这是 Fiber 节点的顶层属性  函数组件通常为null
  stateNode: null,  // 对应的真实 DOM 或类组件实例（函数组件没有实例）   比如：DOM 对象或 this
  memoizedState: {  // Hook 链表
    memoizedState: 0,  // count 的当前值
    queue: {        // Hook 的更新队列
      pending: null,            // 待处理的更新
      dispatch: setCount,
      // ...更新队列信息
    },
    next: null
  },
  
  child: {
    // div 节点
    type: "div",
    tag: HostComponent, // 因为它是DOM
    stateNode: <div></div>,  // 真实 DOM 元素
    memoizedState: null,
    
    child: {
      // h1 节点
      type: "h1",
      tag: HostComponent,
      stateNode: <h1></h1>,
      memoizedState: null,
      
      child: {
        // 文本节点
        type: null,
        tag: HostText,
        stateNode: "Count: 0",  // 文本内容
        memoizedState: null
      },
      
      sibling: {
        // button 节点
        type: "button",
        tag: HostComponent,
        stateNode: <button></button>,
        memoizedState: null,
        
        child: {
          // 文本节点
          type: null,
          tag: HostText,
          stateNode: "Increment",
          memoizedState: null
        }
      }
    }
  }
}
```

**Fiber 节点的 `updateQueue`**: 存储 Fiber 节点级别的更新信息，主要用于类组件和根节点

**Hook 对象的 `queue`**: 存储单个 Hook 的更新信息，用于函数组件的状态管理





# 双缓存机制

Fiber中的alternate字段用于实现**双缓存机制**：

- 双缓存机制维护两棵Fiber树:**current**和**workInProgress**
- 渲染时，Reac不修改当前Fiber，而是**构建一个新的Fiber树**
- 构建完成后，交换**current**和**workInProgress**

**1. 初始状态：**只有 Current Tree 存在，显示当前的 UI 状态。

**2. 更新开始：**React 创建 WorkInProgress Tree，通过 alternate 指针连接两棵树。

**3. 构建过程：**在 WorkInProgress Tree 中应用所有更新，不影响当前显示。

**4. 提交阶段：**交换 Current 和 WorkInProgress 的角色，新树成为 Current Tree。
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





# 优先级顺序

```js
// 优先级示例
const priorities = {
  IMMEDIATE: 1,        // 用户输入事件
  USER_BLOCKING: 2,    // 用户交互
  NORMAL: 3,          // 网络请求结果
  LOW: 4,             // 数据分析
  IDLE: 5             // 空闲时间
};
```





# 中断恢复

```js
// 简化的工作循环概念
function workLoop() {
  while (nextUnitOfWork && !shouldYield()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  // 关键：只有在shouldYield()返回true时才会停止
  // shouldYield()会检查：
  // 1. 时间是否用完
  // 2. 是否有更高优先级的任务
  // 3. 浏览器是否需要做其他事情
}

// shouldYield检查是否应该中断
function shouldYield() {
  return (
    getCurrentTime() >= deadline ||           // 时间到了
    hasHigherPriorityWork() ||               // 有更高优先级任务
    needsToYieldToBrowser()                  // 浏览器需要响应
  );
}
```

中断过程：

1. 浏览器需要绘制或用户有交互时，*shouldYield()* 返回true
2. React保存当前的 *nextUnitOfWork*
3. 将控制权交还给浏览器
4. 浏览器处理其他任务（绘制，用户输入等）

恢复过程：

1. 浏览器空闲时，调度器重新开始工作
2. 从保存的 *nextUnitOfWork* 继续执行
3. 继续构建Fiber树直到完成或再次中断

```js
// Fiber节点保存了恢复所需的所有信息
const workInProgressRoot = {
  current: currentFiberTree,      // 当前显示的树
  finishedWork: null,             // 完成的工作
  nextUnitOfWork: interruptedFiber, // 被中断的位置
  // ...
};

// 恢复时从这里继续
function resumeWork() {
  nextUnitOfWork = workInProgressRoot.nextUnitOfWork;
  workLoop(); // 继续之前中断的工作
}
```

中断渲染分几种情况，但不是每种情况引发的中断渲染都会导致相同的恢复渲染

**时间片用完**：保存进度，从`nextUnitOfWork`继续

**高优先级中断**：丢弃进度，从根节点重新开始

**同等优先级**：通常合并处理，不中断渲染。但同样会舍弃进度，从根节点重新开始

**低优先级**：不会中断当前渲染
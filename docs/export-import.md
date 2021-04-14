# 概述

> ***module.exports ， exports / require*** : 只有node支持的导出/引入
>
> ***export default ， export / import*** : 只有es支持的导出/引入

# module.exports , exports / require

在一个node执行一个文件时，会给这个文件内生成一个 `module`和`exports`对象，我们将这两个对象输出，可以看到module这个对象有个exports属性，值是`{}`。而exports的值也是`{}`。且两者指向**同一个内存地址**。

```js
console.log(module)
/*
Module {
  id: '.',
  path: '...',
  exports: {},
  parent: null,
  filename: '...',
  loaded: false,
  children: [],
  paths: [ ... ]
}
*/
console.log(exports)
// {}
console.log(module.exports === exports)
// true
```

现在来修改下`module.exports`和`exports`的值

```js
exports.name = "oneo"
console.log(module.exports) //{ name: 'oneo' }
console.log(exports) //{ name: 'oneo' }

module.exports.age = 24
console.log(module.exports) // { name: 'oneo', age: 24 }
console.log(exports) // { name: 'oneo', age: 24 }
```

很显然，由于两者指向同一个内存地址，修改其中一个另一个也会发生改变。

那么使用`require`引入时，引入的到底是哪个值呢？

```js
////// unit.js
exports.name = "oneo"
module.exports.age = 24
// exports == module.exports == { name: 'oneo', age: 24 }
exports = "Demacia" // 改变exports的指向

////// test.js
const a = require("./unit")
console.log(a) // { name: 'oneo', age: 24 }
```

我们在`unit.js`中改变了`exports`的指向，然后在`test.js`中将`unit.js`引入，输出，发现还是 `{ name: 'oneo', age: 24 }`,没有改变，这是否意味着真正控制模块导出的其实是`module.exports`呢？

答案是 : **YES**

来验证一下:

```js
////// unit.js
exports.name = "oneo"
module.exports.age = 24
// exports == module.exports == { name: 'oneo', age: 24 }
module.exports = "Demacia" // 改变module.exports的指向

////// test.js
const a = require("./unit")
console.log(a) // Demacia
```

确实，我们修改了`module.exports`指向的值之后，在另一个js文件中引入的值也发生了变化。说明*真正控制模块导出的其实是`module.exports`*。也就是说，很不幸，可怜的`exports`只是个工具人，帮助`module.exports`操作内存中的数据，累死累活到最后真正被`require`进去的内容还是`module.exports`的，而且随时可能被改变指向，改变完指向之后对`module.exports`来说就没有作用了。像不像你和你的上级 : )

所以为了引起想不到的麻烦，尽量用`module.exports`导出,`require`导入。



# export default , export / import

这几个就是ES中的导出导入了。首先了解几点：

1. export与export default均可用于导出常量、函数、文件、模块等
2. 在一个文件或模块中，export、import可以有多个，export default仅有一个
3. 通过export方式导出，在导入时要加{ }，export default则不需要(如果加了，则导出的是个对象，而不是赋的值)
4. export能直接导出变量表达式，export default不行。

```js
////// unit.js
const name = "oneo";
const run = function(){
    console.log("running...")
}
const sleep = function(){
    console.log("sleeping...")
}

export default name // 第一种导出方式
export {run, sleep} // 第二种导出方式
export const age = 24 // 第三种导出方式


////// test.js
// 由于name是由export default导出的，import的时候可以取任意名字，不一定是name
// 但是由export导出的对象就要与原来的名字相同
import name, {run as r, sleep, age} from './unit.js'
console.log(name) // oneo
r() // running...
sleep() // sleeping...
console.log(age) // 24

```

注意以上代码要在`module`中运行。
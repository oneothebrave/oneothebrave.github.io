

# 什么是TypeScript?

**TypeScript** 就是 **JavaScript** 的严格超集，提供了静态类别检查，可通过编译转译为 JavaScript 。任何现有JavaScript 程序都是合法的  **TypeScript** 程序。

# 安装，编译TypeScript

全局安装：

```shell
npm install -g typescript
```

编译( *tsc* : *typescript compiler* )：

```
// a.ts => a.js
tsc a.ts

// a.ts => b.js
tsc --outFile b.js a.ts 

// .ts文件修改时就编译  w:watch
tsc a.ts -w
```

一般的ts项目中，`.ts`文件都放在 *src* 文件夹下，编译好的 `.js`文件和其他一些静态文件都放在 *public* 文件夹下。要想一次性编译所有 *src* 文件夹下的 `.ts` 文件到 *public* 文件夹下，可通过在命令行输入:

```shell
tsc --init
```

用来在根目录下生成一个 `tsconfig.json` 配置文件。

![ts-1](/images/ts-1.jpg)

通过更改 `tsconfig.json` 文件中的 `rootDir`，可指定需要编译的 `.ts`文件存放的目录；

通过更改 `tsconfig.json` 文件中的 `outDir`，可指定编译完成的 `.js`文件存放的目录；

![ts-2](/images/ts-2.jpg)

配置好之后，直接在命令行输入

```shell
tsc
```

或者

```shell
tsc -w
```

来将需要编译的 `.ts`文件编译成指定目录下的 `.js`文件。

若你在其他目录下也创建了一个 `.ts` 文件，并且不想编译它，你可以在 `.tsconfig.json` 加上一个 `include`属性来指定 **只编译某个目录下的文件** ：

![ts-3](/images/ts-3.jpg)

# TypeScript 语法

### 1. 基本类型变量

- 声明

在 **TypeScript** 中，可以用 `var`,`let`,`const` 来声明变量，编译后为了兼容低版本，一律会转译为 `var`。当只想声明一个变量，但不对它进行赋值时，需要先提前指定该变量的类型。这个叫 *显式声明类型*。

 声明类型的时候用 `:`，初始化的时候用 `=`

```typescript
// explicit types
let character : string;
let age : number;
let isLoggin : boolean;
```

要想让变量可以是两种或若干种类型 --- **union types**

```typescript
let uid : string|number;  // 没有括号
uid = '1'
uid = 2
console.log(uid)  // 2
```



- 初始化 

一旦变量的数据类型被指定了，就无法再更改。否则会出现红色波浪下划线，无法编译。例如：

```typescript
let character = 'mario';
character = 20;  // 红色波浪线！ Type 'number' is not assignable to type 'string'
```

给参数指定数据类型，可以在参数后面加 `:type`来指定，这样传参的时候只能传入已规定类型的参数：

```typescript
// 通过 参数名:类型 来指定参数的类型
const circ = (diameter:number) => {
    return diameter * Math.PI
}

console.log(circ(2))
```

### 2. array

- 声明


```typescript
//array -- 声明了ninjas在未来是个只能存储string类型数据的数组，但还未初始化ninjas，所以没有array的方法(push)
let ninjas : string[]
// ninjas.push('yoh')  // TypeError: Cannot read property 'push' of undefined
ninjas = ['yoh', 'maok']  // 由于声明了string类型，所以数组中只能出现string类型的数据

let ninjas2 : string[] = []
ninjas2.push('yoh')  // 由于ninjas2不仅声明了在未来是个只能存储string类型数据的数组，但声明了ninjs2是个数组，所以有数组的方法
```

声明混合数据类型的array --- **union types**

```typescript
let ninjas3 : (string|number|object)[] = []  // 有括号
ninjas3 = [1,'yoh',[1,'2']]
ninjas3.push('joj')
```



- 初始化

初始化方式和JS相同，不同的是初始化完成之后，所做的操作仅限于对array中已有的数据类型的操作：

```typescript
// names中只有string类型，所以添加或修改的只能是string类型；以此类推
let names = ['luigi', 'mario', 'yoshi'];
names.push('toad');
// names.push(3); // 红色波浪线! Argument of type 'number' is not assignable to parameter of type 'string'.
// names[0] = 3;  // 红色波浪线! Type 'number' is not assignable to type 'string'.


// mixed当中有string，number，boolean类型，所以添加或修改的包括但仅限于这三种类型
let mixed = ['tosh', 3, 'mojave', 8, true];
mixed.push('moko');
mixed.push(7);
mixed.push(false);
mixed[0] = 9;
// mixed.push([1,2]) // 红色波浪线!

```

可通过重新赋值成为另一个array

```typescript
names = []
mixed = []

// 能包括的数据类型也只限于刚开始拥有的数据类型
names = ['one']
mixed = ['mixed', 4]   
```



### 3. object

- 声明


```typescript
// 声明了ninja类型为object，所以任何类型为object的都可为ninja赋值
let ninja : object;
ninja = {name: 'mario', age: 20, beltColor: 'black'}
ninja = []

// 不仅声明了ninja2类型为object，还规定了属性及其类型。初始化时要求必须有相同的结构
let ninja2: {
    name: string,
    age: number,
    beltColor: string
}
ninja2 = {name: 'mario', age: 20, beltColor: 'black'}
//ninja2 = []  // 红色波浪线！
```



- 初始化

初始化一个object之后，无法再增加新的属性。修改现有的属性也只能在属性值的同类型之间修改

```typescript
let ninja = {
    name: 'mario',
    belt: 'black',
    age: 20
}；
// 红色波浪线! Property 'skills' does not exist on type '{ name: string; belt: string; age: number; }'.
// ninja.skills = ['fighting', 'sneaking']  
ninja.name = 'oneo';
// ninja.age = 'twenty'  // 红色波浪线! Type 'string' is not assignable to type 'number'.


```

初始化`ninja`为object类型之后，自然就不能修改`ninja`为其他类型，如 `string`,`number`等。

可以重新赋值为另一个object，但是结构要保持相同（而array是没有结构要求的）

```typescript
// ninja = 'typestring'  // 红色波浪线!

// 重新赋值为另一个object， 属性顺序无所谓
ninja = {
    name: 'avan',
    age: 30,
    belt: 'white',
}

// 但是结构一定要与原来相同
// ninja = {  // 红色波浪线!
//     name: 'mario',
//     belt: 'black',
// }  
```



### 4.any

当变量的类型被指定为 **any** 时，那这个变量的类型就可以变来变去了

```typescript
let character: any;
character = 'malong'
character = 1
character = []

let mixed : (any)[] = []
mixed.push(5)
mixed.push('cc')
mixed.push(false)
mixed.push({})

let ninjs : {name: any, age: any} 
ninjs = {name: 25, age: 'lo'} // 属性值可以是任何值，但是总体的结构不能改变（无法增删改）
```



### 5.function

- 声明

```typescript
let greet: Function;  // 注意声明function的时候是大写的F
```



- 初始化

1. 不带参数

   ```typescript
   const greet = () => {
   	console.log('hello')
   };
   ```

2. 带参数

   - 参数类型相同

   ```typescript
   const add = (a: number, b:number) => {
   	console.log(a + b)
   };
   add(10,20);
   ```

   - 参数类型不同

   ```typescript
   const add = (a: number, b:number | string) => {
     // 红色波浪线！ Operator '+' cannot be applied to types 'number' and 'string | number'
   	// console.log(a + b) 
     // 我的理解是typescript是严格模式的javascript，现在a+b不能确定是30还是1020，所以报错。
     
     console.log(a)
     console.log(b)
   };
   add(10,20);
   ```

   - 可选参数

   ```typescript
   const add = (a: number, b: number, c?: number) => {
       console.log(a + b)
       console.log(c)
   };
   add(10, 20, 50)
   ```

   - 可选参数带默认值

   ```typescript
   const add = (a: number, b: number, c: number = 100) => {
       console.log(a + b)
       console.log(c)
     };
   add(10, 20)
   ```

3. 返回值

   返回值的类型是确定的。可以在参数的括号后面添加 `:type` 来指定。

   若不显式指定，则返回值类型会根据参数的类型来决定；
   
   若指定了类型，则返回值类型就是指定的类型
   
   ```typescript
   const add = (a: number, b: number): number => {
       return a + b
     };
   let result = add(10, 20);
   console.log(result) // 30
   
   // result = '30'  // 红色波浪线！ result的数据类型为number,无法修改
   ```
   
   像上面那些只有 `console.log()`的，没有返回值的函数，返回值是 `void`，因此下面两个是等价的：
   
   ```typescript
   const minus = (a: number, b: number) => {
     console.log(a - b)
   }
   ```
   
   与
   
   ```typescript
   const minus = (a: number, b: number): void => {
     console.log(a - b)
   }
   ```
   
   `void` 就像 JS 当中的 `undefined`



# 类型匿名

有下面两个相似的函数：

```typescript
const greet = (user: {name: string, uid: string|number}) => {
    console.log(`${user.name} says its id is ${user.uid}`)
}
const greetAgain = (user: {name: string, uid: string|number}) => {
    console.log(`${user.name} says its id is ${user.uid} again!`)
}
```

可以看到，两个函数都要传入一个参数 *user* ，这个参数是一个对象。两个函数基本相同，而且参数很长，写起来很麻烦，这个时候就要用到 **类型匿名** , 关键词是 `type`

```typescript
type StringOrNum = string | number;
type objWidhName = {name: string, uid: StringOrNum}

const greet = (user: objWidhName) => {
    console.log(`${user.name} says its id is ${user.uid}`)
}
```



# 函数签名

从前面我们知道了，这样可以声明一个函数：

```typescript
let greet : Function;
```

但这仅仅只是声明了 `greet` 是个函数，没有规定其他的东西。

**函数签名** 就是不仅声明这个是函数，也规定了这个函数的参数个数，类型，返回值等结构。本质上我觉得是一个 ***接口***



1. 函数无返回值

   ```typescript
   // 函数签名，确定了参数个数及其类型，返回值
   let greet: (a: string, b: number) => void;
   
   greet = (name: string, age: number) => {
       console.log(`${name} says age is ${age}`)
   }
   greet('anna', 20)
   ```

   这里，声明了 `greet` 首先是个函数，然后它携带2个参数：1个string类型，1个number类型。这个函数的返回值是 `void`，既没有返回值。

   初始化具体函数的时候，参数名不一定与声明时相同（*a*, *b* 只是表明这里有2个参数，取什么名字无所谓，随便取），但是类型一定要相同，然后不能有返回值。

   

2. 函数有返回值

   ```typescript
   let greet: (a: number, b: number) => number;
   
   greet = (num1: number, num2: number) => {
       return num1 + num2
   }
   ```

   这里，声明了 `greet` 首先是个函数，然后它携带2个参数：都是number类型。这个函数的返回值是 `number`。

   初始化具体函数的时候，可以显式地在参数的括号后面加上 `:number`，来显式地告诉开发员返回的类型，也可不加。

   

3. 对象类型的函数签名

   ```typescript
   let logDetails: (obj: {name: string, age: number}) => void;
   
   type person = {name: string, age: number};
   
   logDetails = (ninja: person) => {
       console.log(`${ninja.name} is ${ninja.age} years old.`)
   }
   ```

   这里，声明了 `logDetails` 首先是个函数，然后它传入一个对象类型的参数。这个函数的返回值是 `void`，既没有返回值。

   使用类型匿名来简化书写。

   初始化具体函数的时候，参数名不一定与声明时相同（*obj* 只是表明这里有1个参数，取什么名字无所谓，随便取），但是对象类型里的属性的类型一定要相同，然后不能有返回值。



# DOM

### 1.获取DOM

与 *JavaScript* 类似，*TypeScript* 也可直接操作Dom元素，只是稍微有点区别

```typescript
let anchor = document.querySelector("a")

// 红色波浪线！ 因为typescript并不能确定anchor一定存在。如果不存在anchor就是null。null.href就会报错。typescript不会冒这个险
// console.log(anchor.href)  
```

要保证元素存在，有两种方法

1. 判断

   ```typescript
   let myAnchor = document.querySelector("a");
   
   if (myAnchor) {
     console.log(myAnchor.href)  
   }
   ```

2. **!**

   ```typescript
   let myAnchor = document.querySelector("a")!;
   console.log(myAnchor.href)
   ```

   这个 **!** 的意思是：我，开发员，确定这个元素存在，你，typescript引擎，不用检查了!



### 2.类型转换

在获取了元素之后，将鼠标放在变量上，可以发现，这个变量(myAnchor)的类型为 `HTMLAnchorElement` ，表明TS知道这个变量的类型，类似的还有：

- HTMLInputElement
- HTMLSelectElement
- HTMLFormElement
- ........

但是当通过 `class`名或者 `id` 名获取元素时，变量的类型就成了 `Element`

```typescript
let input = docuemnt.querySelector(".myinput")!;
let form = docuemnt.querySelector("#myform")!;
```

对此，就需要进行*类型转换*（否则无法获取 *value* 等信息）

```typescript
let input = docuemnt.querySelector(".myinput") as HTMLInputElement;
let form = docuemnt.querySelector("#myform") as HTMLFormElement;
```

Tips: 元素的`valueAsNumber`值可以将输出结果转为 `number` 类型



# class

```typescript
class Invoice{
    // public是默认，不指定就是public。public意味着实例对象也可以访问和修改这个属性
    // private表示私有属性，实例对象不能访问这个属性，只能内部访问
    // readonly表示只读属性，实例对象可以访问这个属性，但是不能修改
    readonly client: string;
    private detailes: string;
    public amount: number;
  
    constructor(c: string, d:string, a:number){
        this.client = c;
        this.detailes = d;
        this.amount = a;
    }

    format(){
        return `${this.client} owes $${this.amount} for ${this.detailes}`
    }
}

const invOne = new Invoice('mario', 'work on the mario website', 200);
const invTwo = new Invoice('luigi', 'work on the luigi website', 300);

// 类似于 let names: string[] = []
// 规定了invoices这个数组中只能存放Invoice的实例
let invoices: Invoice[] = [];
invoices.push(invOne);
invoices.push(invTwo);
console.log(invoices)
```

声明类的更简洁的写法：

```typescript
class Invoice{
   // 这种写法属性前面的public是不能省略的
    constructor(
      readonly client: string,
      private detailes: string,
      public amount: number,
  	){}

    format(){
        return `${this.client} owes $${this.amount} for ${this.detailes}`
    }
}

const invOne = new Invoice('mario', 'work on the mario website', 200);
const invTwo = new Invoice('luigi', 'work on the luigi website', 300);
```



# 模块

当项目比较大的时候，会希望把一些例如类分离出去，将其 `export` 然后在需要的地方 `import` 进来，这就是模块化。由于模块化是依赖es6的，所以只支持比较新的浏览器，要实现模块化，按以下步骤：

1. 将 `tsconfig.json` 中的 `compilerOptions` 的 `target`改为 *es6*
2. 将 `tsconfig.json` 中的 `compilerOptions` 的 `module`改为 *es2015*
3. 将引入JS的 `script` 标签添加 `type="module"`
4. export & import 工作。注：import时后缀要写 `.js` 而不是 `.ts` 。因为编译后引入的是 `.js`



# 接口

接口(interface)是TypeScript有的而JavaScript没有的，用来规定对象拥有的属性及其类型，通过 **interface** 关键词来声明

```typescript
// 定义了一个Person接口，规定了要实现这个接口，就必须有2个属性和2个方法	
interface Person{
  name: sting;
  age: number;
  speak(a: string) => void;
  spend(a: number) => number;
}
```

实现接口

```typescript
// 无初始化
let him: Person;

// 初始化
let me: Person = {
  name: 'oneo',
  age: 20,
  speak(text: string): void{
  	console.log(text)
	},
  spend(money: number): number{
    console.log("I spent ", money)
    return money
  }
}
```

类实现接口: **implements**

例子：如下接口简单地规定了实现这个接口需要有个 *format* 函数，无参数，返回一个 *string* 类型的值

```typescript
// 定义接口
interface HasFormatter{
  format(): string;
}

// 类实现接口
class Workder implements HasFormatter{
  constructor(
  	public name: string,
    private salary: number
  ){}
  // 一定要有一个 format 函数
  format(){
    return `${this.name}'s salary is ${this.salary}`
  }
}
```



# 泛型

```typescript
const addUID = (obj: object) => {
    let uid = Math.floor(Math.random() * 100);
    return {...obj, uid}
}

let docOne = addUID({name: 'yoshi', age: 40})
console.log(docOne)
 // console.log(docOne.name)  // 红色波浪线！ 
```

这个函数返回一个由 原对象+uid属性对 组成的新对象，当我们试图访问 `docOne.name` 时，ts引擎会报错，因为在声明 `addUID` 时只说明了要传入一个 *object* ，并没有明确地指明其中的属性值，所以无法访问。作如下修改：

```typescript
const addUID = <T>(obj: T) => {
    let uid = Math.floor(Math.random() * 100);
    return {...obj, uid}
}

let docOne = addUID({name: 'yoshi', age: 40})
console.log(docOne.name)  // yoshi
```

将传入的值类型改为了泛型，就可以了(Beacuse this is going to be whatever type that we specify when we create an object which implements this interface）， 有点像运行时上下文的感觉。 

其中的 `<T>`和 `T` 只是约定俗称，也可以用其他的比如 `<X>`和 `X` ，只是两个要相同。

但是这样就出现了一个问题，那就是参数没有指定是 `object` 类型，也就是说可以是任何类型，这样子明显是有问题的，如:

```typescript
let docTwo = addUID("hello")
```

这明显不合逻辑，因此需要在是泛型的同时又需要指定传入的参数得是 `object` 类型：

```typescript
// 指定传入的参数得是object
const addUID = <T extends object>(obj: T) => {
    let uid = Math.floor(Math.random() * 100);
    return {...obj, uid}
}

// 更明确地指明传入的object的结构: 比如得有一个name属性，类型为string。 也可以有其他属性，但是name属性必须有
const addUID = <T extends {name: string}>(obj: T) => {
    let uid = Math.floor(Math.random() * 100);
    return {...obj, uid}
}
let docOne = addUID({name: 'yoshi', age: 40})
console.log(docOne.name)  // yoshi
console.log(docOne.age)  // 40
```

### 接口中的泛型

当我们要声明一个接口，但是其中的一个属性还不能确定或可以根据具体情况改变时，就可以用到泛型。

```typescript
// 指定泛型  注意位置是在后面的
interface Resource<T>{
  uid: number;
  resourceName: string;
  data: T
}
```

指定了之后，实现时就可以根据需求来改变

```typescript
// 指定为string类型
const resourceOne: Resource<string> = {
  uid: 1,
  resourceName: 'oneo',
  data: '2021'
}

// 指定为object类型
const resourceOne: Resource<object> = {
  uid: 1,
  resourceName: 'oneo',
  data: {time: 'now'}
}

// 指定为string的array类型
const resourceOne: Resource<string[]> = {
  uid: 1,
  resourceName: 'oneo',
  data: ['2021']
}
```

 



# 枚举类型

枚举类型通过 `enum` 关键词来定义，完整的是 **`enum` + 名字 + {...} **

```typescript
enum EnumVariableName {}  // 名字后面直接跟{...}， 没有等号
```

修改之前的例子：

```typescript
// 定义一个枚举类型变量
enum ResourceType { BOOK,  AUTHOR, FILE, DIRECTOR, PERSON}

// 规定resourceName的类型是定义好的枚举类型变量ResourceType
interface Resource<T>{
    uid: number;
    resourceName: ResourceType;
    data: T
}

// 实例化时，resourceName的值只能从ResourceType中取
const resourceOne: Resource<object> = {
    uid: 1,
    resourceName: ResourceType.AUTHOR,
    data: {time: 'now'}
}
```



# tuple

TS中，元组(tuple)和数组(array)的最大区别在于：

- array可以修改任意位置的元素成array中规定可以储存的元素
- tuple一旦元素的位置和类型确定了，则那个位置的元素就无法修改成其他类型的元素



tuple声明：

```typescript
// 与array不同，声明时必须指定每个位置的数据类型
let tup: [string, number, boolean]; 

// 声明时直接给值
// let tup: [string, number, boolean] = ['oneo', 20, true]；
```

tuple初始化:

```typescript
tup = ['oneo', 20, true];
tup[0] = 'sanchez';  // 可以，因为修改过后的类型也是string
// tup[1] = '20';   // 红色波浪线！ 因为修改过后的类型不是number
```


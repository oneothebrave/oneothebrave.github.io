# 搭建

VitePress是[VuePress](https://www.vuepress.cn/)的兄弟，是由[Vite](https://cn.vitejs.dev/)打包编译的。由于VuePress是基于Webpack构建的，因此即使是打包几个简单的页面文本，也要编译完整的Webpack项目（包括所有主题源文件），太慢了。而Vite解决了这个问题，几乎是即时启动服务器，仅编译正在提供的页面的按需编译以及快如闪电的HMR。而VitePress就是基于Vite和Vue3构建的。



其实几乎所有的内容在[VitePress的官网](https://vitepress.vuejs.org/)上都有，不过我只能找到英文的文档，耐心点看能看完，就是不方便，因此记录一下。



## 开始

1. 创建并进入目录：

   ```shell
   $ mkdir vitepress-blog && cd vitepress-blog
   ```

2. 初始化

   ```shell
   $ npm init
   ```

   然后一直敲回车就行

3. 下载VitePress

   ```shell
   $ npm add --also=dev vitepress
   ```

4. 打开项目，在根目录下创建`docs`文件夹。然后在docs文件夹下创建index.md文件，输入`# Hello vitepress`

   ```shell
   $ mkdir docs && echo "# Hello vitepress" > docs/index.md
   ```

5. 在`package.json`中添加以下脚本

   ```json
   {
     "scripts": {
       "docs:dev": "vitepress dev docs",
       "docs:build": "vitepress build docs",
       "docs:serve": "vitepress serve docs"
     }
   }
   ```

6. 把项目在本地服务器运行起来

   ```shell
   $ npm run docs:dev
   ```



这样就有了最基本的文档站点。



## 配置

最基本的文档显然不够看，至少还得有导航栏，侧边栏和一些必要的配置。

在`docs`文件夹下创建`.vitepress`文件夹，再在`.vitepress`文件夹下创建`config.js`文件，项目结构如下：

```shell
.
├─ docs
│  ├─ .vitepress
│  │  └─ config.js
│  └─ index.md
└─ package.json
└─ package-lock.json
└─ node_modules
```

`config.js`就是用来配置站点的基本文件，它export一个JavaScript对象：

```js
module.exports = {
  title: 'Hello VitePress',
  description: 'Just playing around.'
}
```


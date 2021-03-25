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




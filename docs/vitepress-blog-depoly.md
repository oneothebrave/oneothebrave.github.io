# 部署

首先确保：

- 项目根目录下有`docs`文件夹
- 打包编译后的默认位置是`.vitepress/dist`(默认就会是在这里，只要你没有乱动过)
- VitePress作为本地依赖项安装在项目中



## 先本地测试下



```shell
$ npm run docs:build
```

```shell
$ npm run docs:serve
```

第一条命令会打包项目，在`/docs/.vitepress`下生成一个`dist`文件夹，里面就是被打包好的项目文件。

第二条命令会启动一个本地服务器，这是检查打包之后的项目在你的本地环境中看起来是否正常的一种简单方法。



## GitHub Pages



首先在你项目的根目录下创建`deploy.sh`文件，输入以下内容(高亮标注的注释需要根据自己的情况取消注释并修改)：

```shell{14,22,25}
#!/usr/bin/env sh
# 告诉操作系统执行这个脚本的时候，调用/usr/bin下的sh解释器

# 出错时中止
set -e

# 打包编译
npm run docs:build

# 到dist目录下
cd docs/.vitepress/dist

# 如果要部署到自定义域
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果要部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 如果要部署到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

> 创建.github.io的教程自行google

接下来正常来说只要运行这个文件就能部署了

::: tip

Windows：打开Git Bash，输入`bash deploy.sh`

Mac： 打开terminal，输入`bash depoly.sh`

:::

如果你到这就成功了--->:tada: :tada: :tada:

但当我如上部署之后，噢吼，问题来了 :ghost:，我的.github.io上就一个大写的`<username>.github.io`链接，我那么大的Hello World呢？我在这里被卡了2个小时。

要解决问题，就先仔细看看`depoly.sh`文件。其实这就是一个自动化部署的脚本，你要是不嫌麻烦，完全可以每次部署前都从`set -e`开始一句一句手动输入。先是打包编译项目到`dist`文件夹下，接着进入到`dist`目录，然后初始化仓库并将`dist`提交到本地仓库。接下来一句是关键

```shell
$ git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
```



*git push* 命令用于从将本地的分支版本上传到远程(这里是***master***)并合并。当远程默认分支为***main***时，这个命令会创建另一个远程分支叫做***master***。也就是说,`dist`文件其实是被上传到了***master***分支上。打开github上的仓库，点击*Settings*

![settings](/images/blog-1.jpg)

往下滑，找到*GitHub Pages*，并选择*Source*的分支为***master***，根路径根据自己要求选择

![pages](/images/blog-2.jpg)

完成之后，重新跑一遍`deploy.sh`脚本，大功告成！

/*
    Article Item generator

    detailPage: 详细页面路径
    title: 文章标题
    about: 简介
    date: 撰写博客时间
    author: 作者
    intro: 文章概括
*/

function createArticleItem(title, about, date, intro, author, detail_url) {
    const article = `
        <article class="post">
            <header>
                <div class="title">
                    <h2><a href="./articles/detail.html?title=${title}&about=${about}&date=${date}&author=${author}&url=${detail_url}">${title}</a></h2>
                    <p>${about}</p>
                </div>
                <div class="meta">
                    <time class="published">${date}</time>
                    <span class="author">${author}</span>
                </div>
            </header>
            <p>${intro}</p>
            <footer>
                <ul class="actions">
                    <li><a href="./articles/detail.html?title=${title}&about=${about}&date=${date}&author=${author}&url=${detail_url}" class="button large">Continue Reading</a></li>
                </ul>
                <ul class="stats">
                    <li><a href="#" class="icon solid fa-heart">28</a></li>
                    <li><a href="#" class="icon solid fa-comment">128</a></li>
                </ul>
            </footer>
        </article>
    `
    return article
};


/*
    Article Detail generator
*/
function createArticleDetail() {
    const params = getRequest();
    const detail = `
                    <article class="post">
                        <header>
                            <div class="title">
                                <h2>${params.title}</h2>
                                <p>${params.about}</p>
                            </div>
                            <div class="meta">
                                <time class="published">${params.date}</time>
                                <span class="author">${params.author}</span>
                            </div>
                        </header>
                        <p id="detail_text"></p>
                        <footer>
                            <ul class="stats">
                                <li><a href="#">previous</a></li>
                                <li><a href="#" class="icon solid fa-heart">28</a></li>
                                <li><a href="#" class="icon solid fa-comment">128</a></li>
                            </ul>
                        </footer>
                    </article>
                `
    $("#main").append(detail);
    
    $.ajax({
        type: "GET",
        url: params.url,
        success: function (result) {
            $("#detail_text").append(result)
        },
        error: function (result) {
            console.dir(result)
        }
    });
}

function getRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}





/*使用ajax来发起POST请求
HTML代码如下：

<a href="http://www.baidu.com" class="a_post">发起POST请求</a>
JQuery代码如下：

$(".a_post").on("click",function(event){
    event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL(http://www.baidu.com)
    $.ajax({
           type: "POST",
           url: "url地址",
           contentType:"application/json",
           data: JSON.stringify({param1:param1,param2:param2}),//参数列表
           dataType:"json",
           success: function(result){
              //请求正确之后的操作
           },
           error: function(result){
              //请求失败之后的操作
           }
    });
}); */
// JavaScript高级程序设计第四版学习笔记  


(function () {
    // 第一章
    const CHAPTER_ONE = createArticleItem(
        "【第1章】什么是JavaScript",
        "JavaScript高级程序设计第四版笔记",
        "Mar 16, 2021",
        `
        <div class="col-6 col-12-medium">
            <h4>本章内容</h4>
            <ul>
                <li>JavaScript 历史回顾</li>
                <li>JavaScript 是什么</li>
                <li>JavaScript 与 ECMAScript 的关系</li>
                <li>JavaScript 的不同版本</li>
            </ul>
        </div>
        `,
        "oneo",
        "C1-note.html"
    );
    $("#main").prepend(CHAPTER_ONE);

    // 第二章
    const CHAPTER_TWO = createArticleItem(
        "[第2章]HTML中的JavaScript",
        "JavaScript高级程序设计第四版笔记",
        "Mar 16, 2021",
        `
        <div class="col-6 col-12-medium">
            <h4>本章内容</h4>
            <ul>
                <li>使用<\/script>元素</li>
                <li>行内脚本与外部脚本的比较.</li>
                <li>文档模式对 JavaScript 有什么影响.</li>
                <li>确保 JavaScript 不可用时的用户体验.</li>
            </ul>
        </div>
        `,
        "oneo",
        "C2-note.html"
    );
    $("#main").prepend(CHAPTER_TWO);

    // 第三章
    const CHAPTER_THREE = createArticleItem(
        "[第3章]语言基础",
        "JavaScript高级程序设计第四版笔记",
        "Mar 16, 2021",
        `
        <div class="col-6 col-12-medium">
            <h4>本章内容</h4>
            <ul>
                <li>语法</li>
                <li>数据类型</li>
                <li>流控制语句</li>
                <li>理解函数</li>
            </ul>
        </div>
        `,
        "oneo",
        "C3-note.html"
    );
    $("#main").prepend(CHAPTER_THREE);
    
})()







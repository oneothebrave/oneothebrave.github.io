// JavaScript高级程序设计第四版学习笔记  


(function () {
    // 第一章
    const CHAPTER_ONE = createArticleItem(
        "TTTTT",
        "Lorem ipsum dolor amet nullam consequat etiam feugiat",
        "Mar 15, 2021",
        "Mauris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod placerat. Vivamus porttitor",
        "oneo",
        "C1-note"
    );
    $("#main").prepend(CHAPTER_ONE);

    // 第二章
    const CHAPTER_TWO = createArticleItem(
        "[fermentum]onvallis maximus nisl. Sed ma",
        "JavaScriptattis nunc id lorem eui",
        "Mar 15, 2021",
        "auris neque quam, fermentum ut nisl vitae, convallis maximus nisl. Sed mattis nunc id lorem euismod placerat. Vivamus porttitor magn porttitor",
        "Jane Doe",
        "C2-note"
    );
    $("#main").prepend(CHAPTER_TWO);
    
})()







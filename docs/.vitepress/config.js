module.exports = {
    base: '/',
    title: 'Oneo\'s Blog',
    description: 'Oneo Sanchez\'s Tech Blog',
    lang: 'en-US',
    themeConfig: {
        // lastUpdated: 'Last Update',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'GitHub', link: 'https://github.com/oneothebrave/oneothebrave.github.io' },
        ],
        sidebar: [
            { 
                text: "JS笔记", 
                children: [
                    {
                        text: "简介",
                        link: "/JsNote/introduce" 
                    },
                    {
                        text: "一.什么是JavaScript",
                        link: "/JsNote/1" 
                    },
                    {
                        text: "二.HTML中的JavaScript",
                        link: "/JsNote/2" 
                    },
                    {
                        text: "三.语言基础",
                        link: "/JsNote/3" 
                    }
                ]
            },
            { text: "ES6 Promised", link: "/devto-promised" }
        ]
    }
}
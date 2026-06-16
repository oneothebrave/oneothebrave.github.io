const JSNOTE_CHAPTERS = [
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
];

const TRANSLATION = [
    {
        text: "JavaScript中的事件循环",
        link: "/translation/devto-jseventloop" 
    },
    {
        text: "JS中的Promise,async和await",
        link: "/translation/devto-promises-async-await" 
    }
];

module.exports = {
    base: '/',
    title: 'Oneo\'s Blog',
    description: 'oneothebrave\'s Tech Blog',
    lang: 'en-US',
    themeConfig: {
        // lastUpdated: 'Last Update',
        nav: [
            { text: 'Home', link: '/' },
            { text: 'GitHub', link: 'https://github.com/oneothebrave/oneothebrave.github.io' },
        ],
        sidebar: [
            // { 
            //     text: "JS笔记", 
            //     items: JSNOTE_CHAPTERS
            // },
            { 
                text: "VitePress搭建博客并部署到GitHub Pages", 
                items: [
                    {
                        text: "搭建",
                        link: "/vitepress-blog-setup"
                    },
                    {
                        text: "部署",
                        link: "/vitepress-blog-depoly"
                    }
                ]
            },
            {
                text: "AI",
                items: [
                    {
                        text: "Transformer",
                        link: "/AI/transformer"
                    }
                    
                ]
            },
            { 
                text: "React", 
                items: [
                    {
                        text: "Fiber架构",
                        link: "/React/Fiber"
                    },
                    {
                        text: "笔记",
                        link: "/React/note"
                    },
                    {
                        text: "Q&A",
                        link: "/React/questions"
                    },
                ]
            },
            {
                text: "export and import",
                items: [
                    {
                        text: "总结",
                        link: "/export-import"
                    }
                    
                ]
            },
            {
                text: "TypeScript教程",
                items: [
                    {
                        text: "总结",
                        link: "/TypeScript"
                    }
                    
                ]
            },
            {
                text: "翻译而来",
                items: TRANSLATION
            },
            // {
            //     text: "We live in a society",
            //     items: [
            //         {
            //             text: "三胖",
            //             link: "/society--Kim-Jong-un"
            //         }
                    
            //     ]
            // }
        ]
    }
}
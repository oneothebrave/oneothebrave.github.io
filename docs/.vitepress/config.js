const JSNOTE_CHAPTERS = [
  {
    text: "一.什么是JavaScript",
    link: "/JsNote/1",
  },
  {
    text: "二.HTML中的JavaScript",
    link: "/JsNote/2",
  },
  {
    text: "三.语言基础",
    link: "/JsNote/3",
  },
];

const TRANSLATION = [
  {
    text: "JavaScript中的事件循环",
    link: "/translation/devto-jseventloop",
  },
  {
    text: "JS中的Promise,async和await",
    link: "/translation/devto-promises-async-await",
  },
];

module.exports = {
  base: "/",
  title: "Oneo's Blog",
  description:
    "Oneo 的技术手记，记录前端开发、JavaScript、React 与 AI 原理。保持好奇，把原理想明白。",
  lang: "zh-CN",
  appearance: true,
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/mark.svg" }],
    ["meta", { name: "theme-color", content: "#faf9f5" }],
  ],
  markdown: { theme: { light: "github-dark", dark: "github-dark" } },
  themeConfig: {
    logo: { src: "/mark.svg", alt: "" },
    outline: { label: "本篇目录", level: [2, 3] },
    docFooter: { prev: "上一篇", next: "下一篇" },
    sidebarMenuLabel: "文章目录",
    returnToTopLabel: "回到顶部",
    darkModeSwitchLabel: "切换深色模式",
    darkModeSwitchTitle: "切换为深色模式",
    lightModeSwitchTitle: "切换为浅色模式",
    notFound: {
      title: "这页笔记还没写下",
      quote: "换个方向，继续探索值得想明白的事。",
      linkLabel: "回到首页",
      linkText: "回到首页",
    },
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: "搜索笔记", buttonAriaLabel: "搜索笔记" },
              modal: {
                displayDetails: "显示详情",
                resetButtonTitle: "清除搜索",
                backButtonTitle: "关闭搜索",
                noResultsText: "没有找到相关笔记",
                footer: {
                  selectText: "选择",
                  navigateText: "切换",
                  closeText: "关闭",
                },
              },
            },
          },
        },
      },
    },
    // lastUpdated: 'Last Update',
    nav: [
      { text: "首页", link: "/" },
      { text: "所有文章", link: "/#articles" },
      {
        text: "GitHub",
        link: "https://github.com/oneothebrave/oneothebrave.github.io",
      },
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
            link: "/vitepress-blog-setup",
          },
          {
            text: "部署",
            link: "/vitepress-blog-depoly",
          },
        ],
      },
      {
        text: "AI",
        items: [
          {
            text: "Transformer",
            link: "/AI/transformer",
          },

          {
            text: "AI Agent时代的软件质量保障体系",
            link: "/AI/how-to-review",
          },
        ],
      },
      {
        text: "React",
        items: [
          {
            text: "Fiber架构",
            link: "/React/Fiber",
          },
          {
            text: "笔记",
            link: "/React/note",
          },
          {
            text: "Q&A",
            link: "/React/questions",
          },
        ],
      },
      {
        text: "export and import",
        items: [
          {
            text: "总结",
            link: "/export-import",
          },
        ],
      },
      {
        text: "TypeScript教程",
        items: [
          {
            text: "总结",
            link: "/TypeScript",
          },
        ],
      },
      {
        text: "翻译而来",
        items: TRANSLATION,
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
    ],
  },
};

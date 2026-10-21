<script setup>
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

const categories = [
  { id: 'all', label: '全部文章' },
  { id: 'ai', label: 'AI' },
  { id: 'react', label: 'React' },
  { id: 'language', label: 'JavaScript & TS' },
  { id: 'translation', label: '译文' },
  { id: 'blog', label: '博客搭建' }
]

const articles = [
  { category: 'ai', label: 'AI · 深入原理', title: 'Transformer 底层逻辑', description: '从 Token、Self-Attention 到文本生成，一步步理解 Transformer 的运行机制。', link: '/AI/transformer', symbol: '✳', topic: 'Transformer' },
  { category: 'react', label: 'REACT · 架构', title: '重新理解 React Fiber', description: '串起 Fiber 节点、双缓存树、协调器与调度器，读懂一次更新的来龙去脉。', link: '/React/Fiber', symbol: '↗', topic: 'React internals' },
  { category: 'language', label: 'TYPESCRIPT · 类型系统', title: 'TypeScript 核心教程', description: '从基础类型到泛型与类型兼容，让类型系统成为思考代码的另一种方式。', link: '/TypeScript', symbol: 'T', topic: 'Type system' },
  { category: 'react', label: 'REACT · 学习笔记', title: 'React 核心学习笔记', description: '整理日常学习中的关键概念，在组件、状态与更新之间建立清晰的联系。', link: '/React/note', symbol: '↗', topic: 'Learning notes' },
  { category: 'react', label: 'REACT · 问与答', title: '把 React 问题想明白', description: '围绕状态更新、渲染与 Fiber 调度，用一个个问题巩固对 React 的理解。', link: '/React/questions', symbol: '↗', topic: 'Questions & answers' },
  { category: 'language', label: 'JAVASCRIPT · 模块化', title: 'export 与 import 的那些事', description: '理清 CommonJS 和 ES Modules 的导入导出、加载方式与使用边界。', link: '/export-import', symbol: '{ }', topic: 'Modules' },
  { category: 'translation', label: '译文 · JAVASCRIPT', title: '读懂 JavaScript 事件循环', description: '从执行栈到任务队列，跟着图解梳理宏任务、微任务与事件循环。', link: '/translation/devto-jseventloop', symbol: '⟳', topic: 'Event loop' },
  { category: 'translation', label: '译文 · 异步编程', title: 'Promises、async 与 await', description: '从 Callback 到 Promise，再到 async/await，循序理解 JavaScript 的异步操作。', link: '/translation/devto-promises-async-await', symbol: '⟳', topic: 'Async JavaScript' },
  { category: 'blog', label: '建站手记 · 01', title: '用 VitePress 搭建博客', description: '从目录结构、主题配置到侧边栏，为自己的技术笔记搭一个安静的空间。', link: '/vitepress-blog-setup', symbol: '⌘', topic: 'Build a blog' },
  { category: 'blog', label: '建站手记 · 02', title: '把博客部署到 GitHub Pages', description: '连接 GitHub Actions 与 VitePress，让每一次提交都成为一次自动发布。', link: '/vitepress-blog-depoly', symbol: '⌘', topic: 'Ship it' }
]

const selectedCategory = ref('all')
const filteredArticles = computed(() => articles.filter(article => selectedCategory.value === 'all' || article.category === selectedCategory.value))
const countFor = id => id === 'all' ? articles.length : articles.filter(article => article.category === id).length
</script>

<template>
  <div class="blog-home">
    <section class="blog-hero page-container" aria-labelledby="hero-title">
      <div class="hero-copy">
        <p class="eyebrow"><span class="eyebrow-line" aria-hidden="true"></span> A NOTEBOOK FOR THE CURIOUS</p>
        <h1 id="hero-title">Think deeper.<br>Build with clarity.</h1>
        <p class="hero-description">在代码里探索，在记录中理解。<br>关于前端开发、AI 原理，以及那些值得想明白的事。</p>
        <div class="hero-actions">
          <a class="blog-button blog-button-primary" href="#articles">翻开笔记 <span aria-hidden="true">↗</span></a>
          <a class="hero-text-link" href="https://github.com/oneothebrave/oneothebrave.github.io" target="_blank" rel="noreferrer">在 GitHub 找到我 <span aria-hidden="true">↗</span></a>
        </div>
        <p class="hero-footnote">持续学习，慢慢积累。<span aria-hidden="true"> — </span> Notes by Oneo.</p>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="art-topline"><span>IDEAS, CONNECTED.</span><span>FIG. 01</span></div>
        <svg class="notebook-illustration" viewBox="0 0 500 360" fill="none">
          <g class="illustration-sun" stroke="currentColor" stroke-width="9" stroke-linecap="square">
            <path d="M352 48V107M322 56L381 99M303 85L394 73M317 113L380 46M307 64L390 104M335 43L366 117" />
          </g>
          <g class="illustration-ink" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M90 148C139 126 188 132 244 158C288 128 339 126 395 144L390 285C337 269 286 273 244 296C195 274 142 271 84 285L90 148Z" />
            <path d="M97 140C148 121 199 132 244 158L244 287M244 158C287 133 339 123 388 137M84 285L82 294C139 280 196 286 244 307C289 283 340 280 399 294L403 154L395 151M244 296V307" />
            <path d="M113 171C143 163 172 165 201 176M112 181C135 175 156 176 173 180M110 238C139 231 169 235 211 249M109 249C134 244 160 248 181 254" opacity=".45" />
            <path d="M272 246C304 233 336 230 367 238M271 257C297 247 321 245 343 249" opacity=".45" />
            <path d="M146 207L171 217L198 200M171 217L176 239M292 184L321 174L348 194L321 213L292 203Z" />
            <path d="M321 174V213M292 184L321 196L348 194M321 196L292 203" />
            <circle cx="146" cy="207" r="5" class="illustration-node" /><circle cx="171" cy="217" r="5" class="illustration-node" /><circle cx="198" cy="200" r="5" class="illustration-node" />
            <path d="M202 113C211 76 255 61 284 86C313 110 292 143 273 142C246 140 270 101 299 112" stroke-dasharray="4 6" />
            <path d="M122 90L127 99L137 101L129 107L128 117L121 110L111 111L116 102L112 94Z" />
            <path d="M414 227L431 217M420 242L441 243M407 211L412 195M73 229L56 219M66 246L47 249" />
            <path d="M180 321C223 334 269 335 304 322" opacity=".35" />
          </g>
        </svg>
        <div class="art-caption"><span class="art-caption-star">✳</span><span>Good questions lead to<br><em>interesting places.</em></span></div>
      </div>
    </section>

    <section class="featured-section page-container" aria-labelledby="featured-title">
      <a class="featured-note" :href="withBase('/AI/transformer')">
        <div class="featured-copy">
          <p class="eyebrow"><span class="featured-dot" aria-hidden="true"></span> 编辑精选 <span class="featured-separator">/</span> DEEP DIVE</p>
          <h2 id="featured-title">从一个 Token，<br>到理解 Transformer。</h2>
          <p>拆开看一看，智能是如何发生的。<br>一份关于 Attention、编码与生成的深入笔记。</p>
          <span class="featured-link">阅读这篇笔记 <span aria-hidden="true">↗</span></span>
        </div>
        <div class="transformer-diagram" aria-hidden="true">
          <div class="diagram-caption"><span>THE PATH FROM WORDS TO MEANING</span><span>01 → 04</span></div>
          <div class="token-row"><span>Keep</span><span>asking</span><span>why</span><span class="token-cursor">_</span></div>
          <div class="diagram-connector">↓</div>
          <div class="diagram-stage"><span class="stage-index">01</span><span>Embedding</span><span class="stage-detail">words → vectors</span></div>
          <div class="diagram-connector">↓</div>
          <div class="diagram-stage stage-attention"><span class="stage-index">02</span><span>Self-Attention</span><svg viewBox="0 0 70 22"><path d="M2 18Q18 -12 35 18Q52 -12 68 18M2 18Q35 -12 68 18M18 18Q35 0 52 18" fill="none" stroke="currentColor" /></svg></div>
          <div class="diagram-connector">↓</div>
          <div class="diagram-stage"><span class="stage-index">03</span><span>Feed Forward</span><span class="stage-detail">learn the patterns</span></div>
          <div class="diagram-connector">↓</div>
          <div class="diagram-output"><span class="stage-index">04</span><span>A little more understanding.</span><span>↵</span></div>
        </div>
      </a>
    </section>

    <section id="articles" class="articles-section page-container" aria-labelledby="articles-title">
      <div id="topics" class="section-heading">
        <div><p class="eyebrow">LEARN. CONNECT. REPEAT.</p><h2 id="articles-title">每一篇，都是一次想明白。</h2></div>
        <span class="collection-count">THE NOTEBOOK <span aria-hidden="true">/</span> {{ String(articles.length).padStart(2, '0') }} NOTES</span>
      </div>
      <div class="category-filters" role="group" aria-label="按主题筛选文章">
        <button v-for="category in categories" :key="category.id" type="button" class="category-filter" :class="{ 'is-selected': selectedCategory === category.id }" :aria-pressed="selectedCategory === category.id" aria-controls="article-grid" @click="selectedCategory = category.id">{{ category.label }}<span>{{ countFor(category.id) }}</span></button>
      </div>
      <p class="sr-only" role="status" aria-live="polite">显示 {{ filteredArticles.length }} 篇文章</p>
      <div id="article-grid" class="article-grid">
        <a v-for="article in filteredArticles" :key="article.link" :href="withBase(article.link)" class="note-card">
          <div class="note-card-top"><span class="note-symbol" :class="`note-symbol--${article.category}`" aria-hidden="true">{{ article.symbol }}</span><span class="note-label">{{ article.label }}</span></div>
          <h3>{{ article.title }}</h3>
          <p>{{ article.description }}</p>
          <div class="note-card-bottom"><span>{{ article.topic }}</span><span class="note-arrow" aria-hidden="true">↗</span></div>
        </a>
      </div>
      <div class="notebook-end"><span aria-hidden="true">✳</span><p>好奇心没有终点，笔记还在继续。</p></div>
    </section>
  </div>
</template>

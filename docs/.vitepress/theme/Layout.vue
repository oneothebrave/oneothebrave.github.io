<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import BlogHome from './components/BlogHome.vue'

const { frontmatter, page } = useData()
</script>

<template>
  <DefaultTheme.Layout>
    <template #home-hero-before>
      <BlogHome />
    </template>
    <template #layout-bottom>
      <footer class="blog-footer" :class="{ 'blog-footer--article': frontmatter.layout !== 'home' && frontmatter.sidebar !== false && !page.isNotFound }">
        <div class="blog-footer-inner">
          <div class="footer-intro">
            <a class="footer-brand" :href="withBase('/')">Oneo's Blog<span aria-hidden="true">↗</span></a>
            <p>写下来，让理解发生。</p>
            <span class="footer-caption">A small collection of things worth understanding.</span>
          </div>
          <div class="footer-links">
            <span class="footer-label">继续探索</span>
            <a :href="withBase('/#articles')">所有文章</a>
            <a :href="withBase('/AI/transformer')">AI 与 Transformer</a>
            <a :href="withBase('/React/Fiber')">React 与前端</a>
          </div>
          <div class="footer-links footer-links--elsewhere">
            <span class="footer-label">在别处</span>
            <a href="https://github.com/oneothebrave/oneothebrave.github.io" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
            <a href="https://vitepress.dev" target="_blank" rel="noreferrer">Built with VitePress <span aria-hidden="true">↗</span></a>
          </div>
          <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Oneo</span><span>Stay curious. Keep building.</span></div>
        </div>
      </footer>
    </template>
  </DefaultTheme.Layout>
</template>

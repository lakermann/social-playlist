const { description } = require('../../package')

module.exports = {
  title: 'Social Playlist',
  description: description,
  base: '/social-playlist/',
  themeConfig: {
    repo: 'lakermann/social-playlist',
    docsDir: '',
    sidebar: {
      '/': [
        {
          title: 'Guide',
          collapsable: false,
          children: [
            '/',
            'backend/first-spring-boot-application',
            'frontend/first-angular-application',
            'backend/spotify',
            'frontend/consuming-the-rest-api',
            'automatic-login-on-first-page-visit'
          ]
        }
      ],
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top'
  ],
  markdown: {
    lineNumbers: false,
    extendMarkdown: md => {
      md.use(require("markdown-it-footnote"));
    }
  }
}

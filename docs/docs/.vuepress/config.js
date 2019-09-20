module.exports = {
    title: 'Social Playlist',
    description: 'Springboot & Angular Hands-on Workshop',
    base: '/social-playlist/',
    themeConfig: {
        repo: 'lakermann/social-playlist',
        sidebar: [
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
        ]
    },
    markdown: {
        lineNumbers: false,
        extendMarkdown: md => {
            md.use(require('markdown-it-footnote'))
        }
    }
}

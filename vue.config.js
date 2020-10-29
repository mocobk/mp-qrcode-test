module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: '/mp-qrcode-test/',
    outputDir: './dist',
    assetsDir: './static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false
}

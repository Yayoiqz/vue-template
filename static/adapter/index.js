(function () {
    // window.devicePixelRatio：手机像素比
    var pixelRatio = 1 / window.devicePixelRatio
    // 通过js动态设置视口(viewport)
    document.write(`<meta name="viewport" content="width=device-width, user-scalable=no,initial-scale=${pixelRatio},minimum-scale=${pixelRatio},` + `maximum-scale=${pixelRatio}",viewport-fit=cover"/>`)
    // 获取html节点
    var html = document.getElementsByTagName('html')[0]
    // 获取屏幕宽度
    var pageWidth = html.getBoundingClientRect().width
    // 屏幕宽度 / 固定数值 = 基准值
    // html.style.fontSize = 8 + 'px'
    html.style.fontSize = `${pageWidth / 37.5}px`
})()

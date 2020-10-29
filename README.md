# mp-qrcode-test
一款微信小程序带参数二维码生成工具，可模拟测试分享卡片、公众号小程序链接、小程序码带参数跳转至小程序。
![](http://mocobk.test.upcdn.net/image/20201029191607673.jpg)

# 为什么需要这个工具
1. 方便我们快速测试某些带参数的页面；
2. 微信在体验版测试小程序码时，由于未发布的小程序无法生成小程序码（官方要求必须是已发布的小程序才能生成二维码），
导致我们无法在未发布前进行测试，即使我们已发布过小程序，生成了小程序码，当我们扫码时会直接跳转到正式版的小程序，
显然这不是我们想要的，为了避免翻车，我们必须在发布前进行测试，寻找曲线救国的思路。

# 实现原理
不管是小程序码还是分享卡片、公众号小程序链接，都会有个 page 页码和参数（可选），我们只需要知道他们分别是
对应什么 page 路径和参数结构，就能通过类似以下体验版的链接来模拟：

https://open.weixin.qq.com/sns/getexpappinfo?appid=xxx&path=pages/index/index.html?name=mocobk&age=18

* `appid`: 你小程序的 AppId
* `path`: 你的 page 路径，记得后面加上 `.html`
* `?`: 后面接你实际的参数

> 注意小程序码 B 接口的参数是都放在在 scene 参数的值中，且需要 urlencode 如：pages/index/index.html?scene=name%3Dmocobk%26age%3D18
> 具体参考[文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/qr-code.html)
## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

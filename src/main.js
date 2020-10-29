import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import VueClipboard from 'vue-clipboard2'

Vue.config.productionTip = false
VueClipboard.config.autoSetContainer = true
Vue.use(VueClipboard)
Vue.use(ElementUI, {
  size: 'small'
});

new Vue({
  render: h => h(App),
}).$mount('#app')

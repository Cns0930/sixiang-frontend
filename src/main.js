import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/vuex/store'
import "@/assets/css/editor.css"
import "@/assets/css/editor_frame.css"
import "@/assets/js/ckeditor.js"
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'
import "ace-builds/webpack-resolver";

import '@/api/config'
Vue.config.productionTip = false
Vue.use(ElementUI ,{ size: 'mini'})
Vue.config.errorHandler=function(err,vm,info){
    console.error(err,info)
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

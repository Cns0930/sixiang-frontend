import Vue from 'vue'
import App from '@/bangban/App.vue'
import router from '@/bangban/router'
import store from '@/bangban/vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
import "@/assets/css/editor.css"
import "@/assets/css/editor_frame.css"
import "@/assets/js/ckeditor.js"
import "@/assets/css/global.scss"





import "@/assets/css/newGlobal.scss"
import ElementUI from 'element-ui'


import '@/api/config'

import _ from 'lodash';    

Vue.prototype._=_;

Vue.config.productionTip = false
Vue.use(ElementUI ,{ size: 'medium'})
Vue.config.errorHandler=function(err,vm,info){
    console.error(err,vm,info)
}

//  全局组件
import CustomComponents from "@/views/layoutComponents/index"
Object.keys(CustomComponents).forEach(name=>{
    Vue.component(name,CustomComponents[name])
})


//所有未登录会话重定向到 /login
router.beforeEach((to, from, next) => {
  const ticket = localStorage.getItem('ticket')
  if (!ticket && to.path !== '/login') {
      next('/login');
  } else if (to.path === '/login' && ticket) {
      
      next();
  } else {
      next();
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

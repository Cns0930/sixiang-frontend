import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/vuex/store'
import 'element-ui/lib/theme-chalk/index.css'
import "@/assets/css/editor.css"
import "@/assets/css/editor_frame.css"
import "@/assets/js/ckeditor.js"
import "@/assets/css/global.scss"



import ElementUI from 'element-ui'
if(process.env.NODE_ENV === 'development'){
    require("ace-builds/webpack-resolver");
}

import "ace-builds/webpack-resolver"

import '@/api/config'

import _ from 'lodash';    

Vue.prototype._=_;

Vue.config.productionTip = false
Vue.use(ElementUI ,{ size: 'mini'})
Vue.config.errorHandler=function(err,vm,info){
    console.error(err,vm,info)
}

//  全局组件
import CustomComponents from "@/views/layoutComponents/index"
Object.keys(CustomComponents).forEach(name=>{
    Vue.component(name,CustomComponents[name])
})
// import Interface from "./views/test/Interface.vue"
// Vue.component("Interface",Interface)

//所有未登录会话重定向到 /login
router.beforeEach((to, from, next) => {
  const ticket = localStorage.getItem('ticket')
  let haveRole = store.state['config'].roles;
  //ticket有值，vuex中没有roles角色了，侧边栏会显示异常，则直接到login
  if ((!ticket && to.path !== '/login') || (to.path !== '/login' && ticket && haveRole.length < 1)) {
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

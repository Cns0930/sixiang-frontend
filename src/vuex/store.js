import Vue from 'vue'
import Vuex from 'vuex'
import homeModule from "./home/module";
import fieldModel from "./fieldModel/module"
import setting from "./setting/module"
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const persist = createPersistedState({
    paths: ['setting']
  })

// 创建 store 实例
export default new Vuex.Store({
    modules: {

        home: homeModule,
        fieldModel: fieldModel,
        setting,
    },
    plugins: [persist]
})

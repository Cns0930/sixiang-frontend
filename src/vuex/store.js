import Vue from 'vue'
import Vuex from 'vuex'
import homeModule from "./home/module";
import config from "./config/module";
import fieldModel from "./fieldModel/module"
import setting from "./setting/module"
import basic from "./basic/module";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

const persist = createPersistedState({
    paths: ['setting','config']
  })

// 创建 store 实例
export default new Vuex.Store({
    modules: {
        config: config,
        home: homeModule,
        fieldModel: fieldModel,
        setting,
        basic,
    },
    plugins: [persist]
})

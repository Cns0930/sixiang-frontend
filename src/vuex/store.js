import Vue from 'vue'
import Vuex from 'vuex'
import homeModule from "./home/module";
import fieldModel from "./fieldModel/module"

import createPersistedState from "vuex-persistedstate";
import Renderer from '@/views/attributeComponents/Renderer';
import defs from "@/views/attributeComponents/index"
Vue.use(Vuex)
function deserialize(value){
    let jsonObj = JSON.parse(value)
    
    let baseFields = jsonObj?.fieldModel?.baseFields;
    if(baseFields){
        baseFields.forEach(field=>{
            let componentDefs = field.componentDefs
            let actualComponentDefs = new defs[field.type]();
            Object.keys(actualComponentDefs).forEach(key=>{
                actualComponentDefs[key].value = componentDefs[key].value
            })
            field.componentDefs = actualComponentDefs
           
        })
    }
    console.log(jsonObj)
    return jsonObj
    

}
// 创建 store 实例
export default new Vuex.Store({
    modules: {

        home: homeModule,
        fieldModel: fieldModel,
    },
    plugins: [createPersistedState(/* {
        storage: {
          getItem: (key) =>{
              

            return deserialize(localStorage.getItem(key))
            
          } ,
          setItem: (key, value) =>{
       
            // let json = JSON.stringify(value)
            return localStorage.setItem(key, value)
          },
          removeItem: (key) => localStorage.removeItem(key),
        },
      } */)],
})

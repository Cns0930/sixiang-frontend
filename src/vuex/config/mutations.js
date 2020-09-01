// 定义所需的 mutations
const mutations = {
    putShowList(state,data){
        state.showList=data;
    },

    SET_CITY(state, data) {
      state.city = data
    },

    SET_PROVINCE(state, data) {
      state.province = data
    },
    setCollapse(state,data) {
      state.isCollapse = data;
    },
    setCrumbList(state,data) {
      state.crumbList = [];
      state.crumbList = data;
    }
}

export default mutations

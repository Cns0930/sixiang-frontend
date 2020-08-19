import state from "../home/state"

// 定义所需的 mutations
const mutations = {
    putBangbanUrl(state, data) {
        state.bangbanUrl = data
    }
}

export default mutations
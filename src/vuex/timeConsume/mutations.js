import { isArray } from "lodash";
import state from "./state"

// 定义所需的 mutations
const mutations = {
    recordTimeList(state, payload) {
        let timestamp = new Date().getTime();
        // console.log('state', state);
        // console.log('payload', payload);
        let to = payload.to;
        let from = payload.from
        let toItemId = to.query.hasOwnProperty('itemId') ? to.query.itemId : '-1'
        let fromItemId = from.query.hasOwnProperty('itemId') ? from.query.itemId : '-1'
        console.log('fromItemId, toItemId', fromItemId, toItemId);
        // 对离开路由进行操作
        if (state.timeList.hasOwnProperty(from.path)) {
            // 有路径且路径下有该 事项id
            if (state.timeList[from.path].hasOwnProperty(fromItemId)) {
                let len = state.timeList[from.path][fromItemId].length
                state.timeList[from.path][fromItemId][len - 1].closureTime = timestamp
            } else {
                // 有路径但路径下无该 事项id
                state.timeList[from.path][fromItemId] = [
                    {
                        beginTime: timestamp,
                        closureTime: timestamp,
                    }
                ]
            }
        } else {
            // console.log('state.timeList', state.timeList);
            // console.log('from.path', from.path);
            // console.log('state.timeList[from.path]', state.timeList[from.path]);
            state.timeList[from.path] = {};
            state.timeList[from.path][fromItemId] = [
                {
                    beginTime: timestamp,
                    closureTime: timestamp,
                }
            ]
        }
        // 对去往路由进行操作
        if (state.timeList.hasOwnProperty(to.path)) {
            // 有路径且路径下有该 事项id  加一段新的时间进去
            if (state.timeList[to.path].hasOwnProperty(toItemId)) {
                state.timeList[to.path][toItemId].push({
                    beginTime: timestamp,
                    closureTime: timestamp,
                })
            } else {
                // 有路径但路径下无该 事项id
                state.timeList[to.path][toItemId] = [
                    {
                        beginTime: timestamp,
                        closureTime: timestamp,
                    }
                ]
            }
        } else {
            state.timeList[to.path] = {};
            state.timeList[to.path][toItemId] = [
                {
                    beginTime: timestamp,
                    closureTime: timestamp,
                }
            ]
        }
    },
    // 清空timeList
    clearTimeList(state, payload) {
        state.timeList = {
            startTime: new Date().getTime()
        }
        console.log('clearTimeList', state.timeList)
    },
    // 点击 滚动滑轮 键盘敲击 更新对应路由对应事项id的closureTime
    updateClosureTime(state, payload) {
        let timestamp = new Date().getTime()
        let { path, query } = payload.route
        console.log('path query', path, query)
        let itemId = query.hasOwnProperty('itemId') ? query.itemId : '-1'
        if (state.timeList.hasOwnProperty(path)) {
            let len = state.timeList[path][itemId].length
            state.timeList[path][itemId][len - 1].closureTime = timestamp
        } else {
            state.timeList[path] = {};
            state.timeList[path][itemId] = [
                {
                    beginTime: timestamp,
                    closureTime: timestamp,
                }
            ]
        }
        console.log('updateTimeList', state.timeList)
    }
}

export default mutations
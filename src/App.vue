<template>
    <div id="app">

        <router-view />
    </div>
</template>

<script>
import _ from "lodash";
import store from '@/vuex/store';
import { addSysOperatingItemTime } from '@/api/timeConsume/time'
export default {
    data() {
        return {
            activeTimestamp: null,
            localTimestamp: null,
        }
    },
    created() {
        if (!localStorage.getItem('defaultPageSize')) {
            let temp = {};
            localStorage.setItem("defaultPageSize", JSON.stringify(temp));
        }
    },
    mounted() {
        window.addEventListener('keyup', this.handleKeyup)
        window.addEventListener('scroll', _.debounce(this.handleScroll, 100, {
            'leading': false,
            'trailing': true
        }))
        window.addEventListener('click', this.handleClick)
        let timeIntervalId = setInterval(() => this.sendTimeList(), 10 * 60 * 1000);
    },
    methods: {
        // 键盘事件
        handleKeyup(event) {
            const e = event || window.event || arguments.callee.caller.arguments[0]
            if (!e) return
            const { key, keyCode } = e
            // console.log(`键入了${key}在页面：`, this.$route.path)
            this.updateTimeList()
        },
        //  滑轮事件
        handleScroll() {
            let e = document.body.scrollTop || document.documentElement.scrollTop
            if (!e) return
            // console.log('滑动了，在页面：', this.$route.path)
            this.updateTimeList()
        },
        // 点击事件
        handleClick() {
            // console.log('点击了，在页面：', this.$route.path)
            this.updateTimeList()
        },
        // 更新事件统计list
        updateTimeList() {
            // console.log('route', this.$route);
            store.commit('updateClosureTime', { route: this.$route });
        },
        // 发送timeList
        async sendTimeList() {
            let timeList = store.getters.getTimeList
            delete timeList.startTime
            let res = await addSysOperatingItemTime({ addOperatingItemRequest: timeList })
            if (!res.success) {
                this.$message.warning('timeList发送失败')
                return
            }
            store.commit('clearTimeList');
            console.log('发送了timeList', timeList)
        }
    }
}
</script>


<style lang="scss">
* {
    margin: 0;
    padding: 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif, Microsoft YaHei;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
.-center {
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
}
.-center-column {
    display: -webkit-flex;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
.-center-row {
    display: flex;
    align-items: center;
}

ul {
    list-style: none;
}
</style>

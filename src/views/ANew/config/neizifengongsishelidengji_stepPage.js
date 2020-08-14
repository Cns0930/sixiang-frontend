import _ from "lodash"
import dayjs from "dayjs"
import customParseFormat from 'dayjs/plugin/customParseFormat'
let stepData = [{
    "configFn": function config(state, getters) {
        return []
    },
    "component": "ApprovalSelectContent",
    "beforeEnterFn": null,
    "title": "事项选择",
    "configType": 1,
    "config": ["fact1"],
    "stepPagenum": 1
}]
export default stepData
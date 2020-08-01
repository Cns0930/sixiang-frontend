import ace from "ace-builds";
import beautify from "ace-builds/src-noconflict/ext-beautify";


// text 组件
let TextSpan = ({ props }) => <span>{props.value}</span>

// 数字组件
let NumberInput = {
    name: "NumberInput",
    props: ["value"],

    render() {
        return <ElInput value={this.value} onInput={($event) => this.$emit("input", parseFloat($event))}></ElInput>
    }
}
// 选择器组件
let ElSelectC = {
    name: "ElSelectC",
    props: ['options', "value"],

    render() {
        let realOption
        if (Object.prototype.toString.call(this.options) === "[object Array]") {
            realOption = this.options.map(option => ({ label: option, value: option }))
        } else {
            realOption = this.options
        }

        return <ElSelect value={this.value} onInput={(e) => this.$emit("input", e)} >
            {
                realOption.map(option => <ElOption lable={option.label} value={option.value} ></ElOption>)
            }

        </ElSelect>
    }

}
// 根据逗号隔开的数组
let TextAreaArray = {
    name: "TextAreaArray",
    props: ['value'],
    render() {
        return <ElInput value={this.value.join(",")} type="textarea" onInput={($event) => this.$emit("input", $event.split(","))}></ElInput>
    }
}

// input添加类 的数组
export let InputArray = {
    name: "InputArray",
    props: ["value"],
    render() {
        if (this.value.length == 0) {
            this.value.splice(0, 0, "")
        }
        return <div>
            {this.value.map((v, i) => <div>
                <ElInput value={v} onInput={(e) => { this.$set(this.value, i, e) }}></ElInput>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" onClick={() => { this.value.splice(i + 1, 0, "") }}></el-button>
                    <el-button type="primary" icon="el-icon-minus" onClick={() => { this.value.splice(i, 1) }}></el-button>
                </el-button-group>
            </div>)}
        </div>

    }
}
// 单个checkbox
let ElSingleCheckboxC = {
    name: "ElSingleCheckboxC",
    props: ["options", "value"],

    render() {
        return <span>
            {
                this.options.map(option =>
                    <el-checkbox value={this.value} onInput={(e) => this.$emit("input", e)} label={option}>是</el-checkbox>
                )
            }

        </span>

    }
}

// 代码框
export let CodeEditor = {
    name: "CodeEditor",
    props: ["value"],
    data() {
        return {
            open: false,
            editor: null,
        }
    },
    methods: {
        async initEditor() {
            this.open = !this.open;
            if (this.open) {
                await this.$nextTick();
                this.editor = ace.edit(this.$refs.editor);
                this.editor.setTheme("ace/theme/monokai");
                this.editor.session.setMode("ace/mode/javascript");
                this.editor.setOption("wrap", "free")
                this.editor.setValue(this.value)
                beautify.beautify(this.editor.session)
                this.editor.on('change', (e)=> {
                
                   this.emitEvent(this.editor.getValue())
            
                });
            }else{
                this.editor.destroy();
            }
        },
        emitEvent:_.debounce(function(value){
            this.$emit("input",value)
        },300)
    },
    render() {
        return <span>
            <el-button icon="el-icon-edit" type="primary" onClick={this.initEditor}></el-button>

            
                <div vShow={this.open} style="height:300px;width:80%" ref="editor"></div>
            


        </span>

    }
}

//


export default {
    TextSpan,
    NumberInput,
    ElSelectC,
    TextAreaArray,
    InputArray,
    ElSingleCheckboxC,
    CodeEditor,
    
}
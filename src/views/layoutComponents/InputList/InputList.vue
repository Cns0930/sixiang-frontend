
<script>
export default {
    name: "InputList",
    props: ["value"],
    render: function (h) {
        if (this.value.length == 0) {
            this.value.splice(0, 0, "")
        }
        return <div>
            {this.value.map((v, i) =>
                <ElInput value={v} onInput={(e) => { this.$set(this.value, i, e) }} class="input"></ElInput>

            )}
            <el-button-group>
                <el-button type="primary"  onClick={() => { this.value.push("") }}>添加</el-button>
            </el-button-group>
        </div>

    }
}
</script>

<style scoped lang="scss">
.input {
    width: 100px;
    margin: 6px 10px;
}
</style>
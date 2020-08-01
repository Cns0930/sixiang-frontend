



<script>
import { FormItem } from "element-ui"
import AsyncValidator from 'async-validator';
export default {
    name: "TestFormItem",
    mixins: [FormItem],
    props:{
        obj:{
            type:Object,
            default(){
                return null;
            }
        },
        valueName:{
            type:String,
            default:"value"
        }
    },

    created() {
     
    },
    methods: {
        onFieldBlur(v) {
            
            this.validate('blur',v);
        },
        onFieldChange(v) {
            if (this.validateDisabled) {
                this.validateDisabled = false;
                return;
            }

            this.validate('change',v);
        },
        validate(trigger, value, callback = () => { }) {

            this.validateDisabled = false;
            const rules = this.getFilteredRule(trigger);
            
            if ((!rules || rules.length === 0) && this.required === undefined) {
                callback();
                return true;
            }

            this.validateState = 'validating';

            const descriptor = {};
            if (rules && rules.length > 0) {
                rules.forEach(rule => {
                    delete rule.trigger;
                });
            }
            descriptor[this.prop] = rules;

            const validator = new AsyncValidator(descriptor);
            const model = {};

            model[this.prop] =this.obj.ruleKey==="custom"?this.obj:this.obj && this.obj[this.valueName];
           
            validator.validate(model, { firstFields: true }, (errors, invalidFields) => {
                
                this.validateState = !errors ? 'success' : 'error';
                this.validateMessage = errors ? errors[0].message : '';
                
                callback(this.validateMessage, invalidFields);
                this.$emit("itemValidated",{success:!errors})
                this.elForm && this.elForm.$emit('validate', this.prop, !errors, this.validateMessage || null);
            });
        },
    }
}
</script>

<style>
</style>
<template>
    <el-form ref="form" :model="data" :rules="rules" v-bind="attributes" :disabled="submitting" @keyup.enter="submit">
        <slot :data="data"></slot>

        <div class="flex items-center space-x-2">
            <el-button @click="reset">重置</el-button>
            <el-button type="primary" @click="submit" :loading="submitting">保存</el-button>
        </div>
    </el-form>
</template>

<script setup>
import {computed, getCurrentInstance, ref} from "vue";
import {warning} from "../../utils/message";
import api from "../../utils/api";
import useStatus from "../../states/status";

const props = defineProps({
    defaultData: {
        type: Object,
        default: () => ({}),
    },
    rules: {
        type: Object,
        default: () => ({}),
    },
    attributes: {
        type: Object,
        default: () => ({
            labelPosition: 'top',
        }),
    },
    action: {
        type: String,
        required: true,
    },
    method: {
        type: String,
        default: 'put',
    },
})

const label = 'submit_' + getCurrentInstance().uid

const status = useStatus()

const submitting = computed(() => status.get(label))

const data = ref(props.defaultData)

const form = ref()

const emits = defineEmits(['beforeSubmit', 'afterSubmit'])

const reset = () => {
    form.value.resetFields()
}

const submit = () => {
    form.value.validate(valid => {
        if (valid) {
            emits('beforeSubmit', data.value)

            let request = props.method.toLowerCase() === 'put'
                ? api(props.action).label(label).put(data.value)
                : api(props.action).label(label).post(data.value)

            request.then(res => {
                form.value.clearValidate()
                form.value.resetFields()
                emits('afterSubmit', res)
            })
        } else {
            warning('表单验证失败，请重新填写')
        }
    })
}

defineExpose({
    reset,
    submit,
})
</script>

<style scoped>

</style>

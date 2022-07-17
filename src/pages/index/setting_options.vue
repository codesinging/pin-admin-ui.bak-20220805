<template>
    <model-view resource="setting_options" :form-default="formDefault">
        <template #table-columns>
            <name-column/>
            <el-table-column label="分组" prop="group.name"/>
            <el-table-column label="键名" prop="key"/>
            <tag-column label="类型" prop="type_label"/>
            <sort-column/>
            <status-column/>
        </template>

        <template #form-items="{data, isUpdate}">
            <div class="grid grid-cols-2 gap-4">
                <el-form-item label="配置分组" prop="group_id" :rules="[{required: true, message: '请选择分组'}]">
                    <el-select v-model="data.group_id">
                        <el-option v-for="group in groups" :key="group.id" :label="group.name" :value="group.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配置名称" prop="name" :rules="[{required: true, message: '名称不能为空'}]">
                    <el-input v-model="data.name"></el-input>
                </el-form-item>
                <el-form-item label="配置键名" prop="key" :rules="[{required: true, message: '键名不能为空'}]">
                    <el-input v-model="data.key"></el-input>
                </el-form-item>
                <el-form-item label="配置描述" prop="description">
                    <el-input v-model="data.description" placeholder="请输入配置的描述，可为空"></el-input>
                </el-form-item>
            </div>

            <el-form-item label="组件类型" prop="type" :rules="[{required: true, message: '请选择类型'}]">
                <el-select v-model="data.type" filterable @change="onTypeChange(data)">
                    <el-option v-for="(label,type) in types" :key="type" :value="type" :label="label"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-if="data.type" label="组件属性">
                <InputAttributer v-if="data.type==='Input'" v-model="data.attributes"/>
                <TextareaAttributer v-if="data.type==='Textarea'" v-model="data.attributes"/>
                <InputNumberAttributer v-if="data.type==='InputNumber'" v-model="data.attributes"/>
                <ColorPickerAttributer v-if="data.type==='ColorPicker'" v-model="data.attributes"/>
                <DatePickerAttributer v-if="data.type==='DatePicker'" v-model="data.attributes"/>
                <DateTimePickerAttributer v-if="data.type==='DateTimePicker'" v-model="data.attributes"/>
                <TimePickerAttributer v-if="data.type==='TimePicker'" v-model="data.attributes"/>
                <TimeSelectAttributer v-if="data.type==='TimeSelect'" v-model="data.attributes"/>
                <CheckboxGroupAttributer v-if="data.type==='CheckboxGroup'" v-model="data.attributes"/>
                <RadioGroupAttributer v-if="data.type==='RadioGroup'" v-model="data.attributes"/>
                <SingleSelectAttributer v-if="data.type==='SingleSelect'" v-model="data.attributes"/>
                <MultipleSelectAttributer v-if="data.type==='MultipleSelect'" v-model="data.attributes"/>
                <SwitchAttributer v-if="data.type==='Switch'" v-model="data.attributes"/>
            </el-form-item>

            <el-form-item v-if="['CheckboxGroup', 'RadioGroup', 'SingleSelect', 'MultipleSelect'].includes(data.type)" label="选项设置">
                <option-editor v-model="data.data.options"></option-editor>
            </el-form-item>

            <el-form-item v-if="data.type" label="默认值" prop="value">
                <el-input v-if="data.type==='Input'" v-model="data.value" v-bind="data.attributes"></el-input>
                <el-input v-if="data.type==='Textarea'" v-model="data.value" v-bind="data.attributes" type="textarea"></el-input>
                <el-input-number v-if="data.type==='InputNumber'" v-model="data.value" v-bind="data.attributes"></el-input-number>
                <el-color-picker v-if="data.type==='ColorPicker'" v-model="data.value" v-bind="data.attributes"></el-color-picker>
                <el-date-picker v-if="data.type==='DatePicker'" v-model="data.value" v-bind="data.attributes"></el-date-picker>
                <el-date-picker v-if="data.type==='DateTimePicker'" v-model="data.value" v-bind="data.attributes"></el-date-picker>
                <el-time-picker v-if="data.type==='TimePicker'" v-model="data.value" v-bind="data.attributes"></el-time-picker>
                <el-time-select v-if="data.type==='TimeSelect'" v-model="data.value" v-bind="data.attributes"></el-time-select>
                <el-checkbox-group v-if="data.type==='CheckboxGroup'" v-model="data.value" v-bind="data.attributes">
                    <el-checkbox v-for="(item,index) in data.data.options" :key="index" :label="item.value">{{ item.text || item.value }}</el-checkbox>
                </el-checkbox-group>
                <el-radio-group v-if="data.type==='RadioGroup'" v-model="data.value">
                    <el-radio v-for="(item,index) in data.data.options" :key="index" :label="item.value" v-bind="data.attributes">{{ item.text || item.value }}</el-radio>
                </el-radio-group>
                <el-select v-if="data.type==='SingleSelect'" v-model="data.value" v-bind="data.attributes">
                    <el-option v-for="(item,index) in data.data.options" :key="index" :value="item.value">{{ item.text || item.value }}</el-option>
                </el-select>
                <el-select v-if="data.type==='MultipleSelect'" v-model="data.value" v-bind="data.attributes" multiple collapse-tags-tooltip>
                    <el-option v-for="(item,index) in data.data.options" :key="index" :value="item.value">{{ item.text || item.value }}</el-option>
                </el-select>
                <el-switch v-if="data.type==='Switch'" v-model="data.value" v-bind="data.attributes"></el-switch>
            </el-form-item>

            {{ data.attributes }}
            {{ data.data }}
        </template>
    </model-view>
</template>

<script setup>
import ModelView from "../../components/views/ModelView.vue";
import NameColumn from "../../components/columns/NameColumn.vue";
import SortColumn from "../../components/columns/SortColumn.vue";
import StatusColumn from "../../components/columns/StatusColumn.vue";
import TagColumn from "../../components/columns/TagColumn.vue";
import api from "../../utils/api";
import {ref} from "vue";
import InputAttributer from "../../components/attributers/InputAttributer.vue";
import TextareaAttributer from "../../components/attributers/TextareaAttributer.vue";
import InputNumberAttributer from "../../components/attributers/InputNumberAttributer.vue";
import ColorPickerAttributer from "../../components/attributers/ColorPickerAttributer.vue";
import DatePickerAttributer from "../../components/attributers/DatePickerAttributer.vue";
import DateTimePickerAttributer from "../../components/attributers/DateTimePickerAttributer.vue";
import CheckboxGroupAttributer from "../../components/attributers/CheckboxGroupAttributer.vue";
import OptionEditor from "../../components/miscellaneous/OptionEditor.vue";
import RadioGroupAttributer from "../../components/attributers/RadioGroupAttributer.vue";
import SingleSelectAttributer from "../../components/attributers/SingleSelectAttributer.vue";
import MultipleSelectAttributer from "../../components/attributers/MultipleSelectAttributer.vue";
import SwitchAttributer from "../../components/attributers/SwitchAttributer.vue";
import TimePickerAttributer from "../../components/attributers/TimePickerAttributer.vue";
import TimeSelectAttributer from "../../components/attributers/TimeSelectAttributer.vue";

const formDefault = {
    attributes: {},
    value: null,
    data: {},
}

const groups = ref([])
const types = ref({})

const refreshGroups = () => api('setting_groups').message(false).list({status: true}).then(res => groups.value = res)

const refreshTypes = () => api('setting_options/types').message(false).get().then(res => types.value = res)

refreshGroups()
refreshTypes()

const onTypeChange = data => {
    data.attributes = {}
    data.value = null
    data.data = {}
    if (['CheckboxGroup', 'RadioGroup', 'SingleSelect', 'MultipleSelect'].includes(data.type)) {
        data.data.options = []
        data.value = []
    }
}
</script>

<style scoped>

</style>

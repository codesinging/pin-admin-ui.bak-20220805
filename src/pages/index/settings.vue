<template>
    <el-card>
        <template #header>
            <div class="flex items-center justify-between">
                <span>系统设置</span>
                <el-button type="primary" size="small" @click="refresh" :loading="status.any('refreshOptions', 'refreshGroups')">刷新</el-button>
            </div>
        </template>
        <el-tabs v-model="tab" v-loading="status.any('refreshGroups', 'refreshOptions')">
            <el-tab-pane v-for="group in groups" :key="group.id" :label="group.name" :name="group.key">
                <el-descriptions border :column="1">
                    <template v-for="option in options" :key="option.id">
                        <el-descriptions-item v-if="option.group_id===group.id" :label="option.name" label-class-name="w-80">
                            <template #label>
                                <div class="space-y-1">
                                    <div class="text-normal">{{ option.name }}</div>
                                    <div class="text-xs text-gray-400">{{ option.description }}</div>
                                </div>
                            </template>
                            <div v-loading="status.get(option.key)">
                                <el-input v-if="option.type==='Input'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)"></el-input>
                                <el-input-number v-if="option.type==='InputNumber'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option, true)"></el-input-number>
                                <el-input v-if="option.type==='Textarea'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)" type="textarea"></el-input>
                                <el-color-picker v-if="option.type==='ColorPicker'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)"></el-color-picker>
                                <el-date-picker v-if="option.type==='DatePicker'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)"></el-date-picker>
                                <el-date-picker v-if="option.type==='DateTimePicker'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)"></el-date-picker>
                                <el-time-picker v-if="option.type==='TimePicker'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)"></el-time-picker>
                                <el-time-select v-if="option.type==='TimeSelect'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)"></el-time-select>
                                <el-checkbox-group v-if="option.type==='CheckboxGroup'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option, true)">
                                    <el-checkbox v-for="(item,index) in option.data.options" :key="index" :label="item.value">{{ item.text || item.value }}</el-checkbox>
                                </el-checkbox-group>
                                <el-radio-group v-if="option.type==='RadioGroup'" v-model="option.setting.value" @change="change(option)">
                                    <el-radio v-for="(item,index) in option.data.options" v-bind="option.attributes" :key="index" :label="item.value">{{ item.text || item.value }}</el-radio>
                                </el-radio-group>
                                <el-select v-if="option.type==='SingleSelect'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)">
                                    <el-option v-for="(item,index) in option.data.options" :key="index" :value="item.value">{{ item.text || item.value }}</el-option>
                                </el-select>
                                <el-select v-if="option.type==='MultipleSelect'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option, true)" multiple collapse-tags-tooltip>
                                    <el-option v-for="(item,index) in option.data.options" :key="index" :value="item.value">{{ item.text || item.value }}</el-option>
                                </el-select>
                                <el-switch v-if="option.type==='Switch'" v-bind="option.attributes" v-model="option.setting.value" @change="change(option)"></el-switch>
                            </div>
                        </el-descriptions-item>
                    </template>
                </el-descriptions>
            </el-tab-pane>
        </el-tabs>
    </el-card>
</template>

<script setup>
import {ref} from "vue";
import api from "../../utils/api";
import useStatus from "../../states/status";
import {useDebounceFn} from "@vueuse/core";

const status = useStatus()

const tab = ref(null)

const groups = ref([])
const options = ref([])
const option = ref(null)

const refresh = () => Promise.all([
    api('setting_groups').label('refreshGroups').success(false).list(),
    api('setting_options').label('refreshOptions').success(false).list(),
]).then(responses => {
    groups.value = responses[0]
    options.value = responses[1]
    tab.value = tab.value ?? (groups.value[0]?.key ?? null)
})

refresh()

const submit = option => {
    const setting = option.setting
    api('settings', setting.id).label(option.key).put(setting).finally(() => {
        api('setting_options').message(false).show(option.id).then(res => option = res)
    })
}

const debouncedSubmit = useDebounceFn(() => submit(option.value), 1000)

const change = (item, debounce = false) => {
    if (debounce) {
        option.value = item
        debouncedSubmit()
    } else {
        submit(item)
    }
}
</script>

<style scoped>

</style>

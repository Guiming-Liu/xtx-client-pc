<template>
    <XtxDialog :title="(formData ? '编辑' : '添加') + '收货地址'" :visible="dialogVisible" @visible="changeVisible">
        <div class="address-edit">
            <div class="xtx-form">
                <div class="xtx-form-item">
                    <div class="label">收货人：</div>
                    <div class="field">
                        <input v-model="formData.receiver" class="input" placeholder="请输入收货人" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">手机号：</div>
                    <div class="field">
                        <input v-model="formData.contact" class="input" placeholder="请输入手机号" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地区：</div>
                    <div class="field">
                        <XtxCity :fullLocation="formData.fullLocation" @change="changeCity" placeholder="请选择所在地区" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">详细地址：</div>
                    <div class="field">
                        <input v-model="formData.address" class="input" placeholder="请输入详细地址" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">邮政编码：</div>
                    <div class="field">
                        <input v-model="formData.postalCode" class="input" placeholder="请输入邮政编码" />
                    </div>
                </div>
                <div class="xtx-form-item">
                    <div class="label">地址标签：</div>
                    <div class="field">
                        <input v-model="formData.addressTags" class="input" placeholder="请输入地址标签，逗号分隔" />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <XtxButton @click="dialogVisible = false" type="gray" style="margin-right:20px">取消</XtxButton>
            <XtxButton @click="submit()" type="primary">确认</XtxButton>
        </template>
    </XtxDialog>
</template>

<script>
import { reactive, ref } from 'vue-demi'
import { addAddress, editAddress } from '@/api'
import Message from '@/components/library/Message'
export default {
    name: 'AddressEdit',
    setup(props, { emit }) {
        const dialogVisible = ref(false)
        const changeVisible = () => {
            dialogVisible.value = false
        }
        // 打开函数,每次打开对话框都清空表单
        const open = (address) => {
            dialogVisible.value = true
            // 传入{}，即清空，否则就是赋值
            // 如果是修改，那么地址表单有数据，更新数据即可
            if (address.id) {
                for (const key in formData) {
                    formData[key] = address[key]
                }
            } else {
                // 如果是添加，先清空表单数据
                for (const key in formData) {
                    if (key !== formData.isDefault) {
                        formData[key] = null
                    } else {
                        formData[key] = 1
                    }
                }
            }
        }

        // 表单数据
        const formData = reactive({
            id: null,
            receiver: null,
            contact: null,
            provinceCode: null,
            cityCode: null,
            countyCode: null,
            address: null,
            postalCode: null,
            addressTags: null,
            isDefault: 1,
            fullLocation: null
        })
        // 选择地区
        const changeCity = data => {
            formData.provinceCode = data.provinceCode
            formData.cityCode = data.cityCode
            formData.countyCode = data.countyCode
            formData.fullLocation = data.fullLocation
        }

        // 提交操作
        const submit = () => {
            if (formData.id) {
                editAddress(formData).then(data => {
                    // 修改成功
                    Message({ text: '修改收货地址成功', type: 'success' })
                    dialogVisible.value = false
                    emit('on-success', formData)
                })
            } else {
                addAddress(formData).then(data => {
                    // 提示添加成功
                    Message({ text: '添加收货地址成功', type: 'success' })
                    // 拿到地址id
                    formData.id = data.result.id
                    dialogVisible.value = false
                    emit('on-success', formData)
                })
            }
        }

        return { dialogVisible, changeVisible, open, formData, changeCity, submit }
    }
}
</script>

<style scoped lang="less">
.xtx-dialog {
    :deep(.wrapper) {
        width: 780px;

        .body {
            font-size: 14px;
        }
    }
}

.xtx-form {
    padding: 0;

    input {
        outline: none;

        &::placeholder {
            color: #ccc;
        }
    }
}

.xtx-city {
    width: 320px;

    :deep(.select) {
        height: 50px;
        line-height: 48px;
        display: flex;
        padding: 0 10px;
        justify-content: space-between;

        .placeholder {
            color: #ccc;
        }

        i {
            color: #ccc;
            font-size: 18px;
        }

        .value {
            font-size: 14px;
        }
    }

    :deep(.option) {
        top: 49px;
    }
}
</style>
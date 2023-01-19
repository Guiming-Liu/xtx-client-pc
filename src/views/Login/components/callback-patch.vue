<template>
    <Form ref="formCom" :validation-schema="mySchema" autocomplete="off" v-slot="{ errors }" class="xtx-form">
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-user"></i>
                <Field :class="{ err: errors.account }" v-model="form.account" name="account" class="input" type="text"
                    placeholder="请输入用户名" />
            </div>
            <div v-if="errors.account" class="error">{{ errors.account }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-phone"></i>
                <Field :class="{ err: errors.mobile }" v-model="form.mobile" name="mobile" class="input" type="text"
                    placeholder="请输入手机号" />
            </div>
            <div v-if="errors.mobile" class="error">{{ errors.mobile }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-code"></i>
                <Field :class="{ err: errors.code }" v-model="form.code" name="code" class="input" type="text"
                    placeholder="请输入验证码" />
                <span @click="send()" class="code">{{ time === 0 ? '发送验证码' : `${time}秒后发送` }}</span>
            </div>
            <div v-if="errors.code" class="error">{{ errors.code }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field :class="{ err: errors.password }" v-model="form.password" name="password" class="input"
                    type="password" placeholder="请输入密码" />
            </div>
            <div v-if="errors.password" class="error">{{ errors.password }}</div>
        </div>
        <div class="xtx-form-item">
            <div class="field">
                <i class="icon iconfont icon-lock"></i>
                <Field :class="{ err: errors.rePassword }" v-model="rePassword" name="rePassword" class="input"
                    type="password" placeholder="请确认密码" />
            </div>
            <div v-if="errors.rePassword" class="error">{{ errors.rePassword }}</div>
        </div>
        <a @click="submit()" href="javascript:;" class="submit">立即提交</a>
    </Form>
</template>

<script>
import { onUnmounted, reactive, ref } from 'vue-demi'
import schema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/shared'
import { Form, Field } from 'vee-validate'
import { userQQPatchCode, userQQPatchLogin } from '@/api'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
    name: 'CallBackPatch',
    components: { Form, Field },
    props: {
        unionId: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        // 1.表单校验 加两个校验规则：用户名是否已存在，再次输入密码是否一致
        // 2.发送短信验证码：接口API定义
        // 3.完善信息

        // 表单数据对象
        const form = reactive({
            account: null,
            mobile: null,
            code: null,
            password: null,
            rePassword: null
        })
        // 表单检验规则
        const mySchema = {
            account: schema.accountApi,
            mobile: schema.mobile,
            code: schema.code,
            password: schema.password,
            rePassword: schema.rePassword
        }

        // 验证码倒计时逻辑
        const formCom = ref(null)
        const time = ref(0)
        const { pause, resume } = useIntervalFn(() => {
            if (time.value <= 0) {
                pause()
            } else {
                time.value--
            }
        }, 1000, false)
        onUnmounted(() => {
            pause()
        })

        // 1.发送验证码
        // 1.1 绑定发送验证码按钮点击事件
        // 1.2 校验手机号，如果成功才去发送短信（定义API），请求成功开启60s的倒计时，不能再次点击，倒计时结束恢复
        // 1.3 如果失败，失败的校验样式显示出来
        const send = async () => {
            const valid = mySchema.mobile(form.mobile)
            if (valid === true) {
                if (time.value === 0) {
                    await userQQPatchCode(form.mobile)
                    Message({ text: '发送成功', type: 'success' })
                    time.value = 60
                    resume()
                }
            } else {
                formCom.value.setFieldError('mobile', valid)
            }
        }


        //完善信息
        const store = useStore()
        const router = useRouter()
        const submit = () => {
            const valid = formCom.value.validate()
            if (valid) {
                userQQPatchLogin({
                    unionId: props.unionId,
                    ...form
                }).then(data => {
                    const { id, account, avatar, mobile, nickname, token } = data.result
                    store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
                    store.dispatch('cart/mergeCart').then(() => {
                        router.push(store.state.user.redirectUrl)
                        Message({ text: 'QQ信息完善成功', type: 'success' })
                    })
                }).catch(e => {
                    Message({ text: 'QQ信息完善失败', type: 'error' })
                })
            }
        }
        return { form, mySchema, formCom, time, send, submit }
    }
}
</script>

<style scoped lang='less'>
.code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;

    &:hover {
        cursor: pointer;
    }
}
</style>
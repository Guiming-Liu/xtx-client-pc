<template>
    <div class="account-box">
        <div class="toggle">
            <a @click="isMsgLogin = false" href="javascript:;" v-if="isMsgLogin">
                <i class="iconfont icon-user"></i> 使用账号登录
            </a>
            <a @click="isMsgLogin = true" href="javascript:;" v-else>
                <i class="iconfont icon-msg"></i> 使用短信登录
            </a>
        </div>
        <Form ref="formCom" :validationSchema="schema" v-slot="{ errors }" class="form">
            <template v-if="!isMsgLogin">
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field v-model="form.account" name="account" type="text" placeholder="请输入用户名" />
                    </div>
                    <ErrorMessage as="div" v-if="errors.account" class="error" name="account"><i
                            class="iconfont icon-warning" />{{ errors.account }}</ErrorMessage>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-lock"></i>
                        <Field v-model="form.password" name="password" type="password" placeholder="请输入密码" />
                    </div>
                    <ErrorMessage as="div" v-if="errors.password" class="error" name="password"><i
                            class="iconfont icon-warning" />{{ errors.password }}</ErrorMessage>
                </div>
            </template>
            <template v-else>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-user"></i>
                        <Field v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
                    </div>
                    <ErrorMessage as="div" v-if="errors.mobile" class="error" name="mobile"><i
                            class="iconfont icon-warning" />{{ errors.mobile }}</ErrorMessage>
                </div>
                <div class="form-item">
                    <div class="input">
                        <i class="iconfont icon-code"></i>
                        <Field v-model="form.code" name="code" type="password" placeholder="请输入验证码" />
                        <span @click="send()" class="code">{{ time === 0 ? '发送验证码' : `${time}秒后发送` }}</span>
                    </div>
                    <ErrorMessage as="div" v-if="errors.code" class="error" name="code"><i
                            class="iconfont icon-warning" />{{ errors.code }}</ErrorMessage>
                </div>
            </template>
            <div class="form-item">
                <div class="agree">
                    <!-- <XtxCheckbox v-model="form.isAgree"></XtxCheckbox> -->
                    <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
                    <span>我已同意</span>
                    <a href="javascript:;">《隐私条款》</a>
                    <span>和</span>
                    <a href="javascript:;">《服务条款》</a>
                </div>
                <ErrorMessage as="div" v-if="errors.isAgree" class="error" name="isAgree"><i
                        class="iconfont icon-warning" />{{ errors.isAgree }}</ErrorMessage>
            </div>
            <a @click="login()" href="javascript:;" class="btn">登录</a>
        </Form>
        <div class="action">
            <a
                href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
                <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
            </a>
            <div class="url">
                <a href="javascript:;">忘记密码</a>
                <a href="javascript:;">免费注册</a>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue-demi'
import { Form, Field, ErrorMessage } from 'vee-validate'
import veeSchema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { userAccountLogin, userMobileMsg, userMobileLogin } from "@/api"
import { useIntervalFn } from '@vueuse/core'
export default {
    name: 'LoginForm',
    components: { Form, Field, ErrorMessage },
    setup() {
        // 是否用短信登录
        const isMsgLogin = ref(false)
        // 表单信息对象
        const form = reactive({
            account: null,
            password: null,
            mobile: null,
            code: null,
            isAgree: true,
        })

        // 校验规则对象
        const schema = {
            account: veeSchema.account,
            password: veeSchema.password,
            mobile: veeSchema.mobile,
            code: veeSchema.code,
            isAgree: veeSchema.isAgree,
        }

        // 切换表单元素，还原数据并清除校验效果
        const formCom = ref(null)
        watch(isMsgLogin, () => {
            // 还原数据
            form.isAgree = true
            form.account = null
            form.password = null
            form.mobile = null
            form.code = null
            // 校验效果清除：Form组件提供了一个方法resetForm()
            formCom.value.resetForm()
        })

        const store = useStore()
        const route = useRoute()
        const router = useRouter()

        // 需要在点击登录的时候对整体表单进行校验
        const login = async () => {
            // Form组件提供了一个validate函数，用作整体表单验证，返回的是一个promise
            const valid = await formCom.value.validate()
            // 检验成功，发送登录请求
            if (valid) {
                try {
                    // 如果isMsgLogin的值为假，那就是使用账号密码登录
                    let data = null
                    if (!isMsgLogin.value) {
                        const { account, password } = form
                        data = await userAccountLogin({ account, password })
                    } else {
                        // 短信登录
                        // 1.定义两个API 短信登录 获取短信验证码
                        // 2.实现发送短信验证码功能
                        // 3.完成手机短信验证码登录逻辑
                        const { mobile, code } = form
                        data = await userMobileLogin({ mobile, code })
                    }
                    // 1.存储信息
                    const { id, account, nickname, avatar, token, mobile } = data.result
                    store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
                    // 合并购物车
                    store.dispatch('cart/mergeCart').then(() => {
                        // 2.提示
                        Message({ text: '登录成功', type: 'success' })
                        // 3.跳转
                        router.push(route.query.redirectUrl || '/')
                    })
                } catch (e) {
                    if (e.response.data.message) {
                        Message({ text: e.response.data.message || '登录失败', type: 'error' })
                    }
                }

            }
        }

        // pause 暂停 resume开始
        // useIntervalFn(回调函数，间隔时间，是否立即开启)
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

        //发送短信
        const send = async () => {
            const valid = schema.mobile(form.mobile)
            if (valid === true) {
                // 如果手机号校验成功，并且倒计时为0，才可以发送短信
                if (time.value === 0) {
                    await userMobileMsg(form.mobile)
                    Message({ text: '发送成功', type: 'success' })
                    time.value = 60
                    resume()
                }
            } else {
                // 如果手机号校验不成功，使用vee错误函数进行提示
                formCom.value.setFieldError('mobile', valid)
            }
        }

        onMounted(() => {
            // 组件渲染完毕，使用QC生成QQ登录按钮
            QC.Login({
                btnId: 'qqLoginBtn'
            })
        })
        return { isMsgLogin, form, schema, formCom, login, send, time }
    }
}
</script>

<style scoped lang="less">
.account-box {
    .toggle {
        padding: 15px 40px;
        text-align: right;

        a {
            color: @xtxColor;

            i {
                font-size: 14px;
            }
        }
    }

    .form {
        padding: 0 40px;

        &-item {
            margin-bottom: 28px;

            .input {
                position: relative;
                height: 36px;

                >i {
                    width: 34px;
                    height: 34px;
                    background: #cfcdcd;
                    color: #fff;
                    position: absolute;
                    left: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 18px;
                }

                input {
                    padding-left: 44px;
                    border: 1px solid #cfcdcd;
                    height: 36px;
                    line-height: 36px;
                    width: 100%;

                    &.error {
                        border-color: @priceColor;
                    }

                    &.active,
                    &:focus {
                        border-color: @xtxColor;
                    }
                }

                .code {
                    position: absolute;
                    right: 1px;
                    top: 1px;
                    text-align: center;
                    line-height: 34px;
                    font-size: 14px;
                    background: #f5f5f5;
                    color: #666;
                    width: 90px;
                    height: 34px;
                    cursor: pointer;
                }
            }

            >.error {
                position: absolute;
                font-size: 12px;
                line-height: 28px;
                color: @priceColor;

                i {
                    font-size: 14px;
                    margin-right: 2px;
                }
            }
        }

        .agree {
            a {
                color: #069;
            }
        }

        .btn {
            display: block;
            width: 100%;
            height: 40px;
            color: #fff;
            text-align: center;
            line-height: 40px;
            background: @xtxColor;

            &.disabled {
                background: #cfcdcd;
            }
        }
    }

    .action {
        padding: 20px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .url {
            a {
                color: #999;
                margin-left: 10px;
            }
        }
    }
}
</style>
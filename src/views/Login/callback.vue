<template>
    <div class="callback">
        <login-header>联合登录</login-header>
        <section class="container" v-if="isBind">
            <div class="unbind">
                <div class="loading"></div>
            </div>
        </section>
        <section class="container" v-else>
            <nav class="tab">
                <a @click="hasAccount = true" :class="{ active: hasAccount }" href="javascript:;">
                    <i class="iconfont icon-bind" />
                    <span>已有小兔鲜账号，请绑定手机</span>
                </a>
                <a @click="hasAccount = false" :class="{ active: !hasAccount }" href="javascript:;">
                    <i class="iconfont icon-edit" />
                    <span>没有小兔鲜账号，请完善资料</span>
                </a>
            </nav>
            <div class="tab-content" v-if="hasAccount">
                <callback-bind :unionId="unionId"></callback-bind>
            </div>
            <div class="tab-content" v-else>
                <callback-patch :unionId="unionId"></callback-patch>
            </div>
        </section>
        <login-footer></login-footer>
    </div>
</template>

<script>
import { ref } from 'vue-demi'
import LoginFooter from './components/login-footer.vue'
import LoginHeader from './components/login-header.vue'
import CallbackBind from './components/callback-bind.vue'
import CallbackPatch from './components/callback-patch.vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { userQQLogin } from '@/api'
import Message from '@/components/library/Message'
export default {
    name: 'CallBack',
    components: { LoginHeader, LoginFooter, CallbackBind, CallbackPatch },
    setup() {
        const hasAccount = ref(true)
        const isBind = ref(true)
        // 1.获取QQ互联的openId,也就是后台需要的unionId
        // 2.根据QQ互联的openId,进行登录，准备一个接口
        const store = useStore()
        const router = useRouter()
        const unionId = ref(null)
        // 检查QQ是否登录
        if (QC.Login.check()) {
            QC.Login.getMe(openId => {
                unionId.value = openId
                userQQLogin(openId).then(data => {
                    // 1.储存用户信息
                    const { id, account, avatar, mobile, nickname, token } = data.result
                    store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
                    // 合并购物车
                    store.dispatch('cart/mergeCart').then(() => {
                        // 2.跳转到来源页或者首页
                        router.push(store.state.user.redirectUrl)
                        // 3.登录成功提示
                        Message({ text: 'QQ登录成功', type: 'success' })
                    })
                }).catch(e => {
                    // 代表：使用QQ登录失败 ===> 1.没绑定小兔鲜账号 2.没有小兔鲜账号
                    isBind.value = false
                })
            })
        }
        return { hasAccount, isBind, unionId }
    }
}
</script>

<style scoped lang='less'>
.container {
    padding: 25px 0;
    position: relative;
    height: 730px;

    .unbind {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        padding: 25px 0;
        z-index: 99;

        .loading {
            height: 100%;
            background: #fff url(../../assets/images/load.gif) no-repeat center / 100px 100px;
        }
    }
}

.tab {
    background: #fff;
    height: 80px;
    padding-top: 40px;
    font-size: 18px;
    text-align: center;

    a {
        color: #666;
        display: inline-block;
        width: 350px;
        line-height: 40px;
        border-bottom: 2px solid #e4e4e4;

        i {
            font-size: 22px;
            vertical-align: middle;
        }

        span {
            vertical-align: middle;
            margin-left: 4px;
        }

        &.active {
            color: @xtxColor;
            border-color: @xtxColor;
        }
    }
}

.tab-content {
    min-height: 600px;
    background: #fff;
}
</style>
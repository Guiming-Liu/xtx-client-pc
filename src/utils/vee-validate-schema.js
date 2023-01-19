// 定义校验规则，提供给vee-validate组件使用
import {userCheckAccount} from '@/api'
export default {
    // 校验account
    account(value) {
        // value是将来使用该规则的表单元素的值
        // 1.账号不能为空
        // 2.账号需要以字母开头，6-20个字符
        // 如何知道校验成功还是失败？ 返回值true为成功，返回字符串为失败，字符串内容就是失败的提示
        if (!value) return '请输入用户名'
        if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
        return true
    },

    // 检验account是否已经存在
    async accountApi(value) {
        if(!value) return '请出入用户名'
        if (!/^[a-zA-Z]\w{5,19}$/.test(value)) return '字母开头且6-20个字符'
        // 服务端校验
        const {result} = await userCheckAccount(value)
        if(result.valid === true) return '用户名已存在'
        return true
    },

    // 校验password
    password(value) {
        if (!value) return '请输入密码'
        if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
        return true
    },

    // 校验两次密码输入是否一致
    rePassword(value, {form}) {
        if (!value) return '请输入密码'
        if (!/^\w{6,24}$/.test(value)) return '密码是6-24个字符'
        // 校验两次密码是否一致
        if(value !== form.password) return '两次密码输入不一致'
        return true
    },

    // 校验手机号
    mobile(value) {
        if (!value) return '请输入手机号'
        if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
        return true
    },

    // 校验验证码
    code(value) {
        if (!value) return '请输入验证码'
        if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
        return true
    },

    // 校验勾选协议
    isAgree(value) {
        if (!value) return '请勾选同意用户协议'
        return true
    }
}
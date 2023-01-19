import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import Layout from '../views/Layout.vue'
import Home from '../views/Home'
import Category from '../views/Category'
import SubCategory from '../views/SubCategory'
import Goods from '@/views/goods'
import Login from '@/views/Login'
import CallBack from '@/views/Login/callback.vue'
import XtxCartPage from '@/views/cart'
import store from '@/store'
import { h } from 'vue'
const PayCheckout = () => import('@/views/member/pay/checkout')
const XtxPayPage = () => import('@/views/member/pay')
const XtxPayResultPage = () => import('@/views/member/pay/result')
const MemberLayout = () => import('@/views/member/Layout.vue')
const MemberHome = () => import('@/views/member/home')
const MemberOrder = () => import('@/views/member/order')
const MemberOrderDetail = () => import('@/views/member/order/detail.vue')
const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: Category },
      { path: '/category/sub/:id', component: SubCategory },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: XtxCartPage },
      { path: '/member/checkout', component: PayCheckout },
      { path: '/member/pay', component: XtxPayPage },
      { path: '/pay/callback', component: XtxPayResultPage },
      {
        path: '/member', component: MemberLayout,
        children: [
          { path: '/member', component: MemberHome },
          {
            path: '/member/order/',
            component: { render: () => h(<RouterView></RouterView>) },
            children: [
              { path: '', component: MemberOrder },
              { path: ':id', component: MemberOrderDetail  }
            ]
          }
        ]
      }
    ]
  },
  { path: '/login', component: Login },
  { path: '/login/callback', component: CallBack },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0 }
  }
})

// 前置路由守卫
router.beforeEach((to, from, next) => {
  // 需要登录的路由，地址是以 /member 开头
  const { token } = store.state.user.profile
  if (to.path.startsWith('/member') && !token) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.path))
  }
  next()
})

export default router

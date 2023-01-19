<template>
    <div class="category">
        <div class="container">
            <!-- 面包屑 -->
            <XtxBread>
                <XtxBreadItem to="/">首页</XtxBreadItem>
                <transition name="fade-right" mode="out-in">
                    <XtxBreadItem :key="category.id">{{ category.name }}</XtxBreadItem>
                </transition>
            </XtxBread>
            <!-- 轮播图 -->
            <XtxCarousel :banner="banner" style="height:500px" autoPlay></XtxCarousel>
            <!-- 全部二级分类 -->
            <div class="sub-list">
                <h3>全部分类</h3>
                <ul>
                    <li v-for="item in category.children" :key="item.id">
                        <a href="javascript:;">
                            <img :src="item.picture">
                            <p>{{ item.name }}</p>
                        </a>
                    </li>
                </ul>
            </div>
            <!-- 分类商品展示 -->
            <div class="ref-goods" v-for="item in cateGoods" :key="item.id">
                <div class="head">
                    <h3>- {{ item.name }} -</h3>
                    <p class="tag">温暖柔软，品质之选</p>
                    <XtxMore></XtxMore>
                </div>
                <div class="body">
                    <goods-item :goods="subItem" v-for="subItem in item.goods" :key="subItem.id"></goods-item>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { findBanner, findCategory } from '@/api';
import { useStore } from 'vuex';
import { computed, ref, watch } from 'vue-demi';
import { useRoute } from 'vue-router';
import GoodsItem from './components/goods-item.vue';

export default {
    components: { GoodsItem },
    name: 'Category',
    setup() {
        const banner = ref(null)
        findBanner().then((data) => {
            banner.value = data.result
        })
        const store = useStore()
        const route = useRoute()
        const category = computed(() => {
            // 这时候拿到的是全部一级分类的数据，我要的是居家这个一级分类下的数据
            // 怎么拿到居家这个一级分类下的数据呢？
            // 通过id来查找
            // 怎么得到当前居家分类的id？
            // 在路由里，我设置了动态路由，里面有接收分类的id值
            // 调用路由的参数，可以使用route.query或params
            // 在vue3.0里，不能使用this，但可以使用useRouter或useRoute
            // 在这里定义cate为空对象，在数据获取回来前，是一个空对象，而非undefine，这样就不需要在template中判断
            let cate = {}
            const item = store.state.category.category.find(item => {
                return item.id === route.params.id
            })
            if (item) {
                cate = item
            }
            return cate
        })
        const cateGoods = ref([])
        const getCateGoods = () => {
            findCategory(route.params.id).then((data) => {
                cateGoods.value = data.result.children
            })
        }
        watch(() => route.params.id, newVal => {
            if (newVal && `/category/${newVal}` === route.path) getCateGoods()
        }, { immediate: true })
        return { banner, category, cateGoods }
    }
}
</script>

<style scoped lang="less">
.category {
    h3 {
        font-size: 28px;
        color: #666;
        font-weight: normal;
        text-align: center;
        line-height: 100px;
    }

    .sub-list {
        margin-top: 20px;
        background-color: #fff;

        ul {
            display: flex;
            padding: 0 32px;
            flex-wrap: wrap;

            li {
                width: 168px;
                height: 160px;

                a {
                    text-align: center;
                    display: block;
                    font-size: 16px;

                    img {
                        width: 100px;
                        height: 100px;
                    }

                    p {
                        line-height: 40px;
                    }

                    &:hover {
                        color: @xtxColor;
                    }
                }
            }
        }
    }
}

.ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;

    .head {
        .xtx-more {
            position: absolute;
            top: 20px;
            right: 20px;
        }

        .tag {
            text-align: center;
            color: #999;
            font-size: 20px;
            position: relative;
            top: -20px;
        }
    }

    .body {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 0 65px 30px;
    }
}
</style>

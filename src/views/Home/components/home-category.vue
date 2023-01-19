<template>
    <div class='home-category' @mouseleave="(categoryId = null)">
        <!-- 左侧分类 -->
        <ul class="menu">
            <li v-for="item in category" :key="item.id" @mouseenter="(categoryId = item.id)"
                :class="{ active: item.id === categoryId }">
                <router-link :to="`/category/${item.id}`">{{ item.name }}</router-link>

                <template v-if="item.children">
                    <router-link :to="`/category/sub/${subItem.id}`" v-for="subItem in item.children"
                        :key="subItem.id">{{
                                subItem.name
                        }}</router-link>
                </template>
                <template v-else>
                    <XtxSkeleton width="50px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)"
                        animated>
                    </XtxSkeleton>
                    <XtxSkeleton width="50px" height="18px" style="margin-right:5px" bg="rgba(255,255,255,0.2)"
                        animated>
                    </XtxSkeleton>
                </template>
            </li>
        </ul>
        <!-- 右侧弹层 -->
        <div class="layer">
            <h4 v-if="currCategory">{{ currCategory.id === 'brand' ? '品牌' : '分类' }}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
            <!-- 注意：因为currCategory的数据来自category，即来自vuex，是异步获取的数据，要确保异步获取数据完毕后，currCategory有数据之后，才能开始渲染DOM结构，否则会报错，渲染不出结果 -->
            <ul v-if="(currCategory && currCategory.goods)">
                <li v-for="item in currCategory.goods" :key="item.id">
                    <RouterLink :to="`/product/${item.id}`">
                        <img v-lazy="item.picture" alt="">
                        <div class="info">
                            <p class="name ellipsis-2">{{ item.name }}</p>
                            <p class="desc ellipsis">{{ item.desc }}</p>
                            <p class="price"><i>¥</i>{{ item.price }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
            <!-- 品牌 -->
            <!-- 注意：currCategory指的是当前鼠标所在的分类，如果使用brands&&brands.brands。则会导致下面的品牌数据一只出现在结构中，超出了当前鼠标所在分类的界限 -->
            <ul v-if="(currCategory && currCategory.brands)">
                <li class="brand" v-for="item in currCategory.brands" :key="item.id">
                    <RouterLink to="/">
                        <img :src="item.picture" alt="">
                        <div class="info">
                            <p class="place"><i class="iconfont icon-dingwei"></i>{{ item.place }}</p>
                            <p class="name ellipsis">{{ item.name }}</p>
                            <p class="desc ellipsis-2">{{ item.desc }}</p>
                        </div>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>
import { findBrand } from '@/api'
import { computed, reactive, ref } from 'vue-demi'
import { useStore } from 'vuex'
export default {
    name: 'HomeCategory',
    setup() {
        const store = useStore()
        // 重组分类数据数组
        // 从vuex中获取的数据中，没有品牌数据，所以要定义品牌数据，再把定义好的品牌数据和获取的数据组合在一起，形成新的数据
        const brands = reactive({
            id: 'brand',
            name: '品牌',
            children: [{ id: 'child-brand', name: '品牌推荐' }],
            brands: []
        })
        const category = computed(() => {

            // 因为要形成新的数组对象，并且不对原始数据进行改变，所以用map遍历
            const list = store.state.category.category.map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    // 因为是异步获取的数据，要确保有了item.children后才能进行slice()操作，否则会报错
                    children: item.children && item.children.slice(0, 2),
                    goods: item.goods
                }
            })
            list.push(brands)
            return list
        })
        // 目标：鼠标移动到哪一个分类，就显示该分类下的商品数据
        // 首先要找到鼠标所在的分类是哪个分类，只要确定该分类的id值，就能知道是哪个分类
        // 设categoryId的初始值为null，即不在任何一个分类上
        // 设currCategory为鼠标所在的分类
        // 遍历分类数组对象，找到和当前鼠标所在的id值相同的分类，即当前分类,使用find
        const categoryId = ref(null)
        const currCategory = computed(() => {
            return category.value.find(item => item.id === categoryId.value)
        })

        // 获取品牌数据，并加载到右侧弹层上
        // 已有数据brands，分析其结构，得知，品牌数据应该和其他分类的数据结构类似，弹层上的品牌数据，应该和其他分类的goods一样，故在brands上定义一个空数组brands，用来接收品牌数据
        // 因为brands的数据需要从后台中异步获取，所以把brands放到函数外面，定义为响应式数据
        // 获取品牌数据，使用定义好的请求接口
        findBrand(6).then((data) => {
            // reactive修饰的响应式对象不需要.value
            brands.brands = data.result
        })
        return { category, categoryId, currCategory }
    }
}
</script>
  
<style scoped lang='less'>
.home-category {
    width: 250px;
    height: 500px;
    background: rgba(0, 0, 0, 0.8);
    position: relative;
    z-index: 99;

    .menu {
        li {
            padding-left: 40px;
            height: 50px;
            line-height: 50px;

            &:hover,
            &.active {
                background: @xtxColor;
            }

            a {
                margin-right: 4px;
                color: #fff;

                &:first-child {
                    font-size: 16px;
                }
            }
        }

        XtxSkeleton {
            animation: fade 1s linear infinite alternate;
        }

        @keyframes fade {
            from {
                opacity: 0.2;
            }

            to {
                opacity: 1;
            }
        }
    }

    .layer {
        width: 990px;
        height: 500px;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        left: 250px;
        top: 0;
        display: none;
        padding: 0 15px;

        h4 {
            font-size: 20px;
            font-weight: normal;
            line-height: 80px;

            small {
                font-size: 16px;
                color: #666;
            }
        }

        ul {
            display: flex;
            flex-wrap: wrap;

            li {
                width: 310px;
                height: 120px;
                margin-right: 15px;
                margin-bottom: 15px;
                border: 1px solid #eee;
                border-radius: 4px;
                background: #fff;

                &:nth-child(3n) {
                    margin-right: 0;
                }

                a {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    padding: 10px;

                    &:hover {
                        background: #e3f9f4;
                    }

                    img {
                        width: 95px;
                        height: 95px;
                    }

                    .info {
                        padding-left: 10px;
                        line-height: 24px;
                        width: 190px;

                        .name {
                            font-size: 16px;
                            color: #666;
                        }

                        .desc {
                            color: #999;
                        }

                        .price {
                            font-size: 22px;
                            color: @priceColor;

                            i {
                                font-size: 16px;
                            }
                        }
                    }
                }
            }
        }

        li.brand {
            height: 180px;

            a {
                align-items: flex-start;

                img {
                    width: 120px;
                    height: 160px;
                }

                .info {
                    p {
                        margin-top: 8px;
                    }

                    .place {
                        color: #999;
                    }
                }
            }
        }
    }

    &:hover {
        .layer {
            display: block;
        }
    }
}
</style>
  
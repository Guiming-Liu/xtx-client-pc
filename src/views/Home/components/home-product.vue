<template>
    <div class="home-product" ref="target">
        <home-panel :title="item.name" v-for="item in product" :key="item.id">
            <template #right>
                <div class="sub">
                    <RouterLink to="/" v-for="subItem in item.children.slice(0, 4)" :key="subItem.id">{{ subItem.name }}
                    </RouterLink>
                </div>
                <XtxMore></XtxMore>
            </template>
            <div class="box">
                <RouterLink class="cover" to="/">
                    <img v-lazy="item.picture" alt="">
                    <strong class="label">
                        <span>{{ item.name }}馆</span>
                        <span>{{ item.saleInfo }}</span>
                    </strong>
                </RouterLink>
                <ul class="goods-list">
                    <li v-for="subItem in item.goods" :key="subItem.id">
                        <home-goods :goodsList="subItem"></home-goods>
                    </li>
                </ul>
            </div>
        </home-panel>
    </div>
</template>

<script>
import { useLazy } from '@/hooks'
import { findGoods } from '@/api'
import HomeGoods from './home-goods.vue'
import HomePanel from './home-panel.vue'
export default {
    components: { HomePanel, HomeGoods },
    name: 'HomeProduct',
    setup() {
        const { result, target } = useLazy(findGoods)
        return { product: result, target }
    }
}
</script>

<style scoped lang='less'>
.home-product {
    background: #fff;
    height: 2900px;

    .sub {
        margin-bottom: 2px;

        a {
            padding: 2px 12px;
            font-size: 16px;
            border-radius: 4px;

            &:hover {
                background: @xtxColor;
                color: #fff;
            }

            &:last-child {
                margin-right: 80px;
            }
        }
    }

    .box {
        display: flex;

        .cover {
            width: 240px;
            height: 610px;
            margin-right: 10px;
            position: relative;

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .label {
                width: 188px;
                height: 66px;
                display: flex;
                font-size: 18px;
                color: #fff;
                line-height: 66px;
                font-weight: normal;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translate3d(0, -50%, 0);

                span {
                    text-align: center;

                    &:first-child {
                        width: 76px;
                        background: rgba(0, 0, 0, .9);
                    }

                    &:last-child {
                        flex: 1;
                        background: rgba(0, 0, 0, .7);
                    }
                }
            }
        }

        .goods-list {
            width: 990px;
            display: flex;
            flex-wrap: wrap;

            li {
                width: 240px;
                height: 300px;
                margin-right: 10px;
                margin-bottom: 10px;

                &:nth-last-child(-n+4) {
                    margin-bottom: 0;
                }

                &:nth-child(4n) {
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
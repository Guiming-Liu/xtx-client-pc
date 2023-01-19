<template>
    <div class="home-goods">
        <router-link :to="`/product/${goodsList.id}`" class="image">
            <img v-lazy="goodsList.picture" alt="">
        </router-link>
        <p class="name ellipsis-2">{{ goodsList.name }}</p>
        <p class="desc ellipsis">{{ goodsList.desc }}</p>
        <p class="price">&yen;{{ goodsList.price }}</p>
        <div class="extra">
            <RouterLink to="/">
                <span>找相似</span>
                <span>发现现多宝贝 &gt;</span>
            </RouterLink>
        </div>
    </div>
</template>

<script>
import { onMounted } from 'vue-demi'
export default {
    name: 'HomeGoods',
    props: {
        goodsList: {
            type: Object,
            default: () => { }
        }
    }
}
</script>

<style scoped lang='less'>
.home-goods {
    width: 240px;
    height: 300px;
    padding: 10px 30px;
    position: relative;
    overflow: hidden;
    border: 1px solid transparent;
    transition: all .5s;

    .image {
        display: block;
        width: 160px;
        height: 160px;
        margin: 0 auto;

        img {
            width: 100%;
            height: 100%;
        }
    }

    p {
        margin-top: 6px;
        font-size: 16px;

        &.name {
            height: 44px;
        }

        &.desc {
            color: #666;
            height: 22px;
        }

        &.price {
            margin-top: 10px;
            font-size: 20px;
            color: @priceColor;
        }
    }

    .extra {
        position: absolute;
        left: 0;
        bottom: 0;
        height: 86px;
        width: 100%;
        background: @xtxColor;
        text-align: center;
        transform: translate3d(0, 100%, 0);
        transition: all .5s;

        span {
            display: block;
            color: #fff;
            width: 120px;
            margin: 0 auto;
            line-height: 30px;

            &:first-child {
                font-size: 18px;
                border-bottom: 1px solid #fff;
                line-height: 40px;
                margin-top: 5px;
            }
        }
    }

    &:hover {
        border-color: @xtxColor;

        .extra {
            transform: none;
        }
    }
}
</style>
<template>
    <div class='xtx-carousel'>
        <ul class="carousel-body">
            <li class="carousel-item" v-for="(item, i) in banner" :key="i" :class="{ fade: index === i }"
                @mouseenter="pause" @mouseleave="start">
                <!-- 以上@mouseleave不能直接调用autoPlayFn，否则父级没有传animated也会在鼠标离开后开始播放 -->
                <router-link v-if="item.hrefUrl" :to="item.hrefUrl">
                    <img :src="item.imgUrl" alt="">
                </router-link>
                <div v-else class="slider">
                    <router-link v-for="goods in item" :key="goods.id" :to="`/product/${goods.id}`">
                        <img :src="goods.picture" alt="">
                        <p class="name ellipsis">{{ goods.name }}</p>
                        <p class="price">{{ goods.price }}</p>
                    </router-link>
                </div>
            </li>
        </ul>
        <a href="javascript:;" class="carousel-btn prev" @click="prev"><i class="iconfont icon-angle-left"></i></a>
        <a href="javascript:;" class="carousel-btn next" @click="next"><i class="iconfont icon-angle-right"></i></a>
        <div class="carousel-indicator">
            <span v-for="(item, i) in banner" :key="i" :class="{ active: index === i }" @click="index = i"></span>
        </div>
    </div>
</template>
  
<script>
import { computed, onUnmounted, ref, watch } from 'vue-demi'
export default {
    name: 'XtxCarousel',
    props: {
        banner: {
            type: Array,
            default: () => []
        },
        // 不同父级页面的轮播图，自动轮播的间隔时间可能不一样，因此在这里定义间隔时间
        duration: {
            type: Number,
            default: 3000
        },
        // 不同的父级页面，对自动轮播的需求可能不同，所以在这里定义是否自动轮播
        autoPlay: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const index = ref(0)
        let timer = null
        // 定义一个自动轮播的函数,使用间歇函数，而非延时函数
        const autoPlayFn = () => {
            if (timer) clearInterval(timer)
            timer = setInterval(() => {
                index.value++
                if (index.value >= props.banner.length) index.value = 0
            }, props.duration);
        }
        // watch的第一个参数可以监听响应式对象，但如果是响应式对象的值，需要用函数的形式返回该值
        watch(() => props.banner, (newVal) => {
            if (newVal && props.autoPlay) {
                autoPlayFn()
            }
        }, { immediate: true })
        const pause = () => {
            if (timer) clearInterval(timer)
        }
        const start = () => {
            if (props.banner.length && props.autoPlay) {
                autoPlayFn()
            }
        }
        const next = () => {
            index.value = index.value + 1
            if (index.value >= props.banner.length) index.value = 0
        }
        const prev = () => {
            index.value = index.value - 1
            if (index.value <= 0) index.value = props.banner.length - 1
        }
        onUnmounted(() => {
            clearInterval(timer)
        })
        return { index, pause, start, next, prev }
    }
}
</script>
<style scoped lang="less">
.xtx-carousel {
    width: 100%;
    height: 100%;
    min-width: 300px;
    min-height: 150px;
    position: relative;

    .carousel {
        &-body {
            width: 100%;
            height: 100%;
        }

        &-item {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            transition: opacity 0.5s linear;

            &.fade {
                opacity: 1;
                z-index: 1;
            }

            img {
                width: 100%;
                height: 100%;
            }
        }

        &-indicator {
            position: absolute;
            left: 0;
            bottom: 20px;
            z-index: 2;
            width: 100%;
            text-align: center;

            span {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: rgba(0, 0, 0, 0.2);
                border-radius: 50%;
                cursor: pointer;

                ~span {
                    margin-left: 12px;
                }

                &.active {
                    background: #fff;
                }
            }
        }

        &-btn {
            width: 44px;
            height: 44px;
            background: rgba(0, 0, 0, .2);
            color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 228px;
            z-index: 2;
            text-align: center;
            line-height: 44px;
            opacity: 0;
            transition: all 0.5s;

            &.prev {
                left: 20px;
            }

            &.next {
                right: 20px;
            }
        }
    }

    &:hover {
        .carousel-btn {
            opacity: 1;
        }
    }
}

// 轮播商品
.slider {
    display: flex;
    justify-content: space-around;
    padding: 0 40px;

    >a {
        width: 240px;
        text-align: center;

        img {
            padding: 20px;
            width: 230px !important;
            height: 230px !important;
        }

        .name {
            font-size: 16px;
            color: #666;
            padding: 0 40px;
        }

        .price {
            font-size: 16px;
            color: @priceColor;
            margin-top: 15px;
        }
    }
}
</style>
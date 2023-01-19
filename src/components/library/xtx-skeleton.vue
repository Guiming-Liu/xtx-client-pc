<template>
    <div class="xtx-skeleton" :style="{ width, height }" :class="{ shan: animated }">
        <!-- 骨架屏就是有高宽的空盒子，在数据获取完毕前，用来占位显示的 -->
        <div class="block" :style="{ backgroundColor: bg }"></div>
    </div>
</template>

<script>
export default {
    name: 'XtxSkeleton',
    // 使用时，设置动态高度、宽度、背景颜色、是否闪烁
    props: {
        width: {
            type: String,
            default: '100px'
        },
        height: {
            type: String,
            default: '100px'
        },
        bg: {
            type: String,
            default: '#efefef'
        },
        animated: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped lang="less">
.xtx-skeleton {
    display: inline-block;
    position: relative;
    overflow: hidden;
    vertical-align: middle;

    .block {
        width: 100%;
        height: 100%;
        border-radius: 2px;
    }
}

.shan {
    &::after {
        content: "";
        position: absolute;
        animation: shan 1.5s ease 0s infinite;
        top: 0;
        width: 50%;
        height: 100%;
        background: linear-gradient(to left,
                rgba(255, 255, 255, 0) 0,
                rgba(255, 255, 255, 0.3) 50%,
                rgba(255, 255, 255, 0) 100%);
        transform: skewX(-45deg);
    }
}

@keyframes shan {
    0% {
        left: -100%;
    }

    100% {
        left: 120%;
    }
}
</style>
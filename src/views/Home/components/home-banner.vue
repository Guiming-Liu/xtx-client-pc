<template>
    <div class="home-banner">
        <XtxCarousel :banner="banner" autoPlay></XtxCarousel>
    </div>
</template>

<script>
import { findBanner } from '@/api';
import { ref } from 'vue-demi'
export default {
    name: 'HomeBanner',
    setup() {
        const banner = ref(null)
        findBanner(1).then((data) => {
            banner.value = data.result
        })
        return { banner }
    }
}
</script>

<style scoped lang="less">
.home-banner {
    width: 1240px;
    height: 500px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 98;


    // 样式穿透css属性需要和对应子组件的类名相同才能生效
    .xtx-carousel {
        ::v-deep .carousel-btn.prev {
            left: 270px;
        }

        ::v-deep .carousel-indicator {
            padding-left: 250px;
        }
    }

}
</style>
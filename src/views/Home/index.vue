<template>
  <div class="home">
    <div class="container">
      <!-- 左侧分类和右侧弹层 -->
      <home-category></home-category>
      <!-- banner -->
      <home-banner></home-banner>
    </div>
    <!-- 新鲜好物 -->
    <home-new></home-new>
    <!-- 人气推荐 -->
    <home-hot></home-hot>
    <!-- 热门品牌 -->
    <home-brand></home-brand>
    <!-- 产品推荐 -->
    <home-product></home-product>
    <!-- 最新专题 -->
    <home-special></home-special>
  </div>
</template>

<script>
import HomeBanner from './components/home-banner.vue'
import HomeBrand from './components/home-brand.vue'
import HomeCategory from './components/home-category.vue'
import HomeHot from './components/home-hot.vue'
import HomeNew from './components/home-new.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'
export default {
  name: 'Home',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial,
  },

}
</script>

<style>

</style>

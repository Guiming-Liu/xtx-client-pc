<template>
  <div class="goods-comment">
    <div class="head" v-if="commentInfo">
      <div class="data">
        <p><span>{{ commentInfo.salesCount }}</span><span>人购买</span></p>
        <p><span>{{ commentInfo.praisePercent }}</span><span>好评率</span></p>
      </div>
      <div class="tags">
        <div class="dt">大家都在说：</div>
        <div class="dd">
          <a v-for="(item, index) in commentInfo.tags" :key="index" href="javascript:;"
            :class="{ active: currIndex === index }" @click="changeTag(index)">{{ item.title }}（{{ item.tagCount
}}）</a>
        </div>
      </div>
    </div>
    <div class="sort">
      <span>排序：</span>
      <a href="javascript:;" @click="changeSort(null)" :class="{ active: reqParams.sortField === null }">默认</a>
      <a href="javascript:;" @click="changeSort('createTime')"
        :class="{ active: reqParams.sortField === 'createTime' }">最新</a>
      <a href="javascript:;" @click="changeSort('praiseCount')"
        :class="{ active: reqParams.sortField === 'praiseCount' }">最热</a>
    </div>
    <!-- 列表 -->
    <div class="list" v-if="commentList">
      <div class="item" v-for="item in commentList" :key="item.id">
        <div class="user">
          <img :src="item.member.avatar" alt="">
          <span>{{ formatNickname(item.member.nickname) }}</span>
        </div>
        <div class="body">
          <div class="score">
            <i v-for="i in item.score" :key="i + 's'" class="iconfont icon-wjx01"></i>
            <i v-for="i in (5 - item.score)" :key="i + 'k'" class="iconfont icon-wjx02"></i>
            <span class="attr">{{ formatSpecs(item.orderInfo.specs) }}</span>
          </div>
          <div class="text">{{ item.content }}</div>
          <!-- 使用图片预览组件 -->
          <goods-comment-image v-if="item.pictures.length" :pictures="item.pictures"></goods-comment-image>
          <div class="time">
            <span>{{ item.createTime }}</span>
            <span class="zan"><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页组件 -->
    <xtx-pagination v-if="total>0" @changePage="changePageFn" :total="total" :pageSize="reqParams.pageSize" :currPage="reqParams.page"></xtx-pagination>
  </div>
</template>
<script>
import { findGoodsEvaluate, findGoodsEvaluateList } from '@/api';
import { inject, reactive, ref, watch } from 'vue-demi'
import GoodsCommentImage from './goods-comment-image.vue';
import XtxPagination from '../../../components/library/xtx-pagination.vue';
export default {
  components: { GoodsCommentImage, XtxPagination },
  name: 'GoodsComment',
  setup() {
    // 获取评价头部的数据
    const commentInfo = ref(null)
    const goods = inject('goods')
    findGoodsEvaluate(goods.id).then(data => {
      data.result.tags.unshift({ title: '有图', tagCount: data.result.hasPictureCount })
      data.result.tags.unshift({ title: '全部评价', tagCount: data.result.evaluateCount })
      commentInfo.value = data.result
    })

    // 点击激活显示评价标签
    const currIndex = ref(0)
    const changeTag = (index) => {
      currIndex.value = index
      // 点击评价标签，改变reqParams的参数
      // 情况1：点击全部评价，page重置为1，hasPicture为null, tag为null
      if (index === 0) {
        reqParams.page = 1
        reqParams.hasPicture = false
        reqParams.tag = null
      } else if (index === 1) {
        reqParams.page = 1
        reqParams.hasPicture = true
        reqParams.tag = null
      } else {
        reqParams.page = 1
        reqParams.hasPicture = false
        reqParams.tag = commentInfo.value.tags[index].title
      }
      // 情况2：点击有图，page重置为1，hasPicture为true, tag为null
      // 情况3：点击其他tag，page重置为1，hasPicture为null, tag为它的title
    }

    // 点击改变排序
    const changeSort = (type) => {
      reqParams.sortField = type
      reqParams.page = 1
    }

    // 组装发送请求的参数对象
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      hasPicture: null,
      tag: null,
      // sortField的可选字段：praiseCount,createTime
      sortField: null
    })

    // 初始化或改变筛选条件后，获取评价列表数据
    const commentList = ref([])
    const total = ref(null)
    watch(reqParams, () => {
      findGoodsEvaluateList(goods.id, reqParams).then(data => {
        commentList.value = data.result.items
        total.value = data.result.counts
      })
    }, { immediate: true })

    // 定义转换数据的函数
    const formatSpecs = (specs) => {
      return specs.reduce((p, c) => `${p} ${c.name}：${c.nameValue}`, '').trim()
    }
    const formatNickname = (nickname) => {
      return nickname.substr(0, 1) + '****' + nickname.substr(-1)
    }

    // 改变页码，重新发送评论列表的请求
    const changePageFn = (page) => {
      reqParams.page = page
    }

    return { commentInfo, changeTag, currIndex, reqParams, changeSort, formatSpecs, formatNickname, commentList, changePageFn, total }
  }
}
</script>
<style scoped lang="less">
.goods-comment {
  .head {
    display: flex;
    padding: 30px 0;

    .data {
      width: 340px;
      display: flex;
      padding: 20px;

      p {
        flex: 1;
        text-align: center;

        span {
          display: block;

          &:first-child {
            font-size: 32px;
            color: @priceColor;
          }

          &:last-child {
            color: #999;
          }
        }
      }
    }

    .tags {
      flex: 1;
      display: flex;
      border-left: 1px solid #f5f5f5;

      .dt {
        font-weight: bold;
        width: 100px;
        text-align: right;
        line-height: 42px;
      }

      .dd {
        flex: 1;
        display: flex;
        flex-wrap: wrap;

        >a {
          width: 132px;
          height: 42px;
          margin-left: 20px;
          margin-bottom: 20px;
          border-radius: 4px;
          border: 1px solid #e4e4e4;
          background: #f5f5f5;
          color: #999;
          text-align: center;
          line-height: 40px;

          &:hover {
            border-color: @xtxColor;
            background: lighten(@xtxColor, 50%);
            color: @xtxColor;
          }

          &.active {
            border-color: @xtxColor;
            background: @xtxColor;
            color: #fff;
          }
        }
      }
    }
  }

  .sort {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 20px;
    color: #666;

    >span {
      margin-left: 20px;
    }

    >a {
      margin-left: 30px;

      &.active,
      &:hover {
        color: @xtxColor;
      }
    }
  }

  .list {
    padding: 0 20px;

    .item {
      display: flex;
      padding: 25px 10px;
      border-bottom: 1px solid #f5f5f5;

      .user {
        width: 160px;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }

        span {
          padding-left: 10px;
          color: #666;
        }
      }

      .body {
        flex: 1;

        .score {
          line-height: 40px;

          .iconfont {
            color: #ff9240;
            padding-right: 3px;
          }

          .attr {
            padding-left: 10px;
            color: #666;
          }
        }
      }

      .text {
        color: #666;
        line-height: 24px;
      }

      .time {
        color: #999;
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
    }
  }
}
</style>
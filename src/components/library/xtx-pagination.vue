<template>
    <div class="xtx-pagination">
        <a v-if="currPage===1" href="javascript:;" class="disabled">上一页</a>
        <a @click="changePage(currPage-1)" v-else href="javascript:;">上一页</a>
        <span v-if="pager.btnArr[0]>1">...</span>
        <a @click="changePage(i)" v-for="i in pager.btnArr" :key="i" href="javascript:;" :class="{active:currPage===i}">{{ i }}</a>
        <span v-if="pager.btnArr[pager.btnArr.length-1]<pager.totalPage">...</span>
        <a v-if="currPage===pager.totalPage" class="disabled" href="javascript:;">下一页</a>
        <a @click="changePage(currPage+1)" v-else href="javascript:;">下一页</a>
    </div>
</template>

<script>
import { computed, ref } from 'vue-demi'
export default {
    name: 'XtxPagination',
    props: {
        total: {
            type: Number,
            default: 100
        },
        pageSize: {
            type: Number,
            default: 10
        },
        currPage: {
            type: Number,
            default: 1
        },
    },
    setup(props, {emit}) {
        // 按钮的个数
        const btnCount = 5
        // 根据上述的数据，求：总页数、起始页码、结束页码、按钮数组
        const pager = computed(() => {
            const totalPage = Math.ceil(props.total / props.pageSize)
            // 1.理想情况下，求页码的偏移量、起始页和结束页
            const offset = Math.floor(btnCount / 2)
            let start = props.currPage - offset
            let end = start + btnCount - 1
            // 2.当start的计算值小于1时,start=1, 并且end不能超过总页数
            if (start < 1) {
                start = 1
                end = (start + btnCount - 1) < totalPage ? start + btnCount - 1 : totalPage
            }
            // 3.当end的计算值大于总页数时，end=totalPage，并且start不能小于1
            if (end > totalPage) {
                end = totalPage
                start = (end - btnCount + 1) > 1 ? end - btnCount + 1 : 1
            }
            // 处理完start和end后，最终得到按钮数组
            const btnArr = []
            for(let i = start; i <=end; i++) {
                btnArr.push(i)
            }
            return {totalPage, btnArr}
        })

        // 点击分页组件，记录页码的改变，并把页码数传递给父组件
        const changePage = (page) => {
            props.currPage = page
            emit('changePage', page)
        }

        return { pager, changePage}
    }
}
</script>

<style scoped lang="less">
.xtx-pagination {
    display: flex;
    justify-content: center;
    padding: 30px;

    >a {
        display: inline-block;
        padding: 5px 10px;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        margin-right: 10px;

        &:hover {
            color: @xtxColor;
        }

        &.active {
            background: @xtxColor;
            color: #fff;
            border-color: @xtxColor;
        }

        &.disabled {
            cursor: not-allowed;
            opacity: 0.4;

            &:hover {
                color: #333
            }
        }
    }

    >span {
        margin-right: 10px;
    }
}
</style>
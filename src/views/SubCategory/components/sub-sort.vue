<template>
    <div class="sub-sort">
        <div class="sort">
            <a @click="changeSort(null)" :class="{ active: sortParams.sortField === null }" href="javascript:;">默认排序</a>
            <a @click="changeSort('publishTime')" :class="{ active: sortParams.sortField === 'publishTime' }"
                href="javascript:;">最新商品</a>
            <a @click="changeSort('orderNum')" :class="{ active: sortParams.sortField === 'orderNum' }"
                href="javascript:;">最高人气</a>
            <a @click="changeSort('evaluateNum')" :class="{ active: sortParams.sortField === 'evaluateNum' }"
                href="javascript:;">评论最多</a>
            <a @click="changeSort('price')" href="javascript:;">
                价格排序
                <i class="arrow up" :class="{ active: sortParams.sortMethod === 'asc' }"></i>
                <i class="arrow down" :class="{ active: sortParams.sortMethod === 'desc' }"></i>
            </a>
        </div>
        <div class="check">
            <XtxCheckbox @check="changeInventory" v-model="sortParams.inventory">仅显示有货商品
            </XtxCheckbox>
            <XtxCheckbox @check="changeDiscount" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue-demi'
export default {
    name: 'SubSort',
    setup(props, { emit }) {
        // 定义POST请求数据对象
        const sortParams = reactive({
            inventory: false,
            onlyDiscount: false,
            sortField: null,
            sortMethod: null,
        })
        // 改变排序方式
        const changeSort = (sortField) => {
            if (sortField === 'price') {
                sortParams.sortField = sortField
                // 没有点击时，上下箭头都不亮，sortMethod: null，第一次点击时，箭头向下
                if (sortParams.sortMethod === null) {
                    sortParams.sortMethod = 'desc'
                } else if (sortParams.sortMethod === 'desc') {
                    sortParams.sortMethod = 'asc'
                } else {
                    sortParams.sortMethod = 'desc'
                }
                emit('transformSort', sortParams)
            }
            if (sortField !== 'price') {
                sortParams.sortMethod = null
                sortParams.sortField = sortField
                emit('transformSort', sortParams)
            }
        }
        // 改变库存
        const changeInventory = (newVal) => {
            sortParams.inventory = newVal
            emit('transformSort', sortParams)
        }
        // 改变折扣
        const changeDiscount = (newVal) => {
            sortParams.onlyDiscount = newVal
            emit('transformSort', sortParams)
        }
        return { sortParams, changeSort, changeInventory, changeDiscount }
    }
}
</script>

<style scoped lang='less'>
.sub-sort {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .sort {
        display: flex;

        a {
            height: 30px;
            line-height: 28px;
            border: 1px solid #e4e4e4;
            padding: 0 20px;
            margin-right: 20px;
            color: #999;
            border-radius: 2px;
            position: relative;
            transition: all .3s;

            &.active {
                background: @xtxColor;
                border-color: @xtxColor;
                color: #fff;
            }

            .arrow {
                position: absolute;
                border: 5px solid transparent;
                right: 8px;

                &.up {
                    top: 3px;
                    border-bottom-color: #bbb;

                    &.active {
                        border-bottom-color: @xtxColor;
                    }
                }

                &.down {
                    top: 15px;
                    border-top-color: #bbb;

                    &.active {
                        border-top-color: @xtxColor;
                    }
                }
            }
        }
    }

    .check {
        .xtx-checkbox {
            margin-left: 20px;
            color: #999;
        }
    }
}
</style>
<template>
    <div class="goods-sku">
        <!-- sku -->
        <dl v-for="item in goods.specs" :key="item.id">
            <dt>{{ item.name }}</dt>
            <dd>
                <i v-for="sku in item.values" :key="sku.name">
                    <img @click="changeItem(item, sku)" v-if="sku.picture" :src="sku.picture" :title="sku.name"
                        :class="{ selected: sku.selected, disabled: sku.disabled }">
                    <span @click="changeItem(item, sku)" v-else
                        :class="{ selected: sku.selected, disabled: sku.disabled }">{{ sku.name
                        }}</span>
                </i>
            </dd>
        </dl>
    </div>
</template>

<script>
import getPowerSet from '@/vender/power-set'
const spilter = '★'
// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
    const pathMap = {}
    skus.forEach(sku => {
        // 1.过滤出有库存的sku
        if (sku.inventory) {
            // 2.得到sku属性值数组
            const specs = sku.specs.map(spec => spec.valueName)
            // 3.得到sku属性值数组的子集
            const powerSet = getPowerSet(specs)
            // 4.设置给路径字典对象
            powerSet.forEach(val => {
                const key = val.join(spilter)
                if (pathMap[key]) {
                    // 如果key已经有值，那就往数组里追加
                    pathMap[key].push(sku.id)
                } else {
                    // 如果key没有值，那就设置一个数组
                    pathMap[key] = [sku.id]
                }
            })
        }
    })
    return pathMap
}

// 得到当前选中规格的集合
const getSelectedArr = (specs) => {
    const selectedArr = []
    specs.forEach(spec => {
        const selectedVal = spec.values.find(val => val.selected)
        selectedArr.push(selectedVal ? selectedVal.name : undefined)
    })
    return selectedArr
}

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
    specs.forEach((spec, i) => {
        const selectedArr = getSelectedArr(specs)
        spec.values.forEach(val => {
            // 已经选中的按钮不用判断是否禁用
            if (val.name === selectedArr[i]) return false
            // 未选中的按钮替换对应的值
            selectedArr[i] = val.name
            // 过滤无效值得到key
            const key = selectedArr.filter(val => val).join(spilter)
            // 设置禁用状态
            val.disabled = !pathMap[key]
        })
    })
}

// 初始化选中状态
const initSelectedStatus = (goods, skuId) => {
    // 先找到skuId对应的那条sku
    // 遍历每一个按钮，如果按钮的值和sku记录的值相同，就选中
    const sku = goods.skus.find(sku => sku.id === skuId)
    if (sku) {
        goods.specs.forEach((spec, i) => {
            const value = spec.values.find(val => val.name === sku.specs[i].valueName)
            value.selected = true
        })
    }
}

export default {
    name: 'GoodsSku',
    props: {
        goods: {
            type: Array,
            default: () => { }
        },
        skuId: {
            type: String,
            default: ''
        }
    },
    setup(props, { emit }) {
        const pathMap = getPathMap(props.goods.skus)
        // 根据传入的skuId默认选中规格按钮
        if (props.skuId) {
            initSelectedStatus(props.goods, props.skuId)
        }
        // 组件初始化的时候，更新禁用状态
        updateDisabledStatus(props.goods.specs, pathMap)

        const changeItem = (item, sku) => {
            // 如果是禁用状态，不作为
            if (sku.disabled) return
            // 约定：当sku被选中，就拥有一个boolean属性selected
            // 1.如果点击的sku的selected值为真，取反
            if (sku.selected) {
                sku.selected = false
            } else {
                // 2.如果点击的sku的selected值为假，先把通item的所有sku的selected变为假，再把当前点击的sku变为真
                item.values.forEach(val => val.selected = false)
                sku.selected = true
            }
            // 点击的时候，更新禁用状态
            updateDisabledStatus(props.goods.specs, pathMap)
            // 触发change事件，将sku数据传递出去
            const selectedArr = getSelectedArr(props.goods.specs).filter(v => v)
            if (selectedArr.length === props.goods.specs.length) {
                const skuIds = pathMap[selectedArr.join(spilter)]
                const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
                // 传递
                emit('change', {
                    skuId: sku.id,
                    price: sku.price,
                    oldPrice: sku.oldPrice,
                    inventory: sku.inventory,
                    specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
                })
            } else {
                emit('change', {})
            }
        }
        return { changeItem }
    }
}
</script>

<style scoped lang="less">
.sku-state-mixin () {
    border: 1px solid #e4e4e4;
    margin-right: 10px;
    cursor: pointer;

    &.selected {
        border-color: @xtxColor;
    }

    &.disabled {
        opacity: 0.6;
        border-style: dashed;
        cursor: not-allowed;
    }
}

.goods-sku {
    padding-left: 10px;
    padding-top: 20px;

    dl {
        display: flex;
        padding-bottom: 20px;
        align-items: center;

        dt {
            width: 50px;
            color: #999;
        }

        dd {
            flex: 1;
            color: #666;

            img {
                width: 50px;
                height: 50px;
                .sku-state-mixin ();
            }

            span {
                display: inline-block;
                height: 30px;
                line-height: 28px;
                padding: 0 20px;
                .sku-state-mixin ();
            }
        }
    }
}
</style>
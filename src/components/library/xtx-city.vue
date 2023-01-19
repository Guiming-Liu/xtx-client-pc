<template>
    <div class="xtx-city" ref="target">
        <div class="select" @click="toggleDialog()" :class="{active:visible}">
            <span v-if="!fullLocation" class="placeholder">{{ placeholder }}</span>
            <span v-else class="value">{{ fullLocation }}</span>
            <i class="iconfont icon-angle-down"></i>
        </div>
        <div class="option" v-show="visible">
            <div class="loading" v-if="loading"></div>
            <template v-else>
                <span @click="changeItem(item)" class="ellipsis" v-for="item in currList" :key="item.code">{{ item.name
                }}</span>
            </template>
        </div>
    </div>
</template>

<script>
import { computed, reactive, ref } from 'vue-demi'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
    name: 'XtxCity',
    props: {
        fullLocation: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '请选择配送地址'
        }
    },
    setup(props, { emit }) {
        // 控制展开收起，默认收起
        const visible = ref(false)

        // 所有省市区数据
        const cityData = ref([])
        // 正在加载数据
        const loading = ref(false)

        // 提供打开和关闭函数
        const openDialog = () => {
            visible.value = true
            loading.value = true
            // 打开时加载城市数据
            getCityData().then(data => {
                cityData.value = data
                loading.value = false
            })
            // 打开弹层时，清空之前的选择结果
            for (const key in changeResult) {
                changeResult[key] = ''
            }
        }
        const closeDialog = () => {
            visible.value = false
        }

        // 切换展开收起
        const toggleDialog = () => {
            if (visible.value) closeDialog()
            else openDialog()
        }
        // 点击其他位置隐藏
        const target = ref(null)
        onClickOutside(target, () => {
            closeDialog()
        })

        // 获取城市数据
        // 1.数据在哪里
        // 2.何时获取？打开城市列表时，在内存里缓存
        // 3.怎么使用数据？定义计算属性，根据点击的省份城市展示
        const getCityData = () => {
            // 这个位置可能有异常操作，也可能是同步操作，所以封装成promise
            // resolve和reject这两个方法的作用就是改变promise的状态
            return new Promise((resolve, reject) => {
                // 约定：数据存储在window上的cityData字段
                if (window.cityData) {
                    // 有缓存
                    resolve(window.cityData)
                } else {
                    // 无缓存
                    const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
                    axios.get(url).then(res => {
                        window.cityData = res.data
                        resolve(window.cityData)
                    })
                }
            })
        }

        // 定义计算属性
        const currList = computed(() => {
            // 默认显示省一级的列表
            let list = cityData.value
            if (changeResult.provinceCode) {
                // 如果有省份的数据，那就显示该省对应的城市列表
                list = list.find(p => p.code === changeResult.provinceCode).areaList
            }
            if (changeResult.cityCode) {
                // 如果有城市数据，那就显示该城市对应的地区列表
                list = list.find(city => city.code === changeResult.cityCode).areaList
            }
            return list
        })

        // 定义城市数据的结构
        const changeResult = reactive({
            provinceCode: '',
            provinceName: '',
            cityCode: '',
            cityName: '',
            countyCode: '',
            countyName: '',
            fullLocation: ''
        })

        // 每次点击，改变城市数据
        const changeItem = (item) => {
            // 省份
            if (item.level === 0) {
                changeResult.provinceCode = item.code
                changeResult.provinceName = item.name
            }
            // 城市
            if (item.level === 1) {
                changeResult.cityCode = item.code
                changeResult.cityName = item.name
            }
            // 地区
            if (item.level === 2) {
                changeResult.countyCode = item.code
                changeResult.countyName = item.name
                changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
                closeDialog()
                emit('change', changeResult)
            }
        }
        return { visible, toggleDialog, target, currList, loading, changeItem }
    }
}
</script>

<style scoped lang="less">
.xtx-city {
    display: inline-block;
    position: relative;
    z-index: 400;

    .select {
        border: 1px solid #e4e4e4;
        height: 30px;
        padding: 0 5px;
        line-height: 28px;
        cursor: pointer;

        &.active {
            background: #fff;
        }

        .placeholder {
            color: #999;
        }

        .value {
            color: #666;
            font-size: 12px;
        }

        i {
            font-size: 12px;
            margin-left: 5px;
        }
    }

    .option {
        width: 542px;
        border: 1px solid #e4e4e4;
        position: absolute;
        left: 0;
        top: 29px;
        background: #fff;
        min-height: 30px;
        line-height: 30px;
        display: flex;
        flex-wrap: wrap;
        padding: 10px;

        .loading {
            height: 290px;
            width: 100%;
            background: url(../../assets/images/loading.gif) no-repeat center;
        }

        >span {
            width: 130px;
            text-align: center;
            cursor: pointer;
            border-radius: 4px;
            padding: 0 3px;

            &:hover {
                background: #f5f5f5;
            }
        }
    }
}
</style>
<template>
    <div class="xtx-checkbox" @click="changchecked()">
        <i v-if="checked" class="iconfont icon-checked"></i>
        <i v-else class="iconfont icon-unchecked"></i>
        <span v-if="$slots.default">
            <slot></slot>
        </span>
    </div>
</template>

<script>
import { useVModel } from '@vueuse/core'
export default {
    name: 'XtxCheckbox',
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const checked = useVModel(props, 'modelValue', emit)
        const changchecked = () => {
            const newVal = !checked.value
            checked.value = newVal
            emit('change', newVal)
        }
        return { checked, changchecked }
    }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
    display: inline-block;
    margin-right: 2px;

    .icon-checked {
        color: @xtxColor;

        ~span {
            color: @xtxColor;
        }
    }

    i {
        position: relative;
        top: 1px;
    }

    span {
        margin-left: 2px;
    }
}
</style>
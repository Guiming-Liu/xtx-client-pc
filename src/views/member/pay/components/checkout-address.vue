<template>
  <div class="checkout-address">
    <div class="text">
      <div class="none" v-if="!showAddress">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i />货<i />人：</span>{{ showAddress.receiver }}</li>
        <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2') }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation }}{{ showAddress.address }}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <XtxButton @click="openDialog()" class="btn">切换地址</XtxButton>
      <XtxButton @click="openAddressEdit({})" class="btn">添加地址</XtxButton>
    </div>
    <!-- 切换收货地址对话框 -->
    <XtxDialog title="切换收货地址" :visible="dialogVisible" @visible="changeVisible">
      <div @click="selectedAddress = item" :class="{ active: selectedAddress && item.id === selectedAddress.id }"
        class="text item" v-for="item in list" :key="item.id">
        <ul>
          <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
          <li><span>联系方式：</span>{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})/, '$1****$2') }}</li>
          <li><span>收货地址：</span>{{ item.fullLocation + item.address }}</li>
        </ul>
      </div>
      <template v-slot:footer>
        <XtxButton @click="dialogVisible = false" type="gray" style="margin-right:20px">取消</XtxButton>
        <XtxButton @click="confirmAddress()" type="primary">确认</XtxButton>
      </template>
    </XtxDialog>
    <!-- 添加收货地址对话框 -->
    <address-edit ref="addressEdit" @on-success="successHandler"></address-edit>
  </div>
</template>
<script>
import { ref } from 'vue-demi'
import AddressEdit from './address-edit.vue'
export default {
  components: { AddressEdit },
  name: 'CheckoutAddress',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    // 显示的地址
    const showAddress = ref(null)
    if (props.list.length) {
      const defaultAddress = props.list.find(item => item.isDefault === 0)
      if (defaultAddress) {
        showAddress.value = defaultAddress
      } else {
        showAddress.value = props.list[0]
      }
    }

    // 默认通知一个地址ID给父组件
    emit('change', showAddress.value && showAddress.value.id)

    const dialogVisible = ref(false)
    // 选择的地址
    const selectedAddress = ref(null)
    const changeVisible = () => {
      dialogVisible.value = false
    }

    // 打开对话框
    const openDialog = () => {
      dialogVisible.value = true
      selectedAddress.value = null
    }

    // 确认地址
    const confirmAddress = () => {
      // 显示的地址换成选中的地址
      showAddress.value = selectedAddress.value
      // 把选中的地址ID通知结算组件
      emit('change', selectedAddress.value && selectedAddress.value.id)
      dialogVisible.value = false
    }

    // 添加收货地址组件
    const addressEdit = ref(null)
    const openAddressEdit = (address) => {
      addressEdit.value.open(address)
    }

    // 接受添加成功的地址对象
    const successHandler = formData => {
      // 先拿到可修改的地址对象，再修改
      const editAddress = props.list.find(item => item.id === formData.id)
      if (editAddress) {
        // 修改地址
        for (const key in editAddress) {
          editAddress[key] = formData[key]
        }
      } else {
        // 添加地址
        // 需要转换一下数据格式，不然使用的是对象的引用
        const adjson = JSON.stringify(formData)
        props.list.unshift(JSON.parse(adjson))
        // props.list.unshift(formData)
      }
    }

    return { showAddress, dialogVisible, selectedAddress, changeVisible, openDialog, confirmAddress, addressEdit, openAddressEdit, successHandler }
  }
}
</script>
<style scoped lang="less">
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;

  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;

    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }

    >ul {
      flex: 1;
      padding: 20px;

      li {
        line-height: 30px;

        span {
          color: #999;
          margin-right: 5px;

          >i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }

    >a {
      color: @xtxColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }

  .action {
    width: 420px;
    text-align: center;

    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;

      &:first-child {
        margin-right: 10px;
      }
    }
  }

  .xtx-dialog {
    .text {
      flex: 1;
      min-height: 90px;
      display: flex;
      align-items: center;

      &.item {
        border: 1px solid #f5f5f5;
        margin-bottom: 10px;
        cursor: pointer;

        &.active,
        &:hover {
          border-color: @xtxColor;
          background: lighten(@xtxColor, 50%);
        }

        >ul {
          padding: 10px;
          font-size: 14px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>
<template>
  <el-dialog title="进货订单信息" :visible.sync="dialogShow" width="70%">
    <el-form label-width="100px" inline :model="itemData">
      <el-form-item label="供应商" class="el-form-inline">
        <!-- <el-input v-model="itemData.supplier" placeholder="请输入供应商" /> -->
        <el-select v-model="itemData.supplier" placeholder="请选择">
          <el-option
            v-for="item in supplierlist"
            :key="item.id"
            :label="item.s_name"
            :value="item.s_name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名" class="el-form-inline">
        <!-- <el-input v-model="itemData.goodsname" placeholder="请输入商品名" /> -->
        <el-select v-model="itemData.goodsname" placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in goodslist"
            :key="item.id"
            :label="item.goodsname"
            :value="item.goodsname"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="进货单价" class="el-form-inline">
        <el-input v-model="itemData.price" placeholder="请输入进货单价" />
      </el-form-item>
      <el-form-item label="商品描述" class="el-form-inline">
        <el-input v-model="itemData.content" placeholder="请输入商品描述" />
      </el-form-item>
      <el-form-item label="商品规格" class="el-form-inline">
        <el-input v-model="itemData.norms" placeholder="请输入商品规格" />
      </el-form-item>
      <el-form-item label="进货时间" class="el-form-inline">
        <!-- <el-input v-model="itemData.intime" placeholder="请输入出库时间" /> -->
        <el-date-picker v-model="intime" type="datetime" placeholder="请选择进货时间" />
      </el-form-item>
      <el-form-item label="进货数量" class="el-form-inline">
        <el-input v-model="itemData.inNumber" placeholder="请输入进货数量" />
      </el-form-item>
      <el-form-item label="订单状态" class="el-form-inline">
        <!-- <el-input v-model="itemData.state" placeholder="请输入订单状态" /> -->
        <el-select v-model="itemData.state" placeholder="请选择">
          <el-option label="预定中" value="预定中" />
          <el-option label="运输中" value="运输中" />
          <el-option label="等待入库" value="等待入库" />
          <el-option label="完成" value="完成" />
        </el-select>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" @click="onsubmit">保存</el-button>
      <el-button>取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getAllGoods } from '@/api/goods'
import { getAllSuppler } from '@/api/supplier'
import { addOrderPurchase, updateOrderPurchasen } from '@/api/orderPurchase'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    itemData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      type: 'add',
      intime: '',
      goodslist: [],
      supplierlist: []
    }
  },
  watch: {
    show: function(val, oval) {
      if (val) {
        this.dialogShow = val
        if (this.itemData.id) {
          this.type = 'update'
          this.intime = this.$moment(this.itemData.intime * 1000)
        } else {
          this.type = 'add'
        }
      }
    },
    dialogShow: function(val, oval) {
      if (!val) {
        this.$emit('close', val)
      }
    }
  },
  mounted() {
    this.getlists()
  },
  methods: {
    getlists() {
      getAllGoods().then((res) => {
        if (res.code === 200) {
          this.goodslist = res.data
        }
      })
      getAllSuppler().then((res) => {
        if (res.code === 200) {
          this.supplierlist = res.data
        }
      })
    },
    onsubmit() {
      this.$confirm('请确保信息是否填写正确，是否确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.itemData.intime = this.$moment(this.intime).unix()
          this.additem()
          // console.log(this.itemData)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    selectChange(data) {
      console.log(data)
      var goods = this.goodslist.find(item => item.goodsname === data)
      this.itemData.norms = goods.norms
      this.itemData.content = goods.content
    },
    additem() {
      if (this.type === 'add') {
        this.itemData.createtime = this.itemData.updatetime = this.$moment().unix()
        addOrderPurchase(this.itemData).then((res) => {
          this.requestResult(res)
        })
      } else {
        this.itemData.updatetime = this.$moment().unix()
        updateOrderPurchasen(this.itemData).then((res) => {
          this.requestResult(res)
        })
      }
    },
    requestResult(res) {
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        this.dialogShow = false
      } else {
        this.$message({
          type: 'error',
          message: res.msg
        })
      }
    }
  }
}
</script>

<style>
</style>

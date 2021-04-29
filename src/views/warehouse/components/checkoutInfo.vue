<template>
  <el-dialog title="出库信息" :visible.sync="dialogShow" width="70%">
    <el-form label-width="100px" inline :model="itemData">
      <el-form-item label="商品名称" class="el-form-inline">
        <!-- <el-input v-model="itemData.goodname" placeholder="请输入商品名称" /> -->
        <el-select v-model="itemData.goodname" placeholder="请选择" @change="goodsChange">
          <el-option
            v-for="item in goodslist"
            :key="item.id"
            :label="item.goodsname"
            :value="item.goodsname"
          />
        </el-select>
      </el-form-item>
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
      <el-form-item label="出库数量" class="el-form-inline">
        <el-input v-model="itemData.outNumber" placeholder="请输入出库数量" />
      </el-form-item>
      <el-form-item label="出库货架" class="el-form-inline">
        <!-- <el-input v-model="itemData.outShelves" placeholder="请输入出库货架" /> -->
        <el-select v-model="itemData.outShelves" placeholder="请选择">
          <el-option
            v-for="item in shelveslist"
            :key="item.id"
            :label="item.s_number"
            :value="item.s_number"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出库时间" class="el-form-inline">
        <!-- <el-input v-model="itemData.outtime" placeholder="请输入出库时间" /> -->
        <el-date-picker v-model="outtime" type="datetime" placeholder="请选择出库时间" />
      </el-form-item>
      <el-form-item label="操作人" class="el-form-inline">
        <el-input v-model="itemData.operator" readonly placeholder="请输入操作人" />
      </el-form-item>
      <el-form-item label="备注" class="el-form-inline">
        <el-input v-model="itemData.remarks" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button type="primary" @click="onsubmit">保存</el-button>
      <el-button @click="dialogShow = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllGoods, updateGoods } from '@/api/goods'
import { getAllShelves } from '@/api/shelves'
import { getAllSuppler } from '@/api/supplier'
import { addGoodsOut, updateGoodsOut } from '@/api/goodsout'
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
      outtime: '',
      outNumber: 0,
      readonly: false,
      goodslist: [],
      goods: {},
      shelveslist: [],
      supplierlist: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {
    show: function(val, oval) {
      if (val) {
        this.dialogShow = val
        if (this.itemData.id) {
          this.type = 'update'
          this.readonly = true
          this.outNumber = this.itemData.outNumber
          this.outtime = this.$moment(this.itemData.outtime * 1000)
        } else {
          this.type = 'add'
          this.outtime = ''
          this.readonly = false
          this.outNumber = 0
          this.itemData.operator = this.name
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
      getAllGoods().then(res => {
        if (res.code === 200) {
          this.goodslist = res.data
        }
      })
      getAllShelves().then(res => {
        if (res.code === 200) {
          this.shelveslist = res.data
        }
      })
      getAllSuppler().then(res => {
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
          this.itemData.outtime = this.$moment(this.outtime).unix()
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
    additem() {
      if (this.type === 'add') {
        addGoodsOut(this.itemData).then((res) => {
          this.requestResult(res)
        })
      } else {
        updateGoodsOut(this.itemData).then((res) => {
          this.requestResult(res)
        })
      }
    },
    goodsChange(data) {
      // console.log(data)
      this.goods = this.goodslist.find(obj => obj.goodsname === data)
      // this.itemData.supplier = this.goods.supplier
      this.itemData.outShelves = this.goods.shelves_number
    },
    requestResult(res) {
      if (res.code === 200) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        if (this.type === 'add') {
          this.goods.stock = this.goods.stock - this.itemData.outNumber
        } else {
          this.goods.stock = this.goods.stock - (this.itemData.outNumber - this.outNumber)
        }
        updateGoods(this.goods).then(res => {
          if (res.code !== 200) {
            this.$message({
              type: 'error',
              message: '更新库存失败'
            })
          }
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

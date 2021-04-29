<template>
  <el-dialog title="入库信息" :visible.sync="dialogShow" width="70%">
    <el-form label-width="100px" inline :model="itemData">
      <el-form-item label="商品名称" class="el-form-inline">
        <!-- <el-input v-model="itemData.goodname" placeholder="请输入商品名称" /> -->
        <el-select v-model="itemData.goodname" placeholder="请选择">
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
      <el-form-item label="入库数量" class="el-form-inline">
        <el-input v-model="itemData.inNumber" placeholder="请输入入库数量" />
      </el-form-item>
      <el-form-item label="入库货架" class="el-form-inline">
        <!-- <el-input v-model="itemData.inShelves" placeholder="请输入入库货架" /> -->
        <el-select v-model="itemData.inShelves" placeholder="请选择">
          <el-option
            v-for="item in shelveslist"
            :key="item.id"
            :label="item.s_number"
            :value="item.s_number"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入库时间" class="el-form-inline">
        <!-- <el-input v-model="itemData.intime" placeholder="请输入出库时间" /> -->
        <el-date-picker v-model="intime" type="datetime" placeholder="请选择入库时间" />
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
      <el-button>取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAllGoods, updateGoods } from '@/api/goods'
import { getAllShelves } from '@/api/shelves'
import { getAllSuppler } from '@/api/supplier'
import { addGoodsIn, updateGoodsIn } from '@/api/goodsin'
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
      readonly: false,
      goodslist: [],
      goods: {},
      inNumber: 0,
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
          this.inNumber = this.itemData.inNumber
          this.intime = this.$moment(this.itemData.intime * 1000)
        } else {
          this.type = 'add'
          this.intime = ''
          this.readonly = false
          this.inNumber = 0
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
    goodsChange(data) {
      console.log(data)
      this.goods = this.goodslist.find(obj => obj.goodsname === data)
      this.itemData.inShelves = this.goods.shelves_number
    },
    additem() {
      if (this.type === 'add') {
        addGoodsIn(this.itemData).then((res) => {
          this.requestResult(res)
        })
      } else {
        updateGoodsIn(this.itemData).then((res) => {
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
        if (this.type === 'add') {
          this.goods.stock = this.goods.stock + this.itemData.inNumber
        } else {
          this.goods.stock = this.goods.stock + (this.itemData.inNumber - this.inNumber)
        }
        // this.goods.stock = this.goods.stock + this.itemData.outNumber
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

<template>
  <div class="app-container">
    <el-card>
      <el-form inline :model="searchKey">
        <el-form-item label="商品名称">
          <el-input v-model="searchKey.goodsname" placeholder="商品名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="addorupdate('add','')">添加出库订单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table border :data="tableData" :height="tableHeight">
      <el-table-column prop="goodname" label="商品名称" width="180" />
      <el-table-column prop="supplier" label="供应商" width="180" />
      <el-table-column prop="outNumber" label="出库数量" width="180" />
      <el-table-column prop="outShelves" label="出库货架" width="180" />
      <el-table-column prop="outtime" label="出库时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.outtime| moment() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="180" />
      <el-table-column prop="remarks" label="备注" width="180" />
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="addorupdate('update',scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100,total]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <checkout-info :show="dialogShow" :item-data="itemData" @close="closeDialog" />
  </div>
</template>

<script>
import { getGoodsOutByPage, deleteGoodsOut, getGoodsOutByGoodsName } from '@/api/goodsout'
import checkoutInfo from './components/checkoutInfo.vue'
export default {
  components: { checkoutInfo },
  data() {
    return {
      searchKey: {},
      tableData: [],
      itemData: {},
      dialogShow: false,
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    tableHeight: function() {
      return document.documentElement.clientHeight - 220
    }
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      var params = {
        page: this.currentPage,
        size: this.pageSize
      }
      getGoodsOutByPage(params).then((res) => {
        if (res.code === 200) {
          var data = res.data
          this.tableData = data.list
          this.total = data.total
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
      })
    },
    closeDialog(show) {
      this.dialogShow = show
      this.getTableData()
    },
    addorupdate(id, data) {
      if (id === 'add') {
        this.itemData = {}
      } else if (id === 'update') {
        this.itemData = data
      }
      this.dialogShow = true
    },
    search() {
      getGoodsOutByGoodsName(this.searchKey).then(res => {
        if (res.code === 200) {
          this.tableData = res.data
          this.total = res.data.length
          this.pageSize = res.data.length
        }
      })
    },
    deleteItem(data) {
      this.$confirm('确认永久删除该数据？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = {
            id: data.id
          }
          deleteGoodsOut(params).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getTableData()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 10px;
  .el-form {
    text-align: right;
  }
}
</style>

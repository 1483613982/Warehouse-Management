<template>
  <div class="app-container">
    <el-card>
      <el-form inline :model="searchKey">
        <el-form-item label="商品名称">
          <el-input v-model="searchKey.goodsname" placeholder="商品名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button type="primary" @click="addorupdate('add','')">添加销售订单</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-table border :data="tableData" :height="tableHeight">
      <el-table-column prop="supplier" label="供应商" width="180" />
      <el-table-column prop="buyer" label="购买方" width="180" />
      <el-table-column prop="goodsname" label="商品名" width="180" />
      <el-table-column prop="price" label="销售单价" width="180" />
      <el-table-column label="销售总价" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.price*scope.row.outNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="商品描述" width="180" />
      <el-table-column prop="norms" label="商品规格" width="180" />
      <el-table-column prop="outtime" label="销售时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.outtime| moment() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="outNumber" label="进货数量" width="180" />
      <el-table-column prop="state" label="订单状态" width="180" />
      <el-table-column prop="createtime" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createtime| moment() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updatetime" label="修改时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.updatetime| moment() }}</span>
        </template>
      </el-table-column>
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
    <sale-info :show="dialogShow" :item-data="itemData" @close="closeDialog" />
  </div>
</template>

<script>
import { getOrderSaleList, deleteOrderSaleById } from '@/api/orderSale'
import SaleInfo from './components/saleInfo.vue'
export default {
  components: { SaleInfo },
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
      var params = this.searchKey
      params.page = this.currentPage
      params.size = this.pageSize

      getOrderSaleList(params).then((res) => {
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
          deleteOrderSaleById(params).then((res) => {
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
    search() {
      this.currentPage = 1
      this.pageSize = 10
      this.getTableData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableData()
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

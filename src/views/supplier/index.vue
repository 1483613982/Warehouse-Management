<template>
  <div class="app-container">
    <div class="bar">
      <div class="search-box">
        <el-input v-model="searchKey" placeholder="请输入内容" clearable />
      </div>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="primary" @click="editVisible = true;edittype = 'add'">添加供应商</el-button>
    </div>
    <el-table :data="supplierList" style="width: 100%" border :height="tableHeight">
      <el-table-column prop="id" label="编号" width="100" />
      <el-table-column prop="s_name" label="供应商名称" width="180" />
      <el-table-column prop="s_address" label="供应商地址" width="180" />
      <el-table-column prop="s_mobile" label="供应商电话" width="180" />
      <el-table-column prop="postcode" label="邮编" width="180" />
      <el-table-column prop="contacts" label="联系人" width="180" />
      <el-table-column prop="mobile" label="联系人电话" width="180" />
      <el-table-column prop="bank" label="开户银行" width="180" />
      <el-table-column prop="banknumber" label="银行卡号" width="180" />
      <el-table-column prop="e_mail" label="邮箱" width="180" />
      <el-table-column prop="fax" label="传真" width="180" />
      <el-table-column prop="state" label="状态" min-width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0">可用</el-tag>
          <el-tag v-else-if="scope.row.state === 1" type="danger">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="创建时间" min-width="180" :formatter="dateFormatter" />
      <el-table-column prop="updatetime" label="更新时间" min-width="180" :formatter="dateFormatter" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="edit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            :disabled="scope.row.rank == '0' ?true:false"
            type="danger"
            plain
            size="small"
            @click="deletebtn(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <el-dialog title="编辑供应商" :visible.sync="editVisible" width="60%">
      <el-form label-width="100px" :model="supplier">
        <div class="el-form-block">
          <el-form-item label="供应商名称" class="el-form-inline">
            <el-input v-model="supplier.s_name" placeholder="请输入供应商名称" />
          </el-form-item>
          <el-form-item label="供应商地址" class="el-form-inline">
            <el-input v-model="supplier.s_address" placeholder="请输入供应商地址" />
          </el-form-item>
          <el-form-item label="供应商电话" class="el-form-inline">
            <el-input v-model="supplier.s_mobile" placeholder="请输入供应商电话" />
          </el-form-item>
        </div>
        <div class="el-form-block">
          <el-form-item label="联系人" class="el-form-inline">
            <el-input v-model="supplier.contacts" placeholder="请输入联系人" />
          </el-form-item>
          <el-form-item label="联系电话" class="el-form-inline">
            <el-input v-model="supplier.mobile" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="邮编" class="el-form-inline">
            <el-input v-model="supplier.postcode" placeholder="请输入邮编" />
          </el-form-item>
        </div>
        <div class="el-form-block">
          <el-form-item label="开户银行" class="el-form-inline">
            <el-input v-model="supplier.bank" placeholder="请输入开户银行" />
          </el-form-item>
          <el-form-item label="银行卡号" class="el-form-inline">
            <el-input v-model="supplier.banknumber" placeholder="请输入银行卡号" />
          </el-form-item>
        </div>
        <div class="el-form-block">
          <el-form-item label="邮箱" class="el-form-inline">
            <el-input v-model="supplier.e_mail" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="传真" class="el-form-inline">
            <el-input v-model="supplier.fax" placeholder="请输入传真" />
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="addorupdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSupplierList,
  getSupplierCount,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  searchSupplier
} from '@/api/supplier'
export default {
  data() {
    return {
      supplierList: [],
      tableHeight: 500,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchKey: '',
      editVisible: false,
      supplier: {},
      edittype: 'add'
    }
  },
  created() {
    this.getCount()
    this.tableHeight = document.documentElement.clientHeight - 200
  },
  mounted() {
    this.getsupplier()
  },
  methods: {
    // 时间格式化
    dateFormatter(row, column) {
      // console.log(row, column)
      if (column.property === 'createtime') {
        // const createdate = row.create_time
        return this.$moment(row.createtime * 1000).format('YYYY-MM-DD HH:mm:ss')
      } else if (column.property === 'updatetime') {
        return this.$moment(row.updatetime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    // 状态格式化
    stateFormatter(row, column) {
      if (row.state === 0) {
        return '<el-tag>可用</el-tag>'
      } else if (row.state === 1) {
        return '<el-tag type="danger">不可用</el-tag>'
      }
    },
    // 搜索
    search() {
      if (
        this.searchKey === '' ||
        this.searchKey === null ||
        this.searchKey === undefined
      ) {
        this.getSupplier()
      } else {
        searchSupplier(this.searchKey).then(res => {
          if (res.code === 200) {
            this.supplierList = res.data
          } else {
            this.$message({
              showClose: true,
              message: '搜索失败',
              type: 'error'
            })
          }
        })
      }
    },
    getCount() {
      getSupplierCount()
        .then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.total = res.data
          } else {
            console.log('获取总数失败')
          }
        })
        .catch((err) => {
          console.log('请求失败：', err)
        })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getsupplier()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getsupplier()
    },
    getsupplier() {
      getSupplierList(this.currentPage, this.pageSize).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.supplierList = res.data
        }
      })
    },
    addorupdate() {
      console.log(this.edittype)
      switch (this.edittype) {
        case 'add':
          this.supplier.createtime = this.$moment().unix()
          this.supplier.updatetime = this.$moment().unix()
          addSupplier(this.supplier).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              })
              this.editVisible = false
              this.getsupplier()
              this.supplier = {}
            } else {
              this.$message({
                showClose: true,
                message: '添加失败',
                type: 'error'
              })
            }
          })
          break
        case 'update':
          this.supplier.updatetime = this.$moment().unix()
          updateSupplier(this.supplier)
            .then((res) => {
              console.log(res)
              if (res.code === 200) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                })
                this.editVisible = false
                this.getsupplier()
                this.supplier = {}
              } else {
                this.$message({
                  showClose: true,
                  message: '修改失败',
                  type: 'error'
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
          break
        default:
          break
      }
    },
    edit(index, row) {
      this.edittype = 'update'
      this.editVisible = true
      this.supplier = row
    },
    deletebtn(row) {
      console.log(row.id)
      this.$confirm('是否删除该供货商?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplier(row.id)
          .then((res) => {
            if (res.code === 200) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              })
              this.getSupplierList()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
          .catch()
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>


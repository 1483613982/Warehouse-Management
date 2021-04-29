<template>
  <div class="app-container">
    <div class="bar">
      <div class="search-box">
        <el-input v-model="searchKey" placeholder="请输入货架编号" prefix-icon="el-icon-search" />
      </div>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="primary" @click="editVisible = true;edittype = 'add'">添加货架</el-button>
    </div>
    <el-table :data="shelvesList" style="width: 100%" border :height="tableHeight">
      <!-- <el-table-column prop="id" label="编号" width="100" /> -->
      <el-table-column prop="s_number" label="货架编号" width="180" />
      <el-table-column prop="s_layer" label="货架层数" width="180" />
      <el-table-column prop="s_column" label="货架列数" width="180" />
      <el-table-column prop="s_outside" label="货架面数" width="180" :formatter="outsideFormatter" />
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
            @click="deleteShelve(scope.row)"
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
    <el-dialog title="编辑货架" :visible.sync="editVisible" width="60%">
      <el-form label-width="100px" :model="shelves">
        <div class="el-form-block">
          <el-form-item label="货架编号" class="el-form-inline">
            <el-input v-model="shelves.s_number" placeholder="请输入货架编号" />
          </el-form-item>
          <el-form-item label="货架层数" class="el-form-inline">
            <el-input v-model="shelves.s_layer" placeholder="请输入货架层数" />
          </el-form-item>
          <el-form-item label="货架列数" class="el-form-inline">
            <el-input v-model="shelves.s_column" placeholder="请输入货架列数" />
          </el-form-item>
          <el-form-item label="货架面" class="el-form-inline">
            <!-- <el-input v-model="shelves.s_outside" placeholder="请输入货架面数（1/2）" /> -->
            <el-select v-model="shelves.s_outside" placeholder="请选择">
              <el-option value="1" label="单面" />
              <el-option value="2" label="双面" />
            </el-select>
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
  getShelvesCount,
  getShelvesList,
  addShelves,
  updateShelve,
  delShelve,
  searchShelves
} from '@/api/shelves'
export default {
  data() {
    return {
      editVisible: false,
      tableHeight: 500,
      dialogType: 'add', // update 编辑    add 添加
      shelves: {},
      shelvesList: [],
      currentPage: 1,
      pageSize: 10,
      sort: '',
      sortoptions: [],
      searchKey: '',
      total: 0
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 200
    getShelvesCount().then((res) => {
      if (res.code === 200) {
        this.total = res.data
      }
    })
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      getShelvesList(this.currentPage, this.pageSize).then((res) => {
        if (res.code === 200) {
          this.shelvesList = res.data
        }
      })
    },
    dateFormatter(row, column) {
      // console.log(row, column)
      if (column.property === 'createtime') {
        // const createdate = row.create_time
        return this.$moment(row.createtime * 1000).format('YYYY-MM-DD HH:mm:ss')
      } else if (column.property === 'updatetime') {
        return this.$moment(row.updatetime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    outsideFormatter(row, column) {
      var outside = row.s_outside
      if (outside === '1') {
        return '单面'
      } else if (outside === '2') {
        return '双面'
      }
    },
    edit(index, row) {
      this.dialogType = 'update'
      this.editVisible = true
      this.shelves = row
    },
    addorupdate() {
      switch (this.dialogType) {
        case 'add':
          this.addShelve()
          break
        case 'update':
          this.shelves.updatetime = this.$moment().unix()
          updateShelve(this.shelves).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.getList()
              this.editVisible = false
            } else {
              this.$message({
                type: 'error',
                message: '操作失败'
              })
            }
          })
          break
        default:
          break
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    search() {
      searchShelves(this.searchKey).then((res) => {
        if (res.code === 200) {
          this.shelvesList = res.data
        } else {
          this.$message({
            type: 'error',
            message: '查询失败'
          })
        }
      })
    },
    addShelve() {
      this.shelves.createtime = this.$moment().unix()
      this.shelves.updatetime = this.$moment().unix()

      addShelves(this.shelves).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getList()
          this.editVisible = false
          getShelvesCount().then((res) => {
            if (res.code === 200) {
              this.total = res.data
            }
          })
        } else {
          this.$message({
            type: 'error',
            message: '添加失败'
          })
        }
      })
    },
    deleteShelve(row) {
      var id = row.id
      this.$confirm('是否删除该货架信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delShelve(id).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .search-box {
    width: 280px;
    padding: 0 20px;
    margin: 0;
  }
}
</style>

<template>
  <div class="app-container">
    <div class="bar">
      <div class="search-box">
        <el-input v-model="searchKey" placeholder="请输入用户名" prefix-icon="el-icon-search" />
      </div>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="primary" @click="adduser">添加用户</el-button>
    </div>
    <el-table :data="userList" stripe style="width: 100%" border :height="tableHeight">
      <el-table-column prop="id" label="用户编号" width="100" />
      <el-table-column label="头像" width="180">
        <template slot-scope="scope">
          <el-image style="width: 80px; height: 80px" :src="scope.row.avatar" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="usernick" label="用户昵称" width="180" />
      <el-table-column prop="rank" label="权限" width="180" :formatter="rankFormatter" />
      <el-table-column prop="create_time" label="创建时间" width="180" :formatter="dateFormatter" />
      <el-table-column prop="update_time" label="修改时间" min-width="180" :formatter="dateFormatter" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="editbtn( scope.row)">编辑</el-button>
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
    <user-info :show="editVisible" :user-item="user" @close="closeDialog" />
  </div>
</template>

<script>
import { getPageUser, delUser, findUser, getCount } from '@/api/user'

import userInfo from './components/userInfo.vue'
export default {
  components: { userInfo },
  data() {
    return {
      userList: [],
      searchKey: '',
      editVisible: false,
      dialogType: 'add', // edit 编辑    add 添加
      user: {},
      total: 0,
      currentPage: 1,
      pageSize: 10,
      tableHeight: 0
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 200
    getCount().then((res) => {
      if (res.code === 200) {
        this.total = res.data
      }
    })
  },
  mounted() {
    this.getlist()
  },
  methods: {
    // 获得用户列表
    getlist() {
      getPageUser(this.currentPage, this.pageSize).then((res) => {
        this.userList = res.data
      })
    },
    // 权限级别
    rankFormatter(row, column) {
      var rank = row.rank
      if (rank === '0') {
        return '超级管理员'
      } else if (rank === '1') {
        return '管理员'
      } else if (rank === '2') {
        return '用户'
      } else {
        return ''
      }
    },
    // 事件格式化
    dateFormatter(row, column) {
      if (column.property === 'create_time') {
        // const createdate = row.create_time
        return this.$moment(row.create_time).format('YYYY-MM-DD HH:mm:ss')
      } else if (column.property === 'update_time') {
        return this.$moment(row.update_time).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getlist()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getlist()
    },
    closeDialog(show) {
      this.getlist()
      this.editVisible = show
    },
    // 编辑按钮点击事件
    editbtn(row) {
      this.user = row
      this.dialogType = 'edit'
      this.user.password = '密码不可查看'
      // console.log(index, row)
      this.editVisible = true
    },

    // 删除用户
    deletebtn(row) {
      console.log(row.id)
      const id = row.id
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUser(id).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getlist()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
        })
        .catch(() => {})
    },
    // 添加用户点击事件
    adduser() {
      this.user = {
        avatar: '',
        create_time: '',
        password: '',
        rank: '',
        update_time: '',
        username: ''
      }
      this.editVisible = true
      this.dialogType = 'add'
    },

    // 搜索用户
    search() {
      if (this.searchKey.trim() === '') {
        this.getlist()
      } else {
        findUser(this.searchKey)
          .then((res) => {
            if (res.code === 200) {
              this.userList = res.data
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .bar {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .search-box {
      width: 280px;
      padding: 0 20px;
    }
  }
}

</style>

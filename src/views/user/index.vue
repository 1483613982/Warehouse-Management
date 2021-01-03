<template>
  <div class="content">
    <div class="bar">
      <div class="search-box">
        <el-input v-model="searchKey" placeholder="请输入用户名" prefix-icon="el-icon-search" />
      </div>
      <el-button type="primary">搜索</el-button>
      <el-button type="primary" @click="adduser">添加用户</el-button>
    </div>
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="id" label="用户编号" width="100" />
      <el-table-column label="头像" width="180">
        <template scope="scope">
          <el-image style="width: 80px; height: 80px" :src="scope.row.avatar" fit="fill" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="rank" label="权限" width="180" :formatter="rankFormatter" />
      <el-table-column prop="create_time" label="创建时间" width="180" :formatter="dateFormatter" />
      <el-table-column prop="update_time" label="修改时间" :formatter="dateFormatter" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" plain size="small" @click="editbtn(scope.$index, scope.row)">编辑</el-button>
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

    <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
      <div class="edit-box">
        <el-form ref="form" class="el-form" :model="user" label-width="80px">
          <div class="el-form-block">
            <el-form-item label="用户头像" class="el-form-inline">
              <el-image style="width: 100px; height: 100px" :src="user.avatar" fit="fit" />
            </el-form-item>
          </div>
          <div class="el-form-block">
            <el-form-item label="用户编号" class="el-form-inline">
              <el-input v-model="user.id" readonly="readonly" />
            </el-form-item>
            <el-form-item label="权限等级" class="el-form-inline">
              <el-select
                v-model="user.rank"
                placeholder="请选择"
                :disabled="user.rank === '0' ? true:false"
              >
                <el-option label="超级管理员" value="0" disabled />
                <el-option label="管理员" value="1" />
                <el-option label="用户" value="2" />
              </el-select>
            </el-form-item>
          </div>
          <div class="el-form-block">
            <el-form-item label="用户名" class="el-form-inline">
              <el-input v-model="user.username" />
            </el-form-item>
            <el-form-item label="密码" class="el-form-inline">
              <el-input v-model="user.password" :disabled="user.password == '密码不可查看'?true:false" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button v-if="dialogType == 'edit'" type="primary" @click="saveedit">保存修改</el-button>
        <el-button v-else type="primary" @click="saveuser">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, updateUser, addUser, delUser } from '@/api/user'
export default {
  data() {
    return {
      userList: [],
      searchKey: '',
      editVisible: false,
      dialogType: 'add', // edit 编辑    add 添加
      user: {}
    }
  },
  mounted() {
    this.getlist()
  },
  methods: {
    // 获得用户列表
    getlist() {
      getUserList().then((res) => {
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
    // 头像格式化
    avatarFormatter(row, column) {
      const url = row.avatar
      const imghtml =
        "<el-image style='width: 100px; height: 100px' :src=" +
        url +
        " :fit='fit'></el-image>"
      return imghtml
    },
    // 事件格式化
    dateFormatter(row, column) {
      if (column.property === 'create_time') {
        // const createdate = row.create_time
        return this.$moment(row.create_time).format('YYYY-MM-DD hh-mm-ss')
      } else if (column.property === 'update_time') {
        return this.$moment(row.update_time).format('YYYY-MM-DD hh-mm-ss')
      }
    },
    // 编辑按钮点击事件
    editbtn(index, row) {
      console.log(index, row)
      this.editVisible = true
      this.user = row
      this.dialogType = 'edit'
      this.user.password = '密码不可查看'
    },
    // 保存编辑
    saveedit() {
      this.$confirm('是否保存修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateUser(this.user).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.editVisible = false
              this.getlist()
            } else {
              this.$message({
                type: 'error',
                message: '保存失败!'
              })
            }
          })
        })
        .catch(() => {})
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
        id: 0,
        password: '',
        rank: '',
        update_time: '',
        username: ''
      }
      this.editVisible = true
      this.dialogType = 'add'
    },
    // 保存添加用户
    saveuser() {
      const params = {
        avatar: this.user.avatar,
        create_time: this.$moment().unix(),
        id: 0,
        password: this.$md5(this.user.password),
        rank: this.user.rank,
        update_time: this.$moment().unix(),
        username: this.user.username
      }
      debugger
      addUser(params).then((res) => {
        console.log(res)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getlist()
          this.editVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '添加失败'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
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

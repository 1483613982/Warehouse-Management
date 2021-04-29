<template>
  <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
    <div class="edit-box">
      <el-form ref="form" class="el-form" :model="userItem" label-width="80px">
        <div class="el-form-block">
          <el-form-item label="用户头像" class="el-form-inline">
            <el-upload
              class="avatar-uploader"
              :headers="{'token':token}"
              :action="upload.uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="avatar" :src="avatar" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </div>
        <div class="el-form-block">
          <el-form-item label="用户名" class="el-form-inline">
            <el-input v-model="userItem.username" placeholder="用户名" />
          </el-form-item>
          <el-form-item label="密码" class="el-form-inline">
            <el-input v-model="userItem.password" placeholder="密码" :disabled="userItem.password == '密码不可查看'?true:false" />
          </el-form-item>
        </div>
        <div class="el-form-block">

          <el-form-item label="用户昵称" class="el-form-inline">
            <el-input v-model="userItem.usernick" placeholder="用户昵称" />
          </el-form-item>
          <el-form-item label="权限等级" class="el-form-inline">
            <el-select
              v-model="userItem.rank"
              placeholder="请选择"
              :disabled="userItem.rank === '0' ? true:false"
            >
              <el-option label="超级管理员" value="0" disabled />
              <el-option label="管理员" value="1" />
              <el-option label="用户" value="2" />
            </el-select>
          </el-form-item>
        </div>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button v-if="dialogType == 'edit'" type="primary" @click="saveedit">保存修改</el-button>
      <el-button v-else type="primary" @click="saveuser">添加</el-button>
    </span>
  </el-dialog>
</template>

<script>
import upload from '@/api/util'
import { updateUser, addUser } from '@/api/user'
import { getToken } from '@/utils/auth'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    userItem: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      upload,
      editVisible: false,
      dialogType: 'add',
      token: getToken(),
      avatar: ''
    }
  },
  watch: {
    show: function(val, oval) {
      if (val) {
        this.editVisible = val
        if (!this.userItem.id) {
          this.dialogType = 'add'
          this.avatar = ''
        } else {
          this.dialogType = 'edit'
          this.avatar = this.userItem.avatar
        }
      }
    },
    editVisible: function(val, oval) {
      if (!val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
    // 上传图片
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      if (res.code === 200) {
        this.avatar = res.data
      } else {
        this.$message({
          showClose: true,
          message: res.data,
          type: 'error'
        })
      }
    },

    beforeAvatarUpload(file) {
      console.log(file)
    },
    cancel() {
      this.editVisible = false
    },

    // 保存编辑
    saveedit() {
      this.$confirm('是否保存修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.userItem.avatar = this.avatar
          updateUser(this.userItem).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '保存成功!'
              })
              this.editVisible = false
            } else {
              this.$message({
                type: 'error',
                message: '保存失败!'
              })
            }
          })
        })
        .catch(() => {
          this.getlist()
        })
    },
    // 保存添加用户
    saveuser() {
      const params = {
        avatar: this.avatar,
        create_time: this.$moment().unix(),
        id: 0,
        password: this.$md5(this.userItem.password),
        rank: this.userItem.rank,
        update_time: this.$moment().unix(),
        username: this.userItem.username
      }
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

<style scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  line-height: 1;
}
.avatar-uploader:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

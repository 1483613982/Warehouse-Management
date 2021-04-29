<template>
  <el-dialog title="公告信息" :visible.sync="dialogShow" width="70%">
    <el-form label-width="100px" inline :model="itemData">
      <el-form-item label="标题" class="el-form-inline">
        <el-input v-model="itemData.title" placeholder="标题" />
      </el-form-item>
      <el-form-item label="内容" class="el-form-inline">
        <el-input v-model="itemData.content" type="textarea" placeholder="内容" />
      </el-form-item>
      <el-form-item label="发告人" class="el-form-inline">
        <el-input v-model="itemData.informer" readonly placeholder="发告人" />
      </el-form-item>
      <el-form-item label="是否展示" class="el-form-inline">
        <!-- <el-input v-model="itemData.isshow" placeholder="是否展示" /> -->
        <el-select v-model="itemData.isshow" placeholder="请选择">
          <el-option label="是" value="是" />
          <el-option label="否" value="否" />
        </el-select>
      </el-form-item>
      <el-form-item label="发告时间" class="el-form-inline">
        <!-- <el-input v-model="itemData.noticetime" placeholder="发告时间" /> -->
        <el-date-picker v-model="noticetime" type="datetime" placeholder="发告时间" :picker-options="pickerOptions" />
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
import { addNotice, updateNotice } from '@/api/notice'
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
      noticetime: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      }
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
          this.noticetime = this.$moment(this.itemData.noticetime * 1000)
        } else {
          this.type = 'add'
          this.itemData.informer = this.name
        }
      }
    },
    dialogShow: function(val, oval) {
      if (!val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
    onsubmit() {
      this.$confirm('请确保信息是否填写正确，是否确认保存？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.itemData.noticetime = this.$moment(this.noticetime).unix()
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
        this.itemData.createtime = this.itemData.updatetime = this.$moment().unix()
        addNotice(this.itemData).then((res) => {
          this.requestResult(res)
        })
      } else {
        this.itemData.updatetime = this.$moment().unix()
        updateNotice(this.itemData).then((res) => {
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

<template>
  <el-dialog title="公告信息" :visible.sync="dialogShow" width="70%">

    <el-card>
      <div slot="header" class="header">
        <span>{{ itemData.title }}</span>
      </div>
      <div class="content">{{ itemData.content }}</div>
      <div class="footer">
        <span>{{ itemData.informer }}</span>
        <span style="margin-left:10px">{{ itemData.noticetime | moment() }}</span>
      </div>
    </el-card>

  </el-dialog>
</template>

<script>
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
      dialogShow: false
    }
  },

  watch: {
    show: function(val, oval) {
      if (val) {
        this.dialogShow = val
      }
    },
    dialogShow: function(val, oval) {
      if (!val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
.header{
  text-align: center;
}
.content{
  margin: 10px 0;
}
.footer{
  display: flex;
  justify-content: flex-end;
}
</style>

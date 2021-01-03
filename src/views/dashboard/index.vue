<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <h1 class="title">欢迎来到小雷仓库管理系统</h1>
    <div class="system-info">
      <div class="infoitem">前端：{{ frontEnd }}</div>
      <div class="infoitem">后端：{{ backEnd }}</div>
      <div class="infoitem">作者：{{ author }}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['name'])
  },
  data() {
    return {
      frontEnd: 'Vue + Element-UI',
      backEnd: 'Spring boot + Mybatis + MySQL',
      author: '小雷'
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container {
  .system-info {
    .infoitem {
      font-size: 18px;
      line-height: 26px;
    }
  }
}
</style>

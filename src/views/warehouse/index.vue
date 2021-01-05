<template>
  <div class="content">
    <div class="bar">
      <div class="search-box">
        <el-input v-model="searchKey" placeholder="请输入货架编号" prefix-icon="el-icon-search" />
      </div>
      <el-button type="primary">搜索</el-button>
      <div class="search-box">
        <el-select v-model="sort" placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in sortoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-button type="primary">搜索</el-button>
      <el-button type="primary">添加用户</el-button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      editVisible: false,
      dialogType: 'add', // edit 编辑    add 添加
      user: {},

      sort: '',
      sortoptions: [],
      searchKey: ''
    }
  },
  mounted() {

  },
  methods: {

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

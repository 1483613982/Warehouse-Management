<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <h1 class="title">欢迎来到仓库管理系统</h1>
    <div class="system-info">
      <div class="infoitem">前端：{{ frontEnd }}</div>
      <div class="infoitem">后端：{{ backEnd }}</div>
      <div class="infoitem">作者：{{ author }}</div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>公告</span>
          </div>
          <div v-for="(item,index) in noticeList" :key="index">
            <span class="notice-title" @click="shownotice(item)">{{ item.title }}</span>
            <span class="notice-time">{{ item.noticetime | moment() }}</span>
          </div>
          <div v-if="noticeList.length === 0" style=" text-align:center">
            暂无公告
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header">
            <span>库存预警</span>
          </div>
          <div v-for="(item,index) in goodsWarningList" :key="index">
            <span>{{ item.goodsname }}</span>
            <span class="notice-time">库存：{{ item.stock }}</span>
          </div>
          <div v-if="goodsWarningList.length === 0" style=" text-align:center">
            暂无预警商品
          </div>
          <!-- <el-table :data="noticeList" border stripe style="width: 100%">
        <el-table-column prop="title" label="标题" width="180" />
        <el-table-column prop="informer" label="发告人" width="180" />
        <el-table-column prop="noticetime" label="发告时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.noticetime | moment() }}</span>
          </template>
        </el-table-column>
          </el-table>-->
        </el-card>
      </el-col>
    </el-row>
    <notice-info :show="noticeShow" :item-data="noticeItem" @close="closeDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getShowNotice } from '@/api/notice'
import { getGoodsWarning } from '@/api/goods'
import noticeInfo from './components/noticeInfo.vue'

export default {
  name: 'Dashboard',
  components: { noticeInfo },
  data() {
    return {
      frontEnd: 'Vue + Element-UI',
      backEnd: 'Spring boot + Mybatis + MySQL',
      author: '小雷',
      noticeList: [],
      noticeItem: {},
      noticeShow: false,
      goodsWarningList: []
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  mounted() {
    this.getNotice()
    this.getGoods()
  },
  methods: {
    getNotice() {
      getShowNotice().then((res) => {
        if (res.code === 200) {
          this.noticeList = res.data
        }
      })
    },
    getGoods() {
      var params = {
        stock: '100'
      }
      getGoodsWarning(params).then((res) => {
        if (res.code === 200) {
          this.goodsWarningList = res.data
        }
      })
    },
    closeDialog(show) {
      this.noticeShow = show
    },
    shownotice(item) {
      this.noticeItem = item
      this.noticeShow = true
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
    margin-bottom: 20px;
    .infoitem {
      font-size: 18px;
      line-height: 26px;
    }
  }
  .notice-title:hover {
    cursor: pointer;

  }
  .notice-time {
    float: right;
    font-size: 0.8rem;
  }
}
</style>

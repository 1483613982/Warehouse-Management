<template>
  <div class="app-container">
    <div class="bar">
      <div class="search-box">
        <el-input v-model="searchKey" placeholder="请输入商品名称" prefix-icon="el-icon-search" />
      </div>
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button type="primary" @click="addGood()">添加商品</el-button>
    </div>
    <el-table :data="goodsList" style="width: 100%" border :height="tableHeight">
      <!-- <el-table-column prop="id" label="编号" width="100" /> -->
      <el-table-column prop="goodsname" label="商品名称" width="180" />
      <el-table-column prop="goodimgurl" label="商品图片" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.goodimgurl" class="goodsImg">
        </template>
      </el-table-column>
      <el-table-column prop="goodsnumber" label="商品编号" width="180" />
      <el-table-column prop="content" label="商品描述" width="180" />
      <el-table-column prop="norms" label="商品规格" width="180" />
      <el-table-column prop="stock" label="商品库存" width="180" />
      <el-table-column prop="price" label="售价" width="180" />
      <el-table-column prop="productcode" label="生产批号" width="180" />
      <el-table-column prop="promitcode" label="批准文号" width="180" />
      <el-table-column prop="goodstype" label="商品类型" width="180" />
      <el-table-column prop="state" label="商品状态" width="180" />
      <el-table-column prop="shelves_number" label="存放货架" width="180" />
      <el-table-column prop="shelves_layer" label="存放货架层" width="180" />
      <el-table-column prop="shelves_column" label="存放货架列" width="180" />
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
            @click="deleteGood(scope.row)"
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
    <el-dialog title="编辑商品" :visible.sync="editVisible" width="70%">
      <el-form label-width="100px" :model="goods">
        <el-form-item label="商品图片">
          <el-upload
            class="goodsImg-uploader"
            :headers="{'token':token}"
            :action="upload.uploadUrl"
            :show-file-list="false"
            :on-success="handlegoodsImgSuccess"
            :before-upload="beforegoodsImgUpload"
          >
            <img v-if="goodsImg" :src="goodsImg" class="goodsImg">
            <i v-else class="el-icon-plus goodsImg-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="商品名称" class="el-form-inline">
          <el-input v-model="goods.goodsname" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品编号" class="el-form-inline">
          <el-input v-model="goods.goodsnumber" placeholder="请输入商品编号" />
        </el-form-item>
        <el-form-item label="商品规格" class="el-form-inline">
          <el-input v-model="goods.norms" placeholder="请输入商品规格" />
        </el-form-item>
        <el-form-item label="商品描述" class="el-form-inline">
          <el-input v-model="goods.content" placeholder="请输入商品规格" />
        </el-form-item>
        <el-form-item label="售价" class="el-form-inline">
          <el-input v-model="goods.price" placeholder="请输入商品规格" />
        </el-form-item>
        <el-form-item label="生产批号" class="el-form-inline">
          <el-input v-model="goods.productcode" placeholder="请输入商品规格" />
        </el-form-item>
        <el-form-item label="批准文号" class="el-form-inline">
          <el-input v-model="goods.promitcode" placeholder="请输入商品规格" />
        </el-form-item>
        <el-form-item label="商品类型" class="el-form-inline">
          <el-input v-model="goods.goodstype" placeholder="请输入商品类型" />
        </el-form-item>
        <el-form-item label="商品库存" class="el-form-inline">
          <el-input v-model="goods.stock" placeholder="请输入商品库存" />
        </el-form-item>
        <el-form-item label="商品状态" class="el-form-inline">
          <!-- <el-input v-model="goods.state" placeholder="请输入货架列数" /> -->
          <el-select v-model="goods.state" placeholder="请选择">
            <el-option label="在售" value="在售" />
            <el-option label="缺货" value="缺货" />
            <el-option label="库存紧张" value="库存紧张" />
            <el-option label="停售" value="停售" />
          </el-select>
        </el-form-item>

        <el-form-item label="存放货架" class="el-form-inline">
          <el-select v-model="goods.shelves_number" placeholder="请选择货架编号">
            <el-option
              v-for="(item,index) in shelvesList"
              :key="index"
              :label="item.s_number"
              :value="item.s_number"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="存放货架层" class="el-form-inline">
          <el-input v-model="goods.shelves_layer" type="number" placeholder="请输入货架层数" />
          <!-- <el-select v-model="goods.shelves_layer">
              <el-option v-for=" item in shelvesList[]" :key="item" :label="item" :value="item" />
          </el-select>-->
        </el-form-item>
        <el-form-item label="存放货架列" class="el-form-inline">
          <el-input v-model="goods.shelves_column" type="number" placeholder="请输入货架列数" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="addorupdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, addGoods, updateGoods, deleteGoods } from '@/api/goods'
import { getToken } from '@/utils/auth'
import upload from '@/api/util'
import { getAllShelves } from '@/api/shelves'
export default {
  data() {
    return {
      upload,
      searchKey: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      goodsList: [],
      goods: {},
      shelvesList: [],
      editVisible: false,
      edittype: '',
      goodsImg: '',
      token: getToken()
    }
  },
  created() {
    this.tableHeight = document.documentElement.clientHeight - 200
  },
  mounted() {
    this.getList()
    getAllShelves().then((res) => {
      if (res.code === 200) {
        this.shelvesList = res.data
      }
    })
  },
  methods: {
    handlegoodsImgSuccess(res, file) {
      console.log(res, file)
      if (res.code === 200) {
        this.goodsImg = res.data
      } else {
        this.$message({
          showClose: true,
          message: res.data,
          type: 'error'
        })
      }
    },

    beforegoodsImgUpload(file) {
      console.log(file)
    },
    edit(index, row) {
      this.edittype = 'update'
      this.goodsImg = row.goodimgurl || ''
      this.editVisible = true
      this.goods = row
    },
    addGood() {
      this.editVisible = true
      this.edittype = 'add'
      this.goods = {}
      this.goodsImg = ''
    },
    deleteGood(row) {
      this.$confirm('是否确定永久删除该商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = {
            id: row.id
          }
          deleteGoods(params).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getList() {
      getGoodsList(this.currentPage, this.pageSize).then((res) => {
        if (res.code === 200) {
          this.goodsList = res.data.list
          this.total = res.data.total
        } else {
          this.$message({
            type: 'error',
            message: '获得商品列表失败'
          })
        }
      })
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
      this.currentPage = 1
      this.pageSize = 10
      this.getList()
    },
    addorupdate() {
      this.goods.shelves_layer = Number(this.goods.shelves_layer || 1)
      this.goods.shelves_column = Number(this.goods.shelves_column || 1)
      this.goods.updatetime = this.$moment().unix()
      this.goods.goodimgurl = this.goodsImg
      if (this.edittype === 'add') {
        this.goods.createtime = this.$moment().unix()
        addGoods(this.goods).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.editVisible = false
            this.search()
          }
        })
      } else if (this.edittype === 'update') {
        updateGoods(this.goods).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.editVisible = false
            this.search()
          }
        })
      }
    },
    dateFormatter(row, column) {
      // console.log(row, column)
      if (column.property === 'createtime') {
        // const createdate = row.create_time
        return this.$moment(row.createtime * 1000).format('YYYY-MM-DD HH:mm:ss')
      } else if (column.property === 'updatetime') {
        return this.$moment(row.updatetime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
</script>

<style scoped>
.goodsImg-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  line-height: 1;
  width: 100px;
  height: 100px;
}
.goodsImg-uploader:hover {
  border-color: #409eff;
}
.goodsImg-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.goodsImg {
  width: 100px;
  height: 100px;
  display: block;
}
</style>

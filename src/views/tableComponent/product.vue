<template lang="html">
  <div>
    <el-form :inline="true" :model="postData" class="demo-form-inline" labelWidth="80px">
      <el-form-item label="商品编号">
        <el-input v-model="postData.productno" placeholder="商品编号"></el-input>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="postData.productname" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="text"  @click="onPuls" :icon="ispul ? 'el-icon-arrow-up' : 'el-icon-arrow-down'">{{ispul ? '收起' : '展开'}}条件</el-button>
      </el-form-item>
      <div v-show="ispul">
        <el-form-item label="商品分类">
          <el-input v-model="postData.categoryno" placeholder="商品分类"></el-input>
        </el-form-item>
        <el-form-item label="规格">
          <el-input v-model="postData.productrule" placeholder="规格"></el-input>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="postData.productsize" placeholder="型号"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="filter-container">
      <el-checkbox-group v-model="checkboxVal">
        <el-checkbox label="productrule">规格</el-checkbox>
        <el-checkbox label="productsize">型号</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table
      ref="productTable"
      @selection-change="handleSelectionChange"
      highlight-current-row
      max-height="600"
      :key='key'
      :data="gridData" :loading="loading">
      <el-table-column
        type="selection"
        fixed="left"
        width="80">
      </el-table-column>
      <el-table-column property="productno" label="商品编号" width="120"></el-table-column>
      <el-table-column property="categoryno" label="分类" width="100"></el-table-column>
      <el-table-column property="productname" label="商品名称" ></el-table-column>
      <el-table-column :key='fruit.value' v-for='fruit in formThead' :label="fruit.name" width="250">
        <template slot-scope="scope">
          {{scope.row[fruit.value]}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
    <div class="clearfix"></div>
  </div>
</template>

<script>
import { GetProduct } from '@/api/planorder'
const defaultFormThead = []
export default {
  data() {
    return {
      gridData: [],
      pagesize: 10,
      pageindex: 1,
      total: 0,
      currentPage: 1,
      loading: false,
      postData: {
        productname: '',
        categoryno: '',
        productno: '',
        productrule: '',
        productsize: ''
      },
      multipleSelection: [],
      ispul: false,
      checkboxVal: defaultFormThead, // checkboxVal
      key: 1, // table key
      formTheadOptions: [{ name: '规格', value: 'productrule' }, { name: '型号', value: 'productsize' }],
      formThead: defaultFormThead // 默认表头 Default header
    }
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(i => valArr.includes(i.value))
      this.key = this.key + 1// 为了保证table 每次都会重渲 In order to ensure the table will be re-rendered each time
    }
  },
  created() {
    if (!this.gridData.length) {
      this.getList()
    }
  },
  methods: {
    onConfirm() {
      this.$emit('subProduct', this.multipleSelection)
      this.$refs.productTable.clearSelection()
      this.$emit('diClose')
    },
    onCancel() {
      this.$refs.productTable.clearSelection()
    },
    onPuls() {
      this.ispul = !this.ispul
    },
    getList() {
      this.loading = true
      GetProduct({
        pagesize: this.pagesize,
        pageindex: this.pageindex,
        ...this.postData
      }).then(res => {
        console.log(res)
        this.gridData = res.data.purchorders
        this.total = res.data.total
        this.currentPage = res.data.currentPage
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.pagesize = val
      this.getList()
    },
    handleCurrentPageChange(val) {
      this.pageindex = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSubmit() {
      this.getList()
    }
  }
}
</script>

<style lang="css">
.dialog-footer {
  float: right;
}
.clearfix:after{content:".";display:block;height:0;clear:both;visibility:hidden;}
.clearfix{zoom:1;}
.clear{clear:both;display:block;height:0;overflow:hidden;font-size:0;}
</style>

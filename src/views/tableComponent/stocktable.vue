<template lang="html">
  <el-table
    :data="list"
    style="width: 100%"
    v-loading="loading"
    border
    max-height="600">
    <el-table-column
      label="商品名称"
      fixed="left"
      width="240">
      <template slot-scope="scope">
        <span>{{ scope.row.materialname }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="品牌"
      width="150">
      <template slot-scope="scope">
        {{ scope.row.materialtag }}
      </template>
    </el-table-column>
    <el-table-column
      label="规格"
      width="200">
      <template slot-scope="scope">
        {{ scope.row.materialrule }}
      </template>
    </el-table-column>
    <el-table-column
      label="型号"
      width="200">
      <template slot-scope="scope">
        <span>{{ scope.row.materialsize }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="仓库名"
      width="200">
      <template slot-scope="scope">
        <span>{{ scope.row.storename }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="库存单位"
      width="100">
      <template slot-scope="scope">
        <span>{{ scope.row.orderunit }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="库存数量">
      <template slot-scope="scope">
        <span>{{ scope.row.materialnum }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: ['list', 'loading']
}
</script>

<style lang="css">
</style>

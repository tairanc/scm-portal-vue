<template>
  <div>
    <el-form :model="params" ref="queryForm" label-width="120px" class="demo-ruleForm" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="供应商名称：" prop="supplierCode">
            <el-input v-model="params.supplierCode" placeholder="供应商名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品SKU编号：" prop="skuCode">
            <el-input v-model="params.skuCode" placeholder="商品SKU编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品名称：" prop="itemName">
            <el-input v-model="params.itemName" placeholder="商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商商品SKU编号：" prop="supplierSkuCode">
            <el-input v-model="params.supplierSkuCode" placeholder="供应商商品SKU编号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="品牌：" prop="brand">
            <el-input v-model="params.brand" placeholder="品牌"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条形码：" prop="barCode">
            <el-input v-model="params.barCode" placeholder="条形码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="供应商商品状态：" prop="state">
            <el-input v-model="params.state" placeholder="供应商商品状态"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="最近更新日期：">
            <el-col :span="11">
              <el-form-item prop="startDate">
                <el-date-picker
                  v-model="params.startDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col style="text-align: center" :span="2">-</el-col>
            <el-col :span="11">
              <el-form-item prop="endDate">
                <el-date-picker
                  v-model="params.endDate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :offset="2" :span="6">
          <el-form-item>
            <el-button type="primary" icon="search" @click="search">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <table-pagination
      :loading="loading"
      ref="mainTable"
      @getPageData="getPageData"
      :params="params"
      :pageData="pageData"
      :columns="columns"
      @col-click="handleColClick"
    >
    </table-pagination>
  </div>
</template>
<script>
  import { createNamespacedHelpers } from 'vuex'
  import notify from '@/utils/notify'
  import purchase from '@/api/purchase'
  import ElRow from 'element-ui/packages/row/src/row'
  import ElCol from 'element-ui/packages/col/src/col'

  const {mapState, mapActions} = createNamespacedHelpers('purchaseOrder')
  export default {
    components: {
      ElCol,
      ElRow
    },
    name: 'goods-external-goodsList',
    data () {
      return {
        params: {
          start: 0,
          direction: 'ASC',
          supplierCode: '',
          skuCode: '',
          itemName: '',
          supplierSkuCode: '',
          brand: '',
          barCode: '',
          state: '',
          startDate: '',
          endDate: ''
        },
        columns: [
          {
            label: '商品SKU编号',
            field: 'skuCode'
          }, 
          {
            label: '供应商名称',
            field: 'supplierName'
          }, 
          {
            label: '供应商商品SKU编号',
            field: 'supplierSkuCode'
          }, 
          {
            label: '商品名称',
            field: 'itemName'
          }, 
          {
            label: '供应商名称',
            field: 'supplierName'
          }, 
          {
            label: '条形码',
            field: 'barCode'
          }, 
          {
            label: '供货价(元)',
            field: 'supplyPrice'
          }, 
          {
            label: '市场参考价(元)',
            field: 'marketReferencePrice'
          }, 
          {
            label: '仓库名称',
            field: 'warehouse'
          }, 
          {
            label: '库存',
            field: 'stock'
          },
          {
            label:'供应商商品状态',
            field: 'state'
          },
          {
            label: '最近同步时间',
            field: 'notifyTime'
          },
          {
            label: '最近更新时间',
            field: 'updateTime'
          }
        ],
        goodsColumns: [
          {
            label: '商品SKU名称',
            field: 'skuName',
            width: '120px'
          },
          {
            label: '商品SKU编号',
            field: 'skuCode',
            width: '120px'
          },
          {
            label: '规格',
            field: 'specNatureInfo',
            width: '80px'
          },
          {
            label: '货号',
            field: 'itemNo',
            width: '120px'
          },
          {
            label: '条形码',
            field: 'barCode',
            width: '140px'
          },
          {
            label: '品牌名称',
            field: 'brandName',
            width: '120px'
          },
          {
            label: '一级分类/二级分类/三级分类',
            field: 'allCategoryName',
            width: '200px'
          },
          {
            label: '进价(元)',
            field: 'purchasePrice',
            width: '80px'
          },
          {
            label: '采购数量',
            field: 'purchasingQuantity',
            width: '90px'
          },
          {
            label: '采购总金额(元)',
            field: 'totalPurchaseAmount',
            width: '120px'
          },
          {
            label: '批次号',
            field: 'batchCode',
            width: '120px'
          },
          {
            label: '生产编码',
            field: 'produceCode',
            width: '120px'
          },
          {
            label: '生产日期',
            field: 'productDate',
            width: '100px'
          },
          {
            label: '截止保质日期',
            field: 'expireDate',
            width: '120px'
          },
          {
            label: '理论保质期限(天)',
            field: 'shelfLifeDays',
            width: '140px'
          }
        ]
      }
    },
    computed: {
      ...mapState(['purchaseOrderStatus', 'purchaseTypes', 'purchaseTypesMap', 'purchaseOrderStatusMap', 'pageData', 'loading', 'purchaseOrder', 'goodsList', 'purchaseOrderEdit', 'goodsListEdit'])
    },
    methods: {
      search () {
        this.$refs['mainTable'].getPageData()
      },
      handleColClick (val) {
        this.getGoodsList({purchaseId: val.id, start: 0, pageIndex: 0})
        this.getPurchaseOrderById(val.id)
        this.$refs['logTable'].getLogData({entityId: val.id, entityType: 'PurchaseOrder'})
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      deleteOrder (row) {
        purchase.deleteOrder(row).then((res) => {
          notify.success(res.data.databuffer)
          this.search()
        })
      },
      ...mapActions(['getPurchaseOrderStatus', 'getPurchaseTypes', 'getPageData', 'getPurchaseOrderById', 'getGoodsList', 'getPurchaseOrderEditById', 'getGoodsListEdit'])
    },
    created () {
      this.getPurchaseTypes()
      this.getPurchaseOrderStatus()
    }
  }
</script>

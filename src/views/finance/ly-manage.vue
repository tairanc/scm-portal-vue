<template>
  <div class="ly-manage">
    <el-form :model="params" ref="queryForm" label-width="130px" class="demo-ruleForm" size="medium">
      <el-row>
        <el-col :span="6">
          <el-form-item label="商品SKU编号:" prop="skuCode">
            <el-input v-model="params.skuCode" placeholder="商品SKU编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="粮油商品SKU编号:" prop="supplierSkuCode">
            <el-input v-model="params.supplierSkuCode" placeholder="粮油商品SKU编号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="粮油商品名称:" prop="itemName">
            <el-input v-model="params.itemName" placeholder="粮油商品名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="平台订单号:" prop="platformOrderCode">
            <el-input v-model="params.platformOrderCode" placeholder="平台订单号"></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="6">
          <el-form-item label="店铺订单号:" prop="shopOrderCode">
            <el-input v-model="params.shopOrderCode" placeholder="店铺订单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="粮油订单号:" prop="supplierOrderCode">
            <el-input v-model="params.supplierOrderCode" placeholder="粮油订单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="系统发送粮油日期：">
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
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 100%">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="searchOrder">查询</el-button>
                <el-button type="default" @click="resetForm('queryForm')">重置</el-button>
                <el-button type="default" @click="exportOrderReport">导出</el-button>
          </el-form-item>
        </el-col>
      </el-row>    
    </el-form>
    <table-pagination
          :index="true"
          :loading="loading"
          ref="orderTable"
          @getPageData="getLyOrderPage"
          :params="params"
          :pageData="pageData"
          :columns="orderColumns"
        >
    </table-pagination>
  </div>
</template>

<script>
  import bill from '@/api/bill'
  import notify from '@/utils/notify'

  export default {
    name: 'finance-ly-manage',
    data () {
      return {
        params: {
          start: 0,
          skuCode: '',
          supplierSkuCode:'',
          itemName:'',
          platformOrderCode:'',
          shopOrderCode:'',
          supplierOrderCode:'',
          startDate: '',
          endDate: ''
        },
        pageData:{},
        loading: false,
        orderColumns: [
          {label: '商品SKU编号', field: 'skuCode', width: '200',align:'center'},
          {label: '粮油商品SKU编号', field: 'supplierSkuCode', width: '200',align:'center'},
          {label: '粮油商品名称', field: 'itemName', width: '338',align:'center'},
          {label: '交易数量', field: 'num', width: '140',align:'center'},
          {label: '平台订单号', field: 'platformOrderCode', width: '210',align:'center'},
          {label: '店铺订单号', field: 'shopOrderCode', width: '210',align:'center'},
          {label: '粮油订单号', field: 'supplierOrderCode', width: '210',align:'center'},
          {label: '买家实付商品金额', field: 'payment', width: '140',align:'center'},
          {label: '系统发送粮油时间', field: 'createTime', width: '200',align:'center'}
        ]
      }
    },
    methods: {
      getLyOrderPage (params) {
        this.loading = true
        bill.getLyOrderPage(params)
        .then((res) => {
          this.pageData = res.data
          this.loading = false
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      searchOrder () {
        this.$refs['orderTable'].getPageData()
      },
      exportOrderReport () {
        this.$store.dispatch('exportReport', {
          url: 'LyBill/ExportOrder',
          params: this.params
        })
      }
    },
    created () {
      let now = new Date()
      let day = now.getDate()
      let month = now.getMonth()+1;
      let year = now.getFullYear();
      if(month<9){
        this.params.startDate= year +"-"+"0"+month+"-"+"01"; 
      }else{
        this.params.startDate= year +"-"+month+"-"+"01";
      };
      this.params.endDate = now.format('yyyy-MM-dd')
    }
  }
</script>

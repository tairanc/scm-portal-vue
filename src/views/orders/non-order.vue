<template>
  <div class="non-order">
      <el-form :model="params" ref="queryForm" label-width="130px" class="demo-ruleForm" size="medium">
        <el-row>
            <el-col :span="6">
                <el-form-item label="拆单异常编号:" prop="exceptionOrderCode">
                    <el-input v-model="params.exceptionOrderCode" placeholder="拆单异常编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="店铺订单编号:" prop="shopOrderCode">
                    <el-input v-model="params.shopOrderCode" placeholder="店铺订单编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="平台订单编号:" prop="platformOrderCode">
                    <el-input v-model="params.platformOrderCode" placeholder="平台订单编号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="收货人:" prop="receiverName">
                    <el-input v-model="params.receiverName" placeholder="收货人"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-form-item label="异常类型：" prop="exceptionType">
                    <el-select v-model="params.exceptionType" placeholder="异常类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="缺货退回" value="1"></el-option>
                    <el-option label="缺货等待" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>      
            <el-col :span="6">
                <el-form-item label="状态：" prop="status">
                    <el-select v-model="params.status" placeholder="状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="待了结" value="1"></el-option>
                        <el-option label="已了结" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="生成日期:">
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
          </el-form-item>
        </el-col>
        </el-row>
      </el-form>
      <table-pagination
          :index="true"
          :loading="loading"
          ref="orderTable"
          @getPageData="getNonOrderPage"
          :params="params"
          :pageData="pageData"
          :columns="nonOrderColumns"
          @col-click="handleColClick"
        >
    </table-pagination>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="异常商品" name="goods">
        <table-view
          :index="true"
          :pageList="orderInfo.exceptionOrderItemList"
          :columns="goodsColumns"
          :height="220"
        >
        </table-view>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="log">
        <log-table ref="logTable"></log-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
    import order from '@/api/order'
    import notify from '@/utils/notify' 
export default {
    name:'orders-non-order',
    data () {
        return {
            params: {
                start: 0,
                exceptionOrderCode: '',
                shopOrderCode: '',
                platformOrderCode: '',
                exceptionType: '',
                status: '',
                receiverName: '',                
                startDate: '',
                endDate: ''
            },
            activeTab: 'goods',
            pageData: {},
            orderInfo: {
                exceptionOrderItemList: []
            },
            statusMap: {
                10: '待了结',
                11: '了结'
            },
            exceptionTypeMap: {
                1: '缺货退回',
                2: '缺货等待'
            },
            itemTypeMap: {
                1: '自采',
                2: '代发'
            },
            loading: false,
            nonOrderColumns: [
                {label: '拆单异常单编号', field: 'exceptionOrderCode', width: '200',align:'center'},
                {label: '店铺订单号', field: 'shopOrderCode', width: '200',align:'center'},
                {label: '平台订单号', field: 'platformOrderCode', width: '200',align:'center'},
                {label: '店铺名称', field: 'shopName', width: '300',align:'center'},
                {
                    label: '异常类型',
                    field: 'exceptionType', 
                    desField: 'message',
                    width: '120',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.exceptionTypeMap[cellValue]
                        return (data)
                    }
                },
                {label: '异常商品总数量', field: 'itemNum', width: '120',align:'center'},
                {label: '收货人', field: 'receiverName', width: '210',align:'center'},
                {label: '收货人联系方式', field: 'receiverMobile', width: '159',align:'center'},
                {
                    label: '状态',
                    desField: 'message',
                    field: 'status', 
                    width: '140',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.statusMap[cellValue]
                        return (data)
                    }
                },
                {label: '生产时间', field: 'createTime', width: '200',align:'center'}
            ],
            goodsColumns: [
                {label: 'SKU编号', field: 'skuCode', width: '220',align: 'center'},
                {label: 'SKU名称', field: 'itemName', width: '450',align: 'center'},
                {
                    label: '商品类型',
                    desField: 'message',
                    field: 'itemType', 
                    width: '170',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.itemTypeMap[cellValue]
                        return (data)
                    }
                },
                {label: '发货仓库/供应商', field: 'supplierName', width: '300',align: 'center'},                
                {label: '异常原因', field: 'exceptionReason', width: '300', align:'center'},
                {label: '应发货数量', field: 'itemNum', width: '140',align: 'center'},
                {label: '异常数量', field: 'exceptionNum', width: '140',align: 'center'},
                {
                    label: '状态',
                    desField: 'message',
                    field: 'status', 
                    width: '129',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.statusMap[cellValue]
                        return (data)
                    }
                }
            ]
        }
    },
    methods: {
        getNonOrderPage (params) {
            this.loading= true
            order.getNonorderPage(params)
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
        handleColClick (val) {
            this.getNonOrderById(val.exceptionOrderCode)
            this.$refs['logTable'].getLogData({entityId: val.id, entityType: 'ExceptionOrder'})
        },
        getNonOrderById (id) {
            order.getNonOrderById (id)
            .then((res) => {
                this.orderInfo = res.data.result
            })
        }
    },
    created () {
        let now = new Date()
        let nowTime = now.getTime();
        let startTime = nowTime-604800000;        
        this.params.startDate = new Date(startTime).format('yyyy-MM-dd')
        this.params.endDate = now.format('yyyy-MM-dd')
    }
}
</script>


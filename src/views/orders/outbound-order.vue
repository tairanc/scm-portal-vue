<template>
  <div class="outbound-order">
      <el-form :model="params" ref="queryForm" label-width="130px" calss="demo-ruleForm" size="medium">
        <el-row>
          <el-col :span="6">
              <el-form-item label="发货通知单编号：" prop="outboundOrderCode">
                  <el-input v-model="params.outboundOrderCode" placeholder="发货通知单编号"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="店铺订单编号：" prop="shopOrderCode">
                  <el-input v-model="params.shopOrderCode" placeholder="店铺订单编号"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="平台订单编号：" prop="platformOrderCode">
                  <el-input v-model="params.platformOrderCode" placeholder="平台订单编号"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="收货人：" prop="receiverName">
                <el-input v-model="params.receiverName" placeholder="收货人"></el-input>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态:" prop="status">
              <el-select v-model="params.status" placeholder="状态">
                <el-option label="全部" value=""></el-option>
                <el-option :key="'outboundOrderStatus'+index" v-for="(item,index) in outboundOrderStatus" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="发货仓库名称:" prop="warehouseId">
              <el-select v-model="params.warehouseId" placeholder="收货仓库名称">
                <el-option label="全部" value=""></el-option>
                <el-option :key="'warehouseList'+index" v-for="(item,index) in warehouseList" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单付款日期：">
              <el-col :span="11">
                <el-form-item prop="startPayDate">
                  <el-date-picker
                    v-model="params.startPayDate"
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
                <el-form-item prop="endPayDate">
                  <el-date-picker
                    v-model="params.endPayDate"
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
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="发货单创建日期：">
              <el-col :span="11">
                <el-form-item prop="startCreateDate">
                  <el-date-picker
                    v-model="params.startCreateDate"
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
                <el-form-item prop="endCreateDate">
                  <el-date-picker
                    v-model="params.endCreateDate"
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
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button type="default" @click="resetForm('queryForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <table-pagination
      :index="true"
      :loading="loading"
      ref="mainTable"
      @getPageData="getPageData"
      :params="params"
      :pageData="pageData"
      :columns="columns"
      @col-click="handleColClick"
    >
    </table-pagination>
    <el-tabs v-model ="activeTab">
      <el-tab-pane label ="商品明细" name="goods">
        <table-view 
            :index="true"
            :pageList="outboundOrderInfo.outboundDetailList"
            :columns="goodsColumns"
            :height="220"
        >                
          </table-view>
      </el-tab-pane>
      <el-tab-pane label ="收货信息" name="sender">
            <el-row :gutter="20" style="font-size: 14px">
                <el-col :span="6">
                    收货人姓名:{{outboundOrderInfo.receiverName}}
                </el-col>
                <el-col :span="6">
                    收货人手机号：{{outboundOrderInfo.receiverPhone}}
                </el-col>
                <el-col :span="6">
                    收货省份.城市.区域：
                </el-col>
                <el-col :span="6">
                    收货详细地址：{{outboundOrderInfo.receiverAddress}}
                </el-col>
            </el-row>
      </el-tab-pane>
      <el-tab-pane label ="其他信息" name="otherInfo">
            <el-row :gutter="20" style="font-size: 14px">
                <el-col :span="6">
                    店铺名称:{{outboundOrderInfo.shopName}}
                </el-col>
            </el-row>
      </el-tab-pane>
      <el-tab-pane label ="操作日志" name="log">
          <log-table ref="logTable"></log-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tools from '@/utils/tools'
import notify from '@/utils/notify'
import jdAddress from '@/utils/jdAddress.json'
import order from '@/api/order'
import select from '@/api/select'

export default {
    name: 'procurement-warehouse-advice',
    data () {
        return {
            activeTab: 'goods',
            params: {
                start: 0,
                outboundOrderCode: '',
                shopOrderCode: '',
                warehouseId: '',
                receiverName: '',
                status: '',
                startPayDate: '',
                endPayDate: '',
                platformOrderCode: '',
                startCreateDate: '',
                endCreateDate: ''
            },
            pageData: {},
            loading: false,
            outboundOrderStatus: [],
            outboundOrderStatusMap: {},
            warehouseList:[],
            outboundOrderInfo: {
              outboundDetailList: []
            },
            columns: [
                {label: '发货通知单编号', field: 'outboundOrderCode', width: '230',align:'center'},
                {label: '店铺订单号', field: 'shopOrderCode', width: '230',align:'center'},
                {label: '平台订单号', field: 'platformOrderCode', width: '230',align:'center'},
                {label: '收货仓库名称', field: 'warehouseName', width: '118',align:'center'},
                {label: '商品总数量', field: 'itemNum', width: '118',align:'center'},
                {label: '收货人', field: 'receiverName', width: '118',align:'center'},
                {label: '收货人手机号', field: 'receiverPhone', width: '118',align:'center'},
                {label: '订单付款时间', field: 'payTime', width: '160',align:'center'},                
                {
                    label: '状态', 
                    desField: 'message',
                    field: 'status',
                    width: '190',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.outboundOrderStatusMap[cellValue]
                        return (data && data.name) || ''
                    }
                },
                {label: '发货单创建时间', field: 'createTime', width: '160',align:'center'},
                {label: '操作', 
                    width: '160',
                    align:'center',
                    actions: [
                        {
                            label: '通知收货',  
                            type: 'primary',
                            size: 'mini',                          
                            visible: (row) => {
                                return ((row.status === '0' || row.status === '1'))
                            },
                            click: (index,row) =>{

                            }
                        },
                        {
                            label: '-',
                            visible: (row) => {
                                return ((row.status != '0' || row.status != '1'))
                            }
                        }
                    ]
                }
            ],
            goodsColumns: [
                {label: '商品名称', field: 'skuName',  width: '260',align:'center'},
                {label: '商品SKU编号', field: 'skuCode', width: '200',align:'center'},
                {label: '实付总金额(元)', field: 'actualAmount', width: '160',align:'center'},
                {label: '应发商品数量', field: 'shouldSentItemNum', width: '140',align:'center'},
                {label: '实发商品数量', field: 'realSentItemNum', width: '120',align:'center'},
                {label: '发货状态', 
                    field: 'status', 
                    width: '180',
                    desField: 'message',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.getOutboundOrderStatusMap[cellValue]
                        return (data && data.name) || ''
                    }},
                {
                    label:'物流信息',
                    children: [
                        {
                            label: '物流公司',
                            width: '120',
                            align: 'center',
                            field: 'logisticsCorporation'    
                        },
                        {
                            label: '运单编号',
                            width: '120',
                            align: 'center',
                            field: 'waybillNumber'   
                        },
                        {
                            label: '商品数量',
                            width: '120',
                            align: 'center',
                            field: 'itemNum'   
                        },
                        {
                            label: '实际发货时间',
                            width:'120',
                            align: 'center',
                            field:'item'
                        }
                    ]
                }
            ]
        }      
    },
    methods: {
        getPageData (params) {
            this.loading = true
            order.getOutboundOrderPage (params)
            .then((res) =>{
                this.pageData = res.data
                this.loading = false
            })
        },
        search () {
            this.$refs['mainTable'].getPageData()
        },
        resetForm (formName) {
            this.$refs[formName].resetFields()
        },
        getOutboundOrderStatus () {
            select.getOutboundOrderStatus ()
            .then((res) => {
              console.log(res)
                let map = {}
                let result = res.data.result
                this.outboundOrderStatus = result
                tools.getMap(result, map, 'code')
                this.outboundOrderStatusMap = map
            })
        },
        getOutboundWarehouseList () {
          order.getOutboundWarehouseList()
          .then((res) =>{
            this.warehouseList = res.data.result
          })
        },
        getOutboundOrderById (id) {
            order.getOutboundOrderById(id)
            .then((res) => {
              this.outboundOrderInfo = res.data.result;
            })
        },

        handleColClick (val) {
            this.getOutboundOrderById(val.id)
            this.$refs['logTable'].getLogData({entityId: val.id, entityType: 'OutboundOrder'})
        }
    },
    created (){
        this.getOutboundWarehouseList()
        this.getOutboundOrderStatus()
    }
}
</script>


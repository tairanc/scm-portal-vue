<template>
  <div class="warehouse-advice">
      <el-form :model="params" ref="queryForm" label-width="130px" calss="demo-ruleForm" size="medium">
        <el-row>
          <el-col :span="6">
              <el-form-item label="入库通知单编号：" prop="warehouseNoticeCode">
                  <el-input v-model="params.warehouseNoticeCode" placeholder="入库通知单编号"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="采购单编号：" prop="purchaseOrderCode">
                  <el-input v-model="params.purchaseOrderCode" placeholder="采购单编号"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="供应商名称：" prop="supplierName">
                  <el-input v-model="params.supplierName" placeholder="供应商名称"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="6">
              <el-form-item label="采购类型：" prop="purchaseType">
                <el-select v-model="params.purchaseType" placeholder="采购类型">
                    <el-option label="全部" value=""></el-option>
              <el-option :key="'purchaseTypes'+index" v-for="(item,index) in purchaseTypes" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
          <el-form-item label="入库通知单状态:" prop="warehouseNoticeStatus">
            <el-select v-model="params.warehouseNoticeStatus" placeholder="入库通知单状态">
              <el-option label="全部" value=""></el-option>
              <el-option :key="'warehouseNoticeStatus'+index" v-for="(item,index) in warehouseNoticeStatus" :label="item.name" :value="item.code"></el-option>
            </el-select>
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
            :pageList="goodsInfo"
            :columns="goodsColumns"
            :height="220"
        >                
          </table-view>
      </el-tab-pane>
      <el-tab-pane label ="发件方信息" name="sender">
            <el-row :gutter="20" style="font-size: 14px">
                <el-col :span="6">
                    发件人:{{noticeInfo.sender}}
                </el-col>
                <el-col :span="6">
                    发件方手机号：{{noticeInfo.senderNumber}}
                </el-col>
                <el-col :span="6">
                    收货省份.城市：
                </el-col>
                <el-col :span="6">
                    发件方详细地址：{{noticeInfo.senderAddress}}
                </el-col>
            </el-row>
      </el-tab-pane>
      <el-tab-pane label ="其他信息" name="otherInfo">
            <el-row :gutter="20" style="font-size: 14px">
                <el-col :span="6">
                    采购合同:{{noticeInfo.contractCode}}
                </el-col>
                <el-col :span="6">
                    归属采购组：{{noticeInfo.purchaseGroupName}}
                </el-col>
                <el-col :span="6">
                    归属采购人：{{noticeInfo.purchasePersonName}}
                </el-col>
                <el-col :span="6">
                    提运单号：{{noticeInfo.takeGoodsNo}}
                </el-col>
            </el-row>
            <el-row :gutter="20" style="font-size: 14px">
                <el-col :span="6">
                    收货人:{{noticeInfo.receiver}}
                </el-col>
                <el-col :span="6">
                    收货人手机号：{{noticeInfo.receiverNumber}}
                </el-col>
                <el-col :span="6">
                    备注：{{noticeInfo.remark}}
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
import purchase from '@/api/purchase'
import select from '@/api/select'

export default {
    name: 'procurement-warehouse-advice',
    data () {
        return {
            activeTab: 'goods',
            params: {
                start: 0,
                warehouseNoticeCode: '',
                startDate: '',
                endDate: '',
                purchaseOrderCode: '',
                supplierName: '',
                purchaseType: '',
                warehouseNoticeStatus: ''
            },
            pageData: {},
            loading: false,
            warehouseNoticeStatus: [],
            goodsInfo: [],
            noticeInfo: {},
            purchaseTypes:[],
            purchaseTypesMap:{},
            columns: [
                {label: '入库通知单编号', field: 'warehouseNoticeCode', width: '230',align:'center'},
                {label: '采购单编号', field: 'purchaseOrderCode', width: '230',align:'center'},
                {label: '供应商名称', field: 'supplierName', width: '150',align:'center'},
                {label: '采购类型', 
                    field: 'purchaseType', 
                    width: '160',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.purchaseTypesMap[cellValue]
                        return (data && data.name) || ''
                    }
                },
                {label: '收货仓库', field: 'warehouseName', width: '118',align:'center'},
                {label: '要求到货日期', field: 'requriedReceiveDate', width: '160',align:'center'},
                {label: '截止到货日期', field: 'endReceiveDate', width: '160',align:'center'},
                {
                    label: '状态', 
                    field: 'status',
                    width: '160',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.warehouseNoticeStatus[cellValue]
                        return (data && data.name) || ''
                    }
                },
                {label: '入库单创建人', field: 'createOperator', width: '160',align:'center'},
                {label: '最近更新时间', field: 'updateTime', width: '160',align:'center'},
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
                {label: 'SKU编号', field: 'skuCode', link: '/goods/goods-info',width: '180',align:'center'},
                {label: 'SKU名称', field: 'skuName',  width: '170',align:'center'},
                {label: '规格', field: 'specInfo', width: '170',align:'center'},
                {label: '条形码', field: 'barCode', width: '160',align:'center'},
                {label: '批次号', field: 'batchNo', width: '140',align:'center'},
                {label: '生产编码', field: 'productionCode', width: '120',align:'center'},
                {label: '生产日期', field: 'productionDate', width: '120',align:'center'},
                {label: '截止保质日期', field: 'expiredDate', width: '120',align:'center'},
                {label: '理论保质期限(天)', field: 'expiredDay', width: '140',align:'center'},
                {label: '采购总金额(元)', field: 'purchaseAmount', width: '120',align:'center'},
                {label: '采购数量', field: 'purchasingQuantity', width: '120',align:'center'},
                {label: '收货状态', 
                    field: 'status', 
                    width: '120',
                    align:'center',
                    formatter: (row, column, cellValue) => {
                        let data = this.warehouseNoticeStatus[cellValue]
                        return (data && data.name) || ''
                    }},
                {
                    label:'仓库反馈入库信息',
                    children: [
                        {
                            label: '实际入库时间',
                            width: '120',
                            align: 'center',
                            field: 'storageTime'    
                        },
                        {
                            label: '实际入库总量',
                            width: '120',
                            align: 'center',
                            field: 'actualStorageQuantity'   
                        },
                        {
                            label: '正品入库数量',
                            width: '120',
                            align: 'center',
                            field: 'normalStorageQuantity'   
                        },
                        {
                            label: '残次品入库数量',
                            width: '120',
                            align: 'center',
                            field: 'defectiveStorageQuantity'   
                        }
                    ]
                }
            ]
        }      
    },
    methods: {
        getPageData (params) {
            this.loading = true
            purchase.getWarehouseNoticePage (params)
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
        getWarehouseNoticeStatus () {
            select.getWarehouseNoticeStatus ()
            .then((res) => {
                let result = res.data.result
                this.warehouseNoticeStatus = result
            })
        },
        getPurchaseTypes () {
            select.getPurchaseTypes()
            .then((res) => {
                let map = {}
                let result = res.data.result
                this.purchaseTypes = result
                tools.getMap(result,map,'value')
                this.purchaseTypesMap = map                
            })
        },
        getWarehouseNoticeById (id) {
            purchase.getWarehouseNoticeById(id)
            .then((res) => {
                this.goodsInfo = res.data;
            })
        },
        getWarehouseNoticeDetail (id) {
            purchase.getWarehouseNoticeDetail(id)
            .then((res) => {
                this.noticeInfo = res.data.result
            })
        },
        handleColClick (val) {
            this.getWarehouseNoticeById(val.id)
            this.getWarehouseNoticeDetail(val.id)
            this.$refs['logTable'].getLogData({entityId: val.id, entityType: 'WarehouseNotice'})
        }
    },
    created (){
        this.getPurchaseTypes()
        this.getWarehouseNoticeStatus()
    }
}
</script>


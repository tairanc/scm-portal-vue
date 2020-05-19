<template>
  <div id="printBuyIn">
    <div class="printHome" v-show="showHome">
      <el-form :model="params" ref="queryForm" label-width="125px" class="demo-ruleForm" size="medium" id="print">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="调拨出库单编号：" prop="allocateOutOrderCode" size="mini">
              <el-input v-model.trim="params.allocateOutOrderCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="调拨单编号：" prop="allocateOrderCode" size="mini">
              <el-input v-model.trim="params.allocateOrderCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库单联系人：" prop="createOperatorName" size="mini">
              <el-input v-model.trim="params.createOperatorName" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库单状态：">
              <el-form-item size="mini">
                <el-select v-model="params.status" placeholder="">
                  <el-option v-for="(item,index) in statusOrderList" :key="index" :label="item.value" :value="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="height: 13px;"></div>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="调入仓库：" prop="status" size="mini">
              <el-select style="width: 100%;" v-model="params.inWarehouseCode" placeholder="请选择">
                <el-option v-for="(item, i) in warehostList" :key="i" :label="item.warehouseName" :value="item.code" size='mini'>
                </el-option>
              </el-select>
              <!-- <el-select v-model="params.statusOrder" placeholder="">
                <el-option v-for="(item,index) in goodStatus" :key="index" :label="item.value" :value="item.label"></el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统接收时间：" size="mini">
              <el-col :span="11">
                <el-form-item prop="startDate" size="mini">
                  <el-date-picker v-model="params.startDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endDate" size="mini">
                  <el-date-picker v-model="params.endDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="purchaseName" size="mini">
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" size="mini">
              <el-button type="primary" icon="search" @click="search">查询</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="height: 6px;"></div>
      </el-form>

      <div class="header-btn">
        <div class="header-btn-left">
          <el-button type="primary" @click="printBtn" plain size="mini">打印拣货单</el-button>
        </div>
        <div class="header-btn-right">
          <!-- <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="params.pageSize" layout="prev, pager, next, jumper" :total="pagetotal">
          </el-pagination> -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="params.pageNumber" :page-sizes="[10, 20, 30, 50, 100]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
          </el-pagination>
          <!-- <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pages.pageSize" layout="total, prev, pager, next, jumper" :total="pagetotal">
          </el-pagination> -->
        </div>
      </div>

      <el-table ref="tableRow" highlight-current-row @select-all="selectAll" @select="selectBox" height="400" @row-click="cellClick" border :data="tableList" style="width: 100%">
        <el-table-column align="center" fixed="left" :selectable="checkSelectable" type="selection" width="50">
          <!-- <template slot-scope="scope">
            <div class="c-item-blue" v-if="scope.row.status == 0">
              <el-checkbox v-model="scope.row.isChecked"></el-checkbox>
            </div>
            <div v-else>—</div>
          </template> -->
        </el-table-column>
        <el-table-column align="center" type=index label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="allocateOutOrderCode" :show-overflow-tooltip='true' label="调拨出库单编号"></el-table-column>
        <el-table-column align="center" prop="allocateOrderCode" label="调拨单编号" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column align="center" prop="inWarehouseName" label="调入仓库"></el-table-column>
        <el-table-column align="center" prop="createOperatorName" label="出库单联系人"></el-table-column>
        <el-table-column align="center" prop="createOperatorNumber" label="联系人电话"></el-table-column>
        <el-table-column align="center" prop="" label="出库状态">
          <template slot-scope="scope">
            {{ statasflag(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createTime" label="系统接收时间" :show-overflow-tooltip='true'></el-table-column>
        <el-table-column class="no" align="center" fixed="right" prop="" label="操作">
          <template slot-scope="scope">
            <div @click="hideHome(scope.row.id, scope.row.allocateOrderCode)" v-if="scope.row.status == 0">
              <el-button type="text" size="mini">出库结果录入</el-button>
            </div>
            <div v-else>——</div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 单个商品信息详情及其他 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品明细" name="goods">
          <el-table highlight-current-row :data="detailList" border style="width: 100%">
            <el-table-column type="index" align="center" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="skuName" align="center" label="SKU名称" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="skuCode" align="center" label="商品SKU编号" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="specNatureInfo" align="center" label="规格" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="barCode" align="center" label="条形码" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="brandName" align="center" label="品牌名称" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column align="center" label="调拨库存类型">
              <template slot-scope="scope">
                {{ typeChange(scope.row.inventoryType ) }}
              </template>
            </el-table-column>
            <el-table-column prop="planAllocateNum" align="center" label="计划调拨数量">
            </el-table-column>
            <el-table-column prop="realOutNum" align="center" label="实际出库数量" @cell-class-name='addTip'>
            </el-table-column>
          </el-table>
           <!-- 分页 -->
          <el-col class='paging'>
            <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNumber" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
            </el-pagination>
          </el-col>
        </el-tab-pane>
        <el-tab-pane label="收货信息" name="sender">
          <el-row :gutter="20" style="font-size: 14px">
            <el-col :span="6">
              收货人姓名：{{otherInfoDetailRow.receiver}}
            </el-col>
            <el-col :span="6">
              收货人手机号：{{otherInfoDetailRow.receiverMobile}}
            </el-col>
            <el-col :span="6">
              收货省份.城市.区域：
              <span v-if="otherInfoDetailRow.receiverProvinceName">{{otherInfoDetailRow.receiverProvinceName}}</span>
              <span v-if="otherInfoDetailRow.receiverCityName">.{{otherInfoDetailRow.receiverCityName}}</span>
              <span v-if="otherInfoDetailRow.receiverDistrictName">.{{otherInfoDetailRow.receiverDistrictName}}</span>
            </el-col>
            <el-col :span="6" style="height:auto">
              <p>收货详细地址：
                <span>{{otherInfoDetailRow.receiverAddress}}</span>
              </p>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="otherInfo">
          <el-row>
            <el-col style="margin-bottom: 15px;">
              <p style="display: inline-block; width: 300px;">运输物流：{{otherInfoDetailRow.logisticsCorporationName}}</p>
              <p style="display: inline-block; width: 300px;">运单号：{{otherInfoDetailRow.waybillNo}}</p>
            </el-col>
            <el-col>
              出库备注：{{otherInfoDetailRow.outMemo}}
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="log">
          <!-- <log-table ref="logTable"></log-table> -->
          <div style="text-align: right;">
            <el-pagination @size-change="handleLogSizeChange" @current-change="handleLogCurrentChange" :current-page="logParams.pageNumber" :page-sizes="[10, 20, 30, 50, 100]" :page-size="logParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logTotal">
            </el-pagination>
          </div>
          <el-table highlight-current-row border :data="logTableList" style="width: 100%">
            <el-table-column prop="operation" align="center" label="动作"></el-table-column>
            <el-table-column prop="operator" align="center" label="操作人"></el-table-column>
            <el-table-column prop="operateTime" align="center" label="操作时间" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="remark" align="center" label="备注"></el-table-column>
          </el-table>

        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 点击出库结果录入显示页 -->
    <div class="printChild" v-show="!showHome">
      <div class="secondHomeHead">
        <p style="line-height: 30px;padding-left: 5px;">出库结果录入</p>
        <div class="header">
          出库单基本信息
        </div>
        <div class="content" style="border: none">
          <div>
            <p>
              <span class="title">调拨出库单编号：</span>{{otherInfoDetail.allocateOutOrderCode}}</p>
            <p>
              <span class="title">调拨单编号：</span>{{otherInfoDetail.allocateOrderCode}}</p>
            <p>
              <span class="title">调入仓库：</span>{{otherInfoDetail.inWarehouseName}}</p>
            <p>
              <span class="title">出库单联系人：</span>{{otherInfoDetail.createOperatorName}}</p>
          </div>
          <div>
            <p>
              <span class="title">收货人：</span>{{otherInfoDetail.receiver}}</p>
            <p>
              <span class="title">收货人手机号：</span>{{otherInfoDetail.receiverMobile}}</p>
            <p>
              <span class="title">收货省份.城市.区域：</span>
              <span v-if="otherInfoDetail.receiverProvinceName">{{otherInfoDetail.receiverProvinceName}}</span>
              <span v-if="otherInfoDetail.receiverCityName">.{{otherInfoDetail.receiverCityName}}</span>
              <span v-if="otherInfoDetail.receiverDistrictName">.{{otherInfoDetail.receiverDistrictName}}</span>
            </p>
            <p>
              <span class="title">收货详细地址：</span>{{otherInfoDetail.receiverAddress}}</p>
          </div>
        </div>
        <div class="header">
          商品出库信息
        </div>
      </div>

      <!-- 商品出库信息列表 -->
      <!-- 表单 -->
      <div class="search_outparams">
        <p>
          <span class="title">
            <span class="red_tip">*</span>运输物流公司：</span>
          <span class="desc">
            <el-select style="width: 100%;" v-model="outParams.logisticsCorporationCode" size="mini" placeholder="请选择">
              <el-option v-for="(item, i) in companyList" :key="i" :label="item.logisticsCorporationName" :value="item.logisticsCode" size='mini'>
              </el-option>
            </el-select>
          </span>
        </p>
        <p>
          <span class="title">
            <span class="red_tip">*</span>运单编号：</span>
          <span class="desc">
            <el-input v-model="outParams.waybillNo" placeholder="" size='mini'></el-input>
          </span>
          <span class="tip">多个请用","隔开</span>
        </p>
      </div>
      <!-- 表格 -->
      <div id="tableMain">
          <div class="icon">
                <el-tooltip  effect="dark" content="一键填数" placement="top">
                    <i @click="operatData('fill')" class="el-icon-edit-outline"></i>
                </el-tooltip>
                <el-tooltip  effect="dark" content="一键清空" placement="top">
                    <i @click="operatData('clear')" class="el-icon-delete"></i>
                </el-tooltip>
            </div>
          <el-table highlight-current-row :data="goodOutInfoList" border class="tiptable" style="width: 100%">
                <el-table-column type="index" label="序号" width="50" align="center">
                </el-table-column>
                <el-table-column property="skuCode" label="商品SKU编号" align="center" :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column property="skuName" label="SKU名称" align="center" :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column property="specNatureInfo" label="规格" align="center" :show-overflow-tooltip='true'>
                </el-table-column>
                <el-table-column property="barCode" label="条形码" align="center" :show-overflow-tooltip='true'>
                </el-table-column>
                <!-- <el-table-column property="brandName" label="品牌名称" align="center">
                </el-table-column> -->
                <el-table-column label="调拨库存类型" align="center">
                <template slot-scope="scope">
                    {{ typeChange(scope.row.inventoryType ) }}
                </template>
                </el-table-column>
                <el-table-column property="planAllocateNum" label="计划调拨数量" align="center">
                </el-table-column>
                <el-table-column label="实际出库数量" align="center">
                <template slot-scope="scope">
                    <el-input v-model="arr[scope.$index]" placeholder="" size="mini" @change="inputChange(scope.$index, scope.row)"></el-input>
                </template>
                </el-table-column>
            </el-table>
      </div>


      <div class="second-home-remark">
        <div :cols="5">出库备注：</div>
        <el-input style="width:30%;" type="textarea" maxlength='200' placeholder="实际出库数量＜计划调拨数量时必填" v-model="textarea"></el-input>
      </div>
      <div class="second-home-footer">
        <el-button type="primary" size="mini" :disabled="isClick" @click="save">保存</el-button>
        <el-button type="primary" size="mini" :disabled="isClick" @click="saveAll">出库完成</el-button>
        <el-button size="mini" :disabled="isClick"  @click="backHome">返回</el-button>
        <!-- <button class="usualBtn blueBtn">保存</button>
        <button class="usualBtn blueBtn">出库完成</button>
        <button  class="usualBtn ">返回</button> -->
      </div>
    </div>
    <!-- 打印显示的div -->
    <div class="print_screen" v-for="(data, i) in printData" :key="i" v-show="isListShow">
      <h3>调拨出库拣货单</h3>
      <section v-if="data">
        <p>
          <span class="title">出库单编号：</span>
          <span class="desc">{{data.allocateOutOrderCode}}</span>
        </p>
        <p></p>
        <p></p>
        <p></p>
      </section>
      <section v-if="data">
        <p>
          <span class="title">调拨单编号：</span>
          <span class="desc">{{ data.allocateOrderCode}}</span>
        </p>
        <p>
          <span class="title">商品总数量：</span>
          <span class="desc">{{ data.totalNum}}</span>
        </p>
        <p>
          <span class="title">调入仓库：</span>
          <span class="desc">{{ data.inWarehouseName}}</span>
        </p>
        <p>
          <span class="title">出库单联系人：</span>
          <span class="desc">{{ data.createOperatorName}}</span>
        </p>
      </section>
      <section v-if="data">
        <p>
          <span class="title">收货人：</span>
          <span class="desc">{{ data.receiver}}</span>
        </p>
        <p>
          <span class="title">收货人手机号：</span>
          <span class="desc">{{ data.receiverMobile}}</span>
        </p>
        <p style="width: 49%">
          <span class="title">收货方省份.城市.区域：</span>
          <span class="desc">{{ data.receiverProvinceName}}.{{ data.receiverCityName }}.{{ data.receiverDistrictName }}</span>
        </p>
      </section>
      <p class="name">商品明细</p>
      <div class="table_list">
        <el-table highlight-current-row :data="data.detailList" style="width: 100%; border: solid 1px #ccc;" border>
          <el-table-column align="center" type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center">
          </el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center">
          </el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center">
          </el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center">
          </el-table-column>
          <el-table-column label="调拨库存类型" align="center">
            <template slot-scope="scope">
              {{ typeChange(scope.row.inventoryType ) }}
            </template>
          </el-table-column>
          <el-table-column prop="planAllocateNum" label="计划调拨数量" align="center">
          </el-table-column>
          <el-table-column prop="" label="拣货情况" align="center">
          </el-table-column>
        </el-table>
      </div>
    </div>

  </div>
</template>

<script>
import Vuex, { mapActions, mapState } from 'vuex';
import tools from '@/utils/tools';
import purchase from '@/api/purchase';
import select from '@/api/select';
import axios from '@/api/interception';
// import qs from 'qs';

export default {
  data() {
    return {
      isClick: false, // 重复点击
      detailList: [], // 明细列表
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        pageNumber: 1,
        pageSize: 10,
        allocateOrderCode: ''
      },
      logTableList: [], // 日志列表
      printData: [{ otherInfoDetail: { allocateOutOrderCode: '' } }], //打印的数据
      printId: [],
      printDisabled: true, // 默认打印为不可点
      companyList: [], //  物流公司列表
      warehostList: [], // 入仓列表
      isRequie: false, // 列表中的实际出货量必填
      outParams: {
        // 保存订单参数
        waybillNo: '', // 运单号
        logisticsCorporationCode: '' // 公司code
      },
      arr: [], // 保存input输入值
      goodOutInfoList: [], // 商品出库信息列表
      otherInfoDetail: {}, // 获取其他信息和收货信息
      otherInfoDetailRow: {}, // 获取其他信息和收货信息 明细
      statusOrderList: [
        {
          value: '待出库',
          label: '0'
        },
        {
          value: '出库完成',
          label: '1'
        },
        {
          value: '已取消',
          label: '2'
        }
      ],
      isListShow: false, // 隐藏打印表格
      tableData: [
        {
          // 隐藏打印表格的数据
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      goodStatus: [],
      textarea: '',
      childData: {},
      childNameList: ['入库单编号', '调拨单编号', '调出仓库'],
      childNameKey: [
        'allocateOutOrderCode',
        'allocateOrderCode',
        'outWarehouseName'
      ],
      childContentName: [
        '序号',
        'SKU编号',
        'SKU名称',
        '规格',
        '条形码',
        '调拨库存类型',
        '采购数量'
      ],
      showHome: true, //是否显示主页
      activeTab: 'goods', //切换名称
      allSelected: true, // 全选按钮
      headerTitles: [
        '序号',
        '调拨入库单编号',
        '调拨单编号',
        '调出仓库',
        '入库单联系人',
        '联系人电话',
        '入库单状态',
        '系统接收时间',
        '操作'
      ],
      currentPage: 3, //翻页按键
      code: '', //入库调拨的所选列表项的入库单编号
      id: '', //调拨入库单ID
      params: {
        allocateOutOrderCode: '',
        allocateOrderCode: '',
        status: '', // 出库单状态
        inWarehouseCode: '', // 调入仓库
        createOperatorName: '',
        startDate: '',
        endDate: '',
        pageNumber: 1,
        pageSize: 10
      }, //提交订单
      pagetotal: 10, //调拨记录的总条数
      tableList: [], //调拨入库分页数据对象
      logParams: {
        // 日志入参
        pageSize: 10,
        pageNumber: 1,
        entityType: 'WmsAllocateOut',
        entityId: ''
      },
      logTotal: 0, // 日志总条数
      goodsInfo: [], //货物详情
      goodsInfoRow: [], // 商品货物详情
      noticeInfo: {}, //明细详情
      warehouseNoticeStatus: [], //地址详情
      purchaseTypes: [], //类型
      purchaseTypesMap: {},
      goodsColumns: [
        { label: 'SKU编号', field: 'skuCode', align: 'center' },
        { label: 'SKU名称', field: 'skuName', align: 'center' },
        { label: '规格', field: 'specNatureInfo', align: 'center' },
        { label: '条形码', field: 'barCode', align: 'center' },
        { label: '品牌名称', field: 'brandName', align: 'center' },
        {
          label: '调拨库存类型',
          field: 'inventoryType',
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.inventoryType == 1) {
              return '正品';
            } else if (row.inventoryType == 2) {
              return '残次品';
            }
          }
        },
        { label: '实际出库数量', field: 'realOutNum', align: 'center' },
        {
          label: '仓库反馈入库信息',
          children: [
            {
              label: '实际入库总量',
              width: '120',
              align: 'center',
              field: 'realInNum'
            },
            {
              label: '正品入库数量',
              width: '120',
              align: 'center',
              field: 'nornalInNum'
            },
            {
              label: '残次品入库数量',
              width: '120',
              align: 'center',
              field: 'defectInNum'
            }
          ]
        }
      ],
      resultTable: [],
      operateData: [] //操作日志的数据
    };
  },
  computed: {
    ...mapState('printBuyInStore', ['data', 'datalist', 'goodsInfos'])
  },
  methods: {
    ...mapActions('printBuyInStore', ['aList', 'aDetailList']),
    checkSelectable(row, index) {
      return row.status === '0';
    },
    addTip({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 7) {
          return 'color';
        }
      }
    },
    operatData(str) {
        if(str == 'fill'){
            this.goodOutInfoList.map((item, index) => {
                this.arr[index] = item.planAllocateNum
                this.$set(this.arr, index, item.planAllocateNum)
            })
        }else if(str == 'clear'){
            this.arr = []
        }
    },
    //选择打印事件获取要打印的数据
    selectBox(select, row) {
      console.log('selectBox', select);
      if (select.length) {
        this.printDisabled = false;
      } else {
        this.printDisabled = true;
      }
      this.printId = select;
    },
    selectAll(select) {
      console.log('selectAll', select);
      if (select.length) {
        this.printDisabled = false;
      } else {
        this.printDisabled = true;
      }
      this.printId = select;
    },
    needPrintData(select) {
      this.printData = [];
      const loading = this.$loading({
        //遮罩对象
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // this.ajax(select,0)
      let promise = select.map((item, index) => {
        console.log('item: ', item);
        // let json = item;
        let json = {};
        let code = item.id;
        return this.GET('/wmsAllocateOut/wmsAllocateOutDetail/' + code).then(
          res => {
            // json['tableData'] = res.body.detailList;
            json = res.body;

            this.printData.push(json);
          }
        );
      });

      axios.all(promise).then(
        axios.spread((res1, res2) => {
          loading.close();
          setTimeout(() => {
            this.isListShow = false;
            console.log('111111', this.printData);
            window.print();
            this.$store.commit('changeShowTab', true);
          }, 10);
        })
      );
    },
    // input的输入监听事件
    inputChange(i, row) {
      let planAllocateNum = row.planAllocateNum;
      var reg = /^[0-9]+$/;
      if (this.arr[i] < 0 || !reg.test(this.arr[i])) {
        this.$message({
          showClose: true,
          message: '实际出库数量只能为0或者正整数!',
          type: 'warning'
        });
        this.isRequie = false;
        return;
      }
      if (this.arr[i] > planAllocateNum) {
        this.$message({
          showClose: true,
          message: '实际出库数量不能大于计划出库数量!',
          type: 'warning'
        });
        this.isRequie = false;
        return;
      }
      this.isRequie = true;
    },
    statasflag(str) {
      switch (str) {
        case '0':
          return '待出库';
        case '1':
          return '出库完成';
        case '2':
          return '已取消';
      }
    },
    typeChange(str) {
      if (str == '1') {
        return '正品';
      } else if (str == '2') {
        return '残品';
      }
    },
    printBtn() {
      console.log(this.printDisabled);
      console.log(this.tableList);
      // 没有选中一个
      if (this.printDisabled) {
        this.$message({
          message: '请先选择出库单!',
          type: 'warning'
        });
      } else {
        this.isListShow = true;
        this.$store.commit('changeShowTab', false);
        setTimeout(() => {
          this.needPrintData(this.printId);
        }, 20);
      }
    },
    // 表格 当前页
    handleCurrentChange(val) {
      console.log('当前页：', val);
      //分页点击触发事件
      this.$nextTick(() => {
        this.params.pageNumber = val;
        this.needData(this.params);
      });
    },
    // 表格 每页多少条
    handleSizeChange(val) {
      this.params.pageSize = val;
      this.params.pageNumber = 1;
      this.needData(this.params);
    },
    // 日志 当前页
    handleLogCurrentChange(val) {
      console.log('当前页：', val);
      //分页点击触发事件
      this.$nextTick(() => {
        this.logParams.pageNumber = val;
        this.needOperateData(this.logParams);
      });
    },
    // 日志 每页多少条
    handleLogSizeChange(val) {
      this.logParams.pageSize = val;
      this.logParams.pageNumber = 1;
      this.needOperateData(this.logParams);
    },
    getPurchaseTypes() {
      select.getPurchaseTypes().then(res => {
        let map = {};
        let result = res.data.result;
        this.purchaseTypes = result;
        tools.getMap(result, map, 'value');
        this.purchaseTypesMap = map;
      });
    },
    getWarehouseNoticeStatus() {
      select.getWarehouseNoticeStatus().then(res => {
        let result = res.data.result;
        this.warehouseNoticeStatus = result;
      });
    },
    search() {
      if (
        new Date(this.params.startDate).getTime() >
        new Date(this.params.endDate).getTime()
      ) {
        this.$message({
          message: '开始日期不得大于结束日期!',
          type: 'warning'
        });
        return;
      }
      this.params.pageNumber = 1;
      this.needData(this.params);
    },
    save() {
      let paramsArr = [];
      this.goodOutInfoList.forEach((item, i) => {
        let obj = {};
        obj.skuCode = item.skuCode;
        // obj.planAllocateNum = item.planAllocateNum;
        obj.realOutNum = this.arr[i];
        paramsArr.push(obj);
      });
      // 查找公司名字
      if (this.outParams.logisticsCorporationCode) {
        this.companyList.forEach(item => {
          if (item.logisticsCode === this.outParams.logisticsCorporationCode) {
            this.outParams.logisticsCorporationName =
              item.logisticsCorporationName; // 查找公司名字
          }
        });
      }
      this.outParams.id = this.id; // 主键
      this.outParams.outMemo = this.textarea; // 出库备注
      this.outParams.wmsAllocateOutDetailExtVOList = paramsArr;
      let Reg = /^[0-9]+$/;
      let isInt = false;
      if (this.outParams.wmsAllocateOutDetailExtVOList.length) {
        this.outParams.wmsAllocateOutDetailExtVOList.forEach(item => {
          if (
            (item.realOutNum < 0 || !Reg.test(item.realOutNum)) &&
            item.realOutNum
          ) {
            isInt = true;
            console.log(11111);
            return;
          }
        });
      }
      if (isInt) {
        this.$message({
          message: '实际出库数量只能为0或者正整数!',
          type: 'warning'
        });
        return;
      }

      console.log('出库信息：', this.outParams);
      // 商品理货信息的保存事件
      this.isClick = true;
      this.PUT(
        '/wmsAllocateOut/wmsAllocateOutDetail/' + this.id,
        this.outParams
      ).then(res => {
        if (res.code == '200') {
          this.$message({
            type: 'success',
            message: '保存调拨出库单详情成功!'
          });
          // setTimeout(() => {
          //   this.backHome();
          // }, 1200);
        }
      }).finally(() => {
        this.isClick = false;
        this.backHome();
      })
    },
    resetForm() {
      //初始化表单
      this.currentPage = 1;
      this.params = {
        allocateOutOrderCode: '',
        allocateOrderCode: '',
        status: '', // 出库单状态
        inWarehouseCode: '', // 调入仓库
        createOperatorName: '',
        startDate: '',
        endDate: '',
        pageNumber: 1,
        pageSize: 10
      }; //提交订单
      // for (let obj in this.params) {
      //   if (obj == 'pageSize' || obj == 'pageNumber' || obj == 'status' || obj == 'statusOrder') {
      //     this.params.pageSize = 1;
      //     this.params.pageNumber = 5;
      //     this.params.status = '0';
      //     this.params.statusOrder = '1'; // 出库单状态
      //   } else {
      //     this.params[obj] = '';
      //   }
      // }
      this.needData(this.params);
    },
    selectedAll(selected) {
      //   全选 反选逻辑
      if (selected) {
        for (let i = 0, j = this.datalist.length; i < j; i++) {
          let order = this.datalist[i];
          if (!order.createOperator) continue;
          this.$set(order, 'contractCode', true);
        }
      } else {
        for (let i = 0, j = this.datalist.length; i < j; i++) {
          let order = this.datalist[i];
          if (!order.createOperator) continue;
          this.$set(order, 'contractCode', false);
        }
      }
      this.allSelected = selected;
    },
    change(item) {
      console.log(item.contractCode);
    },
    cellClick(row, event, column) {
      let text = event.target.innerText;
      this.code = row.allocateOrderCode;
      this.id = row.id;
      this.logParams.entityId = row.id;
      console.log(row.allocateOrderCode);
      console.log(row.id);
      this.goodsInfo = [];
      this.goodsInfoRow = [];

      if(text == '出库结果录入'){
          this.needTableDatail(this.code, true);
          this.getCompanyList();
          this.getOtherInfo(this.id);
      } else {
          this.detailParams.allocateOrderCode = row.allocateOrderCode;
          this.detailParams.pageNumber = 1;
          this.getTableDetailList();
          // this.needTableDatailRow(this.code);
          this.getOtherInfoRow(this.id);
      }
      this.needOperateData(this.logParams);

    //   setTimeout(() => {
    //     this.needTableDatail(this.code);
    //     this.getOtherInfo(this.id);
    //     this.needOperateData(this.logParams);
    //   }, 20);
      console.log(this.goodsInfo);
    },
    saveAll() {
      if (!this.outParams.logisticsCorporationCode) {
        this.$message({
          message: '请输入运输物流公司!',
          type: 'warning'
        });
        return;
      }
      if (!this.outParams.waybillNo) {
        this.$message({
          message: '请输入运单编号!',
          type: 'warning'
        });
        return;
      }
      if (this.outParams.waybillNo.length > 100) {
        this.$message({
          message: '运单编号长度不能超过100个!',
          type: 'warning'
        });
        return;
      }
      var reg = /^[a-zA-Z0-9,]+$/;
      if (!reg.test(this.outParams.waybillNo)) {
        this.$message({
          message: '运单号只能输入英文数字和英文逗号!',
          type: 'warning'
        });
        return;
      }
      var hasComma = this.outParams.waybillNo.indexOf(',');
      var isRepet = false;
      console.log(hasComma);
      if (hasComma > -1) {
        let arr = this.outParams.waybillNo.split(',');
        let list = [];
        console.log(arr);
        arr.forEach(item => {
          if (list.indexOf(item) > -1) {
            isRepet = true;
            return;
          } else {
            list.push(item);
          }
        });
      }
      if (isRepet) {
        this.$message({
          message: '运单号不能重复!',
          type: 'warning'
        });
        return;
      }
      if (this.textarea.length > 200) {
        this.$message({
          message: '备注长度不能超过200个字符!',
          type: 'warning'
        });
        return;
      }
      let paramsArr = [];
      console.log(this.goodOutInfoList);
      console.log(this.arr);
      this.goodOutInfoList.forEach((item, i) => {
        let obj = {};
        obj.skuCode = item.skuCode;
        obj.planAllocateNum = this.goodOutInfoList[i].planAllocateNum;
        obj.realOutNum = this.arr[i];
        paramsArr.push(obj);
      });
      // 查找公司名字
      if (this.outParams.logisticsCorporationCode) {
        this.companyList.forEach(item => {
          if (item.logisticsCode === this.outParams.logisticsCorporationCode) {
            this.outParams.logisticsCorporationName =
              item.logisticsCorporationName; // 查找公司名字
          }
        });
      }
      this.outParams.id = this.id; // 主键
      this.outParams.outMemo = this.textarea; // 出库备注
      this.outParams.wmsAllocateOutDetailExtVOList = paramsArr;
      console.log('出库参数：', this.outParams);

      let isShow = true;
      let isInt = true;
      let isLess = false; // 实际出库数量小于计划出库数量列表
      let isMore = false; // 实际出库数量大于计划出库数量列表
      let lessArr = []; // 实际出库数量小于计划出库数量列表
      let result = ''; // 提示信息文字
      let Reg = /^[0-9]+$/;
      if (this.outParams.wmsAllocateOutDetailExtVOList.length) {
        this.outParams.wmsAllocateOutDetailExtVOList.forEach(item => {
          if (item.realOutNum < item.planAllocateNum) {
            lessArr.push(item.skuCode);
          }
          if (
            item.realOutNum === '' ||
            item.realOutNum === 'undefined' ||
            item.realOutNum === null
          ) {
            this.$message({
              message: '请输入实际出库数量!',
              type: 'warning'
            });
            isShow = false;
            return;
          } else if (item.realOutNum < 0 || !Reg.test(item.realOutNum)) {
            this.$message({
              message: '实际出库数量只能为0或者正整数!',
              type: 'warning'
            });
            isInt = false;
            return;
          }

          if (item.realOutNum < item.planAllocateNum) {
            isLess = true;
            return;
          } else if (item.realOutNum > item.planAllocateNum) {
            isMore = true;
            return;
          }
        });
      }
      if (lessArr.length) {
        result = `[${lessArr}]的实际出库数量小于计划调拨数量，`;
      } else {
        result = '';
      }
      if (!isInt) {
        this.$message({
          message: '实际出库数量只能为0或者正整数!',
          type: 'warning'
        });
        return;
      }

      if (isMore) {
        this.$message({
          message: '实际出库数量不能大于计划调拨数量！',
          type: 'warning'
        });
        return;
      }

      if (isLess) {
        if (!this.textarea) {
          this.$message({
            message: '存在SKU的实际出库数量小于计划调拨数量，请填写"出库备注"!',
            type: 'warning'
          });
          return;
        }
      } else {
        isLess = false;
      }
      console.log(isShow);
      console.log(!isMore);
      console.log(!isLess);
      if (this.outParams.wmsAllocateOutDetailExtVOList.length) {
        let list = [];
        this.outParams.wmsAllocateOutDetailExtVOList.forEach(item => {
          let params = {};
          params.skuCode = item.skuCode;
          params.realOutNum = item.realOutNum;
          list.push(params);
        });
        this.outParams.wmsAllocateOutDetailExtVOList = list;
      }
      console.log('出库参数2：', this.outParams);
      if (isShow && !isMore) {
        this.$confirm(
          '确定后将不能再修改数据!',
          `${result}您确定“出库完成”吗？`,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }
        )
          .then(() => {
            this.isClick = true;
            this.POST(
              '/wmsAllocateOut/wmsAllocateOutDetail/' + this.id,
              this.outParams, true
            ).then(res => {
              console.log('出库完成：', res);
              if (res.code == '200') {
                this.$message({
                  type: 'success',
                  message: '出库完成!'
                });
                // setTimeout(() => {
                //   this.backHome();
                // }, 1200);
              }
            }).finally(() => {
              this.isClick = false;
              this.backHome();
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
      }
    },
    backHome() {
      this.showHome = true;
      this.currentPage = 1;
      this.resetForm();
    },
    hideHome(id, allocateOrderCode) {
      // 切换显示内容页面 请求下层数据
      this.code = allocateOrderCode;
      this.id = id;
      this.logParams.entityId = id;
      // 清空之前的参数
      this.outParams = {
        // 保存订单参数
        waybillNo: '', // 运单号
        logisticsCorporationCode: '', // 公司code
        logisticsCorporationName: '' // 公司name
      };
      this.arr = []; // 保存input输入值
      this.textarea = '';
      this.showHome = false;
    //   setTimeout(() => {
    //     this.needTableDatail(this.code);
    //     this.getOtherInfo(this.id);
    //     this.needOperateData(this.logParams);
    //     this.getCompanyList();
    //     this.showHome = false;
    //   }, 20);
    },
    sureArrive() {
      this.$prompt('确认已到货？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '备注： 不超过200个字符'
      })
        .then(({ value }) => {
          this.$nextTick(() => {
            axios({
              method: 'PUT',
              url: '/wms-web' + '/wmsAllocateIn/confirm/' + this.code
            }).then(res => {
              this.$message({
                type: 'success',
                message: '备注信息是：' + value
              });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    },
    getDeatails(item) {
      console.log(item);
    },
    needData(params) {
      this.detailList = [];
      //获取调拨入库列表
      return this.GET('/wmsAllocateOut/wmsAllocateOutPage', params).then(
        res => {
          console.log('挑拨入库列表：', res);
          this.pagetotal = res.body.recordTotal;
          this.tableList = res.body.objects;

          if (this.tableList[0]) {
            setTimeout(() => {
              this.$refs.tableRow.setCurrentRow(this.tableList[0]);
            }, 20);
            let code = this.tableList[0].allocateOrderCode;
            let id = this.tableList[0].id;
            this.code = code; // 获取第一条数据的code
            this.id = id; // 获取第一条数据的id
            this.logParams.entityId = id; // 获取第一条数据的id
            console.log(this.code + '--' + this.id);
            this.detailParams.allocateOrderCode = this.tableList[0].allocateOrderCode;
            // this.needTableDatailRow(this.code);
            this.detailParams.pageNumber = 1;
            this.getTableDetailList();
            this.getOtherInfoRow(this.id);
            this.needOperateData(this.logParams);
          } else {
            this.goodsInfo = [];
            this.goodsInfoRow = [];
            this.noticeInfo = [];
            this.logTableList = [];
          }
        }
      );
    },
    // 获取采购单明细数据详情
    getTableDetailList() {
      this.GET('/wmsAllocateDetail/wmsAllocateDetailsPage', this.detailParams).then(res => {
        this.detailList = res.body.objects;
        this.detailCount = res.body.pageTotal;
      });
    },
    // 页码条数改变
    detailChangeSize(val) {
      this.detailParams.pageNumber = 1;
      this.detailParams.pageSize = val;
      this.getTableDetailList();
    },
    // 当前页码改变
    detailChangeNumber(val) {
      this.detailParams.pageNumber = val;
      this.getTableDetailList();
    },
    // 获取调拨入库单个列表的详情
    needTableDatailRow(allocateOrderCode, load) {
      this.goodsInfoRow = []
      this.GET('/wmsAllocateDetail/wmsAllocateDetails', { allocateOrderCode: allocateOrderCode },load).then(res => {
            this.goodsInfoRow = res.body;
      })
    },
    // 获取调拨入库单个列表的详情
    needTableDatail(allocateOrderCode, load) {
      this.goodsInfo = []
      this.goodOutInfoList = []
      this.GET('/wmsAllocateDetail/wmsAllocateDetails', { allocateOrderCode: allocateOrderCode },load).then(res => {
            this.goodsInfo = res.body;
            this.goodOutInfoList = this.goodsInfo;
            this.goodOutInfoList.forEach(item => {
                if (item.realOutNum || item.realOutNum === 0) {
                    this.arr.push(item.realOutNum);
                }
            });
      })
    //   axios({
    //     methods: 'get',
    //     url: '/wms-web' + '/wmsAllocateDetail/wmsAllocateDetails',
    //     params: { allocateOrderCode: allocateOrderCode }
    //   }).then(res => {
    //     console.log('单个列表详情：', res.data.body);
    //     this.goodsInfo = res.data.body;
    //     this.goodOutInfoList = this.goodsInfo;
    //     this.goodOutInfoList.forEach(item => {
    //       if (item.realOutNum || item.realOutNum === 0) {
    //         this.arr.push(item.realOutNum);
    //       }
    //     });
    //     // this.noticeInfo = res.data.body;
    //   });
    },
    // 获取发件方信息和其他信息 明细
    getOtherInfoRow(id) {
      this.otherInfoDetailRow = {};
      axios({
        methods: 'get',
        url: '/wms-web' + '/wmsAllocateOut/' + id
      }).then(res => {
        console.log('获取发件方信息和其他信息: ', res);
        this.otherInfoDetailRow = res.data.body;
      });
    },
    // 获取发件方信息和其他信息
    getOtherInfo(id) {
      this.otherInfoDetail = {}
      axios({
        methods: 'get',
        url: '/wms-web' + '/wmsAllocateOut/' + id
      }).then(res => {
        console.log('获取发件方信息和其他信息: ', res);
        this.otherInfoDetail = res.data.body;
        if (this.otherInfoDetail.waybillNo) {
          this.outParams.waybillNo = this.otherInfoDetail.waybillNo;
        }
        if (this.otherInfoDetail.logisticsCorporationCode) {
          this.outParams.logisticsCorporationCode = this.otherInfoDetail.logisticsCorporationCode;
          this.outParams.logisticsCorporationName = this.otherInfoDetail.logisticsCorporationName;
        }
        if (this.otherInfoDetail.outMemo) {
          this.textarea = this.otherInfoDetail.outMemo;
        }
      });
    },
    needOperateData() {
      //操作日志获取数据
      axios({
        method: 'get',
        url: '/wms-web' + '/wmsLogInformation/wmsLogInformationPage',
        params: this.logParams
      }).then(res => {
        console.log('日志列表：', res);
        if (res.data.code === '200') {
          this.logTableList = res.data.body.objects;
          this.logTotal = res.data.body.recordTotal;
        }
      });
    },
    getCompanyList() {
      axios({
        method: 'get',
        url: '/wms-web' + '/logisticsCorporation/enabled'
      }).then(res => {
        console.log('公司列表：', res);
        if (res.data.code == '200') {
          this.companyList = res.data.body;
          console.log(this.companyList);
        }
      });
    },
    getWarehouseList() {
      axios({
        method: 'get',
        url: '/wms-web' + '/warehouseInfo/warehouseInfos'
      }).then(res => {
        console.log('入仓列表：', res);
        if (res.data.code == '200') {
          this.warehostList = res.data.body;
        }
      });
    }
  },
  mounted() {
    this.needData(this.params);
    this.getWarehouseList(); // 获取调入仓库管理下拉菜单
  }
};
</script>

<style lang="less" scoped>
.paging {
  margin-top: 15px;
  text-align: right;
}
#printBuyIn{
    // min-width: 1500px!important ;
}
#tableMain {
    position: relative;
    width: 100%;
    .icon{
        font-size: 18px;
        color: #409EFF;
        cursor:pointer;
        position: absolute;
        top: 8px;
        right:  1.5%;
        z-index: 100
    }
}
.red_tip {
  padding-right: 5px;
  color: #ff0000;
}

.value {
  padding-left: 10px;
  vertical-align: middle;
}
.print_screen {
  margin-top: 30px;
  h3 {
    text-align: center;
    font-size: 16px;
    font-weight: 900;
    margin-bottom: 50px;
  }
  section {
    line-height: 60px;
    font-size: 12px;
    border-bottom: solid 1px #000;
    // display: flex;
    // justify-content: space-between;
    padding: 0 10px;
    p {
      width: 24%;
      display: inline-block;
    }
  }
  .name {
    margin: 15px 0;
  }
  .table_list {
    width: 1000px;
  }
}
.header-btn {
  display: flex;
  justify-content: space-between;
}
.c-item-blue {
  color: blue;
  cursor: pointer;
}

.printChild {
  position: relative;
  width: 100%;
  min-width: 1440px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @fColor: #f2f2f2;
  @eColor: #ec6337;
  @d8line: 1px solid #d8d8d8;

  .item {
    display: flex;
    justify-content: center;
    color: #333;
    border-left: @d8line;
    border-top: @d8line;
    word-break: break-all;
    &:nth-child(n) {
      width: 10%;
    }

    &:nth-child(1) {
      width: 5%;
    }
    &:nth-child(3) {
      width: 20%;
    }
    &:nth-child(5) {
      width: 20%;
    }
    &:nth-child(6) {
      width: 15%;
    }
    &:nth-child(7) {
      width: 20%;
    }
  }

  .secondHomeHead {
    display: flex;
    flex-direction: column;
    width: 100%;
    .header {
      background-color: #f5f7fa;
      height: 30px;
      // font-size: 14px;
      padding: 5px;
    }
    .content {
      margin: 15px 10px;
      // font-size: 14px;
      div {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin: 15px 0;
        p {
          width: 400px;
          .title {
            width: 140px;
            text-align: right;
            display: inline-block;
          }
        }
      }
      // .content-ul {
      //   display: flex;
      //   flex-direction: row;
      // }
    }
  }

  .search_outparams {
    width: 100%;
    margin: 15px 0;
    p {
      width: 30%;
      display: inline-block;
      line-height: 40px;
      span {
        display: inline-block;
        vertical-align: top;
        width: 30%;
      }
      .title {
        text-align: right;
      }
    }
  }

  .second-home-content {
    display: flex;
    border: 1px solid #d8d8d8;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    .header-ul {
      display: flex;
      background-color: #999;
      .header {
        display: flex;
        width: 10%;
        // font-size: 14px;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #d8d8d8;

        &:nth-child(1) {
          width: 5%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(5) {
          width: 20%;
        }
        &:nth-child(6) {
          width: 15%;
        }
        &:nth-child(7) {
          width: 20%;
        }
      }
      & > .header:nth-child(7) {
        display: flex;
        flex-direction: column;
        .header-item {
          width: 100%;
          .header-item-specW {
            display: flex;
            flex-direction: row;
            justify-content: center;
            justify-content: space-around;
            border-bottom: 1px solid #d8d8d8;
          }
          .header-item-specS {
            display: flex;
            flex-direction: row;
            justify-content: center;
            justify-content: space-around;
            & > div {
              width: 50%;
              border-left: 1px solid #d8d8d8;
              text-align: center;
              .red-span {
                color: red;
              }
            }
            & > div:nth-child(1) {
              border-left: transparent;
            }
          }
        }
      }
    }
    .contents {
      display: flex;
      width: 100%;
      min-height: 30px;
      border-bottom: 1px solid #d8d8d8;
      .content-item {
        display: flex;
        width: 10%;
        // font-size: 14px;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #d8d8d8;

        // &:nth-child(n) {
        // //   width: 10%;
        //   font-size: 12px;
        //   word-break: break-all;
        // }
        &:nth-child(1) {
          width: 5%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(5) {
          width: 20%;
        }
        &:nth-child(6) {
          width: 15%;
        }
        &:nth-child(7) {
          width: 20%;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
      }

      // &>.content-item{
      //     display: inline-flex;
      //     flex-direction: row;
      //     min-height: 30px;
      //     .item;
      //     font-size: 12px;
      // }
      // &>.content-item:nth-child(1){
      //     border-left: transparent;
      // }
    }
  }

  .second-home-remark {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 5px;
    // font-size: 14px;
    padding: 50px 0;
  }

  .second-home-footer {
    .usualBtn {
      width: 80px;
      height: 30px;
      border-radius: 5px;
      border: 1px solid #999;
    }
    .blueBtn {
      background-color: rgb(68, 68, 157);
      color: white;
    }
  }
}
</style>

<style lang="less">
.table_list {
  div.cell {
    padding: 0;
  }
}
.el-message-box--center .el-message-box__content {
  color: #ff0000;
}
.tiptable thead tr th:nth-child(8) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}
.el-message-box__title span {
  width: 100%;
  display: inline-block;
  word-break: break-all;
  white-space: normal;
  line-height: 20px;
}
</style>



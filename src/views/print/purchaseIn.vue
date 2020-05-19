<template>

  <div id="printBuyIn">
    <div class="printHome" v-if="showHome">
      <el-form :model="params" ref="queryForm" label-width="125px" class="demo-ruleForm" size="medium" id="print">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="采购入库单编号：" prop="purchaseInOrderCode" size="mini">
              <el-input v-model="params.purchaseInOrderCode" placeholder="采购入库单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="采购单编号：" prop="purchaseOrderCode" size="mini">
              <el-input v-model="params.purchaseOrderCode" placeholder="采购单编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库单联系人：" prop="createOperatorName" size="mini">
              <el-input v-model="params.createOperatorName" placeholder="入库单联系人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入库单状态：" prop="status" size="mini">
              <el-select v-model="params.status" placeholder="入库单状态">
                <el-option :key="'purchaseTypes'+index" v-for="(item,index) in goodStatus" :label="item.key" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="height: 13px;"></div>
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="预约到货日期：">
              <el-col :span="11">
                <el-form-item prop="startDate" size="mini">
                  <el-date-picker v-model="params.preReceiveStart" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endDate" size="mini">
                  <el-date-picker v-model="params.preReceiveEnd" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
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
          <el-col :span="4">
            <el-form-item label="供应商名称：" prop="supplierName" size="mini">
              <el-input v-model="params.supplierName" placeholder="供应商名称"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="" prop="purchaseName" size="mini">
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="" size="mini">
              <el-button type="primary" icon="search" @click="search">查询</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="header-btn">
        <div class="header-btn-left">
          <el-button type="primary" :disabled="printDisabled" @click="printBtn" plain size="mini">打印理货单</el-button>
        </div>
        <div class="header-btn-right">
          <el-pagination @current-change="handleCurrentChange"  @size-change="changeSize"  :current-page="currentPage" :page-sizes="[10, 20, 50, 100]"  layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
          </el-pagination>
        </div>
      </div>

      <div class="tab_wapper">
        <el-table ref="tableRow" :height="360"    highlight-current-row @select-all="selectAll" @select="selectBox" @row-click="cellClick" border :data="tableList" style="width: 100%;">
          <el-table-column align="center" :selectable="checkSelectable" type="selection" width="50">
          </el-table-column>
          <el-table-column align="center" type=index label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="purchaseInOrderCode" label="采购入库单编号" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column align="center" prop="purchaseOrderCode" label="采购单编号" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column align="center" prop="supplierName" label="供应商名称" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column align="center" prop="createOperatorName" label="入库单联系人" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column align="center" prop="createOperatorNumber" label="联系人电话" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column align="center" prop="" label="入库单状态">
            <template slot-scope="scope">
              {{ statasflag(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="preStartTime" label="预约到货日期"></el-table-column>
          <el-table-column align="center" prop="createTime" label="系统接收时间"></el-table-column>
          <el-table-column class="no" align="center" prop="" label="操作">
            <template slot-scope="scope">

              <div class="c-item-blue" v-if="scope.row.status == 0">
                <el-button @click="sureArrive" type="text" size="mini">
                  确认到货
                </el-button>
              </div>
              <div class="c-item-blue" @click="hideHome({id: scope.row.id})" v-else-if="scope.row.status == 1">
                <el-button type="text" size="mini">理货结果录入</el-button>
              </div>
              <div v-else>——</div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="商品明细" name="goods">
          <table-view :index="true" :pageList="detailList" :columns="goodsColumns" >
          </table-view>
          <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNumber" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
          </el-pagination>
        </el-col>
        </el-tab-pane>
        <el-tab-pane label="发件方信息" name="sender">
          <el-row :gutter="20">
            <el-col :span="6">
              发件人：{{goodsInfo.sender}}
            </el-col>
            <el-col :span="6">
              发件方手机号：{{goodsInfo.senderNumber}}
            </el-col>
            <el-col :span="6">
              收货省份.城市：{{ goodsInfo.senderProvince ? goodsInfo.senderProvince +" "+ goodsInfo.senderCity : ''}}
            </el-col>
            <el-col :span="6" style="height:auto">
              发件方详细地址：<span>{{goodsInfo.senderAddress}}</span>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="otherInfo">
          <el-row style="margin-bottom: 15px;">
            <el-col :span="4">
              提运单号：{{goodsInfo.takeGoodsNo}}
            </el-col>
            <!-- <el-col :span="20">
              备注：<div style="display: inline-block;vertical-align: top;" v-html="goodsInfo.remark"></div>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col>
              入库备注：{{goodsInfo.inMemo}}
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="log">
          <div>
            <el-pagination @current-change="operateChange"  @size-change="operateChangeSize" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="operatePage.recordTotal">
            </el-pagination>
          </div>
          <el-table highlight-current-row border :data="operateData" style="width: 100%">
            <el-table-column prop="operation" align="center" label="动作"></el-table-column>
            <el-table-column prop="operator" align="center" label="操作人"></el-table-column>
            <el-table-column prop="operateTime" align="center" label="操作时间"></el-table-column>
            <el-table-column prop="remark" align="center" label="备注"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="printChild" v-else>
      <div style="text-align:left;width:100%">理货结果录入</div>
      <div class="secondHomeHead">
        <div class="header">
          入库单基本信息
        </div>
        <div class="content">
          <div v-for="(item, index) in childNameList" :key="index" class="content-ul">
            <div> {{item}} ： {{goodsInfo[childNameKey[index]] }} </div>
          </div>
        </div>
        <div class="header">
          商品理货信息
        </div>
      </div>

      <!-- 点击代理或录入后的表格 -->
      <div id="tableMain" style="width:100%">
        <div class="icon">
            <el-tooltip  effect="dark" content="一键填数" placement="top">
                <i @click="operatData('fill')" class="el-icon-edit-outline"></i>
            </el-tooltip>
            <el-tooltip  effect="dark" content="一键清空" placement="top">
                 <i @click="operatData('clear')" class="el-icon-delete"></i>
            </el-tooltip>
        </div>
        <el-table highlight-current-row :data="goodsInfo.detailList" border style="width: 100%">
          <el-table-column type="index" align="center" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="skuCode" align="center" label="SKU编号" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="skuName" align="center" label="SKU名称" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="specInfo" align="center" label="规格" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="barCode" align="center" label="条形码" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column prop="purchasingQuantity" align="center" label="采购数量">
          </el-table-column>
          <el-table-column label="理货数量" align="center">
            <el-table-column label="*正品数量(输入0或正整数)" align="center">
              <template slot-scope="scope">
                <el-input size="mini" type="text" v-model.number="scope.row.normalStorageQuantity" :maxlength="10"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="*残品数量(输入0或正整数)" align="center">
              <template slot-scope="scope">
                <el-input size="mini" type="text" v-model.number="scope.row.defectiveStorageQuantity" :maxlength="10"></el-input>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>

      <div class="second-home-remark">
        <div :cols="5">入库备注：</div>
        <el-input style="width:35%; padding-left:20px;" type="textarea" height="40px" :cols="16" placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
      <div class="second-home-footer">
        <el-button @click="save" type="primary" :disabled="isClick" size="mini">保存</el-button>
        <el-button @click="saveAll" type="primary"  :disabled="isClick" size="mini">入库完成</el-button>
        <el-button @click="backHome" :disabled="isClick" size="mini">返回</el-button>
      </div>
    </div>

    <!-- 打印显示的div -->
    <div class="print_screen" :key="index" v-for="(data, index) in printData" v-show="isListShow">
      <h3>采购入库理货单</h3>
      <section>
        <p>
          <span class="title">入库单编号：</span>
          <span class="desc">{{ data.purchaseInOrderCode }}</span>
        </p>
        <p></p>
        <p></p>
        <p></p>
      </section>
      <section>
        <p>
          <span class="title">采购单编号：</span>
          <span class="desc">{{data.purchaseOrderCode }}</span>
        </p>
        <p>
          <span class="title">预约到货日期：</span>
          <span class="desc">{{data.expectStartTime | filterTime }}</span>
        </p>
        <p>
          <span class="title">入库单联系人：</span>
          <span class="desc">{{ data.createOperatorName }}</span>
        </p>
        <p>
          <span class="title">联系人电话：</span>
          <span class="desc">{{ data.createOperatorNumber }}</span>
        </p>
      </section>
      <section>
        <p>
          <span class="title">供应商名称：</span>
          <span class="desc">{{ data.supplierName }}</span>
        </p>
        <p>
          <span class="title">发件人:</span>
          <span class="desc">{{ data.sender }}</span>
        </p>
        <p>
          <span class="title">发件方手机：</span>
          <span class="desc">{{ data.senderNumber }}</span>
        </p>
        <p>
          <span class="title">发件方省份-城市：</span>
          <span class="desc">{{ data.receiverProvince }}-{{ data.receiverCity }}</span>
        </p>
      </section>
      <p class="name">商品明细</p>
      <div class="table_list">
        <el-table :data="data.detailList" style="width: 100%; border: solid 1px #ccc;" border>
          <el-table-column align="center" type="index" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center">
          </el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center">
          </el-table-column>
          <el-table-column prop="specInfo" label="规格" align="center">
          </el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center">
          </el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center">
          </el-table-column>
          <el-table-column prop="" label="生产日期" align="center">
            <template slot-scope="scope">
              {{ scope.row.productionDate ? scope.row.productionDate : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="" label="截止保质日期" align="center">
            <template slot-scope="scope">
              {{ scope.row.expireDate ? scope.row.productionDate : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="purchasingQuantity" label="采购数量" align="center">
          </el-table-column>
          <el-table-column label="理货数量" align="center">
            <el-table-column prop="normalStorageQuantity" label="正品数量" align="center">
            </el-table-column>
            <el-table-column prop="defectiveStorageQuantity" label="残品数量" align="center">
            </el-table-column>
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
import axios from 'axios';

export default {
  data() {
    return {
      isClick: false, // 重复点击事件
      detailList: [], // 明细列表
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        pageNumber: 1,
        pageSize: 10,
        purchaseOrderCode: '',
        purchaseInOrderCode: ''
      },
      isListShow: false, // 隐藏打印表格
      tableData: [],
      goodStatus: [
        {
          value: '',
          key: '全部'
        },
        {
          value: 0,
          key: '未到货'
        },
        {
          value: 1,
          key: '已到货待理货'
        },
        {
          value: 2,
          key: '入库完成'
        },
        {
          value: 3,
          key: '已取消'
        }
      ],
      textarea: '',
      childData: {},
      childNameList: ['入库单编号', '采购单编号', '预约到货日期', '供应商名称'],
      childNameKey: [
        'purchaseInOrderCode',
        'purchaseOrderCode',
        'expectStartTime',
        'supplierName'
      ],
      childContentName: [
        '序号',
        'SKU编号',
        'SKU名称',
        '规格',
        '条形码',
        '采购数量',
        ''
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
      currentPage: 1, //翻页按键
      code: '', //入库调拨的所选列表项的入库单编号
      id: '', //调拨入库单ID
      params: {
        purchaseInOrderCode: '',
        purchaseOrderCode: '',
        supplierName: '',
        status: '',
        createOperatorName: '',
        supplierCode: '',
        startDate: '',
        endDate: '',
        preReceiveStart: '',
        preReceiveEnd: '',
        pageNumber: 1,
        pageSize: 10
      }, //提交订单
      pagetotal: 10, //调拨记录的总条数
      tableList: [], //调拨入库分页数据对象
      pages: {
        //分页参数
        pageSize: 10,
        pageNumber: 1
      },
      goodsInfo: {
          detailList: []
      }, //理货货物详情
      goodsInfoDetail: [], //货物详情
      noticeInfo: {}, //明细详情
      warehouseNoticeStatus: [], //地址详情
      purchaseTypes: [], //类型
      purchaseTypesMap: {},
      goodsColumns: [
        { label: 'SKU编号', field: 'skuCode', align: 'center' },
        { label: 'SKU名称', field: 'skuName', align: 'center' },
        { label: '规格', field: 'specInfo', align: 'center' },
        { label: '条形码', field: 'barCode', align: 'center' },
        { label: '批次号', field: 'batchNo', align: 'center' },
        { label: '生产编码', field: 'productionCode', align: 'center' },
        { label: '生产日期', field: 'productionDate', align: 'center' },
        { label: '截止保质期', field: 'expireDate', align: 'center' },
        { label: '理论保质期限(天)', field: 'expireDay', align: 'center' },
        { label: '采购数量', field: 'purchasingQuantity', align: 'center' },
        {
          label: '理货入库信息',
          children: [
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
      ],
      resultTable: [],
      operateData: [], //操作日志的数据
      operatePage: {
        //操作日志的分页信息
        pageSize: 10,
        pageNumber: 1,
        recordTotal: 0
      },
      printData: [], //打印的数据
      printDisabled: true, //打印按钮的disabled
      printId: []
    };
  },
  filters: {
    filterTime(str) {
      if (str) {
        return str.toString().substr(0, 10)
      }
    }
  },
  computed: {},
  methods: {
    operatData(str) {
        if(str == 'fill'){
            this.goodsInfo.detailList.map((item, index) => {
                item.normalStorageQuantity = item.purchasingQuantity
                item.defectiveStorageQuantity = 0
            })
        }else if(str == 'clear'){
            this.goodsInfo.detailList.map((item, index) => {
                item.normalStorageQuantity = ''
                item.defectiveStorageQuantity = ''
            })
        }
    },
    //操作日志的分页事件
    operateChange(value) {
      this.operatePage.pageNumber = value;
      let data = {
        pageSize: this.operatePage.pageSize,
        pageNumber: this.operatePage.pageNumber,
        entityType: 'wmsPurchaseIn',
        entityId: this.id
      };
      this.needOperateData(data);
    },
    operateChangeSize(val) {
        this.operatePage.pageSize = val;
        let data = {
            pageSize: this.operatePage.pageSize,
            pageNumber: this.operatePage.pageNumber,
            entityType: 'wmsPurchaseIn',
            entityId: this.id
        };
        this.needOperateData(data);
    },
    checkSelectable(row, index) {
      return row.status === '0' || row.status === '1';
    },
    statasflag(str) {
      switch (str) {
        case '0':
          return '未到货';
        case '1':
          return '已到货待理货';
        case '2':
          return '入库完成';
        case '3':
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
    //选择打印事件获取要打印的数据
    selectBox(select, row) {
      if (select.length < 1) {
        this.printDisabled = true;
      } else {
        this.printDisabled = false;
      }

      this.printId = select;
    },
    selectAll(select) {
      if (select.length < 1) {
        this.printDisabled = true;
      } else {
        this.printDisabled = false;
      }
      this.printId = select;
    },
    needPrintData(select) {
      //打印所需的数据接口
      this.printData = [];
      const loading = this.$loading({
        //遮罩对象loading
        lock: true,
        text: 'loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      let promise = select.map((item, index) => {
        let json = item;
        let code = item.purchaseInOrderCode;
        return this.GET('/wmsPurchaseIn/wmsPurchaseInDetailPrint/' + code).then(
          res => {
            this.printData.push(res.body)
          },
          error => {
            loading.close();
          }
        );
      });

      axios.all(promise).then(
        axios.spread((res1, res2) => {
          loading.close();
          setTimeout(() => {
            this.isListShow = false;
            window.print();
            this.$store.commit('changeShowTab', true);
          }, 10);
        })
      );
    },
    printBtn() {
      this.isListShow = true;
      this.$store.commit('changeShowTab', false);
      setTimeout(() => {
        this.needPrintData(this.printId);
      }, 20);
    },
    handleCurrentChange(val) {
      //分页点击触发事件
      this.$nextTick(() => {
        this.params.pageNumber = val;
        this.needData(this.params);
      });
    },
    changeSize(val) {
        this.params.pageSize = val;
        this.needData(this.params);
    },
    //按条件查询
    search() {
      if(this.params.endDate && this.params.startDate){
          if (this.params.endDate < this.params.startDate ) {
            this.$message.warning('系统接受时间的结束日期不能小于起始日期！');
            return;
          }
      }
      if(this.params.preReceiveEnd && this.params.preReceiveStart){
          if ( this.params.preReceiveEnd < this.params.preReceiveStart) {
            this.$message.warning('预约到货日期的结束日期不能小于起始日期！');
            return;
          }
      }

      this.needData(this.params).then(res => {});
    },
    save() {

      //商品理货信息的保存事件
      this.$nextTick(() => {
        // this.finishSave('/wmsPurchaseIn/save/', '保存成功');
            if(!this.finishSave('保存成功')){

            }else{
                let data = this.finishSave('保存成功');
                this.isClick = true;
                this.PUT('/wmsPurchaseIn/save/' + this.id, data).then(res => {
                this.$message({
                    type: 'success',
                    message: '保存成功'
                });
                // setTimeout(() => {
                    this.showHome = true;
                    this.resetForm();
                // }, 1000);
                }).finally(() => {
                  this.isClick = false;
              })
            }
      });
    },
    resetForm() {
      //初始化表单然后再请求接口
      for (let obj in this.params) {
        if (obj == 'pageSize' || obj == 'pageNumber') {
        } else {
          this.params[obj] = '';
        }
      }
      this.needData(this.params);
    },
    cellClick(row, event, column) {
      let code = row.purchaseInOrderCode;
      let text = event.target.innerText;
      this.code = code;
      this.id = row.id;
      let data = {
        pageSize: 10,
        pageNumber: 1,
        entityType: 'WmsPurchaseIn',
        entityId: this.id
      };
      this.detailList = [];
      this.detailParams.purchaseInOrderCode = row.purchaseInOrderCode;
      this.detailParams.purchaseOrderCode = row.purchaseOrderCode;
      if(text == '理货结果录入'){
          this.needTableDatail(this.code, true);
      } else {
          // this.needTableDatail(this.code);
          // 读取列表中的详情数据字段
          this.goodsInfo.sender = row.sender;
          this.goodsInfo.senderNumber = row.senderNumber;
          this.goodsInfo.senderProvince = row.senderProvince;
          this.goodsInfo.senderCity = row.senderCity;
          this.goodsInfo.senderAddress = row.senderAddress;
          this.goodsInfo.takeGoodsNo = row.takeGoodsNo;
          this.goodsInfo.remark = row.remark;
          this.goodsInfo.inMemo = row.inMemo;
          // 获取明细分页数据
          this.detailParams.pageNumber = 1;
          this.getTableDetailList();
      }
      this.needOperateData(data);
    },
    //入库完成事件
    saveAll() {

      const h = this.$createElement;
      if(!this.finishSave('录入成功')){

      }else{
        this.$confirm('确定后将不能再修改数据!','您确定“入库完成”吗？',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }
        )
        .then(() => {
        //   this.finishSave('/wmsPurchaseIn/finishIn/', '录入成功');
            let data = this.finishSave('录入成功');
            this.isClick = true;
            this.PUT('/wmsPurchaseIn/finishIn/' + this.id, data, true).then(res => {
                this.$message({
                    type: 'success',
                    message: '录入成功'
                });
                // setTimeout(() => {
                    this.showHome = true;
                    this.resetForm();
                // }, 1000);
            }).finally(() => {
                this.isClick = false;
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
    finishSave(str) {
      let arr = [];
      let parent = document.getElementById('tableMain');
      let reg = /^[0-9]*$/; // 数字正则
      let index = -1;
      let num = '';
      let skuArr = ''

      if(!this.goodsInfo.detailList.length){
          this.$message.warning('暂无数据')
          return false
      }
      for (let a = 0; a < this.goodsInfo.detailList.length; a++) {
        let n = this.goodsInfo.detailList[a].normalStorageQuantity;
        let d = this.goodsInfo.detailList[a].defectiveStorageQuantity;
        let r = this.goodsInfo.detailList[a].purchasingQuantity; // 采购数量
        let l = n * 1 + d * 1; // 正品和残品的数量之和
        num = a;
        if (!reg.test(n) || !this.check(n)) {
          index = 0;
          this.$message.warning('输入的格式不正确，请输入大于或等于0的正整数');
          break;
        } else if (!reg.test(d) ||!this.check(d)) {
          index = 1;
          this.$message.warning('输入的格式不正确，请输入大于或等于0的正整数');
          break;
        }

        if (str == '录入成功') {
          if (n === '' || n == null) {
            index = 0;
            this.$message.warning(
              `入库完成时，[ ${
                this.goodsInfo.detailList[a].skuCode
              } ] 的正品数量不能为空`
            );
            break;
          } else if (d === '' || d == null) {
            index = 1;
            this.$message.warning(
              `入库完成时，[ ${
                this.goodsInfo.detailList[a].skuCode
              } ] 的残品数量不能为空`
            );
            break;
          } else if (l > r) {
            index = 0;
            this.$message.warning(
              `入库完成时，[ ${
                  this.goodsInfo.detailList[a].skuCode
                } ] 的正品数量+残品数量不能大于采购数量！`
                );
            break;
          }
        //   else if (n < 1 && d < 1) {
        //     index = 0;
        //     this.$message.warning(
        //       `入库完成时，[ ${
        //         this.goodsInfo.detailList[a].skuCode
        //       } ] 的正品数量和残品数量不能同时为0`
        //     );
        //     break;
        //   }
        }

        let json = {
          defectiveStorageQuantity: d,
          normalStorageQuantity: n,
          id: this.goodsInfo.detailList[a].id,
          skuCode: this.goodsInfo.detailList[a].skuCode,
          purchasingQuantity: this.goodsInfo.detailList[a].purchasingQuantity
        };
        arr.push(json);
      }
      if (index > -1) {
        let item = parent.getElementsByClassName('el-table__row')[num];
        let input = item.getElementsByTagName('input')[index];
        input.focus();
        return false
      } else {
        let data = {
          checkDetailList: arr,
          inMemo: this.textarea
        };
        return data
        // this.PUT(params + this.id, data).then(res => {
        //   this.$message({
        //     type: 'success',
        //     message: str
        //   });
        //   setTimeout(() => {
        //     this.showHome = true;
        //     this.resetForm();
        //   }, 1000);
        // });
      }
    },
    check(a) {
      //校验输入的格式

      let flag = false;
      if (a % 1 === 0) {
        if (a >= 0) {
          flag = true;
        }
      }
      return flag;
    },
    backHome() {
      this.needData(this.params);
    //   this.needTableDatail(this.code);
      this.showHome = true;
    },
    hideHome(payload) {
      // 切换显示内容页面 请求下层数据
      this.showHome = false;
    },
    //确认收货事件
    sureArrive() {
      this.$prompt('确认已到货？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '备注： 不超过200个字符',
        beforeClose: (action, instance, done) => {
          if (instance.inputValue && instance.inputValue.length > 200) {
            if (action == 'confirm') {
              this.$message.warning('备注长度不能超过200字符');
            } else {
              done();
            }
          } else {
            done();
          }
        }
      })
        .then(({ value }) => {
          let str = value ? value : '无';
          this.$nextTick(() => {
            this.PUT('/wmsPurchaseIn/confirm/' + this.code, {
              remark: value
            }).then(res => {
              this.$message({
                type: 'success',
                message: '备注信息是：' + str
              });
              setTimeout(() => {
                this.needData(this.params);
              }, 1000);
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
    needData(params) {
        this.goodsInfoDetail = []
        this.detailList = [];
      //获取调拨入库列表
      return this.GET('/wmsPurchaseIn/wmsPurchaseInPage', params).then(res => {
        this.pagetotal = res.body.recordTotal;
        this.tableList = res.body.objects;

        if (this.tableList[0]) {
          setTimeout(() => {
              this.$refs.tableRow.setCurrentRow(this.tableList[0]);
            }, 20);
          let code = this.tableList[0].purchaseInOrderCode;
          let data = {
            pageSize: 10,
            pageNumber: 1,
            entityType: 'WmsPurchaseIn',
            entityId: this.tableList[0].id
          };
          this.detailParams.purchaseInOrderCode = this.tableList[0].purchaseInOrderCode;
          this.detailParams.purchaseOrderCode = this.tableList[0].purchaseOrderCode;
          this.code = code;
          // this.needTableDatail(this.code);
          // 读取列表中的详情数据字段
          this.goodsInfo.sender = this.tableList[0].sender;
          this.goodsInfo.senderNumber = this.tableList[0].senderNumber;
          this.goodsInfo.senderProvince = this.tableList[0].senderProvince;
          this.goodsInfo.senderCity = this.tableList[0].senderCity;
          this.goodsInfo.senderAddress = this.tableList[0].senderAddress;
          this.goodsInfo.takeGoodsNo = this.tableList[0].takeGoodsNo;
          this.goodsInfo.remark = this.tableList[0].remark;
          this.goodsInfo.inMemo = this.tableList[0].inMemo;
          // 获取明细分页数据
          this.detailParams.pageNumber = 1;
          this.getTableDetailList();

          this.needOperateData(data);
        } else {
          this.goodsInfoDetail = []
          this.goodsInfo = [];
          this.operateData = [];
          this.operatePage.recordTotal = 0;
        }
        this.params.pageNumber = 1  //初始化
      });
    },
    needTableDatail(code, load) {
      this.goodsInfo = {
          detailList : []
      };
      //获取调拨入库单个列表的详情
      return this.GET('/wmsPurchaseIn/wmsPurchaseInDetail/' + code, '',load).then(
        res => {
          this.goodsInfo = JSON.parse(JSON.stringify(res.body));
          if(load){
                this.goodsInfo = res.body;
                this.textarea = this.goodsInfo.inMemo;
                if (this.goodsInfo.detailList && this.goodsInfo.detailList.length) {
                    this.goodsInfo.detailList.forEach(item => {
                    //   if (!item.normalStorageQuantity) {
                    //     item.normalStorageQuantity = 0;
                    //   }
                        if(item.normalStorageQuantity === null){
                            item.normalStorageQuantity = ''
                        }
                        if(item.defectiveStorageQuantity === null){
                            item.defectiveStorageQuantity = ''
                        }
                        if (!item.defectiveStorageQuantity) {
                            item.defectiveStorageQuantity = 0;
                        }
                    });
                }
          }
        }
      );
    },
    // 获取采购单明细数据详情
    getTableDetailList() {
      this.GET('/wmsPurchaseIn/wmsPurchaseInDetailPage', this.detailParams).then(res => {
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
    needOperateData(data) {
      //操作日志获取数据
      this.GET('/wmsLogInformation/wmsLogInformationPage', data).then(res => {
        this.operateData = res.body.objects;
        this.operatePage.recordTotal = res.body.recordTotal;
      });
    }
  },
  mounted() {
    this.needData(this.params);
  }
};
</script>

<style lang="less" scoped>
.paging {
  margin-top: 15px;
  text-align: right;
}
#tableMain {
    position: relative;
    .icon{
        font-size: 18px;
        color: #409EFF;
        cursor:pointer;
        position: absolute;
        top: 8px;
        right:  9%;
        z-index: 100
    }
}
.value {
  padding-left: 10px;
  vertical-align: middle;
}
.el-textarea textarea {
  min-height: 40px !important ;
}
.content-item-child {
  input {
    padding-left: 20px;
    padding: 5px;
  }
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
}

.printChild {
  position: relative;
  width: 100%;
  min-width: 1440px;
  display: flex;
  flex-direction: column;
  justify-content: left;
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
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      padding: 5px;
      margin: 20px 0;
      color: #333;
      padding: 0 10px;
      box-sizing: border-box;
      border-radius: 2px;
    }
    .content {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      border: none;
      margin: 30px 10px;
      font-size: 12px;
      .content-ul {
        display: flex;
        flex-direction: row;
        padding-right: 200px;
        .content-ul div {
        }
      }
    }
  }

  .second-home-content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    border-radius: 3px;
    .header-ul {
      display: flex;
      background-color: #f5f7fa;
      color: #333;
      height: 80px;
      // border-top:solid 1px #d8d8d8;
      border: solid 1px #d8d8d8;
      .header {
        display: flex;
        width: 10%;
        font-size: 14px;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #d8d8d8;

        &:nth-child(1) {
          width: 5%;
          border-left: none;
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
            line-height: 40px;
          }
          .header-item-specS {
            display: flex;
            flex-direction: row;
            justify-content: center;
            justify-content: space-around;
            line-height: 40px;
            span {
              flex: 50%;
              text-align: center;
            }
            span:first-child {
              border-right: solid 1px #d8d8d8;
            }
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
      min-height: 40px;
      border: 1px solid #d8d8d8;
      .content-item {
        display: flex;
        width: 10%;
        font-size: 14px;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #d8d8d8;
        box-sizing: border-box;
        // &:nth-child(n) {
        // //   width: 10%;
        //   font-size: 12px;
        //   word-break: break-all;
        // }
        &:nth-child(1) {
          width: 5%;
          border: none;
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
    width: 100%;
    padding-left: 5px;
    font-size: 14px;
    padding: 50px 0;
  }

  .second-home-footer {
    .usualBtn {
      width: 80px;
      height: 40px;
      border-radius: 5px;
      border: 1px solid rgba(68, 88, 157, 1);
    }
    .blueBtn {
      background-color: rgba(68, 88, 157, 1);
      color: white;
    }
  }
}
.el-message-box {
  width: auto;
  .el-message-box__btns {
    text-align: center;
  }
}
</style>

<style lang="less">
.el-message-box__title span {
    width: auto !important;
}
.el-table .success-row {
  background: #f0f9eb;
}
.table_list {
  div.cell {
    padding: 0;
  }
}
.el-message-box--center .el-message-box__message {
  color: #ff0000;
}
</style>



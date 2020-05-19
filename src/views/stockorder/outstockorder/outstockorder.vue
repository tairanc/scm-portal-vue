<template>
  <div class="outstockorder">
    <el-form
      label-width="125px"
      size="mini"
    >
      <el-row :span="24">
        <el-col :span="6">
          <el-form-item label="出库调整单编号：">
            <el-input v-model="searchParams.stockAdjustOutCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="库存调整单编号：">
            <el-input v-model="searchParams.stockAdjustCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类型：">
            <el-select v-model="searchParams.businessType" placeholder="">
              <el-option v-for="(item,index) in outBoundOptions" :key="index" :label="item.value" :value="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="创建时间："
            size="mini"
          >
            <el-col :span="11">
              <el-date-picker
                v-model="searchParams.startDate"
                :clearable='false'
                type="date"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              >
              </el-date-picker>
            </el-col>
            <el-col
              style="text-align: center"
              :span="2"
            >-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="searchParams.endDate"
                type="date"
                :clearable='false'
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :span="24">
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col
          style="margin:20px 0"
          :span="6"
        >
          <el-form-item>
            <el-button
              size="mini"
              @click="searchFormData"
              type="primary"
            >查询</el-button>
            <el-button
              size="mini"
              @click="resetFrom"
            >重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-col class='paging'>
      <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
    </el-col>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" ref="multipleTable" @row-click="tableRowClick" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="出库调整单编号" prop="stockAdjustOutCode" align="center"></el-table-column>
      <el-table-column label="库存调整单编号" prop="stockAdjustCode" align="center"></el-table-column>
      <el-table-column label="业务类型" prop="businessTypeDesc" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="单据状态" prop="stockAdjustOutStatusDesc" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;">
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="tableRowList" style="width: 100%" border v-show="false">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span align="center">原SKU&nbsp;&nbsp;&nbsp;</span><span class="targatSkuCode">{{scope.row.skuCode}}</span></div>
              <div class="oringinDiv"><span align="center">目标SKU</span><span class="targatSkuCode">{{scope.row.targetSkuCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.skuName}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetSkuName}}</span></div>
            </template>
          </el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.specNatureInfo}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetSpecNatureInfo}}</span></div>
            </template>
          </el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.barCode}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetBarCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column prop="inOutInventoryTypeDesc" label="调整库存类型" align="center" ></el-table-column>
          <el-table-column prop="" label="调整数量" align="center" >
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5">
                <span v-if="scope.row.adjustNum !== ''">减少{{scope.row.adjustNum}}</span>
                <span v-else>-</span>
              </div>
              <div class="oringinDiv">
                <span v-if="scope.row.targetAdjustNum !== ''">增加{{scope.row.targetAdjustNum}}</span>
                <span v-else>-</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableRowList" style="width: 100%" >
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width='150' show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="inOutInventoryTypeDesc" label="出库库存类型" align="center" ></el-table-column>
          <el-table-column prop="inOutNum" label="出库数量" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="finishTime" label="出库时间" align="center" show-overflow-tooltip></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNumber" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="2">
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">调整说明：{{tableRowDetail.adjustInstruction}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="3">
        <el-table :data="logInfoList" style="width: 100%">
          <el-table-column prop="operation" label="动作" align="center"></el-table-column>
          <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
          <el-table-column prop="operateTime" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center">
            <template slot-scope='scope'>
              <div v-html='scope.row.remark'></div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="logChangeSize" @current-change="logChangeNumber" :current-page="operateParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="operateParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "outstockorder",
  data() {
    return {
      businessType: '', // 根据业务类型显示不同的明细列表
      tableRowDetail: {},
      logInfoList: [],
      detailCount: 0, // 明细分页总条数
      detailParams: { // 明细分页参数
        pageNumber: 1,
        pageSize: 10,
        stockAdjustOutId: ''
      },
      activeName: '1',
      tableRowList: [],
      tableDataList: [],
      outBoundOptions: [
        {
          value: '全部',
          label: ''
        },
        {
          value: '库存盘点',
          label: '0'
        },
        {
          value: '正品转残品',
          label: '1'
        },
        {
          value: '残品转正品',
          label: '2'
        },
        {
          value: '库存转化',
          label: '3'
        },
        {
          value: '系统原因',
          label: '4'
        }
      ],
      totalCount: 0,
      searchParams: {
        stockAdjustCode: "", // 库存调整单号
        businessType: "", //库存调整业务类型0-库存盘点 1-正品转残品 2-残品转正品 3-库存转化 4-系统原因
        warehouseCode: window.localStorage.code,
        stockAdjustInCode: "", //入库调整单编号
        startDate: "",
        endDate: "",
        pageNumber: 1,
        pageSize: 10
      },
      logCount: 0,
      operateParams: {
        start: 0,
        pageNumber: 1,
        pageSize: 10,
        entityType: 'WmsStockAdjustOutOrder',
        entityId: ''
      }, // 日志
    };
  },
  mounted: function() {
    this.initDataList();
  },
  methods: {
    checkedBusinessType(val) {
      let str = '';
      this.outBoundOptions.forEach(item => {
        if (val && val == item.label) {
          str = item.value;
        }
      });
      return str;
    },
    searchFormData() {
       if (
        new Date(this.searchParams.startDate).getTime() >
        new Date(this.searchParams.endDate).getTime()
      ) {
        this.$message({
          message: '开始日期不得大于结束日期',
          type: 'warning'
        });
        return;
      }
      this.searchParams.pageSize = 10;
      this.searchParams.pageNumber = 1;
      this.initDataList();
    },
    resetFrom() {
      this.searchParams = {
        stockAdjustCode: "", // 库存调整单号
        businessType: "", //库存调整业务类型0-库存盘点 1-正品转残品 2-残品转正品 3-库存转化 4-系统原因
        warehouseCode: window.localStorage.code,
        stockAdjustInCode: "", //入库调整单编号
        startDate: "",
        endDate: "",
        pageNumber: 1,
        pageSize: 10
      };
      this.initDataList();
    },
    // 获取入库调整单数据列表
    initDataList() {
      this.tableRowDetail = {};
      this.tableDataList = [];
      this.tableRowList = [];
      this.logInfoList = [];
      this.logCount = 0;
      this.GET('/adjustOutOrder/page', this.searchParams)
        .then(res => {
          this.tableDataList = res.body.objects;
          this.totalCount = res.body.recordTotal;
          if (this.tableDataList && this.tableDataList.length) {
            setTimeout(() => {
              this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
              // 获取明细分页数据
              this.businessType = this.tableDataList[0].businessType;
              this.detailParams.stockAdjustOutId = this.tableDataList[0].id;
              this.tableRowDetail.adjustInstruction = this.tableDataList[0].adjustInstruction;
              // 获取明细分页数据
              this.detailParams.pageNumber = 1;
              this.getTableDetailList();
              this.operateParams.entityId = this.tableDataList[0].id;
              this.getLogInfo();
            }, 20);
          } else {
            this.tableRowList = [];
            this.logInfoList = [];
            this.logCount = 0;
          }
        });
    },
    // 页码条数改变
    changeSize(val) {
      this.searchParams.pageNumber = 1;
      this.searchParams.pageSize = val;
      this.initDataList();
    },
    // 当前页码改变
    changeNumber(val) {
      this.searchParams.pageNumber = val;
      console.log(this.searchParams.pageNumber);
      this.initDataList();
    },
    tableRowClick(row) {
      // 获取明细分页数据
      this.businessType = row.businessType;
      this.detailParams.stockAdjustOutId = row.id;
      this.tableRowDetail.adjustInstruction = row.adjustInstruction;
      // 获取明细分页数据
      this.detailParams.pageNumber = 1;
      this.getTableDetailList();
      this.operateParams.entityId = row.id;
      this.getLogInfo();
    },
    // 获取入库调整单明细数据详情
    getTableDetailList() {
      console.log(this.detailParams);
      this.GET('/adjustOutOrder/detail', this.detailParams).then(res => {
        console.log('res: ', res);
        this.tableRowList = res.body.objects;
        this.detailCount = res.body.recordTotal;
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
     // 页码条数改变
    logChangeSize(val) {
      this.operateParams.pageNumber = 1;
      this.operateParams.pageSize = val;
      this.getLogInfo();
    },
    // 当前页码改变
    logChangeNumber(val) {
      this.operateParams.pageNumber = val;
      this.getLogInfo();
    },
    // 获取日志信息
    getLogInfo() {
      this.GET('/wmsLogInformation/wmsLogInformationPage', this.operateParams).then(res => {
        this.logInfoList = res.body.objects;
        this.logCount = res.body.recordTotal;
      });
    },
  }
};
</script>

<style lang="stylus" scoped>
.outstockorder
  .paging
    margin-top: 15px
    text-align: right
  .oringinDiv
    span
      padding:2px 8px;
    .targatSkuCode
      display:inline-block;
      border-left: 1px solid #ebeef5;
      width: 150px;
      text-align: center;
</style>

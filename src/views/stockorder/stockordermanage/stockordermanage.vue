<template>
  <div class="stockordermanage">
    <!-- 表单 -->
    <el-form :model="searchParams" ref="queryForm" label-width="125px" class="search_form" size="medium">
      <el-row :span="20">
        <el-col :span="6">
          <el-form-item label="库存调整单编号：" size="mini">
            <el-input v-model.trim="searchParams.stockAdjustCode" placeholder=""></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="业务类型：" size="mini">
            <el-select v-model="searchParams.businessType" filterable placeholder="请选择">
              <el-option v-for="item in businessTypeList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单据状态：" size="mini">
            <el-select v-model="searchParams.docStatus" filterable placeholder="请选择">
              <el-option v-for="item in docStatusList" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="最近更新时间："  size="mini">
              <el-col :span="11">
                  <el-form-item prop="" size="mini">
                      <el-date-picker v-model="searchParams.startUpdateTime"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                      </el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                  <el-form-item prop="" size="mini">
                      <el-date-picker v-model="searchParams.endUpdateTime"   type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                      </el-date-picker>
                  </el-form-item>
              </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="height: 13px;"></div>
      <el-row :span="20">
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">&nbsp;</el-col>
        <el-col :span="6">
          <el-form-item size="mini">
            <el-button type="primary" icon="search" @click="searchFormData">查询</el-button>
            <el-button type="default" icon="circle-cross" @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分页 -->
    <el-row type="flex" justify="space-between">
      <el-col>
        <el-button type="primary" size="mini" @click="toAddOrEdit('add')">新增库存调整单</el-button>
      </el-col>
      <el-col class='paging'>
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="searchParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 表格tableData -->
    <el-table :data="tableDataList" @row-click="tableRowClick" ref="multipleTable" highlight-current-row border tooltip-effect="dark" height="454">
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="库存调整单编号" prop="stockAdjustCode" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="业务类型" prop="businessTypeDesc" align="center"></el-table-column>
      <el-table-column label="单据状态" prop="docStatusDesc" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.docStatus == '1'" style='color: orange;'>{{scope.row.docStatusDesc}}</div>
          <div v-else-if="scope.row.docStatus == '4'" style='color: green;'>{{scope.row.docStatusDesc}}</div>
          <div v-else>{{scope.row.docStatusDesc}}</div>
        </template>
      </el-table-column>
      <el-table-column label="同步SCM状态" prop="synScmStatusDesc" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.synScmStatus == 1" style='color: orange;'>{{scope.row.synScmStatusDesc}}</div>
          <div v-else-if="scope.row.synScmStatus == 2" style='color: green;'>{{scope.row.synScmStatusDesc}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="最近更新时间" prop="updateTime"  align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <div v-if='scope.row.docStatus == "0" || scope.row.docStatus == "1"'>
            <el-button size="mini" type="text"  @click="toAddOrEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text"  @click="deleteBtn(scope.row)">删除</el-button>
          </div>
          <el-button size="mini" type="text" v-else-if='scope.row.synScmStatus == "1"'  @click="retrySyn(scope.row)">重新同步</el-button>
          <span v-else>-</span>
          </template>
      </el-table-column>
    </el-table>
    <!-- 选项卡 -->
    <el-tabs v-model="activeName" type="card" style="margin-top: 15px;" >
      <el-tab-pane label="商品明细" name="1">
        <el-table :data="tableRowList" style="width: 100%" border v-show="businessType == '3'">
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
          <el-table-column prop="adjustInventoryTypeDesc" label="调整库存类型" align="center" ></el-table-column>
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
        <el-table :data="tableRowList" style="width: 100%" border v-show="businessType != '3'">
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column prop="skuCode" label="SKU编号" align="center" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="skuName" label="SKU名称" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="specNatureInfo" label="规格" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="barCode" label="条形码" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="adjustInventoryTypeDesc" label="调整库存类型" align="center" ></el-table-column>
          <el-table-column prop="adjustNum" label="调整数量" align="center"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-col class='paging'>
          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNumber" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
          </el-pagination>
        </el-col>
      </el-tab-pane>
      <el-tab-pane label="其他信息" name="2">
        <!-- 第一行 -->
        <el-row>
          <el-col :span="6" style="height: auto;line-height: 30px;">
            <div class="title">调整说明：{{adjustInstruction}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="操作日志" name="3">
        <el-table :data="logInfoList" style="width: 100%" border>
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
  import axios from 'axios';
  export default {
    name: 'stockordermanage',
    data() {
      return {
        businessType: '', // 根据业务类型显示不同的明细列表
        tableRowPrintList: [], // 预览打印的数据
        detailCount: 0, // 明细分页总条数
        detailParams: { // 明细分页参数
          pageNumber: 1,
          pageSize: 10,
          id: ''
        },
        purchaseCount: 0,
        userName: window.sessionStorage.userName,
        isPreviewInfo: false,
        disabledDownLoad: false,
        disabledDownLoadExcel: false,
        isTableDisabled: false,
        codeArr: [], // 打印参数
        isPrint: false, // 打印的pdf
        loading: null, // loading
        isShow: false, // 下载pdf控制的隐藏
        copyId: '', // 复制成功之后要跳转到id
        timer: null, // 倒计时
        time: 5, // 倒计时时间
        copyDialogVisible: false, // 弹窗
        printData: [], // 打印的数据
        htmlTitle: '采购订单',
        downLoadUrl: '', // 下载路径
        fileDataList: [], // 上传文件列表
        code: '', // 保存的采购单编号
        state1: '',
        form: {
          logiisticsInfo: '', // 物流信息
          packing: '' // 包装方式
        },
        restaurantsList: [], // 包装信息
        logiisticsInfoList: [], // 物流信息
        operateParams: {
          pageNumber: 1,
          pageSize: 10,
          entityType: 'WmsStockAdjustOrder',
          entityId: ''
        }, // 日志
        tableData: [],
        isInstallInfo: false, // 弹窗
        activeName: '1', // 当前选中的选项卡
        arr: [], // 数组列表
        purchaseGroupCodeList: [
          {
            name: '全部',
            code: ''
          }
        ], // 采购组列表
        brandNameList: [], // 品牌列表
        firstCateList: [], // 类目一级列表
        secondCateList: [], // 类目二级列表
        thirdCateList: [], // 类目三级列表
        isFirstLevel: true, // 关联二级菜单
        isSecondLevel: true, // 关联三级菜单
        dialogTableVisible: false, // 弹窗
        currentTableIndex: [], // 当前列表对应子列表的sku项
        skuList: [], // sku列表
        spuCodeList: [], // spu更改状态列表
        skuCodeList: [], // sku更改状态列表
        tableDataList: [], // 初始化列表数据
        tableRowList: [], // 详情明细
        adjustInstruction: '', // 调整说明
        logInfoList: [], // 日志信息
        logCount: 0, // 日志条数
        docStatusList: [
          {
            name: '全部',
            code: ''
          },
          {
            name: '暂存',
            code: '0'
          },
          {
            name: '审核驳回',
            code: '1'
          },
          {
            name: '提交审核',
            code: '2'
          },
          {
            name: '审核通过',
            code: '3'
          },
          {
            name: '调整完成',
            code: '4'
          },
        ], // 单据状态列表0-暂存 1-审核驳回 2-提交审核 3-审核通过 4-调整完成
        businessTypeList: [
          {
            name: '全部',
            value: ''
          },
          {
            name: '库存盘点',
            value: '0'
          },
          {
            name: '正品转残品',
            value: '1'
          },
          {
            name: '残品转正品',
            value: '2'
          },
          {
            name: '库存转化',
            value: '3'
          },
          {
            name: '系统原因',
            value: '4'
          },
        ], // 库存调整业务类型0-库存盘点 1-正品转残品 2-残品转正品 3-库存转化 4-系统原因
        totalCount: 0, // 列表条数
        searchParams: {
          stockAdjustCode: '', // 库存调整单号
          docStatus: '', // 单据状态
          businessType: '', // 库存调整业务类型
          startUpdateTime: '', // 开始日期
          endUpdateTime: '', // 结束日期
          pageSize: 10, // 默认10条
          pageNumber: 1 // 默认第一页
        }, // 请求参数
        multipleSelection: [] // 多选框选中
      };
    },
    created() {
      this.initDataList();
    },
    computed: {
      divHeight() {
        let height = 600;
        if (this.printData[0].remark && this.printData[0].remark.length) {
          height = 650 - (Math.ceil(this.printData[0].remark.length / 62) * 50);
        }
        return height + 'px';
      }
    },
    methods: {
      // 多选框选中
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 多选框是否可选
      checkSelectable(row, index) {
        let isSeletc = false;
        if (row.status === '2' || row.status === '8') {
          isSeletc = true;
        }
        return isSeletc;
      },
      uploadFile(fileName) {
        this.GET('/qinniuPrivate/fileDownload', { fileName }).then(res => {
          console.log(res.result);
        // this.downLoadUrl = res.result;
        // top.window.location.href = res.result;
        window.open(res.result);
      });
      },
      // 获取上传列表数据
      getUploadDataList(code) {
        this.GET('/qinniuPrivate/uploadFile', { code }).then(res => {
          this.fileDataList = res.result || [];
        // if (this.fileDataList.length) {
        //   this.uploadFile(this.fileDataList[0].uploadFileName);
        // }
      });
      },
      // 获取采购单数据列表
      initDataList() {
        this.GET('/stockAdjust/findPage', this.searchParams)
          .then(res => {
          this.tableDataList = res.body.objects;
          this.totalCount = res.body.recordTotal;
          this.isTableDisabled = false;
        if (this.tableDataList && this.tableDataList.length) {
          setTimeout(() => {
            this.$refs.multipleTable.setCurrentRow(this.tableDataList[0]);
            this.detailParams.id = this.tableDataList[0].id;
            this.businessType = this.tableDataList[0].businessType;
            this.adjustInstruction = this.tableDataList[0].adjustInstruction;
            // 获取明细分页数据
            this.detailParams.pageNumber = 1;
            this.getTableDetailList();
            this.operateParams.entityId = this.tableDataList[0].id;
            this.getLogInfo();
          }, 20);
        } else {
          this.tableRowList = [];
          this.boxInfoDetail = [];
          this.logInfoList = [];
          this.fileDataList = [];
          this.logCount = 0;
          this.isTableDisabled = true;
        }
      });
      },
      // 获取采购单明细数据详情
      getTableDetailList() {
        this.GET('/stockAdjust/findSkuDetailsPage/' + this.detailParams.id, this.detailParams).then(res => {
          console.log('res: ', res);
          this.tableRowList = res.body.objects;
          this.detailCount = res.body.recordTotal;
        });
      },
      // 页码条数改变
      detailChangeSize(val) {
        this.detailParams.start = 0;
        this.detailParams.pageNumber = 1;
        this.detailParams.pageSize = val;
        this.getTableDetailList();
      },
      // 当前页码改变
      detailChangeNumber(val) {
        this.detailParams.pageNumber = val;
        this.detailParams.start = (val - 1) * this.detailParams.pageSize;
        this.getTableDetailList();
      },
      // 删除接口
      deleteUpdateState(row) {
        this.DELETE('/stockAdjust/delete/', row.id)
          .then(res => {
          this.$message({
          type: 'success',
          message: res.body
        });
        setTimeout(() => {
          this.initDataList();
      }, 600);
      });
      },
      // 重新同步接口
      retrySyn(row) {
        this.PUT('/stockAdjust/retrySyn/' + row.id)
          .then(res => {
          this.$message({
          type: 'success',
          message: res.body
        });
        setTimeout(() => {
          this.initDataList();
        }, 600);
      });
      },
      // 获取日志信息
      getLogInfo() {
        this.GET('/wmsLogInformation/wmsLogInformationPage', this.operateParams).then(res => {
          this.logInfoList = res.body.objects;
          this.logCount = res.body.recordTotal;
        });
      },
      // 点击删除按钮
      deleteBtn(row) {
        this.$confirm(`删除后数据将不可恢复。`, `您确认要删除吗?`, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          })
          .then(() => {
          this.deleteUpdateState(row);
      })
      .catch(() => {
          this.$message({
          type: 'info',
          message: `已取消!`
        });
      });
      },
      // 点击整行
      tableRowClick(row) {
        this.detailParams.id = row.id;
        this.businessType = row.businessType;
        this.adjustInstruction = row.adjustInstruction;
        // 获取明细分页数据
        this.detailParams.pageNumber = 1;
        this.getTableDetailList();
        this.operateParams.entityId = row.id;
        this.getLogInfo();
      },
      // 跳转新增页面
      toAddOrEdit(id) {
          this.$router.push({path: '/stockordermanage/stockorderaddoredit/' + id});
      },
      // 页码条数改变
      logChangeSize(val) {
        this.operateParams.start = 0;
        this.operateParams.pageNumber = 1;
        this.operateParams.pageSize = val;
        this.getLogInfo();
      },
      // 当前页码改变
      logChangeNumber(val) {
        this.operateParams.pageNumber = val;
        this.operateParams.start = (val - 1) * this.operateParams.pageSize;
        this.getLogInfo();
      },
      // 筛选条件
      searchFormData() {
        if (
          new Date(this.searchParams.startUpdateTime).getTime() >
          new Date(this.searchParams.endUpdateTime).getTime()
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
      // 重置搜索条件
      resetForm() {
        this.searchParams = {
          stockAdjustCode: '', // 库存调整单号
          docStatus: '', // 单据状态
          businessType: '', // 库存调整业务类型
          startUpdateTime: '', // 开始日期
          endUpdateTime: '', // 结束日期
          pageSize: 10, // 默认10条
          pageNumber: 1 // 默认第一页
        };
        this.initDataList();
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
        this.initDataList();
      },
      // 类型的翻译
      checkedBusinessType(type) {
        let typeStr = '';
        this.businessTypeList.forEach(item => {
          if (type && item.value == type) {
            typeStr = item.name
          }
        })
        return typeStr;
      },
      // 单据状态翻译
      checkedStatus(status) {
        let statusStr = '';
        if (status === '0') {
          statusStr = '暂存';
        } else if (status === '1') {
          statusStr = '审核驳回';
        } else if (status === '3') {
          statusStr = '审核通过';
        } else if (status === '2') {
          statusStr = '提交审核';
        } else if (status === '4') {
          statusStr = '调整完成';
        }
        return statusStr;
      },
      // 单据状态翻译
      checkedSynScmStatus(status) {
        let statusStr = '';
        if (status === '0') {
          statusStr = '待同步';
        } else if (status === '1') {
          statusStr = '同步失败';
        } else if (status === '2') {
          statusStr = '同步成功';
        }
        return statusStr;
      },
      // 调整库存类型翻译
      checkedAdjustInventoryType(status) {
        let statusStr = '-';
        if (status === '0') {
          statusStr = '正品';
        } else if (status === '1') {
          statusStr = '残品';
        } else if (status === '2') {
          statusStr = '正品->残品';
        } else if (status === '3') {
          statusStr = '残品->正品';
        }
        return statusStr;
      }
    }
  };
</script>

<style lang="stylus">
.stockordermanage
  .oringinDiv
    span
      padding:2px 8px;
    .targatSkuCode
      display:inline-block;
      border-left: 1px solid #ebeef5;
      width: 150px;
      text-align: center;
  .paging
    text-align: right;

</style>

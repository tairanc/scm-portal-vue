<template>
  <div class="stockorderdetail">
    <div>库存调整单审核</div>
    <div class="title">基本信息</div>
    <el-form label-width="125px" size="mini">
      <el-form-item label="库存调整单编号：">
        {{ searchParams.stockAdjustCode }}
      </el-form-item>
      <el-form-item label="业务类型：">
        {{ searchParams.businessTypeDesc }}
      </el-form-item>
      <el-form-item label="调整说明：">
        {{ searchParams.adjustInstruction }}
      </el-form-item>
      <div class="title">商品明细</div>
      <el-table :data="tableDataList" style="width: 100%" border v-show="searchParams.businessType == '3'">
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
      <el-table :data="tableDataList" border style="width: 100%" v-show="searchParams.businessType != '3'">
        <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
        <el-table-column align="center" prop="skuCode" label="SKU编号" > </el-table-column>
        <el-table-column align="center" prop="skuName" label="SKU名称" > </el-table-column>
        <el-table-column align="center" prop="specNatureInfo" label="规格" > </el-table-column>
        <el-table-column align="center" prop="barCode" label="条形码" > </el-table-column>
        <el-table-column align="center" prop="adjustInventoryTypeDesc" label="调整库存类型" ></el-table-column>
        <el-table-column align="center" prop="adjustNum" label="调整数量" > </el-table-column>
      </el-table>
      <div class="title radiut">审核信息</div>
      <div v-show="!editOrDetail">
        <!-- <div style="padding: 10px 0">审核记录：</div> -->
        <el-form-item label="审核记录：" v-if="auditLog && auditLog.length">
          <el-table :data="auditLog" border >
            <el-table-column align="center" prop="operation" label="审核结果" ></el-table-column>
            <el-table-column align="center" prop="operator" label="审核人" > </el-table-column>
            <el-table-column align="center" prop="operateTime" label="审核时间" > </el-table-column>
            <el-table-column align="center" prop="remark" label="审核意见" > </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="审核意见：">
          <el-input v-model.trim="auditOpinion" maxlength="1500" type="textarea"></el-input>
          驳回时必填,最多不超过1500个字符
        </el-form-item>
        <div style="text-align:center;">
          <el-button size="mini" :disabled="disableBtn || disableBtn1" @click="confirm('0')" type="primary">通过</el-button>
          <el-button size="mini" :disabled="disableBtn1" @click="confirm('1')" type="primary">驳回</el-button>
          <el-button @click="back()" size="mini">取消</el-button>
        </div>
      </div>
      <div v-show="editOrDetail">
        <ul class="audit_status">
          <li>
            <span>当前状态：</span>
            <span v-show="isAuditStatus == 1">已审核</span>
            <span v-show="isAuditStatus == 0">待审核</span>
          </li>
          <li>
            <span>当前审核结果：</span>
            <span v-if="searchParams.docStatus === 4" style="color:rgb(0, 153, 0);">审核通过</span>
            <span v-else-if="searchParams.docStatus === 1" style="color:rgb(255, 0, 0);">审核驳回</span>
            <span v-else>-</span>
          </li>
        </ul>
        <el-form-item label="审核记录：">
          <el-table :data="auditLog" border >
            <el-table-column align="center" prop="operation" label="审核结果" ></el-table-column>
            <el-table-column align="center" prop="operator" label="审核人" > </el-table-column>
            <el-table-column align="center" prop="operateTime" label="审核时间" > </el-table-column>
            <el-table-column align="center" prop="remark" label="审核意见" > </el-table-column>
          </el-table>
        </el-form-item>
        <div style="text-align:center; margin:20px 0">
          <el-button v-if="isAuditStatus == 0" size="mini" @click="toAudit" type="primary">审核</el-button>
          <el-button @click="back()" size="mini">返回</el-button>
        </div>
      </div>
    </el-form>

  </div>
</template>
<script>
  export default {
    name: 'stockorderdetail',
    data() {
      return {
        auditLog: [], // 审核记录
        searchParams: {
          stockAdjustCode: '', // 库存调整单号
          businessType: '', // 库存调整业务类型
          adjustInventoryType: '', // 库存调整库存类型
          adjustInstruction: '', // 调整说明
          reviewStatus: '' // 是否审核
        },
        operateParams: {
          pageNumber: 1,
          pageSize: 10,
          filterFlag: 1,
          entityType: 'WmsStockAdjustOrder',
          entityId: ''
        }, // 日志
        tableDataList: [],
        id: this.$route.params.id, // 库存调整单id
        editOrDetail: this.$route.query.flag ? this.$route.query.flag : false, // true是detail
        isAuditStatus: this.$route.query.isAuditStatus,
        auditOpinion: '',
        disableBtn: false,
        disableBtn1: false,
        warehouseList: [], // 仓库信息
        auditOption: 0 // 审核通过与否
      };
    },
    mounted: function() {
      this.initDetailData();
      this.operateParams.entityId = this.id;
      this.getLogInfo();
    },
    methods: {
      // 获取日志信息
      getLogInfo() {
        this.GET('/wmsLogInformation/wmsLogInformationPage', this.operateParams).then(res => {
          console.log(res.body.objects);
          this.auditLog = res.body.objects;
          // this.logCount = res.body.recordTotal;
        });
      },
      toAudit() {
        this.editOrDetail = false;
      },
      back() {
        this.$router.push({
          path: '/stockorderaudit'
        });
      },
      initDetailData() {
        this.GET('/stockAdjust/review/' + this.id).then(res => {
          // let auditLogObj = {};
          this.searchParams = res.body;
          this.tableDataList = res.body.stockAdjustEditDetailsVOS;
          // auditLogObj.docStatusDesc = this.searchParams.docStatusDesc;
          // auditLogObj.reviewStatusDesc = this.searchParams.reviewStatusDesc;
          // auditLogObj.auditOperator = this.searchParams.auditOperator;
          // auditLogObj.auditTime = this.searchParams.auditTime;
          // this.auditLog.push(auditLogObj);
      });
      },
      confirm(flag) {
        if (flag === '1' && !this.auditOpinion) {
          this.$message.warning('请填写审核意见');
          return;
        }
        let data = {
          id: this.id,
          auditOpinion: this.auditOpinion
        };
        this.disableBtn1 = true;
        this.PUT('/stockAdjust/auditPass/' + flag, data, true).then(res => {
          this.$message.success(res.body);
          this.back();
      }).finally(() => {
          this.disableBtn1 = false;
      });
      }
    }
  };
</script>
<style lang="stylus" scoped>
  .stockorderdetail
    .oringinDiv
      span
        padding:2px 8px;
      .targatSkuCode
        display:inline-block;
        border-left: 1px solid #ebeef5;
        width: 150px;
        text-align: center;
    .title
      background-color #f5f7fa;
      color #909399
      padding 10px
      font-size 14px
      margin 10px 0
    .title.radiut
      color #409eff
      background-color #ecf8ff
    .audit_status
      display flex
      padding 10px
      margin 20px 0 10px 0
      border solid 1px #999
      li
        padding-right 50px
</style>


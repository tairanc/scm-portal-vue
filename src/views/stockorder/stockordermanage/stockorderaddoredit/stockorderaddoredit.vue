<template>
  <div class="stockorderaddoredit">
    <!-- 表单 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="searchParams" :rules="rules" ref="searchParams" label-width="125px" class="search_form" size="medium">
        <!-- 第0行 -->
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="库存调整单编号：" size="mini">
              {{searchParams.stockAdjustCode ? searchParams.stockAdjustCode : '保存后系统自动生成'}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
          <el-col :span="6" >&nbsp;</el-col>
        </el-row>
        <div style="height: 13px;"></div>
        <!-- 第二行 -->
        <el-row :span="20">
          <el-col :span="24">
            <el-form-item label="业务类型：" prop="businessType" size="mini">
              <el-radio-group v-model="searchParams.businessType" @change="preCheck">
                <el-radio :label="0">库存盘点</el-radio>
                <el-radio :label="1">正品转残品</el-radio>
                <el-radio :label="2">残品转正品</el-radio>
                <el-radio :label="3">
                  <el-tooltip class="item" effect="dark" :content="businessTypeTip" placement="top">
                  <span>库存转化</span>
                  </el-tooltip>
                </el-radio>
                <el-radio :label="4">系统原因</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <div style="height: 13px;"></div>
        <!-- 第三行 -->
        <el-row :span="20" v-if="showAdjustInventoryType">
          <el-col :span="24">
            <el-form-item label="调整库存类型：" prop="adjustInventoryType" size="mini">
              <el-radio-group v-model="searchParams.adjustInventoryType" @change="chooseAdjustType">
                <el-radio :label="1">正品</el-radio>
                <el-radio :label="2">残品</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第五行 -->
        <el-row :span="20">
          <el-col :span="24">
            <el-form-item label="调整说明：" prop="adjustInstruction" size="mini">
              <el-input type="textarea" v-model.trim="searchParams.adjustInstruction" placeholder="" :maxlength="500"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card style="margin-top: 15px">
      <div slot="header" class="clearfix">
        <span>明细信息</span>
      </div>
        <el-button  type="primary" size="mini"  @click="addGoods"> + 添加商品<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-button type="primary" size="mini" :disabled="isChose" @click="importGood">导入商品</el-button>
        <el-button type="text" size="mini" @click="ExcelDownLoad">导入模板下载</el-button>
        <el-table class="price_list" :data="tableDataList" style="width: 100%;margin-top:15px;" border>
          <el-table-column type="index" label="序号" align="center"></el-table-column>
          <el-table-column v-if="searchParams.businessType == 3" prop="skuCode" label="SKU编号" align="center" width="230" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span align="center">原SKU&nbsp;&nbsp;&nbsp;</span><span class="targatSkuCode">{{scope.row.skuCode}}</span></div>
              <div class="oringinDiv"><span align="center">目标SKU</span><span class="targatSkuCode">{{scope.row.targetSkuCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="skuCode" label="SKU编号" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="searchParams.businessType == 3" prop="skuName" label="SKU名称" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.skuName}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetSkuName}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="skuName" label="SKU名称" align="center" :key="Math.random()"></el-table-column>

          <el-table-column v-if="searchParams.businessType == 3" prop="specNatureInfo" label="规格" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.specNatureInfo}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetSpecNatureInfo}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="specNatureInfo" label="规格" align="center" :key="Math.random()"></el-table-column>

          <el-table-column  v-if="searchParams.businessType == 3" prop="barCode" label="条形码" align="center" :key="Math.random()">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5"><span>{{scope.row.barCode}}</span></div>
              <div class="oringinDiv"><span>{{scope.row.targetBarCode}}</span></div>
            </template>
          </el-table-column>
          <el-table-column v-else prop="barCode" label="条形码" align="center" :key="Math.random()"></el-table-column>
          <el-table-column prop="adjustInventoryTypeDesc" label="调整库存类型" align="center"></el-table-column>
          <el-table-column v-if="searchParams.businessType == 3" prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <div class="oringinDiv" style="border-bottom: 1px solid #ebeef5">
                <span>减少</span>
                <el-input v-model.trim="scope.row.adjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
              </div>
              <div class="oringinDiv">
                <span>增加</span>
                <el-input v-model.trim="scope.row.targetAdjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column :render-header="renderHeader"  v-else-if="searchParams.businessType == 0 || searchParams.businessType == 4" prop="adjustNum" label="调整数量,（减少请输入负数）"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.adjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column v-else prop="adjustNum" label="调整数量"  align="center" :key="Math.random()" label-class-name="isadjuststyle">
            <template slot-scope="scope">
              <el-input v-model.trim="scope.row.adjustNum" :maxlength='10' placeholder="" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteBtn((addOrEditParams.pageNumber-1)*addOrEditParams.pageSize + scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

    </el-card>
    <!--添加商品非库存转化-->
    <el-dialog title="选择商品" :visible.sync="isGoodsOne" width="550px" :close-on-click-modal='false' :show-close='true'>
      <el-form :model="selectGoodsParams" :rules="rules" ref="selectGoodsParams" label-width="0" class="search_form" size="medium">
        <el-row :span="20">
          <el-col>
            <div style="margin-bottom: 5px;">请输入需要调整商品的SKU编号或条形码（多个请换行）：</div>
            <el-form-item label="" size="mini">
              <el-input type="textarea"  placeholder="" v-model.trim="selectGoodsParams.skuOrBarCode" @keydown.native="listenKeyDown($event)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="text-align: center;margin-top: 15px">
          <el-col>
            <el-button type="primary"  icon="circle-cross" size="mini" @click="funSetGoods">确定</el-button>
            <el-button  size="mini" type="primary" @click="isGoodsOne = false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!--添加商品库存转化-->
    <el-dialog title="选择商品" :visible.sync="isGoodsTwo" width="60%" :close-on-click-modal='false' :show-close='true'>
      <el-form>
        <el-row :span="24">
          <el-col :span="22">
            <p style="padding-left: 10px; margin-top: -10px;line-height: 40px">请输入原SKU和目标SKU的编号或条形码：</p>
            <el-table
              ref="multipleTable"
              :data="addTableDataList"
              highlight-current-row
              border
              tooltip-effect="dark"
            >
              <el-table-column
                type="index"
                label="序号"
                width="55"
                align="center"
              ></el-table-column>
              <el-table-column
                label="原SKU编号或条形码"
                prop="originalSkuOrBarCode"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.originalSkuOrBarCode"
                    placeholder=""
                    maxlength="30"
                    size='mini'
                    @change="checkValueName(scope.row.originalSkuOrBarCode)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="目标SKU编号或条形码"
                prop="targetSkuOrBarCode"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model.trim="scope.row.targetSkuOrBarCode"
                    placeholder=""
                    maxlength="30"
                    size='mini'
                    @change="checkValueName(scope.row.targetSkuOrBarCode)"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="deleteAddBtn(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="2">
            <el-button
              class="add-more-item"
              type="primary"
              size="mini"
              @click="toAddGoodsSku"
            > + </el-button>
          </el-col>
        </el-row>
        <el-row style="text-align: center;margin-top: 15px">
          <el-col>
            <el-button type="primary"  icon="circle-cross" size="mini" @click="funSetGoods">确定</el-button>
            <el-button  size="mini" type="primary" @click="isGoodsTwo = false">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!-- 导入采购商品弹窗 -->
    <el-dialog title="导入商品" :visible.sync="isShopGood" width="60%" :close-on-click-modal='false' :show-close='false' v-loading='loading'>
      <!-- /chain-web/order/orderImport -->
      <el-upload ref="uploadGood" v-show="isGoodResult === 'default'" :close-on-click-modal='false' class="upload-demo" :before-upload="beforeAvatarUpload" :on-error='uploadError' drag :data="goodsParams" action='/wms-web/stockAdjust/importSkuOrBarCode' :on-progress='uploadProgress' :on-success="uploadGoodSuccess" :on-preview="handlePreview" :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <div v-show="isGoodResult === 'success'" class="result">
        <span class="el-icon-circle-check-outline icon"></span>
        <p>导入成功</p>
      </div>
      <div v-show="isGoodResult === 'fail'" class="result">
        <span class="el-icon-circle-close-outline icon"></span>
        <p>{{errorMsg}}</p>
        <p>请点此
          <el-button type="text" @click="downloadFail(errorJson)" icon="circle-cross" :disabled="disabledDownLoad" style="color: red;">下载文件</el-button>
          ，修改后重新上传。
        </p>
      </div>
      <span slot="footer" class="dialog-footer" >
        <div style="text-align: center;">
          <el-button v-if="isGoodResult === 'default'" @click="closeGoodFile" size="mini" :disabled="isClick">关闭</el-button>
          <el-button v-else @click="closeGoodUpload" size="mini" :disabled="isClick">关闭</el-button>
        </div>
      </span>
    </el-dialog>

    <div class="btn_group">
      <el-button type="primary" size="mini"  @click="submitAuditBtn(1)" :disabled="isSubmit">提交审核</el-button>
      <el-button size="mini"  @click="submitAuditBtn(0)">保存</el-button>
      <el-button size="mini" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import qs from 'qs';
  export default {
    name: 'stockorderaddoredit',
    data() {
      return {
        id: '',
        isTip: true,
        isGoodsOne: false,
        isGoodsTwo: false,
        isTypeThree: false,
        warehouseType: 'MD', // 西安综管平台的门店仓
        code: '',
        businessTypeTip: '用于不同SKU间库存的转化，如：SKU1（一箱牛奶）1个库存转化成SKU2（一瓶牛奶）30个库存',
        addOrEditParams: {
          start: 0, // 默认参数
          pageSize: 10, // 默认10条
          pageNumber: 1, // 默认第一页
          totalCount: 0
        },
        isChose: true, // 选择商品可点击
        activeName: '1',
        isClick: false,
        disabledDownLoad: false,
        tableData: [],
        loading: false, // 上传loading
        outFile: '', // 导出文件el
        errorJson: [], // 错误的列表数据
        goodsParams: {}, // 导入商品时额外的参数
        fileId: '', // 要删除的文件id
        isSubmit: false, // 防止多次点击
        currentIndex: '', // 要删除的index
        fileDataList: [], // 上传文件列表
        uploadResult: {}, // 上传成功返回的响应数据
        errorMsg: '', // 错误信息
        isResult: 'default', // 默认显示导入文件
        isGoodResult: 'default', // 默认显示导入商品明细
        isAccount: false, // 导入报价
        isShopGood: false, // 导入商品明细
        logCount: 0, // 表单列表总条数
        dailogTableDataList: [], // 弹窗数据列表
        tableDataList: [], // 列表数据
        addTableDataList: [], // 添加商品列表数据
        warehouseList: [], // 调整仓库列表
        searchParams: {
          stockAdjustCode: '',
          businessType: '', // 库存调整业务类型
          adjustInventoryType: 1, // 库存调整库存类型
          docStatus: '', // 单据状态
          adjustInstruction: '' // 调整说明
        },
        selectGoodsParams: {
          adjustInventoryType: '',
          businessType: '',
          existStockAdjustSkuDetails: [],
          skuOrBarCode: '', // sku或者条形码
          originalTargetSkuOrBarCodeAOS: [{
            originalSkuOrBarCode: '', // 原来
            targetSkuOrBarCode: '' // 现在
          }] // 原商品目标商品sku编号或者条形码
        }, // 添加商品表单
        showAdjustInventoryType: false, // 是否要显示库存调整库存类型
        showAdjustInventoryObj: false, // 是否要显示库存调整对象
        isWarehouseTypeMd: false, // 调整仓库是否是西安综管门店
        rules: {
          businessType: [
            { required: true, message: '请选择调整业务类型', trigger: 'change' }
          ],
          adjustInventoryType: [
            { required: true, message: '请选择调整库存类型', trigger: 'change' }
          ]
        }
      };
    },
    watch: {
    },
    created() {
      // this.getWarehouseList();
      if (this.$route.params.id !== 'add') {
        this.id = this.$route.params.id;
        this.searchParams.id = this.$route.params.id;
        this.getSearchParams();
      } else {
        this.isChose = false;
        this.addTableRow();
      }
    },
    filters: {
      tofixed(val) {
        let num = val.toString();
        if (num.indexOf('.') > -1 && num.split('.')[1].length > 3) {
          num = Number(num).toFixed(3);
          return num;
        }
        return num;
      }
    },
    methods: {
      renderHeader(createElement, { column, _self }) { // 表头重置
        const label = column.label;
        const labelArr = label.split(',');
        return createElement(
          'span', [
            createElement('span', {
              attrs: { type: 'text' }
            }, [labelArr[0]]),
            createElement('p', {
              attrs: { type: 'text', style: 'color:#f00;line-height:20px;' }
            }, [labelArr[1] || ''] )
          ]
        );
      },
      // 模板的下载地址
      ExcelDownLoad() {
        if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
          this.$message({
            type: 'warning',
            message: '请选择业务类型！'
          });
          return;
        }
        window.open('/wms-web/stockAdjust/exportTemplate/' + this.searchParams.businessType);
      },
      changeSize(val) {
        this.addOrEditParams.start = 0;
        this.addOrEditParams.pageNumber = 1;
        this.addOrEditParams.pageSize = val;
      },
      changeNumber(val) {
        this.addOrEditParams.start = (val - 1) * this.addOrEditParams.pageSize;
        this.addOrEditParams.pageNumber = val;
      },
      toAddGoodsSku() {
        this.addTableDataList.push({
          originalSkuOrBarCode: '',
          targetSkuOrBarCode: ''
        });
      },
      downloadFail(errorJson) {
        this.disabledDownLoad = true;
        axios({
          // 用axios发送post请求
          method: 'post',
          url: '/wms-web/stockAdjust/stockAdjustErrorExport', // 请求地址
          data: {
            errorList: errorJson,
            businessType: this.searchParams.businessType
          },
          responseType: 'blob', // 表明返回服务器返回的数据类型
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          const blob = new Blob([res.data]); // new Blob([res])中不加data就会返回下图中[objece objece]内容（少取一层）
          const fileName = '库存调整单错误商品明细.xls'; // 下载文件名称
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          setTimeout(() => {
            this.disabledDownLoad = false;
           }, 2000);
        });
      },
      uploadFile(fileName) {
        this.GET('/qinniuPrivate/fileDownload', { fileName }).then(res => {
          console.log(res.result);
        // top.window.location.href = res.result;
        window.open(res.result);
      });
      },
      uploadError(err, file, fileList) {
        this.loading = false;
        console.log(err);
        let obj = err.toString().substr(err.toString().indexOf('{'));
        let objErr = JSON.parse(obj);
        this.$message({
          message: objErr.databuffer,
          type: 'error'
        });
        this.isShopGood = false;
      },
      // 文件上传之前
      beforeAvatarUpload(file) {
        const isExcel = file.type === 'application/vnd.ms-excel';
        const isLt10M = file.size / 1024 / 1024 <= 10;
        if (!isLt10M) {
          this.$message.error('上传文件大小不能超过 10MB!');
        }
        return isLt10M;
      },
      addTableRow() {
        this.fileDataList.push({});
      },
      // 导入模板
      importAccount(index) {
        this.isResult = 'default';
        this.uploadResult = {};
        if (this.$refs.upload) {
          this.$refs.upload.clearFiles();
        }
        this.isAccount = true;
        this.currentIndex = index;
        console.log(this.fileDataList[index].id);
        if (this.fileDataList[index].id) {
          this.fileId = this.fileDataList[index].id;
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      // 导入商品btn
      importGood() {
        if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
          this.$message({
            type: 'warning',
            message: '请选择业务类型！'
          });
          return;
        }
        if ((this.searchParams.businessType === 0 || this.searchParams.businessType === 4) && !this.searchParams.adjustInventoryType) {
          this.$message({
            type: 'warning',
            message: '请选择调整库存类型！'
          });
          return;
        }
        this.isGoodResult = 'default';
        this.uploadResult = {};
        if (this.$refs.uploadGood) {
          this.$refs.uploadGood.clearFiles();
        }
        let objParams = {
          businessType: this.searchParams.businessType,
          inventoryType: this.searchParams.adjustInventoryType,
          skuDetail: JSON.stringify(this.tableDataList)
        };
        this.goodsParams = objParams;
        this.isShopGood = true;
        this.isClick = false;
        console.log(this.goodsParams);
      },
      // 文件上传中
      uploadProgress(event, file, fileList) {
        this.loading = true;
      },
      // 商品上传成功
      uploadGoodSuccess(response, file, fileList) {
        this.loading = false;
        if (response.code === '200' && response.body.errorList.length === 0 ) {
          this.uploadResult = response.body;
          this.isGoodResult = 'success';
        } else if (response.code === '200' && response.body.errorList.length !== 0 ){
          this.disabledDownLoad = false;
          this.uploadResult = response.body;
          let successNum = (response.body && response.body.rightList) ? response.body.rightList.length : 0;
          let errorNum = (response.body && response.body.errorList.length) ? response.body.errorList.length : 0;
          this.errorMsg = `导入成功${successNum}条，导入失败${errorNum}条`;
          let errorList = response.body.errorList;
          this.errorJson = errorList;
          this.isGoodResult = 'fail';
        } else {
          this.$message({
            type: 'error',
            message: response.message
          });
        }
      },
      closeGoodUpload() {
        this.isClick = true;
        if (this.uploadResult.rightList && this.uploadResult.rightList.length) {
          this.tableDataList = [...this.tableDataList, ...this.uploadResult.rightList];
        }
        this.addOrEditParams.totalCount = this.tableDataList.length;
        this.isShopGood = false;
      },
      closeGoodFile() {
        this.isShopGood = false;
      },
      // 上传成功关闭
      closeUpload() {
        // this.initDataList();
        this.isAccount = false;
        if (this.fileId) {
          this.uploadResult.id = this.fileId;
        }
        this.fileDataList.splice(this.currentIndex, 1, this.uploadResult);
      },
      // 上传失败关闭
      closeFile() {
        this.isAccount = false;
      },
      // 搜索条件改变清空数据
      resetTableDataList(val) { // warehouseType
        if (val) {
          this.warehouseList.forEach( item => {
            if (item.code === val) {
              if (item.warehouseSourceType === this.warehouseType) {
                this.isWarehouseTypeMd = true; // 是西安总管门店
              } else {
                this.isWarehouseTypeMd = false;
              }
            }
          });
          if ([1, 2, 3].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd) {
            this.showAdjustInventoryObj = true; // 如果业务类型为库存转化正传残 残转载
          } else if ([0, 4].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd && this.searchParams.adjustInventoryType === 1) {
            this.showAdjustInventoryObj = true;
          } else {
            this.showAdjustInventoryObj = false;
          }
          this.tableDataList = [];
        }
      },
      // 获取信息
      getSearchParams() {
        this.GET('/stockAdjust/edit/' + this.id).then(res => {
          let resData = res.body;
          this.searchParams.stockAdjustCode = resData.stockAdjustCode;
          this.searchParams.businessType = resData.businessType;
          this.searchParams.adjustInventoryType = resData.adjustInventoryType;
          // this.searchParams.docStatus = resData.docStatus;
          this.searchParams.adjustInstruction = resData.adjustInstruction;
          this.tableDataList = resData.stockAdjustEditDetailsVOS;
          if (this.searchParams.businessType === 0 || this.searchParams.businessType === 4) {
            this.showAdjustInventoryType = true;
          } else {
            this.showAdjustInventoryType = false;
            this.searchParams.adjustInventoryType = '';
          }
          if (this.searchParams.businessType == 3) {
            this.isTypeThree = true; // 如果业务类型为库存转化则显示新sku转老sku的弹窗
          } else {
            this.isTypeThree = false;
          }
      }).finally(() => {
          setTimeout(() => {
          this.isChose = false;
        }, 2000);
      });
      },
      // 提交审核
      submitAudit(id, params) {
        this.isSubmit = true;
        this.POST('/stockAdjust/stockAdjustSave/' + id, params).then(res => {
          this.$message({
          type: 'success',
          message: res.body
        });
        setTimeout(() => {
          this.$router.push({ path: '/stockordermanage' });
          }, 20);
       }).finally(() => {
          this.isSubmit = false;
       });
      },
      // 直接提交审核,没有编辑
      submitAuditNoId(id, params) {
        this.POST('/stockAdjust/stockAdjustSave/' + id, params).then(res => {
          this.$message({
          type: 'success',
          message: res.body
        });
          setTimeout(() => {
            this.$router.push({ path: '/stockordermanage' });
            this.isSubmit = false;
          }, 20);
        }).finally(() => {
            this.isSubmit = false;
        });
      },
      // 仓库下拉列表
      getWarehouseList() {
        this.GET('/stockadjust/warehouseList').then(res => {
          this.warehouseList = res.result;
      });
      },
      // 多选选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 添加商品
      addGoods() {
        if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
          this.$message({
            type: 'warning',
            message: '请先选择业务类型！'
          });
          return;
        };
        if ((this.searchParams.businessType === 0 || this.searchParams.businessType === 4) && !this.searchParams.adjustInventoryType) {
          this.$message({
            type: 'warning',
            message: '请先选择库存调整类型！'
          });
          return;
        };
        if (this.isTypeThree) {
          this.isGoodsTwo = true;
        } else {
          this.isGoodsOne = true;
        }
        this.addTableDataList = [];
        this.selectGoodsParams.skuOrBarCode = '';
        this.selectGoodsParams.originalTargetSkuOrBarCodeAOS = [{
          originalSkuOrBarCode: '', // 原来
          targetSkuOrBarCode: '' // 现在
        }];
      },
      // 根据sku或者条形码添加商品或者老sku替换新的sku
      funSetGoods() {
        let isNumber = '';
        let isOrigin = false;
        let isTarget = false;
        let isTrue = false;
        this.addTableDataList.forEach((item, i) => {
          if (!item.originalSkuOrBarCode && !isNumber) {
            isNumber = i + 1;
            isOrigin = true;
          }
          if (!item.targetSkuOrBarCode && !isNumber) {
            isNumber = i + 1;
            isTarget = true;
          }
          if ((item.originalSkuOrBarCode == item.targetSkuOrBarCode) && !isNumber) {
            isNumber = i + 1;
            isTrue = true;
          }
        })
        if (isOrigin) {
          this.$message({
            type: 'warning',
            message: `序号为${isNumber}的原SKU的编号或条形码不能为空！`
          });
          return;
        }
        if (isTarget) {
          this.$message({
            type: 'warning',
            message: `序号为${isNumber}的目标SKU的编号或条形码不能为空！`
          });
          return;
        }
        if (isTrue) {
          this.$message({
            type: 'warning',
            message: `序号为${isNumber}的SKU的编号和条形码不能是同一个商品！`
          });
          return;
        }
        this.selectGoodsParams.businessType = this.searchParams.businessType;
        this.selectGoodsParams.adjustInventoryType = this.searchParams.adjustInventoryType;
        this.selectGoodsParams.originalTargetSkuOrBarCodeAOS = this.addTableDataList;
        this.selectGoodsParams.existStockAdjustSkuDetails = this.tableDataList;
        this.POST('/stockAdjust/checkSkuOrBarCode', this.selectGoodsParams ).then(res => {
          this.$message({
            type: 'success',
            message: '添加商品成功！'
          });
          this.isGoodsOne = false;
          this.isGoodsTwo = false;
          this.tableDataList = res.body;
        });
      },
      // 页码条数改变
      logChangeSize(val) {
        this.form.start = 0;
        this.form.pageNumber = 1;
        this.form.pageSize = val;
      },
      // 当前页码改变
      logChangeNumber(val) {
        this.form.pageNumber = val;
        this.form.start = (val - 1) * this.form.pageSize;
      },
      makeSure(id, params) {
        this.$confirm('确认提交审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.searchParams.id) {
            console.log(params);
            this.submitAudit(id, params);
          } else {
            this.submitAuditNoId(id, params);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消!'
          });
        });
      },
      // 提交审核按钮以及保存
      submitAuditBtn(id) {
        // 格式校验
        let isAdjustNum = false;
        let isBoxInt = false;
        let isBoxMoreInt = false;
        let isSkuCode = '';
        let isZero = false;
        let isIntReg = /^[0-9]+$/; // 正整数
        let isIntMoreReg = /^-?[1-9]\d*$/; // 正负整数
        if ([0, 1, 2, 3, 4].indexOf(this.searchParams.businessType) === -1) {
          this.$message({
            message: '请先选择业务类型!',
            type: 'warning'
          });
          return;
        }
        if ((this.searchParams.businessType === 0 || this.searchParams.businessType === 4) && !this.searchParams.adjustInventoryType) {
          this.$message({
            message: '请先选择库存类型!',
            type: 'warning'
          });
          return;
        }
        this.tableDataList.forEach(item => {
          if ( (item.adjustNum == '0') && !isSkuCode) {
            isSkuCode = item.skuCode;
            isZero = true;
          }
          if (item.targetAdjustNum == '0' && (this.searchParams.businessType === 3) && !isSkuCode) {
            isSkuCode = item.targetSkuCode;
            isZero = true;
          }
          if (!item.adjustNum  && !isSkuCode && id) {
            isSkuCode = item.skuCode;
            isAdjustNum = true;
          }
          if (!item.targetAdjustNum && (this.searchParams.businessType === 3) && !isSkuCode && id) {
            isSkuCode = item.targetSkuCode;
            isAdjustNum = true;
          }

          if (item.adjustNum && !isIntReg.test(item.adjustNum) && ([1, 2, 3].indexOf(this.searchParams.businessType) !== -1) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isBoxInt = true;
          }
          if (item.targetAdjustNum && !isIntReg.test(item.targetAdjustNum)  && (this.searchParams.businessType === 3) && !isSkuCode) {
            isSkuCode = item.targetSkuCode;
            isBoxInt = true;
          }
          if (item.adjustNum && !isIntMoreReg.test(item.adjustNum) && ([0, 4].indexOf(this.searchParams.businessType) !== -1) && !isSkuCode) {
            isSkuCode = item.skuCode;
            isBoxMoreInt = true;
          }
        });
        if (isAdjustNum && id) {
          this.$message({
            message: `sku编号为${isSkuCode}的调整数量不能为空！`,
            type: 'warning'
          });
          return;
        }
        if (isZero && id) {
          this.$message({
            message: `sku编号为${isSkuCode}的调整数量不能为0！`,
            type: 'warning'
          });
          return;
        }
        if (isBoxInt) {
          this.$message({
            message: `sku编号为${isSkuCode}的调整数量只能为正整数！`,
            type: 'warning'
          });
          return;
        }
        if (isBoxMoreInt) {
          this.$message({
            message: `sku编号为${isSkuCode}的调整数量只能为整数！`,
            type: 'warning'
          });
          return;
        }
        let params = {};
        params.stockAdjustSaveSkuDetailAOList = JSON.parse(JSON.stringify(this.tableDataList));
        params.id = this.searchParams.id;
        params.businessType = this.searchParams.businessType;
        params.adjustInventoryType = this.searchParams.adjustInventoryType;
        params.adjustInstruction = this.searchParams.adjustInstruction;
        if (id) {
          this.makeSure(id, params);
        } else {
          if (this.searchParams.id) {
            console.log(params);
            this.submitAudit(id, params);
          } else {
            this.submitAuditNoId(id, params);
          }
        }
      },
      deleteBtn(i) {
        this.tableDataList.splice(i, 1);
        this.addOrEditParams.totalCount = this.tableDataList.length;
      },
      deleteAddBtn(i) {
        this.addTableDataList.splice(i, 1);
      },
      deleteUpload(id, index) {
        if (id) {
          this.DELETE('/qinniuPrivate/uploadFile/', id).then(res => {
            this.$message({
            type: 'success',
            message: res.body
          });
          if (this.searchParams.purchaseOrderCode) {
          }
        });
        } else {
          this.fileDataList.splice(index, 1);
          this.addTableRow();
        }
      },
      // 返回按钮
      back() {
        this.$router.push({ path: '/stockordermanage' });
      },
      listenKeyDown(e) { // 回车事件监听
        if (e.keyCode === 13) {
          e.preventDefault();
          this.selectGoodsParams.skuOrBarCode = this.selectGoodsParams.skuOrBarCode + '\n';
        }
      },
      // 检查是否选中调整仓库
      preCheck() {
          if (this.searchParams.businessType === 0 || this.searchParams.businessType === 4) {
            this.showAdjustInventoryType = true;
            this.searchParams.adjustInventoryType = 1;
          } else {
            this.showAdjustInventoryType = false;
            this.searchParams.adjustInventoryType = '';
          }
          if (this.searchParams.businessType === 3) {
            this.isTypeThree = true; // 如果业务类型为库存转化则显示新sku转老sku的弹窗
          } else {
            this.isTypeThree = false;
          }
          if ([1, 2, 3].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd) {
            this.showAdjustInventoryObj = true; // 如果业务类型为库存转化正传残 残转载
          } else if ([0, 4].indexOf(this.searchParams.businessType) !== -1 && this.isWarehouseTypeMd && this.searchParams.adjustInventoryType === 1) {
            this.showAdjustInventoryObj = true;
          } else {
            this.showAdjustInventoryObj = false;
          }
          this.tableDataList = [];
      },
      chooseAdjustType() { // 检查是否选中正品
        if (this.searchParams.adjustInventoryType === 1 && this.isWarehouseTypeMd) {
          this.showAdjustInventoryObj = true;
        } else {
          this.showAdjustInventoryObj = false;
        }
        this.tableDataList = [];
      },
      checkValueName() { // 检查skucode等是否正确

      }
    }
  };
</script>
<style lang="stylus" scoped>
  .stockorderaddoredit
    .oringinDiv
      span
        padding:2px 8px;
      .targatSkuCode
        display:inline-block;
        border-left: 1px solid #ebeef5;
        width: 150px;
        text-align: center;
      .el-input
        width: 50%
    .add-more-item
      margin-top: 30px;
      margin-left: 5px;
    .btn_group
      margin-top: 15px;
      text-align: center;
      margin-bottom: 15px;
    .result
      text-align: center
      .icon
        font-size: 80px
      p
        line-height: 40px
    .upload-demo
      text-align: center
    .btn
      color: blue
      cursor: pointer
</style>
<style lang="stylus">
  .stockorderaddoredit
    .el-dialog__body
      padding 10px
</style>

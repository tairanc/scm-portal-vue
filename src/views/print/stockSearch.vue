<template>
  <div id="printBuyIn">
    <!-- from表单 -->
    <el-form label-width="125px" :model="params" size="medium" class="demo-form-inline">
      <el-row :span="24">
        <el-col :span="6">
          <el-form-item label="SKU编码：" size="mini">
            <el-input v-model="params.skuCode" placeholder="sku编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SPU编码：" size="mini">
            <el-input v-model="params.spuCode" placeholder="SPU编码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SKU名称：" size="mini">
            <el-input v-model="params.skuName" placeholder="SKU名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="条形码：" size="mini">
            <el-input v-model="params.barCode" placeholder="条形码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="height: 13px;"></div>
      <el-row :span="20">
        <el-col :span="6">
          <!-- <el-form-item label="所属类目：" size="mini">
            <el-cascader clearable v-model="defaultSelected" @change="categoryChange" placeholder="试试搜索：衣服" :options="categoryOption" filterable change-on-select></el-cascader>
          </el-form-item> -->
          <el-form-item label="所属类目：" size="mini">
            <el-col :span="8">
              <el-select v-model="params.firstCategoryId" filterable placeholder="请选择" @change="firstCateChange">
                <el-option v-for="item in firstCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="params.secondCategoryId" :disabled="isFirstLevel" @change="secondCateChange" filterable placeholder="请选择">
                <el-option v-for="item in secondCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-select v-model="params.thirdCategoryId" :disabled="isSecondLevel"  @change="thirdCateChange"  filterable placeholder="请选择">
                <el-option v-for="item in thirdCateList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌：" size="mini">
            <el-select clearable @change="brandChange" v-model="params.brandId" filterable placeholder="请选择">
              <el-option v-for="(item, index) in brandOption.data" :key="index" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" prop="purchaseName" size="mini">
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="" size="mini">
            <el-button @click="search" type="primary" icon="search">查询</el-button>
            <el-button @click="resetForm" type="default" icon="circle-cross">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div style="height: 6px;"></div>
    </el-form>
    <!-- from表单结束 -->
    <div style="display:flex;justify-content:space-between;">
      <div>
        <el-button :disabled="tableList.length < 1" @click="exportExcel" type="primary" size="mini">导出</el-button>
      </div>
      <div>
        <!-- <el-pagination @size-change="handleSizeChange" @current-change="currentChange" :current-page="params.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="recordTotal">
        </el-pagination> -->
        <el-pagination @size-change="changeSize" @current-change="changeNumber" :current-page="params.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
      </div>
    </div>

    <el-table ref="tableRow" highlight-current-row @row-click="cellClick" :data="tableList" height="400" border style="width: 100%">
      <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
      <el-table-column align="center" prop="skuCode" label="SKU编号" :show-overflow-tooltip='true'> </el-table-column>
      <el-table-column align="center" prop="skuName" label="SKU名称" :show-overflow-tooltip='true'> </el-table-column>
      <el-table-column align="center" prop="spuCode" label="SPU编码" :show-overflow-tooltip='true'> </el-table-column>
      <el-table-column align="center" prop="specNatureInfo" label="规格" :show-overflow-tooltip='true'> </el-table-column>
      <el-table-column align="center" prop="barCode" label="条形码" :show-overflow-tooltip='true'> </el-table-column>
      <el-table-column align="center" prop="categoryName" :show-overflow-tooltip='true' label="所属类目"> </el-table-column>
      <el-table-column align="center" prop="brandName" label="品牌" :show-overflow-tooltip='true'> </el-table-column>
      <el-table-column align="center" prop="realInventory" label="正品_真实总库存">
        <template slot-scope="scope">
          <div v-if="scope.row.realInventory === null || scope.row.realInventory === ''" >-</div>
          <div v-else style="cursor: pointer;color: blue" @click="showRelDetail(scope.row)">{{scope.row.realInventory}}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="lockInventoryAll" label="正品_锁定库存"> </el-table-column>
      <el-table-column align="center" prop="availableInventory" label="正品_可用库存"> </el-table-column>
      <el-table-column align="center" prop="onWayInventory" label="正品_在途库存"> </el-table-column>
      <el-table-column v-if="type.operationalNature == 1 && type.operationalType == 2" align="center" prop="chipInventory" label="已绑芯片库存"> </el-table-column>
      <el-table-column align="center" prop="" label="库存详情" :show-overflow-tooltip='true'>
        <template slot-scope="scope">
          <el-button @click="dialogChange" type="text" size="mini">库存详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="库存详情" :visible.sync="dialog.flag" width="80%">
      <div v-for="(data, index) in dialog.table" :key="index">
        <span style="padding-right:40px;">SKU编号：{{ data.skuCode  }}</span><span>SKU名称：{{ data.skuName }}</span>
      </div>
      <div class="wrap">
        <div class="title">库存类型：正品</div>
        <el-table highlight-current-row border :data="dialog.table">
          <el-table-column align="center" property="realInventory" label="真实总库存" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.realInventory === null || scope.row.realInventory === ''" >-</div>
              <div v-else style="cursor: pointer;color: blue" @click="showRelDetail(scope.row)">{{scope.row.realInventory}}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" property="lockInventory" label="销售锁定库存" width="200"></el-table-column>
          <el-table-column align="center" property="lockAllocateInventory" label="调拨锁定库存"></el-table-column>
          <el-table-column align="center" property="lockQualityReturnsNum" label="退货锁定库存"></el-table-column>
          <el-table-column align="center" property="lockQualityOtherInventory" label="其他锁定库存"></el-table-column>
          <el-table-column align="center" property="availableInventory" label="可用库存"></el-table-column>
          <el-table-column align="center" property="chipInventory" label="已绑芯片库存"></el-table-column>
          <el-table-column align="center" property="onWayInventory" label="在途库存"></el-table-column>
        </el-table>
      </div>
      <div class="wrap">
        <div class="title">库存类型：残品</div>
        <el-table highlight-current-row border :data="dialog.table">
          <el-table-column align="center" property="realDefectiveInventory" label="真实总库存" width="150"></el-table-column>
          <el-table-column align="center" property="lockAllocateDefectiveInventory" label="调拨锁定库存"></el-table-column>
          <el-table-column align="center" property="lockDefectiveReturnsNum" label="退货锁定库存"></el-table-column>
          <el-table-column align="center" property="lockDefectiveOtherInventory" label="其他锁定库存"></el-table-column>
          <el-table-column align="center" property="availableDefectiveInventory" label="可用库存"></el-table-column>
          <el-table-column align="center" property="defectiveOnWayInventory" label="在途库存"></el-table-column>
        </el-table>
      </div>
      <div class="btn">
        <el-button @click="dialogChange" type="primary" size="mini">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleDetail" :visible.sync="isDetailShow" width="80%">
      <el-form label-width="125px" :model="detailParams" size="medium" class="demo-form-inline">
        <el-row :span="24">
          <el-col :span="6">
            <el-form-item label="出入库单据编号：" size="mini">
              <el-input v-model="detailParams.documentNo" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="来源单据编号：" size="mini">
              <el-input v-model="detailParams.sourceDocumentNo" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="库存变动日期：" size="mini">
              <el-col :span="11">
                <el-form-item size="mini">
                  <el-date-picker v-model="detailParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item size="mini">
                  <el-date-picker v-model="detailParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="" size="mini">
              <el-button type="primary" icon="search" @click="searchDetailList">查询</el-button>
              <el-button type="default" icon="circle-cross" @click="resetDetailList">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableRelList" border height="454">
        <el-table-column align="center" type="index" label="序号" width="50"> </el-table-column>
        <el-table-column align="center" prop="stockType" label="库存变动类型" :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            {{checkedType(scope.row.stockType)}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="documentNo" label="出入库单据编号" :show-overflow-tooltip='true'> </el-table-column>
        <el-table-column align="center" prop="sourceDocumentNo" label="来源单据编号" :show-overflow-tooltip='true'> </el-table-column>
        <el-table-column align="center" prop="quantity" label="库存变动数量" :show-overflow-tooltip='true'>
          <template slot-scope="scope">
            {{scope.row.status === 'I' ? '+' : '-' }}{{scope.row.quantity}}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="stockQuantity" label="变动后库存值" :show-overflow-tooltip='true'> </el-table-column>
        <el-table-column align="center" prop="createTime" label="库存变动时间" :show-overflow-tooltip='true'> </el-table-column>
      </el-table>
      <div style="height: 32px; text-align: right;">
        <el-pagination @size-change="handleDetailSizeChange" @current-change="currentDetailChange" :current-page="detailParams.pageNumber" :page-sizes="[5, 10, 20, 50, 100]" :page-size="detailParams.size" layout="total, sizes, prev, pager, next, jumper" :total="detailTotal">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button @click="isDetailShow = false" type="primary" size="mini">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'stockSearch',
  data() {
    return {
      detailTotal: 0, // 库存明细条数
      isDetailShow: false, // 库存明细弹窗
      tableRelList: [], // 库存明细列表
      titleDetail: '', // 库存明细列表title
      detailParams: {
        documentNo: '', // 单据编号
        sourceDocumentNo: '',  // 来源单据编号
        startDate: '', // 起始日期
        endDate: '', // 结束日期
        skuCode: '',
        pageNumber: 1,
        pageSize: 10
      }, // 库存明细列表搜索条件
      firstCateList: [], // 类目一级列表
      secondCateList: [], // 类目二级列表
      thirdCateList: [], // 类目三级列表
      isFirstLevel: true, // 关联二级菜单
      isSecondLevel: true, // 关联三级菜单
      params: {
        //表单参数
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        skuCode: '',
        spuCode: '',
        skuName: '',
        barCode: '',
        categoryId: '',
        categoryLevel: '',
        brandId: '',
        pageNumber: 1,
        pageSize: 10
      },
      totalCount: 0,
      tableList: [],
      categoryOption: [],
      defaultSelected: [],
      brandOption: {
        data: [],
        value: ''
      },
      dialog: {
        //详情的数据
        table: [],
        flag: false
      },
      type: {
          operationalNature: '',
          operationalType:''
      }
    };
  },
  methods: {
    //获取全部类目事件
    initCateData(val) {
        return this.GET('/category/tree',val)
    },
    // 获取明细
    getRelDetailList() {
      this.GET('/stock/getDetalPage', this.detailParams).then(res => {
        console.log(res);
        if (res.code === '200') {
          this.tableRelList = res.body.objects || [];
          this.detailTotal = res.body.recordTotal || 0;
        }
      });
    },
    // 搜索按钮
    searchDetailList() {
      if (
        new Date(this.detailParams.startDate).getTime() >
        new Date(this.detailParams.endDate).getTime()
      ) {
        this.$message({
          message: '开始日期不得大于结束日期',
          type: 'warning'
        });
        return;
      }
      this.detailParams.pageSize = 10;
      this.detailParams.pageNumber = 1;
      this.getRelDetailList();
    },
    // 重置detailList
    resetDetailList() {
      this.detailParams = {
        documentNo: '', // 单据编号
        sourceDocumentNo: '',  // 来源单据编号
        startDate: '', // 起始日期
        endDate: '', // 结束日期
        skuCode: this.detailParams.skuCode,
        pageNumber: 1,
        pageSize: 10
      };
      this.getRelDetailList();
    },
    //选择一级类目事件
    firstCateChange(val, row) {
       this.params.categoryId = val
       this.params.categoryLevel = 1
       this.initCateData({parentId: val,isRecursive: false}).then( res => {
         this.params.secondCategoryId = ''
         this.params.thirdCategoryId = ''
         this.secondCateList = res.body
         this.isFirstLevel = false
       })
    },
    //选择二级类目事件
    secondCateChange(val) {
        this.params.categoryId = val
        this.params.categoryLevel = 2
        this.initCateData({parentId: val,isRecursive: false}).then( res => {
          this.params.thirdCategoryId = ''
          this.thirdCateList = res.body
          this.isSecondLevel = false
        })
    },
    /** @param 选择类目三级事件
     */
    thirdCateChange(val){
      this.params.categoryLevel = 3
      this.params.categoryId = val
    },
    // 详情数据初始化
    cellClick(row, column, cell, event) {
      this.dialog.table = [];
      this.dialog.table.push(row);
    },
    dialogChange() {
      this.$nextTick(() => {
        this.dialog.flag = !this.dialog.flag;
      });
    },
    brandChange(value) {
      this.params.brandId = value;
    },
    categoryChange(id) {
      this.params.categoryId = id[id.length - 1];
      this.params.categoryLevel = id.length;
    },
    // 转换类型
    checkedType(type) {
      let typeStr = '';
      if (type === '1') {
        typeStr = '门店订单出库';
      } else if (type === '2') {
        typeStr = '非门店订单出库';
      } else if (type === '3') {
        typeStr = '销售订单出库';
      } else if (type === '4') {
        typeStr = '调拨出库';
      } else if (type === '5') {
        typeStr = '采购入库';
      } else if (type === '6') {
        typeStr = '调拨入库';
      } else if(type === '7'){
         typeStr = '退货入库'
      } else if(type === '8'){
         typeStr = '盘盈入库'
      } else if(type === '9'){
         typeStr = '退货出库'
      } else if(type === '10'){
         typeStr = '盘亏出库'
      } else if(type === '11'){
         typeStr = '其他入库'
      } else if(type === '12'){
         typeStr = '其他出库'
      } else if(type === '13'){
         typeStr = '调整出库'
      } else if(type === '14'){
         typeStr = '调整入库'
      }
      return typeStr;
    },
    // 页码条数改变
    changeSize(val) {
      this.params.pageNumber = 1;
      this.params.pageSize = val;
      this.needTableData();
    },
    // 当前页码改变
    changeNumber(val) {
      this.params.pageNumber = val;
      this.needTableData();
    },
    // handleSizeChange(size) {
    //   //显示条数事件
    //   this.params.pageSize = size;
    //   this.needTableData(this.params);
    // },
    // currentChange(current) {
    //   //点击页数事件
    //   this.params.pageNumber = current;
    //   this.needTableData(this.params);
    // },
    // 点击正品真实库存显示弹窗
    showRelDetail(row) {
      this.isDetailShow = true;
      this.detailParams = {
        documentNo: '', // 单据编号
        sourceDocumentNo: '',  // 来源单据编号
        startDate: '', // 起始日期
        endDate: '', // 结束日期
        skuCode: '',
        pageNumber: 1,
        pageSize: 10
      };
      this.detailParams.skuCode = row.skuCode;
      this.titleDetail = '商品【'+ row.skuCode +'】“正品_真实总库存”的库存变动明细'
      this.getRelDetailList();
    },
    handleDetailSizeChange(size) {
      //显示条数事件
      this.detailParams.pageSize = size;
      this.detailParams.pageNumber = 1;
      this.getRelDetailList(this.params);
    },
    currentDetailChange(current) {
      //点击页数事件
      this.detailParams.pageNumber = current;
      this.getRelDetailList(this.params);
    },
    search() {
      this.params.pageNumber = 1
      this.needTableData();
    },
    resetForm() {
      //初始化表单然后再请求接口
      this.params = {
        //表单参数
        firstCategoryId: '',
        secondCategoryId: '',
        thirdCategoryId: '',
        skuCode: '',
        spuCode: '',
        skuName: '',
        barCode: '',
        categoryId: '',
        categoryLevel: '',
        brandId: '',
        pageNumber: 1,
        pageSize: 10
      }
      this.isFirstLevel = true;
      this.isSecondLevel = true;
      this.needTableData();
    },
    needCategoryData(val) {
      //获取类目列表
      let data = val || {
        parentId: '',
        isRecursive: false
      };
      this.GET('/category/tree', data).then(res => {
        let arr = res.body;
        let arr1 = arr.map((item, index, now) => {
          return {
            value: item.id,
            label: item.name,
            children: item.children
              ? item.children.map((item1, index1, now1) => {
                  return {
                    value: item.id,
                    label: item.name,
                    children: item1.children
                      ? item1.children.map((item2, index2, now2) => {
                          return {
                            value: item.id,
                            label: item.name
                          };
                        })
                      : ''
                  };
                })
              : ''
          };
        });

        this.categoryOption = arr1;
      });
    },
    needBrandData() {
      //获取品牌列表
      this.GET('/brand/brands').then(res => {
        this.brandOption.data = res.body;
        // this.brandOption.data.unshift({ name: '全部', id: '' });
      });
    },
    needTableData() {
      //获取列表数据
      this.GET('/wmsItemInfo/wmsItemInfoPage', this.params).then(res => {
        this.tableList = res.body.objects;
        this.totalCount = res.body.recordTotal;
        if (this.tableList.length) {
          setTimeout(() => {
            this.$refs.tableRow.setCurrentRow(this.tableList[0]);
          }, 20);
        }
      });
    },
    exportExcel() {
      //导出列表
      let data = {
        skuCode: this.params.skuCode,
        spuCode: this.params.spuCode,
        skuName: this.params.skuName,
        barCode: this.params.barCode,
        categoryId: this.params.categoryId,
        categoryLevel: this.params.categoryLevel,
        brandId: this.params.brandId
      };

      let url = `/wms-web/wmsItemInfo/export?skuCode=${
        this.params.skuCode
      }&spuCode=${this.params.spuCode}&skuName=${this.params.skuName}&barCode${
        this.params.barCode
      }&categoryId=${this.params.categoryId}&categoryLevel=${
        this.params.categoryLevel
      }&brandId=${this.params.brandId}`;
      window.open(url);
    }
  },
  created: function() {
    this.needTableData();
    this.needCategoryData();
    this.needBrandData();
    this.initCateData({parentId: '',isRecursive: false}).then( res => {
      this.firstCateList = res.body
    })

    let arr = JSON.parse(localStorage.warehouse)
    let code = localStorage.code

    arr.map((item, index) => {
        if(code == item.code){
            this.type.operationalNature = item.operationalNature
            this.type.operationalType = item.operationalType
        }
    })
    console.log(this.type)
  }
};
</script>

<style lang="less" scoped>
.el-select .el-input {
  input {
    width: 130px;
  }
}
.wrap {
  padding-top: 20px;
  .title {
    background-color: #f5f7fa;
    padding: 10px 10px;
  }
}
.btn {
  text-align: center;
  padding-top: 20px;
}
</style>


<template>
    <div class="otherOutbound">
        <div v-show="!isListShow">
            <el-form label-width="125px" size="mini">
                <el-row :span="24">
                    <el-col :span="6">
                        <el-form-item label="其他出库单编号：">
                            <el-input v-model="searchParams.outInNoticeCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出库单联系人：">
                            <el-input v-model="searchParams.outInContact"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="出库单状态：">
                            <el-select v-model="searchParams.status"  filterable placeholder="请选择">
                                <el-option
                                    v-for="item in outBoundOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="系统接收时间：" size="mini">
                            <el-col :span="11">
                                <el-date-picker v-model="searchParams.startDate"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-col>
                            <el-col style="text-align: center" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-date-picker v-model="searchParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="6">&nbsp;</el-col>
                    <el-col :span="6">&nbsp;</el-col>
                    <el-col :span="6">&nbsp;</el-col>
                    <el-col style="margin:20px 0" :span="6">
                        <el-form-item>
                            <el-button size="mini" @click="search" type="primary">搜索</el-button>
                            <el-button size="mini" @click="resetFrom" type="">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button style="margin-bottom:10px" @click="printBtn" size="mini">打印拣货单</el-button>
            <div class="table_data" >
                <el-table  :height="440" highlight-current-row @select="selectAll" @select-all="selectAll" @row-click="rowClick" ref="tableMain" border style="min-height:300px;width:100%;" :data="tableData">
                    <el-table-column :selectable="checkSelectable" align="center" type="selection" width="50"> </el-table-column>
                    <el-table-column label="序号" align="center"  type="index"  width="50"> </el-table-column>
                    <el-table-column prop="outInNoticeCode" align="center" label="其他出库单编号"   > </el-table-column>
                    <el-table-column prop="outInContact" align="center" label="出库单联系人"  > </el-table-column>
                    <el-table-column prop="outInMobile" align="center" label="联系人手机号"    > </el-table-column>
                    <el-table-column prop="outInCause" align="center" label="出库原因"    > </el-table-column>
                    <el-table-column prop="" align="center" label="出库状态"    >
                        <template slot-scope="scope">
                            <span v-show="scope.row.status == 0">待出库</span>
                            <span v-show="scope.row.status == 1">出库完成</span>
                            <span v-show="scope.row.status == 2">已取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="系统接收时间"    >
                        <template slot-scope="scope">
                            {{ new Date().formatDate(scope.row.createTime,'yyyy-MM-dd hh:mm:ss') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="" align="center" label="操作"    >
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status == 0" @click="toOutResult(scope.row)" type="text">出库结果录入</el-button>
                            <el-button v-else  type="text">-</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="width:100%;overflow: hidden;">
                <el-pagination style="text-align:right; padding:20px 0;"
                    @size-change="changeSize" @current-change="changeNumber"
                    :current-page="searchParams.pageNumber"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="searchParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchParams.recordTotal"
                >
                </el-pagination>
            </div>
            <div class="table_detail">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="商品明细" name="first">
                        <el-table style="width:100%;" border :data="detailList">
                            <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
                            <el-table-column prop="skuName" align="center" label="SKU名称"   :show-overflow-tooltip='true'> </el-table-column>
                            <el-table-column prop="skuCode" align="center" label="SKU编号"  :show-overflow-tooltip='true'> </el-table-column>
                            <el-table-column prop="specNatureInfo" align="center" label="规格"   :show-overflow-tooltip='true' > </el-table-column>
                            <el-table-column prop="barCode" align="center" label="条形码"    > </el-table-column>
                            <el-table-column prop="" align="center" label="库存类型"    >
                                <template slot-scope="scope">
                                    <span v-show="scope.row.inventoryType == 1">正品</span>
                                    <span v-show="scope.row.inventoryType == 2">残品</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="planOutInNum" align="center" label="计划出库数量"    > </el-table-column>
                            <el-table-column prop="realOutInNum" align="center" label="实际出库数量"    > </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <el-col class='paging'>
                          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNumber" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
                          </el-pagination>
                        </el-col>
                    </el-tab-pane>
                    <el-tab-pane label="其他信息" name="second">
                        <el-form  label-width="100px" size="mini">
                            <el-form-item label="出库原因：">
                                {{ detailRemark.outInCause }}
                            </el-form-item>
                            <el-form-item label="备注：">
                                {{ detailRemark.remark }}
                            </el-form-item>
                            <el-form-item label="出库备注：">
                                {{ detailRemark.outRemark }}
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="操作日志" name="third">
                        <operate-table :url="'/wmsLogInformation/wmsLogInformationPage'" :isRefresh="isRefresh"  v-if="entityId" :entityId='entityId' :params="operateParams"></operate-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <!-- 打印显示的div -->
        <div class="print_screen" v-for="(data, index) in printData" :key="index" v-show="isListShow">
            <h3 class="page_break">其他出库拣货单</h3>
            <section>
                <p>
                    <span class="title">出库单编号:</span>
                    <span class="desc">{{ data.outInNoticeCode }}</span>
                </p>
                <p></p>
                <p></p>
            </section>
            <section>
                <p>
                    <span class="title">商品总数量：</span>
                    <span class="desc">{{ data.totalNum }}</span>
                </p>
                <p>
                    <span class="title">出库单联系人：</span>
                    <span class="desc">{{ data.outInContact }}</span>
                </p>
                <p>
                    <span class="title">联系人手机号：</span>
                    <span class="desc">{{ data.outInMobile }}</span>
                </p>
                <!-- <p></p> -->
            </section>
            <p class="name">商品明细</p>
            <div class="table_list">
                <el-table highlight-current-row :data="data.otherReturnOutDetailList" style="width: 100%; border: solid 1px #ccc;" border>
                <el-table-column align="center" type="index" label="序号">
                </el-table-column>
                <el-table-column prop="skuCode" label="SKU编号" align="center">
                </el-table-column>
                <el-table-column prop="skuName" label="SKU名称" align="center">
                </el-table-column>
                <el-table-column prop="barCode" label="条形码" align="center">
                </el-table-column>
                <el-table-column prop="specNatureInfo" label="规格" align="center">
                </el-table-column>
                <el-table-column prop="returnNum" label="库存类型" align="center">
                    <template slot-scope="scope">
                        <span v-show="scope.row.inventoryType == 1">正品</span>
                        <span v-show="scope.row.inventoryType == 2">残品</span>
                    </template>
                </el-table-column>
                <el-table-column prop="planOutInNum" label="计划出库数量" align="center">
                </el-table-column>
                <el-table-column prop="" label="拣货情况" align="center">

                </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import operateTable from '@/components/operateTable';
import axios from 'axios';
export default {
    name:'otherOutbound',
    data() {
        return{
            detailList: [], // 明细列表
            detailCount: 0, // 明细分页总条数
            detailParams: { // 明细分页参数
              pageNumber: 1,
              pageSize: 10,
              outInNoticeCode: ''
            },
            active:'',
            activeName: 'first',
            isListShow: false,
            searchParams: {
                outInNoticeCode:'',
                outInContact:'',
                warehouseCode: window.localStorage.code,
                status:'',
                startDate:'',
                endDate: '',
                pageNumber:1,
                pageSize: 10,
                recordTotal:0
            },
            isRefresh: 0, //是否刷新日志
            entityId: '', // 主键id
            operateParams: {   // 操作日志所需参数
                entityId: '',
                entityType: 'WmsOtherReturnOut'
            },
            tableData:[],
            detailData: [],
            detailRemark:{
                outInCause: '',
                outRemark: '',
                remark: ''
            },
            printData: [],
            outBoundOptions:[{
                label:'全部',
                value:''
            },{
                label:'待出库',
                value:'0'
            },{
                label:'出库完成',
                value:'1'
            },{
                label:'已取消',
                value:'2'
            }],
            printCodeArr: []
        }
    },
    mounted: function() {
        this.initData()
    },
    components: {
        operateTable
    },
    methods:{
        search() {
            if(this.searchParams.startDate && this.searchParams.endDate && this.searchParams.startDate > this.searchParams.endDate){
                return this.$message.warning('开始时间不得大于结束时间')
            }
            this.searchParams.pageNumber = 1;
            this.initData()
        },
        resetFrom() {
            for(let obj in this.searchParams){
                if(obj == 'warehouseCode'){
                    continue
                }else{
                    this.searchParams[obj] = ''
                }
            }
            this.searchParams.pageNumber = 1;
            this.searchParams.pageSize = 10;
            this.searchParams.recordTotal = 0;
            this.initData();
        },
        rowClick(row, event, column){
            if( column.label != '操作'){
                this.detailRemark.outInCause = row.outInCause;
                this.detailRemark.outRemark = row.outRemark;
                this.detailRemark.remark = row.remark;
                this.detailParams.outInNoticeCode = row.outInNoticeCode;
                this.detailParams.pageNumber = 1;
                this.getTableDetailList();
                // this.initDetail(row.outInNoticeCode);
                this.operateParams.entityId = this.entityId = row.outInNoticeCode;
            }
        },
        selectAll(select) {
            this.printCodeArr = [];
            for(let i=0; i<select.length;i++){
                this.printCodeArr.push(select[i].outInNoticeCode);
            }
        },
        // 打印列表
        printBtn() {
            if(!this.printCodeArr.length){
                this.$message.warning('请至少选中一条数据')
                return
            }
            this.printData = [];
            let promise = this.printCodeArr.map(item => {
                return this.GET('/otherReturnOut/print', {outInNoticeCodes : item })
            })
            this.$store.commit('changeShowTab', false);
            this.isListShow = true;

            const loading = this.$loading({
                //遮罩对象
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            axios.all(promise).then(res=>{
                res.map(item => {
                    this.printData.push(item.body[0])
                })
                loading.close();
                setTimeout(() => {
                    window.print();
                    this.isListShow = false;
                    this.$store.commit('changeShowTab', true);
                }, 10)
            });
        },
        checkSelectable(row) {
            //判断表格单选框是否显示
            return row.status == 0 ;
        },
        handleClick() {

        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData();
        },
        changeNumber() {
            this.searchParams.pageNumber = val;
            this.initData();
        },
        toOutResult(row) {
            this.$router.push({
                path: '/otherOutResult/' + row.outInNoticeCode
            })
        },
        // 主数据
        initData() {
            this.detailList = [];
            this.GET('/otherReturnOut/pageList', this.searchParams).then(res => {
                this.tableData = res.body.objects;
                this.searchParams.recordTotal = res.body.recordTotal;
                if(res.body.objects.length){
                    this.detailParams.outInNoticeCode = this.tableData[0].outInNoticeCode;
                    this.detailParams.pageNumber = 1;
                    this.getTableDetailList();
                    // this.initDetail(res.body.objects[0].outInNoticeCode);
                    this.operateParams.entityId = this.entityId = res.body.objects[0].outInNoticeCode;
                    this.detailRemark.outInCause = res.body.objects[0].outInNoticeCode;
                    this.detailRemark.outRemark = res.body.objects[0].outRemark;
                    this.detailRemark.remark = res.body.objects[0].remark;
                    this.$nextTick(() => {
                        this.$refs.tableMain.setCurrentRow(this.tableData[0]);
                    })
                } else {
                    this.detailData = [];
                    this.operateParams.entityId = this.entityId = 'false';
                }
            })
        },
        // 获取采购单明细数据详情
        getTableDetailList() {
          this.GET('/otherReturnOut/detailListPage/', this.detailParams).then(res => {
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
        // 数据详情
        initDetail(code) {
            this.GET(`/otherReturnOut/detailList/`, {outInNoticeCode: code}).then(res => {
                this.detailData = res.body;
            })
        }
    }
}
</script>
<style lang="less" scoped>
.paging {
  margin-top: 15px;
  text-align: right;
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
      width: 33%;
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

</style>


<style lang="less">
   .page_break{
       page-break-before: always;
   }

</style>

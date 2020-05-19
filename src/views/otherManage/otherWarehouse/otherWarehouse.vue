<template>
    <div class="otherWarehouse">
        <div v-show="!isListShow">
            <el-form label-width="125px" size="mini">
                <el-row :span="24">
                    <el-col :span="6">
                        <el-form-item label="其他入库单编号：">
                            <el-input v-model="searchParams.outInNoticeCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库单联系人：">
                            <el-input v-model="searchParams.outInContact"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库单状态：">
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
                            <el-button @click="search" size="mini" type="primary">搜索</el-button>
                            <el-button @click="resetFrom" size="mini" type="">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button style="margin-bottom:10px" @click="printBtn"  size="mini">打印理货单</el-button>
            <div class="table_data" >
                <el-table :height="440"   ref="tableMain" highlight-current-row @select="selectAll" @select-all="selectAll" @row-click="rowClick" border style="min-height:300px; width:100%;" :data="tableData">
                    <el-table-column :selectable="checkSelectable" align="center" type="selection" width="50"> </el-table-column>
                    <el-table-column label="序号" align="center"  type="index"  width="50"> </el-table-column>
                    <el-table-column prop="outInNoticeCode" align="center" label="其他入库单编号" :show-overflow-tooltip='true'  > </el-table-column>
                    <el-table-column prop="outInContact" align="center" label="入库单联系人" :show-overflow-tooltip='true' > </el-table-column>
                    <el-table-column prop="outInMobile" align="center" label="联系人手机号" :show-overflow-tooltip='true'   > </el-table-column>
                    <el-table-column prop="outInCause" align="center" label="入库原因"  :show-overflow-tooltip='true'  > </el-table-column>
                    <el-table-column prop="" align="center" label="入库状态"    >
                        <template slot-scope="scope">
                            <span v-show="scope.row.status == 0">未到货</span>
                            <span v-show="scope.row.status == 1">已到货待理货</span>
                            <span v-show="scope.row.status == 2">入库完成</span>
                            <span v-show="scope.row.status == 3">已取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="系统接收时间" >
                        <template slot-scope="scope">
                            {{ new Date().formatDate(scope.row.createTime,'yyyy-MM-dd hh:mm:ss') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="" align="center" label="操作"    >
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status == 0" @click="confrimResult(scope.row)" type="text">确认收货</el-button>
                            <el-button v-else-if="scope.row.status == 1" @click="toOutResult(scope.row)" type="text">理货结果录入</el-button>
                            <el-button v-else  type="text">-</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div style="overflow: hidden;">
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

            <div class="table_detail" style="width:100%;">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="商品明细" name="first">
                        <el-table border :data="detailList" style="width:100%;">
                            <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
                            <el-table-column prop="skuName" align="center" label="商品SKU名称"   > </el-table-column>
                            <el-table-column prop="skuCode" align="center" label="商品SKU编号"  > </el-table-column>
                            <el-table-column prop="specNatureInfo" align="center" label="规格"    > </el-table-column>
                            <el-table-column prop="barCode" align="center" label="条形码"    > </el-table-column>
                            <el-table-column prop="" align="center" label="库存类型"    >
                                <template slot-scope="scope">
                                    <span v-show="scope.row.inventoryType == 1">正品</span>
                                    <span v-show="scope.row.inventoryType == 2">残品</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="planOutInNum" align="center" label="计划入库数量"    > </el-table-column>
                            <el-table-column prop="" align="center" label="理货入库信息"    >
                                <el-table-column prop="" align="center" label="实际入库数量"   >
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.nornalOutInNum === null && scope.row.defectOutInNum === null">{{ '' }}</span>
                                        <span v-else>{{ scope.row.nornalOutInNum + scope.row.defectOutInNum }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="nornalOutInNum" align="center" label="正品入库数量"   > </el-table-column>
                                <el-table-column prop="defectOutInNum" align="center" label="残次品入库数量"   > </el-table-column>
                            </el-table-column>
                        </el-table>
                        <!-- 分页 -->
                        <el-col class='paging'>
                          <el-pagination @size-change="detailChangeSize" @current-change="detailChangeNumber" :current-page="detailParams.pageNumber" :page-sizes="[1, 10, 20, 50, 100]" :page-size="detailParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="detailCount">
                          </el-pagination>
                        </el-col>
                    </el-tab-pane>
                    <el-tab-pane label="其他信息" name="second">
                        <el-form  label-width="100px" size="mini">
                            <el-form-item label="入库原因：">
                                {{ detailData.outInCause }}
                            </el-form-item>
                            <el-form-item label="备注：">
                                {{ detailData.remark  }}
                            </el-form-item>
                            <el-form-item label="入库备注：">
                                {{ detailData.inRemark  }}
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="操作日志" name="third">
                        <operate-table :url="'/wmsLogInformation/wmsLogInformationPage'" :isRefresh="isRefresh"  v-if="entityId" :entityId='entityId' :params="operateParams"></operate-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>


        <!-- 确认到货 -->
        <el-dialog
            title="确认到货"
            :visible.sync="dialogVisisble"
            width="30%">
                <div>
                    <span>确认到货备注:</span>
                    <el-row :span="24">
                        <!-- <el-col :span="2">备注:</el-col> -->
                        <el-col :spna="18">
                            <el-input   placeholder="限输入200个字" maxlength="200" v-model="confirmRemark" style="padding:10px 0;" type="textarea"></el-input>
                        </el-col>
                    </el-row>
                </div>
                <span style="text-align:center" slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" :disabled="disabled1" @click="confirmArrival">确认到货</el-button>
                    <el-button size="mini" @click="dialogVisisble = false">取消</el-button>
                </span>
        </el-dialog>

        <!-- 打印显示的div -->
        <div class="print_screen" v-for="(data, index) in printData" :key="index" v-show="isListShow">
            <h3 class="page_break">其他入库理货单</h3>
            <section>
                <p>
                    <span class="title">入库单编号:</span>
                    <span class="desc">{{ data.outInNoticeCode }}</span>
                </p>
                <p></p>
                <p></p>
                <p></p>
            </section>
            <section>
                <p>
                    <span class="title">入库单联系人：</span>
                    <span class="desc">{{ data.outInContact }}</span>
                </p>
                <p>
                    <span class="title">联系人手机号：</span>
                    <span class="desc">{{ data.outInMobile }}</span>
                </p>
                <p></p>
                <p></p>
            </section>
            <p class="name">商品明细</p>
            <div  class="table_list">
                <el-table  highlight-current-row :data="data.detailList" style="width: 100%; border: solid 1px #ccc; " border>
                    <el-table-column align="center" type="index" label="序号">
                    </el-table-column>
                    <el-table-column prop="skuCode" label="SKU编号" align="center">
                    </el-table-column>
                    <el-table-column prop="skuName" label="SKU名称" align="center">
                    </el-table-column>
                    <el-table-column prop="specNatureInfo" label="规格" align="center">
                    </el-table-column>
                    <el-table-column prop="barCode" label="条形码" align="center">
                    </el-table-column>
                    <el-table-column prop="brandName" label="品牌" align="center">
                    </el-table-column>
                    <el-table-column prop="returnNum" label="库存类型" align="center">
                        <template slot-scope="scope">
                            <span v-show="scope.row.inventoryType == 1">正品</span>
                            <span v-show="scope.row.inventoryType == 2">残品</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="planOutInNum" label="计划入库数量" align="center">
                    </el-table-column>
                    <el-table-column  label="理货数量" align="center">
                        <el-table-column prop="inNum" label="正品数量" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.inNum === null || scope.row.inNum === ''">-</span>
                                <span v-else> {{ scope.row.nornalOutInNum }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="defectiveInNum" label="残品数量" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.defectiveInNum === null || scope.row.defectiveInNum === ''">-</span>
                                <span v-else> {{ scope.row.defectOutInNum }}</span>
                            </template>
                        </el-table-column>
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
    name:'otherWarehouse',
    data() {
        return{
            detailList: [], // 明细列表
            detailCount: 0, // 明细分页总条数
            detailParams: { // 明细分页参数
              pageNumber: 1,
              pageSize: 10,
              outInNoticeCode: '',
              flag: 0
            },
            dialogVisisble: false,
            disabled1: false,
            activeName: 'first',
            printData:[], // 打印的表格
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
            confirmRemark: '',// 确认到货备注
            outInNoticeCode: '',
            tableData:[],
            detailData: '',
            isRefresh: 0, //是否刷新日志
            entityId: '', // 主键id
            operateParams: {   // 操作日志所需参数
                entityId: '',
                entityType: 'WmsOtherReturnIn'
            },
            outBoundOptions:[{
                label:'全部',
                value:''
            },{
                label:'未到货',
                value:'0'
            },{
                label:'已到货待理货',
                value:'1'
            },{
                label:'入库完成',
                value:'2'
            },{
                label:'已取消',
                value:'3'
            }],
            printCodeArr:[]
        }
    },
    mounted: function() {
        this.initData()
    },
    components: {
        operateTable
    },
    watch:{
        dialogVisisble(n,o) {
            if(n == false){
                this.confirmRemark = ''
            }
        }
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
            this.printData = []
            let promise = this.printCodeArr.map(item => {
                return this.GET(`/wmsOtherReturnIn/queryOtherInDetail/${item}/1`)
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
                    this.printData.push(item.body);
                })
                // let oneData =  res[0].body.detailList[0];
                // for(let i=0; i<10; i++){
                //     this.printData[0].detailList.push(oneData);
                // }
                loading.close();
                setTimeout(() => {
                    window.print();
                    this.isListShow = false;
                    this.$store.commit('changeShowTab', true);
                }, 500)
            });
        },
        checkSelectable(row, index) {
            //判断表格单选框是否显示
            return row.status == 0 || row.status == 1;
        },
        handleClick() {

        },
        rowClick(row, event, column) {
            if( column.label != '操作'){
                this.detailParams.outInNoticeCode = row.outInNoticeCode;
                this.initDetail(row.outInNoticeCode);
                this.operateParams.entityId = this.entityId = row.id;
                // this.isRefresh ++;
            }
        },
        // 确认收货
        confrimResult(row) {
            this.dialogVisisble = true;
            this.outInNoticeCode = row.outInNoticeCode;
        },
        confirmArrival() {
            this.disabled1 = true
            this.PUT('/wmsOtherReturnIn/otehnEnsureArrival', {outInNoticeCode: this.outInNoticeCode,confirmRemark: this.confirmRemark},true).then(res => {
                this.$message.success('确认到货成功')
                this.dialogVisisble = false;
                this.searchParams.pageNumber =1;
                this.confirmRemark = '';
                this.initData();
            }).finally(() =>{
                this.disabled1 = false;
            })
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            this.initData();
        },
        changeNumber(val) {
            this.searchParams.pageNumber = val;
            this.initData();
        },
        toOutResult(row) {
            this.$router.push({
                path: '/otherWareResult/'+row.outInNoticeCode
            })
        },
        // 主数据
        initData(){
            this.detailList = [];
            this.GET('/wmsOtherReturnIn/queryOtherInPage', this.searchParams).then(res => {
                this.tableData = res.body.objects;
                this.searchParams.recordTotal = res.body.recordTotal;
                if(res.body.objects.length){
                    this.detailParams.outInNoticeCode = this.tableData[0].outInNoticeCode;
                    this.initDetail(res.body.objects[0].outInNoticeCode);
                    this.operateParams.entityId = this.entityId = res.body.objects[0].id;
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
          this.GET('/wmsOtherReturnIn/queryOtherInDetailPage', this.detailParams).then(res => {
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
        initDetail(code, flag = 0) {
            this.GET(`/wmsOtherReturnIn/queryOtherInDetail/${code}/${flag}`).then(res => {
                this.detailData = res.body;
                this.detailParams.pageNumber = 1;
                this.getTableDetailList();
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

</style>
<style lang="less">
   .page_break{
       page-break-before: always;
   }

</style>


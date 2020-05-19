<template>
    <div class="afterSale">
        <div v-if="!isListShow">
            <el-form label-width="125px" size="medium">
                <el-row style="margin-bottom: 10px;" :span="24">
                    <el-col :span="6">
                        <el-form-item label="创建时间：" prop="" size="mini">
                            <el-col :span="11">
                                <el-form-item prop="" size="mini">
                                <el-date-picker v-model="searchParams.startDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col style="text-align: center" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-form-item prop="endDate" size="mini">
                                <el-date-picker v-model="searchParams.endDate" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                                </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="入库单编号：" prop="" size="mini">
                            <el-input v-model="searchParams.warehouseNoticeCode"  placeholder="入库单编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="售后单编号：" prop="" size="mini">
                            <el-input v-model="searchParams.afterSaleCode"  placeholder="售后单编号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="销售渠道订单号：" prop="" size="mini">
                            <el-input v-model="searchParams.shopOrderCode"  placeholder="销售渠道订单号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="6">
                        <el-form-item label="操作人：" prop="" size="mini">
                            <el-input v-model="searchParams.operator"  placeholder="操作人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物流单号：" prop="" size="mini">
                            <el-input v-model="searchParams.waybillNumber"  placeholder="物流单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="" prop="" size="mini">
                            <el-button type="primary" icon="search" @click="search">搜索</el-button>
                            <el-button type="default" icon="circle-cross" @click="resetForm">清空条件</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div>
                <el-button type="primary" @click="printBtn" size="mini">打印</el-button>
            </div>
            <el-tabs v-model="searchParams.status" @tab-click="tabClick" type="card" style="margin-top: 15px;">
                <el-tab-pane label="全部" name="-1"></el-tab-pane>
                <el-tab-pane label="未到货" name="0"></el-tab-pane>
                <el-tab-pane label="已到货待理货" name="1"></el-tab-pane>
                <el-tab-pane label="入库完成" name="2"></el-tab-pane>
                <el-tab-pane label="已关闭" name="3"></el-tab-pane>
            </el-tabs>
            <el-table ref="tableMain" :height="360" @select="selectBox" @cell-click="handleClick"  highlight-current-row @select-all="selectAll"  border :data="tableData" style="width:100%;min-height:300px;">
                <el-table-column :selectable="checkSelectable"  type="selection" align="center" prop="" width="50"></el-table-column>
                <el-table-column  align="center" type="index" label="序号" width="50"></el-table-column>
                <el-table-column  align="center" prop="warehouseNoticeCode" label="入库单编号" :show-overflow-tooltip='true'></el-table-column>
                <el-table-column  align="center" prop="shopOrderCode" label="销售渠道订单号" :show-overflow-tooltip='true'></el-table-column>
                <el-table-column  align="center" prop="afterSaleCode" label="售后单编号" :show-overflow-tooltip='true'></el-table-column>
                <el-table-column  align="center" prop="skuNum" label="商品行数">
                </el-table-column>
                <el-table-column  align="center" prop="inNum" label="正品入库总量"></el-table-column>
                <el-table-column  align="center" prop="defectiveInNum" label="残品入库总量"></el-table-column>
                <el-table-column  align="center" prop="totalInNum" label="总入库数量"></el-table-column>
                <el-table-column  align="center" prop="logisticsCorporation" label="物流公司"></el-table-column>
                <el-table-column  align="center" prop="waybillNumber" label="物流单号" :show-overflow-tooltip='true'></el-table-column>
                <el-table-column  align="center" prop="operator" label="操作人">
                </el-table-column>
                <el-table-column  align="center" prop="createTime" label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime ? new Date().formatDate(scope.row.createTime, 'yyyy-MM-dd hh:mm') : scope.row.createTime }}
                    </template>
                </el-table-column>
                <el-table-column  align="center" prop="warehouseTime" label="入库时间">
                    <template slot-scope="scope">
                        {{ scope.row.warehouseTime ? new Date().formatDate(scope.row.warehouseTime, 'yyyy-MM-dd hh:mm') : scope.row.warehouseTime}}
                    </template>
                </el-table-column>
                <el-table-column  align="center" prop="" label="入库单状态">
                    <template slot-scope="scope">
                        <div v-show="scope.row.status == 0">未到货</div>
                        <div v-show="scope.row.status == 1">已到货待理货</div>
                        <div v-show="scope.row.status == 2">入库完成</div>
                        <div v-show="scope.row.status == 3">已关闭</div>
                    </template>
                </el-table-column>
                <el-table-column  align="center" prop="" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status == 0" @click="confirm(scope.row,'confirm')" type="text">确认到货</el-button>
                        <el-button v-else-if="scope.row.status == 1" @click="confirm(scope.row, 'into')" type="text">理货结果录入</el-button>
                        <div v-else>-</div>
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:right; padding:10px 0">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="searchParams.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="searchParams.pageTotal">
                </el-pagination>
            </div>
            <el-tabs v-model="detailTabActieve"  style="padding-top:20px">
                <el-tab-pane label="商品明细" name="1">
                    <el-table :summary-method="getSummaries" ref="tableRow" show-summary @select-all="selectAll"  border :data="tableDataDetail" style="width:100%">
                        <el-table-column  align="center" type="index" label="序号" ></el-table-column>
                        <el-table-column  align="center" prop="skuName" label="SKU名称" :show-overflow-tooltip='true'></el-table-column>
                        <el-table-column  align="center" prop="skuCode" label="SKU编号" :show-overflow-tooltip='true'></el-table-column>
                        <el-table-column  align="center" prop="barCode" label="条形码"></el-table-column>
                        <el-table-column  align="center" prop="specNatureInfo" label="规格" :show-overflow-tooltip='true'></el-table-column>
                        <el-table-column  align="center" prop="returnNum" label="拟退货数量"></el-table-column>
                        <el-table-column  align="center" prop="inNum" label="正品入库数量"></el-table-column>
                        <el-table-column  align="center" prop="defectiveInNum" label="残品入库数量"></el-table-column>
                        <el-table-column  align="center" prop="amount3" label="合计">
                            <template slot-scope="scope">
                                {{ scope.row.inNum + scope.row.defectiveInNum }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="操作日志" name="2">
                    <operate-table :url="'/wmsLogInformation/wmsLogInformationPage'" :isRefresh="isRefresh"  v-if="entityId" :entityId='entityId' :params="operateParams"></operate-table>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!-- 打印显示的div -->
        <div class="print_screen" v-for="(data, index) in printData" :key="index" v-show="isListShow">
            <h3>退货入库理货单</h3>
            <section>
                <p>
                    <span class="title">入库单编号:</span>
                    <span class="desc">{{ data.warehouseNoticeCode }}</span>
                </p>
                <p></p>
                <p></p>
            </section>
            <section>
                <p>
                    <span class="title">系统订单编号：</span>
                    <span class="desc">{{data.scmShopOrderCode  }}</span>
                </p>
                <p>
                    <span class="title">联系人：</span>
                    <span class="desc">{{ data.sender }}</span>
                </p>
                <p>
                    <span class="title">联系电话：</span>
                    <span class="desc">{{ data.senderNumber }}</span>
                </p>
            </section>
            <section>
                <p>
                    <span class="title">销售渠道：</span>
                    <span class="desc">{{data.channelName }}</span>
                </p>
                <p>
                    <span class="title">店铺名称：</span>
                    <span class="desc">{{ data.shopName  }}</span>
                </p>
                <p>
                    <span class="title">入库仓库：</span>
                    <span class="desc">{{ data.warehouseName }}</span>
                </p>
            </section>
            <section>

                <p>
                    <span class="title">操作人：</span>
                    <span class="desc">{{ data.operator }}</span>
                </p>
                <p>
                    <span class="title">入库时间：</span>
                    <span class="desc">{{ data.warehouseTime ?  new Date().formatDate(data.warehouseTime, 'yyyy-MM-dd hh:mm') : ''}}</span>
                </p>
                <p>

                </p>
            </section>
            <p class="name">商品明细</p>
            <div class="table_list">
                <el-table highlight-current-row :data="data.returnInDetailList" style="width: 100%; border: solid 1px #ccc;" border>
                <el-table-column align="center" type="index" label="序号">
                </el-table-column>
                <el-table-column prop="skuCode" label="SKU编号" align="center">
                </el-table-column>
                <el-table-column prop="skuName" label="SKU名称" align="center">
                </el-table-column>
                <el-table-column prop="barCode" label="条形码" align="center">
                </el-table-column>
                <el-table-column prop="brandName" label="品牌" align="center">
                </el-table-column>
                <el-table-column prop="returnNum" label="拟退货数量" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.returnNum === null || scope.row.returnNum === ''">-</span>
                        <span v-else> {{ scope.row.returnNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="理货数量" align="center">
                    <el-table-column prop="inNum" label="正品数量" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.inNum === null || scope.row.inNum === ''">-</span>
                            <span v-else> {{ scope.row.inNum }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="defectiveInNum" label="残品数量" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.defectiveInNum === null || scope.row.defectiveInNum === ''">-</span>
                            <span v-else> {{ scope.row.defectiveInNum }}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 确认到货 -->
        <el-dialog
            title="确认到货"
            :visible.sync="dialogVisisble"
            width="30%">
                <div>
                    <span>确认到货备注:</span>
                    <el-input   placeholder="限输入200个字" maxlength="200" v-model="confirmRemark" style="padding:10px 0;" type="textarea"></el-input>
                </div>
                <span style="text-align:center" slot="footer" class="dialog-footer">
                    <el-button size="mini" type="primary" :disabled="disabled1" @click="confirmArrival">确认到货</el-button>
                    <el-button size="mini" @click="dialogVisisble = false">取消</el-button>
                </span>
        </el-dialog>

        <!-- 理货结果录入 -->
        <el-dialog
            title="理货入库设置"
            :visible.sync="dialogVisisbleInto"
            width="50%">
            <el-form size="medium" label-width="125px">
                <el-row :span="24">
                    <el-col>
                        <el-form-item label="理货结果备注：">
                            <el-input placeholder="限输入200个字" maxlength="200" v-model="recordRemark" style="padding:10px 0;" type="textarea"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col>
                        <el-form-item label="上传图片：">
                            <el-upload
                                ref="upload"
                                class="upload-demo"
                                action="/wms-web/qiniu/upload/afterSale"
                                :on-preview="handlePreview"
                                name="file"
                                :file-list="fileListShow"
                                list-type="picture"
                                :on-remove="onRemove"
                                :on-success="onSuccess"
                                :before-upload="beforeUpload"
                                multiple
                                :limit="5"
                                :on-exceed="handleExceed">
                                <el-button size="mini"  type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">最多限传5张，单张限4MB以内，支持JPG,PNG,BMP格式</div>
                            </el-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :span="24">
                    <el-col :span="24">
                        <el-form-item label="">
                            <el-table class="requreRed" id="tableMain" ref="tableRow"  border :data="confirmObject.returnInDetailList" style="width:100%">
                                <el-table-column  align="center" type="index" label="序号" ></el-table-column>
                                <el-table-column  align="center" prop="skuName" label="SKU名称"></el-table-column>
                                <el-table-column  align="center" prop="barCode" label="条形码"></el-table-column>
                                <el-table-column  align="center" prop="maxReturnNum" label="可退货数量"></el-table-column>
                                <el-table-column  align="center" prop="inNum" label="正品入库数量">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.inNum" maxlength="10" size="mini" type="text"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column  align="center" prop="defectiveInNum" label="残品入库数量">
                                    <template slot-scope="scope">
                                        <el-input  v-model="scope.row.defectiveInNum" maxlength="10" size="mini" type="text"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div style="text-align:center; padding-top:20px">
                <el-button size="mini" :disabled="disabled2" @click="inConfirm" type="primary"> 提交</el-button>
                <el-button size="mini" @click="dialogVisisbleInto = false" > 取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import operateTable from '@/components/operateTable';
export default {
    data() {
        return{
            isListShow: false,
            showHome: true, //是否显示主页
            dialogVisisble: false,
            dialogVisisbleInto: false,
            searchParams: {
                startDate: '', // 开始时间
                endDate: '', // 结束时间
                warehouseNoticeCode: '', // 入库单编号
                afterSaleCode: '', //售后单编号
                shopOrderCode: '', // 订单编号
                operator: '', //操作人
                waybillNumber: '', // 物流单号
                status: '-1', // 发货单状态
                pageSize: 10,
                pageNumber:1,
                pageTotal: 0
            },
            operateParams: {   // 操作日志所需参数
                entityId: '',
                entityType: 'WmsReturnIn'
            },
            entityId: '',
            isRefresh: '', //是否刷新日志
            confirmRemark: '', //确认到货备注
            recordRemark: '', //入库备注
            confirmObject:'' , // 点击确认售货的对象
            detailTabActieve: '1',
            fileList: [], // 图片list
            tableData:[], // 主列表数据
            tableDataDetail:[], // 商品明细
            printData: [], // 打印数据
            selectList: [], // 所选择的列表
            fileListShow: [],
            disabled1: false,
            disabled2: false
        }
    },
    mounted: function() {
        const start = new Date();
        const end = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 31);
        this.searchParams.startDate = start;
        this.searchParams.endDate = end;

        let data = this.searchParams;
        data.startDate = this.formatDataChange(start, 'yyyy-MM-dd')
        data.endDate = this.formatDataChange(end, 'yyyy-MM-dd')
        this.initData(data)
    },
    components: {
        operateTable
    },
    methods: {
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                let num = 0
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                if(this.tableDataDetail.length){
                    for(let i=0; i<this.tableDataDetail.length;i++){
                        if(this.tableDataDetail[i].defectiveInNum === '' && this.tableDataDetail[i].defectiveInNum === ''){
                            continue
                        }else{
                            num += this.tableDataDetail[i].defectiveInNum+this.tableDataDetail[i].inNum
                        }
                    }
                }
                if(index === columns.length-1){
                    if(typeof num === 'string'){
                        sums[columns.length-1] = '-'
                    }else if(typeof num === 'number'){
                        sums[columns.length-1] = num;
                    }
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                            return prev + curr;
                        } else {
                            return prev;
                        }
                    }, 0);

                    // sums[index] += ' 元';
                } else {
                    if(index === 5 || index === 6 || index === 7 || index === 8){
                        sums[index] = '-';
                    }else{
                        sums[index] = '';
                    }
                }
                if(index == 3){
                   sums[index] = '';
                }
            });
            return sums;
        },
        // 搜索
        search() {
            this.searchParams.pageNumber = 1;
            this.initData(this.searchParams)
        },
        // 重置
        resetForm() {
            for(let obj in this.searchParams){
                this.searchParams[obj] = ''
            }
            this.searchParams.pageNumber = 1
            this.searchParams.pageSize = 10
            this.searchParams.pageTotal = 0
            this.searchParams.status = '-1'
            this.initData(this.searchParams)
        },
        // 明细
        handleClick(row) {
            this.operateParams.entityId = this.entityId = row.id;
            this.afterDataDetail(row.warehouseNoticeCode)
        },
        // tab切换
        tabClick() {
            this.searchParams.pageNumber = 1
            this.entityId = '1'
            this.initData(this.searchParams)
        },
        //选择打印事件获取要打印的数据
        selectBox(select, row) {
            this.printData = select;
        },
        selectAll(select) {
            this.printData = select;
        },
        checkSelectable(row, index) {
            //判断表格单选框是否显示
            return row.status == 0 || row.status == 1;
        },
        // 当前页
        handleCurrentChange(val) {
            this.searchParams.pageNumber = val;
            this.initData(this.searchParams)
        },
        // 每页显示多少条
        handleSizeChange(val) {
            console.log(1)
            this.searchParams.pageSize = val;
            this.initData(this.searchParams)
        },
        // 上传前事件
        beforeUpload(file) {
            let fileFormat = file.type;
            if (fileFormat === 'image/png' || fileFormat === 'image/jpg' || fileFormat === 'image/jpeg' || fileFormat === 'image/PBG' || fileFormat === 'image/bmp') {
                if (file.size > 1024 * 1024 * 4 ) {
                    this.$message.warning('文件大小不能大于4M');
                    return false;
                }
            } else {
                this.$message.warning('文件类型只能为.png,.jpg,.bmp');
                return false;
            }
        },
        // 上传成功
        onSuccess(file){
            this.fileList.push(file.body.key)
        },
        // 移除时事件
        onRemove(file) {

            let key = file.response.body.key
            if (this.fileList.length) this.fileList.splice(this.fileList.indexOf(key), 1);
        },
        handlePreview() {

        },
        handleExceed(row, obj) {
            this.$message.warning('最多上传5张图片');
        },
        // 打印列表
        printBtn() {
            if(!this.printData.length){
                this.$message.warning('请至少选中一条数据')
                return
            }
            this.isListShow = true;
            this.$store.commit('changeShowTab', false);
            setTimeout(() => {
                window.print();
                this.isListShow = false;
                this.$store.commit('changeShowTab', true);
                this.printData = []
            },500)
        },
        // 理货录入提交
        inConfirm() {
            if(this.checkDetailData()){
                let data = {
                    id : this.confirmObject.id,
                    returnInDetailList: this.confirmObject.returnInDetailList,
                    warehouseNoticeCode : this.confirmObject.warehouseNoticeCode,
                    recordRemark: this.recordRemark,
                    picture: this.fileList.length ? this.fileList.join(',') : ''
                }
                this.disabled2 =  true
                this.PUT('/wmsReturnInManager/returnInSetting',  data).then(res => {
                    this.$message.success('理货入库设置成功')
                    this.dialogVisisbleInto = false
                    this.entityId = ''
                    setTimeout(() => {
                        this.initData(this.searchParams)
                    },500)
                }).finally(res => {
                    setTimeout(() => {
                        this.disabled2 = false;
                    },100)
                })
            }
        },
        // 检验规格
        checkDetailData() {
            let parent = document.getElementById('tableMain');
            let num = -1;
            let index = 0;
            let reg = /^([1-9]\d*|[0]{1,1})$/;
            let obj = this.confirmObject.returnInDetailList;
            for(let i=0; i<obj.length; i++){
                if(!reg.test(obj[i].inNum)){
                    num = i
                    index = 0;
                    this.$message.warning('输入格式不正确，需输入大于或等于0的正整数')
                    break
                }else if(!reg.test(obj[i].defectiveInNum)) {
                    num = i
                    index = 1;
                    this.$message.warning('输入格式不正确，需输入大于或等于0的正整数')
                    break
                }
            }
            if(num > -1){
                let item = parent.getElementsByClassName('el-table__row')[num];
                let input = item.getElementsByTagName('input')[index];
                input.focus();
                return false
            }else{
                return true
            }
        },
        // 打开确认到货弹窗
        confirm(row, str) {
            this.fileList = [];
            this.fileListShow = [];
            this.confirmObject = row

            if(str === 'confirm'){

                this.confirmRemark = ''
                this.dialogVisisble = true

            }else if(str === 'into'){

                this.dialogVisisbleInto = true
                this.recordRemark = ''

            }

            this.GET('/wmsReturnInManager/queryOrderSkusList/'+row.warehouseNoticeCode).then(res => {
                this.confirmObject.returnInDetailList = res.body
                this.confirmObject.returnInDetailList.map((item, index) => {
                    item.inNum = 0
                    item.defectiveInNum = 0
                })
            })

        },
        /**
         * @param 确认到货
         */
        confirmArrival(id) {
            let data = {
                id: this.confirmObject.id,
                confirmRemark: this.confirmRemark,
                warehouseNoticeCode: this.confirmObject.warehouseNoticeCode
            }

            this.disabled1 = true
            this.PUT('/wmsReturnInManager/ensureArrival',data).then(res => {
                this.dialogVisisble = false
                this.entityId = ''
                this.$message.success('确认到货成功')
                this.initData(this.searchParams)
            }).finally(res => {
                setTimeout(() => {
                    this.disabled1= false;
                },100)
            })

        },
        // 初始化数据
        initData(data) {
            this.GET('/wmsReturnInManager/wmsReturnInPage', data).then(res => {
                this.tableData = res.body.objects
                this.searchParams.pageTotal = res.body.pageTotal
                if(res.body.objects && res.body.objects.length){
                    this.afterDataDetail(res.body.objects[0].warehouseNoticeCode)
                    this.$nextTick(() => {
                        this.$refs.tableMain.setCurrentRow(this.tableData[0]);
                    })
                    this.operateParams.entityId = this.entityId = res.body.objects[0].id;
                }else{
                    this.tableDataDetail = []
                }
            })
        },
        // 详情
        afterDataDetail(id) {
            this.GET('/wmsReturnInManager/queryOrderSkusList/'+id).then(res => {
                this.tableDataDetail = res.body
                this.tableDataDetail.map((item, index) => {
                    for(let i in item){
                        if(item[i] === '' || item[i] === null){
                            item[i] = '-'
                        }
                    }
                })
            })
        },
         // 转换时间格式
        formatDataChange(time, format) {
            let t = new Date(time);
            let tf = function(i) {
                 return (i < 10 ? '0' : '') + i;
            };

            return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                case 'MM':
                    return tf(t.getMonth() + 1);
                case 'mm':
                    return tf(t.getMinutes());
                case 'dd':
                    return tf(t.getDate());
                case 'HH':
                    return tf(t.getHours());
                case 'ss':
                    return tf(t.getSeconds());
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
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

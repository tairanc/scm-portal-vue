<template>
    <div class="otherWareResult">
        <div>理货结果录入</div>
        <div class="base_message">
            <div class="title">入库单基本信息</div>
            <el-form style="padding:10px 0" label-width="120px" size="mini">
                <el-form-item label="其它入库单编号：">
                    {{ tableData.outInCode }}
                </el-form-item>
                <el-form-item label="入库原因：">
                    {{ tableData.outInCause  }}
                </el-form-item>
                <el-form-item label="备注：">
                    {{ tableData.remark  }}
                </el-form-item>
            </el-form>
        </div>
        <div class="shop_message">
            <div class="title">商品入库信息</div>
            <div id="tableMain">
                <div class="icon">
                    <el-tooltip  effect="dark" content="一键填数" placement="top">
                        <i @click="operatData('fill')" class="el-icon-edit-outline"></i>
                    </el-tooltip>
                    <el-tooltip  effect="dark" content="一键清空" placement="top">
                        <i @click="operatData('clear')" class="el-icon-delete"></i>
                    </el-tooltip>
                </div>
                <el-table class="ware_table" id="ware_table" border :data="tableData.detailList">
                    <el-table-column label="序号" align="center" type="index"  width="50"> </el-table-column>
                    <el-table-column prop="skuCode" align="center" label="SKU编号"  > </el-table-column>
                    <el-table-column prop="skuName" align="center" label="SKU名称"   > </el-table-column>
                    <el-table-column prop="specNatureInfo" align="center" label="规格"    > </el-table-column>
                    <el-table-column prop="barCode" align="center" label="条形码"    > </el-table-column>
                    <el-table-column prop="" align="center" label="库存类型"    >
                        <template slot-scope="scope">
                            <span v-show="scope.row.inventoryType == 1">正品</span>
                            <span v-show="scope.row.inventoryType == 2">残品</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="planOutInNum" align="center" label="计划入库数量"    > </el-table-column>
                    <el-table-column prop="" align="center" label="理货数量"    >
                        <el-table-column prop="" align="center" label="正品数量"   > 
                            <template slot-scope="scope">
                                <el-input maxlength="10" @input="checkInput(scope.row.nornalOutInNum, scope.$index, 0)" v-model="scope.row.nornalOutInNum" size="mini"></el-input>
                            </template>
                        </el-table-column> 
                        <el-table-column prop="" align="center" label="残品数量"   > 
                            <template slot-scope="scope">
                                <el-input maxlength="10" @input="checkInput(scope.row.defectOutInNum, scope.$index, 1)"  v-model="scope.row.defectOutInNum" size="mini"></el-input>
                            </template>
                        </el-table-column> 
                    </el-table-column>
                </el-table>
            </div>
            <el-form style="margin:20px 0" label-width="100px" size="mini">
                <el-form-item label="入库备注：">
                    <el-input v-model="tableData.inRemark " maxlength="200" placeholder="" size="mini" type="textarea"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div style="text-align:center; padding: 20px 0">
            <el-button type="primary" :disabled="disabledBtn" @click="keepData('0')" size="mini">保存</el-button>
            <el-button type="primary" :disabled="disabledBtn" @click="keepData('1')" size="mini">入库完成</el-button>
            <el-button type="" @click="back()" size="mini">取消</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'otherWareResult',
    data() {
        return {
            tableData:[],
            code: this.$route.params.id,
            disabledBtn: false
        }
    },
    mounted: function() {
        this.initData()
    },
    methods:{
        operatData(str) {
            if(str == 'fill'){
                this.tableData.detailList.map((item, index) => {
                    if(item.inventoryType == 1){
                        item.nornalOutInNum = item.planOutInNum
                        item.defectOutInNum = 0
                    } else if(item.inventoryType == 2) {
                        item.nornalOutInNum = 0
                        item.defectOutInNum = item.planOutInNum
                    } 
                })
            }else if(str == 'clear'){
                this.tableData.detailList.map((item, index) => {
                    item.nornalOutInNum = ''
                    item.defectOutInNum = ''
                })
            }
        },
        checkInput(item,num,index) {
            let reg=/^([1-9]\d*|[0]{1,1})$/;
            let last = item[item.length-1];

            if(item[item.length-1] === '.' || !reg.test(item)){
                if(item){
                    this.$message.warning('录入时正残品数量只能输入0或正整数')
                }
                this.$nextTick(() => {
                    if(index == 0){
                        this.tableData.detailList[num].nornalOutInNum = '';
                    }else{
                        this.tableData.detailList[num].defectOutInNum = '';
                    }
                })
            }
        },
        back(){
            this.$router.go(-1)
        },
        initData() {
            this.GET(`/wmsOtherReturnIn/queryOtherInDetail/${this.code}/0`).then(res => {
                if(res.body){
                    res.body.detailList.map(item => {
                        if(item.inventoryType == 1 && !item.defectOutInNum){
                            item.defectOutInNum = 0
                        }else if(item.inventoryType == 2 && !item.nornalOutInNum){
                            item.nornalOutInNum = 0
                        }
                    })
                }
                this.tableData = res.body;
            })
        },
        keepData(flag) {
            if(!this.checkData(flag)){
                return;
            }
            let arr = this.tableData ? this.tableData.detailList.map(item => {
                return{
                    defectOutInNum: item.defectOutInNum,
                    nornalOutInNum: item.nornalOutInNum,
                    skuCode: item.skuCode
                }
            }): [];
            let data = {
                detailRequest: arr,
                flag,
                inRemark : this.tableData.inRemark,
                outInNoticeCode: this.code
            }
            this.disabledBtn = true
            if(flag == 1){
                this.$confirm('确定后将不能再修改数据!','您确定“入库完成”吗？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                })
                .then(() => {
                   this.PUT('/wmsOtherReturnIn/otherInSet/',data, true).then(res => {
                        this.$message.success('理货录入成功');
                        this.$router.push({
                            path: '/otherWarehouse'
                        })
                    }).finally(() => {
                        this.disabledBtn = false;
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                    this.disabledBtn = false;
                });
            }else if(flag == 0){
                this.PUT('/wmsOtherReturnIn/otherInSet/',data, true).then(res => {
                    this.$message.success('保存成功');
                    this.$router.push({
                        path: '/otherWarehouse'
                    })
                }).finally(() => {
                    this.disabledBtn = false;
                })
            }
            
        },
        checkData(flag) {
            let parent = document.getElementById('ware_table');
            let index = 0;
            let num = -1;
            for(let i=0;i<this.tableData.detailList.length; i++){
                let d = this.tableData.detailList[i].defectOutInNum, n=this.tableData.detailList[i].nornalOutInNum;
                if(flag != 0){
                    if(n === '' || n === null){
                        this.$message.warning('录入时正品数量不能为空！');
                        index = 0;
                        num = i
                        break;
                    }
                    if(d === '' || d === null){
                        this.$message.warning('录入时残品数量不能为空！');
                        index = 1;
                        num = i
                        break;
                    }
                }
                
            }
            if(num > -1){
                let item = parent.getElementsByClassName('el-table__row')[num]
                let input = item.getElementsByTagName('input')[index]
                input.focus();
                return false;
            }else{
                return true
            }
        }   
    }
}
</script>
<style lang="less" scoped>
    #tableMain {
        position: relative;
        .icon{
            font-size: 18px;
            color: #409EFF;
            cursor:pointer;
            position: absolute;
            top: 8px;
            right: 7.5%;
            z-index: 100
        }
    }
    .otherWareResult{
        min-width:1500px;
        .title{
            background-color:#f5f7fa;
            color :#909399;
            padding: 10px;
            font-size: 12px;
            margin:10px 0
        }
    }
</style>
<style lang="less">
.el-message-box--center .el-message-box__message {
  color: #ff0000;
}
</style>



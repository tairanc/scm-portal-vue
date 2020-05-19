<template>
    <div class="otherOutResult">
        <div>出库结果录入</div>
        <div class="base_message">
            <div class="title">出库单基本信息</div>
            <el-form style="padding:10px 0" label-width="120px" size="mini">
                <el-form-item label="其它出库单编号：">
                    {{ tableData.outInCode  }}
                </el-form-item>
                <el-form-item label="出库原因：">
                    {{ tableData.outInCause  }}
                </el-form-item>
                <el-form-item label="备注：">
                    {{ tableData.outRemark  }}
                </el-form-item>
            </el-form>
        </div>
        <div class="shop_message">
            <div class="title">商品出库信息</div>
            <div class="shop_message">
                <div id="tableMain">
                    <div class="icon">
                        <el-tooltip  effect="dark" content="一键填数" placement="top">
                            <i @click="operatData('fill')" class="el-icon-edit-outline"></i>
                        </el-tooltip>
                        <el-tooltip  effect="dark" content="一键清空" placement="top">
                            <i @click="operatData('clear')" class="el-icon-delete"></i>
                        </el-tooltip>
                    </div>
                    <el-table class="out_table" id="out_table" border :data="tableData.otherReturnOutDetailList">
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
                        <el-table-column prop="planOutInNum" align="center" label="计划出库数量"    > </el-table-column>
                        <el-table-column prop="" align="center" label="实际出库数量"    > 
                            <template slot-scope="scope">
                                <el-input maxlength="10" @input="checkInput(scope.row.realOutInNum, scope.$index)" v-model="scope.row.realOutInNum" size="mini"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <el-form style="margin:20px 0" label-width="100px" size="mini">
                <el-form-item label="出库备注：">
                    <el-input v-model="outRemark" maxlength="200" placeholder="实际出库数量≠计划出库数量时必填" size="mini" type="textarea"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div style="text-align:center; padding: 20px 0">
            <el-button type="primary" :disabled="disabledBtn" @click="keepData(0)" size="mini">保存</el-button>
            <el-button type="primary" :disabled="disabledBtn" @click="keepData(1)"  size="mini">出库完成</el-button>
            <el-button type="" @click="back()" size="mini">取消</el-button>
        </div>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            center
            width="25%">
            <div v-if="!dialogMessage.flag">
                <div style="text-align:center; display:flex;">
                    <i style="font-size:22px;vertical-align: middle;color:#e6a23c; padding-right:5px;" class="el-icon-warning"></i>
                    <div v-html="dialogMessage.title" style="text-align:center;"></div>
                </div>
            </div>
            <div v-if="dialogMessage.flag">
                <div style="text-align:center;">
                    <i style="font-size:22px;vertical-align: middle;color:#e6a23c; padding-right:5px;" class="el-icon-warning"></i>
                    <span v-html="dialogMessage.title" style="text-align:center;"></span>
                </div>
            </div>
            <div style="padding:10px 0 0 25px; color:#ff0000; text-align:center;">{{ dialogMessage.content }}</div>
            <span slot="footer"  class="dialog-footer">
                <el-button size="mini" :disabled="disabledBtn" type="primary" @click="outFinish">确 定</el-button>
                <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'otherOutResult',
    data() {
        return {
            dialogVisible: false,
            disabledBtn: false,
            tableData:[],
            code: this.$route.params.id,
            outRemark: '', //出库备注
            dialogMessage: {
                title: '您确定“出库完成”吗？',
                content: '确定后将不能再修改数据',
                flag: true
            }
        }
    },
    mounted: function() {
        this.detailData();
    },
    methods:{
        operatData(str) {
            if(str == 'fill'){
                this.tableData.otherReturnOutDetailList.map((item, index) => {
                    item.realOutInNum = item.planOutInNum
                })
            }else if(str == 'clear'){
                this.tableData.otherReturnOutDetailList.map((item, index) => {
                    item.realOutInNum = ''
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
                    this.tableData.otherReturnOutDetailList[num].realOutInNum = '';   
                })
            }
        },
        back(){
            this.$router.go(-1)
        },
        detailData(){
            this.GET(`/otherReturnOut/info`, {outInNoticeCode: this.code}).then(res => {
                this.tableData = res.body;
                this.outRemark = res.body.outRemark;
            })
        },
        // 保存
        keepData(str) {
            if(!this.checkData(str)){
                return
            }
            let data = [];
            for(let i=0; i<this.tableData.otherReturnOutDetailList.length;i++){
                data.push({
                    skuCode: this.tableData.otherReturnOutDetailList[i].skuCode,
                    realOutInNum: this.tableData.otherReturnOutDetailList[i].realOutInNum
                })
            }
            let wmsOtherReturnOutDO = {
                otherReturnOutDetailList: data,
                outInNoticeCode: this.code,
                outRemark: this.outRemark
            } 
            if(str == 0){
                this.disabledBtn = true
                this.PUT('/otherReturnOut/outSave', wmsOtherReturnOutDO, true).then( res => {
                    this.$message.success('保存成功');
                    this.back();
                }).finally(() => {
                    this.disabledBtn = false;
                })
            }else if(str == 1){
                let arr = [];
                let str = '';
                for(let i=0;i<this.tableData.otherReturnOutDetailList.length; i++){
                    let r = this.tableData.otherReturnOutDetailList[i].realOutInNum;
                    let p = this.tableData.otherReturnOutDetailList[i].planOutInNum;
                    if(r != p){
                        arr.push(`${this.tableData.otherReturnOutDetailList[i].skuCode}`);
                    }
                }
                if(arr.length && !this.outRemark){
                    this.$message.warning('存在SKU的实际出库数量不等于计划出库数量，请填写“出库备注”!');
                    return
                }else if(arr.length && this.outRemark){
                    str = `[${arr.join(',')}]  的实际出库数量<span style="color:#ff0000">不等于</span>计划出库数量，您确认出库完成吗？`;
                    this.dialogMessage.title = str;
                    this.dialogMessage.flag = false;
                }else if(!arr.length){
                    this.dialogMessage.title = '您确定“出库完成”吗？'
                    this.dialogMessage.flag = true;
                }
                this.dialogVisible = true; 
            }                      
        },
        outFinish() {
                let data = [];
                for(let i=0; i<this.tableData.otherReturnOutDetailList.length;i++){
                    data.push({
                        skuCode: this.tableData.otherReturnOutDetailList[i].skuCode,
                        realOutInNum: this.tableData.otherReturnOutDetailList[i].realOutInNum
                    })
                }
                let wmsOtherReturnOutDO = {
                    otherReturnOutDetailList: data,
                    outInNoticeCode: this.code,
                    outRemark: this.outRemark
                } 
                this.disabledBtn = true
                this.PUT('/otherReturnOut/outFinish', wmsOtherReturnOutDO, true).then(res => {
                    this.$message.success('出库成功');
                    this.back();
                }).finally(() => {
                    this.dialogVisible = false;
                    this.disabledBtn = false;
                })
        },
        checkData(flag) {
            let parent = document.getElementById('out_table');
            let index = 0;
            let num = -1;
            for(let i=0;i<this.tableData.otherReturnOutDetailList.length; i++){
                let d = this.tableData.otherReturnOutDetailList[i].realOutInNum;
                if(flag != 0){
                    if(d === '' || d === null){
                        this.$message.warning('出库数量不能为空！');
                        num = i;
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
        width: 100%;
        .icon{
            font-size: 18px;
            color: #409EFF;
            cursor:pointer;
            position: absolute;
            top: 8px;
            right:  1.4%;
            z-index: 100
        }
    }
    .otherOutResult{
        min-width: 1500px;
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



<template>
  <div class="stockorderaudit">
    <el-form label-width="125px" size="mini">
        <el-row :span="24">
            <el-col :span="6">
                <el-form-item label="库存调整单编号：">
                    <el-input v-model="searchParams.stockAdjustCode"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="业务类型：">
                    <el-select v-model="searchParams.businessType"  filterable placeholder="请选择">
                        <el-option
                            v-for="item in businessTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="提交审核时间："  size="mini">
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.startSubmitTime"  :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col style="text-align: center" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="" size="mini">
                            <el-date-picker v-model="searchParams.endSubmitTime"   type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
            </el-col>
            <el-col :span="6">&nbsp;</el-col>
        </el-row>
        <el-row :span="24">
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="6">
                <el-form-item size="mini">
                    <el-button type="primary" @click="search" icon="search">查询</el-button>
                    <el-button type="default" @click="resetForm" icon="circle-cross">重置</el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    <el-tabs v-model="searchParams.reviewStatus"  @tab-click="handleClick">
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="已审核" name="1"></el-tab-pane>
        <el-tab-pane label="全部" name='2'></el-tab-pane>
    </el-tabs>
    <!-- 待审核 -->
    <el-table v-show="searchParams.reviewStatus == 0 || searchParams.reviewStatus == ''" :data="tableData" border style="width: 100%">
        <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
        <el-table-column align="center" prop="" label="库存调整单编号" >
            <template slot-scope="scope">
                <span @click="toAdjustDetail(scope.row.id, 1, scope.row.reviewStatus)" style="color:#409EFF; cursor: pointer">{{ scope.row.stockAdjustCode }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="businessTypeDesc" label="业务类型" ></el-table-column>
        <el-table-column align="center" prop="submitOperator" label="提交人" > </el-table-column>
        <el-table-column align="center" prop="reviewStatusDesc" label="审核状态" ></el-table-column>
        <!-- <el-table-column  align="center" prop="auditResult" label="审核结果" >
             <template slot-scope="scope">
                <span v-show="scope.row.status === 1">暂存</span>
                <span v-show="scope.row.status === 2">提交审核</span>
                <span v-show="scope.row.status === 3">审核通过</span>
                <span v-show="scope.row.status === 4">审核驳回</span>
                <span v-show="scope.row.status === 5">通知仓库</span>
                <span v-show="scope.row.status === 6">作废</span>
            </template>
        </el-table-column> -->
        <el-table-column align="center" prop="submitTime" label="提交审核时间" > </el-table-column>
        <el-table-column align="center" prop="" label="操作" >
            <template slot-scope="scope">
                <el-button @click="toAdjustDetail(scope.row.id, 0, scope.row.reviewStatus)" type="text">审核</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 已审核 -->
    <el-table v-show="searchParams.reviewStatus == 1" :data="tableData" border style="width: 100%">
        <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
        <el-table-column align="center" prop="" label="库存调整单编号" >
            <template slot-scope="scope">
                <span @click="toAdjustDetail(scope.row.id, 1, scope.row.reviewStatus)" style="color:#409EFF; cursor: pointer">{{ scope.row.stockAdjustCode }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="businessTypeDesc" label="业务类型" ></el-table-column>
        <el-table-column align="center" prop="submitOperator" label="提交人" > </el-table-column>
        <el-table-column align="center" prop="reviewStatusDesc" label="审核状态" ></el-table-column>
        <el-table-column  align="center" prop="docStatus" label="审核结果" >
            <template slot-scope="scope">
                <span style="color:#009900" v-if="scope.row.docStatus > 2">审核通过</span>
                <span style="color:#FF0000" v-else-if="scope.row.docStatus < 2">审核驳回</span>
                <span  v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="submitTime" label="提交审核时间" > </el-table-column>
    </el-table>

    <!-- 全部 -->
    <el-table v-show="searchParams.reviewStatus == 2" :data="tableData" border style="width: 100%">
        <el-table-column type="index" align="center" prop="" label="序号" width="50">  </el-table-column>
        <el-table-column align="center" prop="" label="库存调整单编号" >
            <template slot-scope="scope">
                <span @click="toAdjustDetail(scope.row.id, 1, scope.row.reviewStatus)" style="color:#409EFF; cursor: pointer">{{ scope.row.stockAdjustCode }}</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="businessTypeDesc" label="业务类型" ></el-table-column>
        <el-table-column align="center" prop="submitOperator" label="提交人" > </el-table-column>
        <el-table-column align="center" prop="reviewStatusDesc" label="审核状态" ></el-table-column>
        <el-table-column  align="center" prop="auditResult" label="审核结果" >
            <template slot-scope="scope">
                <span style="color:#009900" v-if="scope.row.docStatus > 2">审核通过</span>
                <span style="color:#FF0000" v-else-if="scope.row.docStatus < 2">审核驳回</span>
                <span  v-else>-</span>
            </template>
        </el-table-column>
        <el-table-column align="center" prop="submitTime" label="提交审核时间" > </el-table-column>
        <el-table-column align="center" prop="" label="操作" >
            <template slot-scope="scope">
                <el-button v-if="scope.row.docStatus == 2" @click="toAdjustDetail(scope.row.id, 0, scope.row.reviewStatus)" type="text">审核</el-button>
                <span v-else>-</span>
            </template>
        </el-table-column>
    </el-table>
    <div class="page" style="text-align:right; padding: 10px 0;">
        <el-pagination
            @size-change="changeSize"
            @current-change="changeNumber"
            :current-page="searchParams.pageNumber"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="searchParams.totalCount < 0 ? 0 : searchParams.totalCount">
        </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'stockorderaudit',
    data() {
        return {
            activeName: '',
            searchParams: {
                stockAdjustCode: '', // 库存调整单号
                businessType: '', // 库存调整业务类型0-库存盘点 1-正品转残品 2-残品转正品 3-库存转化 4-系统原因
                startSubmitTime: '', // 开始时间
                endSubmitTime: '', // 结束时间
                reviewStatus: '0', // 审核状态
                pageNumber: 1,
                pageSize: 10,
                totalCount: 0
            },
            businessTypeOptions: [{
                label: '全部',
                value: ''
            }, {
                label: '库存盘点',
                value: '0'
            }, {
                label: '正品转残品',
                value: '1'
            }, {
                label: '残品转正品',
                value: '2'
            }, {
                label: '库存转化',
                value: '3'
            }, {
                label: '系统原因',
                value: '4'
            }],
            warehouseNameOptions: [],
            tableData: []
        };
    },
    mounted: function() {
        this.initData(this.searchParams);
    },
    methods: {
      checkedBusinessType(val) {
          let str = '';
          this.businessTypeOptions.forEach(item => {
            if (val && val == item.value) {
              str = item.label;
            }
          });
          return str;
        },
        // 跳转审核页面
        toAdjustDetail(id, flag, status) {
          this.$router.push({
            path: '/stockorderaudit/stockorderdetail/' + id,
            query: {
              flag,
              isAuditStatus: status
            }
          });
        },
        search() {
            if (this.searchParams.startSubmitTime && this.searchParams.endSubmitTime && this.searchParams.startSubmitTime > this.searchParams.endSubmitTime) {
                return this.$message.warning('开始时间不得大于结束时间');
            }
            this.searchParams.pageNumber = 1;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            this.initData(data);
        },
        resetForm() {
            for (let obj in this.searchParams) {
                if (obj === 'reviewStatus') {
                    continue;
                } else {
                    this.searchParams[obj] = '';
                }
            }
            this.searchParams.pageNumber = 1;
            this.searchParams.pageSize = 10;
            this.searchParams.totalCount = 0;
            this.searchParams.reviewStatus = '0';
            let data = JSON.parse(JSON.stringify(this.searchParams));
            this.initData(data);
        },
        changeSize(val) {
            this.searchParams.pageSize = val;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            this.initData(data);
        },
        changeNumber(val) {
            this.searchParams.pageNumber = val;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            this.initData(data);
        },
        handleClick(current) {
            this.tableData = [];
            this.searchParams.totalCount = 0;
            this.searchParams.pageNumber = 1;
            this.searchParams.pageSize = 10;
            let data = JSON.parse(JSON.stringify(this.searchParams));
            this.initData(data);
        },
        toRaudit(row) {
            this.$router.push({path: '/otheraudit/otherdetail/' + row.outInCode});
        },
        toAuditDetail(row) {
            this.$router.push(
                {path: '/otheraudit/otherdetail/' + row.outInCode, query: {flag: 'edit'}}
            );
        },
        // 初始化数据
        initData(data) {
            this.GET('/stockAdjust/findReviewPage', data).then(res => {
                this.tableData = res.body.objects;
                this.searchParams.totalCount = res.body.recordTotal;
            });
        }
    }
  };
</script>
<style lang="stylus" scoped>

</style>

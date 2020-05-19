<template>
    <div class="warehouse-manage">
        <el-form :model="params" ref="queryForm" label-width="130px" class="demo-ruleForm" size="medium">
            <el-row>
                <el-col :span="6">
                    <el-form-item label="仓库名称:" prop="name">
                        <el-input v-model="params.name" placeholder="仓库名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="仓库状态" prop="isValid">
                        <el-select v-model="params.isValid" placeholder="仓库状态">
                            <el-option label="请选择" value=""></el-option>
                            <el-option label="启用" value="1"></el-option>
                            <el-option label=停用 value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :offset="2" :span="6">
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="search">查询</el-button>
                        <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <table-pagination
        :loading="loading"
        ref="mainTable"
        @getPageData="getPageData"
        :params="params"
        :pageData="pageData"
        :columns="columns"
        >
    </table-pagination>
    </div>
</template>    
<script>
import { createNamespacedHelpers } from 'vuex'
import notify from '@/utils/notify'
import ElRow from 'element-ui/packages/row/src/row'
import ElCol from 'element-ui/packages/col/src/col'

const {mapState, mapActions} = createNamespacedHelpers('warehouseManage')
export default {
    components:{
        ElCol,
        ElRow
    },
    name: 'warehousing-warehouse-manage',
    data () {
        return {
            params: {
                start: 0,
                name: '',
                isValid: ''
            },
            columns: [
                {label: '仓库编号', field: 'code', width: '190',align:'center'},
                {label: '仓库名称', field: 'warehouseName', width: '190',align:'center'},
                {label: '仓库类型', field: 'warehouseTypeCode', width: '150',align:'center'},
                {label: 'SKU数量', field: 'skuNum', width: '150',align:'center'},
                {label: '货主仓库状态', field: 'ownerWarehouseState', width: '180',align:'center'},
                {label: '状态', field: 'isValid', width: '120',align:'center'},
                {label: '创建人', field: 'createOperator', width: '189',align:'center'},
                {label: '最近更新时间', field: 'updateTime', width: '200',align:'center'},
                {label: '货主管理', field: 'isValid', width: '150',align:'center'},
                {label: '商品管理', field: 'isValid', width: '150'},
                {
                label: '操作', 
                field: 'isValid', 
                width: '180',
                actions: [
                    {
                        label: '编辑',
                        type: 'primary'
                    }                    
                ]
                }
            ]
        }
    },
    computed: {
        ...mapState(['pageData','loading'])
    },
    methods: {
        search () {
            this.$refs['mainTable'].getPageData()
        },
        resetForm (formName) {
            this.$refs[formName].resetFields()
        },
        ...mapActions(['getPageData'])
    }
}
</script>

<template>
  <div id="printBuyIn">
    <div class="breadcrumb" v-show="isShowTab">
      <div v-show="isShow">
        <p v-show="isCode != '1'" :class="{active: isShopActive}" @click="toggle(1)">门店订单</p>
        <p v-show="isCode != '1'">|</p>
        <p :class="{active: isActive}" @click="toggle(2)">非门店订单出库</p>
      </div>
      <div v-show="!showHome">出库结果录入</div>
    </div>
    <!-- 门店订单 -->
    <div class="shop_order" v-if="isShopOrder">
      <!-- 表单 -->
      <el-form :model="shopParams" ref="queryForm" label-width="125px" class="demo-ruleForm" size="medium" id="print">
        <el-row :span="20">
          <el-col :span="6">
            <el-form-item label="发货单编号：" prop="allocateOutOrderCode" size="mini">
              <el-input v-model.trim="shopParams.outboundOrderCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="门店订单号：" prop="allocateOrderCode" size="mini">
              <el-input v-model.trim="shopParams.shopOrderCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="系统接收时间：" size="mini">
              <el-col :span="11">
                <el-form-item prop="startDate" size="mini">
                  <el-date-picker v-model="shopParams.startDate" :clearable='false' type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col style="text-align: center" :span="2">-</el-col>
              <el-col :span="11">
                <el-form-item prop="endDate" size="mini">
                  <el-date-picker v-model="shopParams.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="mini">
              <el-button type="primary" icon="search" @click="searchShop">查询</el-button>
              <el-button type="default" icon="circle-cross" @click="resetForm('queryForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 分页 -->
      <div class="paging">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="shopParams.pageNumber" :page-sizes="[10, 20, 30, 50, 100]" :page-size="shopParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
      <!-- 表格 -->
      <div class="table_list">
        <el-table ref="tableRow1" highlight-current-row :data="shopOrderList" border style="width: 100%" height="400" @row-click="cellShopClick">
          <el-table-column type="index" align="center" label="序号" width="50">
          </el-table-column>
          <el-table-column property="outboundOrderCode" :show-overflow-tooltip='true' align="center" label="发货单编号">
          </el-table-column>
          <el-table-column property="shopOrderCode" :show-overflow-tooltip='true' align="center" label="门店订单号">
          </el-table-column>
          <el-table-column property="receiver" align="center" label="收货人">
            <template slot-scope="scope">
              <div v-if="scope.row.receiver">{{scope.row.receiver}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column property="totalItemNum" align="center" label="商品总数量">
          </el-table-column>
          <el-table-column align="center" label="出库状态">
            <template slot-scope="scope">
              {{ statasflag(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column property="payTime" align="center" label="付款时间" :show-overflow-tooltip='true'>
          </el-table-column>
          <el-table-column property="createTime" align="center" label="系统接收时间" :show-overflow-tooltip='true'>
          </el-table-column>
        </el-table>
      </div>
      <!-- 列表明细 -->
      <el-tabs class="table_detail" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品明细" name="detail">
          <el-table highlight-current-row :data="detailInfo.wmsOrderOutDetailList" style="width: 100%">
            <el-table-column type="index" align="center" label="序号" width="50">
            </el-table-column>
            <el-table-column property="skuName" align="center" label="SKU名称" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column property="skuCode" align="center" label="商品SKU编号" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column property="specInfo" align="center" label="规格" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column property="barCode" align="center" label="条形码" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column property="payment" align="center" label="实付总金额（元）">
            </el-table-column>
            <el-table-column property="shouldOutNum" align="center" label="应发商品数量">
            </el-table-column>
            <el-table-column property="realOutNum" align="center" label="实发商品数量">
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收货信息" name="info">
          <el-row :span="20">
            <el-col :span="6">
              收货人姓名：{{detailInfo.receiver}}
            </el-col>
            <el-col :span="6">
              收货人手机号：{{detailInfo.receiverPhone}}
            </el-col>
            <el-col :span="6">
              收货省份.城市.区域：{{detailInfo.receiverProvince}}.{{detailInfo.receiverCity}}.{{detailInfo.receiverDistrict}}
            </el-col>
            <el-col :span="6" style="height:auto">
              收货详细地址：
              <span>{{detailInfo.receiverAddress}}</span>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="rizhi">
          <div class="header-btn-right">
            <el-pagination @size-change="handleLogSizeChange" @current-change="handleLogCurrentChange" :current-page="logParams.pageNumber" :page-sizes="[10, 20, 30, 50, 100]" :page-size="logParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logTotal">
            </el-pagination>
          </div>
          <el-table highlight-current-row :data="logTableList" style="width: 100%">
            <el-table-column prop="operation" align="center" label="动作"></el-table-column>
            <el-table-column prop="operator" align="center" label="操作人"></el-table-column>
            <el-table-column prop="operateTime" align="center" label="操作时间" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="remark" align="center" label="备注"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 非门店订单出库 -->
    <div class="" v-if="!isShopOrder">
      <div class="printHome" v-show="showHome">
        <el-form :model="params" ref="queryForm" label-width="125px" class="demo-ruleForm" size="medium" id="print">
          <el-row :span="20">
            <el-col :span="6">
              <el-form-item label="发货单编号：" size="mini">
                <el-input v-model.trim="params.outboundOrderCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="销售渠道订单号：" size="mini">
                <el-input v-model.trim="params.shopOrderCode" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="收货人：" size="mini">
                <el-input v-model.trim="params.receiver" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出库状态：" prop="status" size="mini">
                <el-select v-model="params.status" placeholder="">
                  <el-option v-for="(item,index) in goodStatus" :key="index" :label="item.value" :value="item.label"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="height: 13px;"></div>
          <el-row :span="20">
            <el-col :span="6">
              <el-form-item label="所属业务线：">
                <el-form-item prop="statusOrder" size="mini">
                  <el-select v-model="params.channelCode" @change="chooseChannel" placeholder="">
                    <el-option v-for="(item,index) in channelsList" :key="index" :label="item.name" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="销售渠道：">
                <el-form-item prop="statusOrder" size="mini">
                  <el-select v-model="params.sellChannelCode" :disabled="isDisbaled" placeholder="请先选择业务线">
                    <el-option v-for="(item,index) in sellChannelsList" :key="index" :label="item.sellName" :value="item.sellCode"></el-option>
                  </el-select>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="系统接收时间：" size="mini">
                <el-col :span="11">
                  <el-form-item prop="startDate" size="mini">
                    <el-date-picker v-model="params.startDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item prop="endDate" size="mini">
                    <el-date-picker v-model="params.endDate" type="date" :clearable='false' placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" style="width: 100%">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="6">
              <el-form-item label="" prop="purchaseName" size="mini">
              </el-form-item>
            </el-col> -->
            <el-col :span="6">
              <el-form-item size="mini">
                <el-button type="primary" icon="search" @click="searchUnShop">查询</el-button>
                <el-button type="default" icon="circle-cross" @click="resetUnShopForm()">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="header-btn">
          <div class="header-btn-left">
            <el-button type="primary" @click="printBtn" plain size="mini">打印拣货单</el-button>
            <el-button type="primary" @click="exportOrderExcel" :disabled="shopUnOrderList && !shopUnOrderList.length" size="mini">订单导出</el-button>
          </div>
          <div class="header-btn-right">
            <el-pagination @size-change="handleUnShopSizeChange" @current-change="handleUnShopCurrentChange" :current-page="params.pageNumber" :page-sizes="[5, 10, 15, 20]" :page-size="params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagetotal">
            </el-pagination>
            <!-- <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pages.pageSize" layout="total, prev, pager, next, jumper" :total="pagetotal">
            </el-pagination> -->
          </div>
        </div>

        <el-table ref="tableRow2" highlight-current-row @select-all="selectAll" @select="selectBox" height="400" @row-click="cellShopClick" border :data="shopUnOrderList" style="width: 100%">
          <el-table-column align="center" fixed="left" :selectable="checkSelectable" type="selection" width="50">
          </el-table-column>
          <el-table-column align="center" type=index label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="outboundOrderCode" :show-overflow-tooltip='true' label="发货单编号"></el-table-column>
          <el-table-column align="center" prop="shopOrderCode" :show-overflow-tooltip='true' label="销售渠道订单号"></el-table-column>
          <el-table-column align="center" prop="channelName" label="所属业务线"></el-table-column>
          <el-table-column align="center" prop="sellChannelName" label="销售渠道"></el-table-column>
          <el-table-column align="center" prop="receiver" label="收货人"></el-table-column>
          <el-table-column align="center" prop="totalItemNum" label="商品总数量"></el-table-column>
          <el-table-column align="center" prop="" label="出库状态">
            <template slot-scope="scope">
              {{ statasflag(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="payTime" label="付款时间" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column align="center" prop="createTime" label="系统接收时间" :show-overflow-tooltip='true'></el-table-column>
          <el-table-column class="no" align="center" prop="" label="操作" fixed="right">
            <template slot-scope="scope">
              <div v-if="scope.row.status == 0" @click.stop="hideHome(scope.row.outboundOrderCode)">
                <el-button type="text" size="mini">出库结果录入</el-button>
              </div>
              <div v-else>-</div>
            </template>
          </el-table-column>
        </el-table>
        <!-- 单个商品信息详情及其他 -->
        <el-tabs v-model="activeTab" class="search_outparams">
          <el-tab-pane label="商品明细" name="goods">
            <el-table highlight-current-row :data="detailInfoRow.wmsOrderOutDetailList" border style="width: 100%">
              <el-table-column type="index" align="center" label="序号" width="50">
              </el-table-column>
              <el-table-column prop="skuName" align="center" label="SKU名称" :show-overflow-tooltip='true'>
              </el-table-column>
              <el-table-column prop="skuCode" align="center" label="商品SKU编号" :show-overflow-tooltip='true'>
              </el-table-column>
              <el-table-column prop="specInfo" align="center" label="规格" :show-overflow-tooltip='true'>
              </el-table-column>
              <el-table-column prop="barCode" align="center" label="条形码" :show-overflow-tooltip='true'>
              </el-table-column>
              <el-table-column prop="payment" align="center" label="实付总金额（元）">
              </el-table-column>
              <el-table-column prop="shouldOutNum" align="center" label="应发商品数量">
              </el-table-column>
              <el-table-column prop="realOutNum" align="center" label="实发商品数量">
              </el-table-column>
              <!-- <el-table-column prop="status" align="center" label="商品发货状态">
                  <template slot-scope="scope">
                      <span v-show="scope.row.status == 1">仓库接收失败</span>
                      <span v-show="scope.row.status == 2">等待仓库发货</span>
                      <span v-show="scope.row.status == 4">全部发货</span>
                      <span v-show="scope.row.status == 5">部分发货</span>
                      <span v-show="scope.row.status == 6">已取消</span>
                  </template>
              </el-table-column> -->
              <el-table-column prop="status" align="center" label="是否已取消">
                  <template slot-scope="scope">
                      <span v-if="scope.row.status == 6">已取消</span>
                      <span v-else>未取消</span>
                  </template>
              </el-table-column>
              <el-table-column label="物流信息" align="center">
                <el-table-column label="物流公司" align="center" :show-overflow-tooltip='true'>
                  <template slot-scope="scope">
                    <p v-if="scope.row.status == 6">-</p>
                    <div v-else class="border bordernone" v-for="(item, i) in scope.row.wmsOrderOutLogisticsDetailList" :key="i">
                      <p>{{item.logistictsName}}</p>
                      <!-- <el-input v-show="logisticList[i].isEditor" v-model="item.logistictsName" placeholder=""></el-input> -->
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="运单编号" align="center" :show-overflow-tooltip='true'>
                  <template slot-scope="scope">
                    <p v-if="scope.row.status == 6">-</p>
                    <div v-else class="border bordernone" v-for="(item, i) in scope.row.wmsOrderOutLogisticsDetailList" :key="i">
                      {{item.wayBill}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="商品数量" align="center">
                  <template slot-scope="scope">
                    <p v-if="scope.row.status == 6">-</p>
                    <div v-else class="border bordernone" v-for="(item, i) in scope.row.wmsOrderOutLogisticsDetailList" :key="i">
                      {{item.itemNum}}
                    </div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="inventoryType" align="center" label="物流信息">
                </el-table-column>
                <el-table-column prop="wayBill" align="center" label="运单编号">
                </el-table-column>
                <el-table-column prop="totalItemNum" align="center" label="商品数量">
                </el-table-column> -->
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="收货信息" name="sender">
            <el-row :gutter="20">
              <el-col :span="6">
                收货人姓名：{{detailInfoRow.receiver}}
              </el-col>
              <el-col :span="6">
                收货人手机号：{{detailInfoRow.receiverPhone}}
              </el-col>
              <el-col :span="6">
                收货省份.城市.区域：{{detailInfoRow.receiverProvince}}.{{detailInfoRow.receiverCity}}.{{detailInfoRow.receiverDistrict}}
              </el-col>
              <el-col :span="6" style="height:auto">
                收货详细地址：
                <span>{{detailInfoRow.receiverAddress}}</span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="其它信息" name="otherInfo">
            <el-row>
              <!-- <el-col style="margin-bottom: 15px;">
                <p style="display: inline-block; width: 300px;">运输物流：{{detailInfoRow.receiver}}</p>
                <p style="display: inline-block; width: 300px;">运单号：{{detailInfoRow.outboundOrderCode}}</p>
              </el-col> -->
              <el-col>
                <p>发货备注：{{detailInfoRow.memo}}</p>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="log">
            <div class="header-btn-right">
              <el-pagination @size-change="handleLogSizeChange" @current-change="handleLogCurrentChange" :current-page="logParams.pageNumber" :page-sizes="[10, 20, 30, 50, 100]" :page-size="logParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="logTotal">
              </el-pagination>
            </div>
            <el-table highlight-current-row border :data="logTableList" style="width: 100%">
              <el-table-column prop="operation" align="center" label="动作"></el-table-column>
              <el-table-column prop="operator" align="center" label="操作人"></el-table-column>
              <el-table-column prop="operateTime" align="center" label="操作时间" :show-overflow-tooltip='true'></el-table-column>
              <el-table-column prop="remark" align="center" label="备注"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 点击出库结果录入显示页 -->
      <div class="printChild" v-show="!showHome">
        <div class="secondHomeHead">
          <div class="header">
            发货单基本信息
          </div>
          <div class="content" style="border: none">
            <div>
              <p>
                <span class="title">发货单编号：</span>{{detailInfo.outboundOrderCode}}</p>
              <p>
                <span class="title">销售渠道订单号：</span>{{detailInfo.shopOrderCode}}</p>
              <p>
                <span class="title">所属业务线：</span>{{detailInfo.channelName}}</p>
              <p>
                <span class="title">销售渠道：</span>{{detailInfo.sellChannelName}}</p>
            </div>
            <div>
              <p>
                <span class="title">收货人：</span>{{detailInfo.receiver}}</p>
              <p>
                <span class="title">收货人手机号：</span>{{detailInfo.receiverPhone}}</p>
              <p>
                <span class="title">收货省份.城市.区域：</span>{{detailInfo.receiverProvince}}.{{detailInfo.receiverCity}}.{{detailInfo.receiverDistrict}}</p>
              <p>
                <span class="title">收货详细地址：</span>{{detailInfo.receiverAddress}}</p>
            </div>
          </div>
          <div class="header">
            商品出库信息
          </div>
        </div>

        <!-- 商品出库信息列表 -->
        <!-- 表单 -->
        <div class="search_outparams">
          <el-button type="primary" :disabled="!detailList.length" @click="addMsg" size="mini">+ 新增包裹信息</el-button>
        </div>
        <!-- 表格 -->
        <div style="width: 100%;" class="detaile" v-if="detailInfo">
          <el-table highlight-current-row border :data="detailInfo.wmsOrderOutDetailList" style="width: 100%">
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column prop="skuCode" align="center" label="SKU编号" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="skuName" align="center" label="SKU名称" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="specInfo" align="center" label="规格" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="barCode" align="center" label="条形码" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="shouldOutNum" align="center" label="应发商品数量"></el-table-column>
            <el-table-column prop="realOutNum" align="center" label="实发商品数量">
              <template slot-scope="scope">
                <p v-if="scope.row.realOutNum === '' || scope.row.realOutNum === null">-</p>
                <p v-else>{{scope.row.realOutNum}}</p>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="status" align="center" label="商品发货状态">
                <template slot-scope="scope">
                    <span v-show="scope.row.status == 1">仓库接收失败</span>
                    <span v-show="scope.row.status == 2">等待仓库发货</span>
                    <span v-show="scope.row.status == 4">全部发货</span>
                    <span v-show="scope.row.status == 5">部分发货</span>
                    <span v-show="scope.row.status == 6">已取消</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="status" align="center" label="是否已取消">
                  <template slot-scope="scope">
                      <span v-if="scope.row.status == 6">已取消</span>
                      <span v-else>未取消</span>
                  </template>
              </el-table-column>
            <el-table-column align="center" label="物流信息">
              <el-table-column label="物流公司" align="center" :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <div v-if="scope.row.wmsOrderOutLogisticsDetailList && !scope.row.wmsOrderOutLogisticsDetailList.length">-</div>
                  <div v-else class="border bordernone" v-for="(item, i) in scope.row.wmsOrderOutLogisticsDetailList" :key="i">
                    <p>{{item.logistictsName}}</p>
                    <!-- <el-input v-show="logisticList[i].isEditor" v-model="item.logistictsName" placeholder=""></el-input> -->
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="运单编号" align="center" :show-overflow-tooltip='true'>
                <template slot-scope="scope">
                  <div v-if="scope.row.wmsOrderOutLogisticsDetailList && !scope.row.wmsOrderOutLogisticsDetailList.length">-</div>
                  <div v-else class="border bordernone" v-for="(item, i) in scope.row.wmsOrderOutLogisticsDetailList" :key="i">
                    {{item.wayBill}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="商品数量" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.wmsOrderOutLogisticsDetailList && !scope.row.wmsOrderOutLogisticsDetailList.length">-</div>
                  <div v-else class="border bordernone" v-for="(item, i) in scope.row.wmsOrderOutLogisticsDetailList" :key="i">{{item.itemNum}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <div v-if="scope.row.wmsOrderOutLogisticsDetailList && !scope.row.wmsOrderOutLogisticsDetailList.length">-</div>
                  <div v-else class="border bordernone" v-for="(item, i) in scope.row.wmsOrderOutLogisticsDetailList" :key="i">
                    <el-button type="text" size="mini" @click.native="handleEdit(scope.$index,i, item)">修改</el-button>
                    <el-button type="text" size="mini" @click="handleDelete(scope.$index,i, item)">删除</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
        </div>

        <div class="second-home-remark">
          <div :cols="5">发货备注：</div>
          <el-input style="width:30%;" type="textarea" maxlength='200' placeholder="实发数量＜应发数量时必填" v-model="memo"></el-input>
        </div>
        <div class="second-home-footer">
          <el-button type="primary" size="mini" @click="saveData('0')">保存</el-button>
          <el-button type="primary" size="mini" @click="saveData('1')">出库完成</el-button>
          <el-button size="mini" @click="backHome">取消</el-button>
          <!-- <button @click="saveData('0')" class="usualBtn blueBtn">保存</button>
          <button @click="saveData('1')" class="usualBtn blueBtn">出库完成</button>
          <button @click="backHome" class="usualBtn ">取消</button> -->
        </div>
      </div>
      <!-- 新增包裹信息 -->
      <div class="add_msg">
        <el-dialog title="新增包裹信息" :visible.sync="dialogFormVisible">
          <!-- <el-form :model="addParams">
            <el-row :span="20">
              <el-col :span="8">
                <el-form-item class="red_tip" label="快递公司" label-width="125px">
                  <el-select v-model="addParams.logistictsCode" placeholder="请选择公司名称">
                    <el-option v-for="(item, i) in companyList" :key="i" :label="item.logisticsCorporationName" :value="item.logisticsCorporationCode" size='mini'>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="运单编号" label-width="125px">
                  <el-input v-model.trim="addParams.wayBill" auto-complete="off"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form> -->
          <div class="search_outparams">
            <p>
              <span class="title">
                <span class="red_tip">*</span>快递公司：</span>
              <span class="desc">
                <el-select clearable @change="companyChange" v-model.trim="addParams.logistictsCode" size="mini" filterable placeholder="请选择公司名称">
                  <el-option v-for="(item, i) in companyList" :key="i" :label="item.logisticsCorporationName" :value="item.logisticsCode" size='mini'>
                  </el-option>
                </el-select>
              </span>
            </p>
            <p>
              <span class="title">
                <span class="red_tip">*</span>运单编号：</span>
              <span class="desc">
                <el-input v-model.trim="addParams.wayBill" :maxlength='50' size="mini" placeholder=""></el-input>
              </span>
            </p>
          </div>
          <p style="line-height: 30px;">请先勾选包裹中的SKU: </p>
          <el-table class="data_list" highlight-current-row border ref="multipleTable" :data="detailList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" fixed="left" width="50" align="center">
            </el-table-column>
            <el-table-column type="index" label="序号" align="center" width="50">
            </el-table-column>
            <el-table-column property="skuCode" label="SKU编号" align="center" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column property="skuName" label="SKU名称" align="center" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column property="specInfo" label="规格" align="center" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column property="barCode" label="条形码" align="center" :show-overflow-tooltip='true'></el-table-column>
            <el-table-column prop="status" align="center" label="是否已取消">
                  <template slot-scope="scope">
                      <span v-if="scope.row.status == 6">已取消</span>
                      <span v-else>未取消</span>
                  </template>
            </el-table-column>
            <el-table-column label="剩余发货数量" align="center">
              <template slot-scope="scope">
                <div>{{calcRemainCount(scope.row)}}</div>
              </template>
            </el-table-column>
            <el-table-column label="本包裹发货数量" align="center">
              <template slot-scope="scope">
                <el-input v-show="scope.row.isChecked" v-model="scope.row.itemNum" @change="outNumChange(scope.row.itemNum, scope.row.shouldOutNum)" placeholder="请输入内容"></el-input>
                <div v-show="!scope.row.isChecked" style="width: 100%; text-align: center;">-</div>
              </template>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="saveAndClose">保存后关闭</el-button>
            <el-button type="primary" size="mini" @click="saveAndAgain">保存后继续添加</el-button>
            <el-button @click="cancelBtn" size="mini">取消</el-button>
          </div>
        </el-dialog>
      </div>
      <div></div>
      <!-- 打印显示的div -->
      <div class="print_screen" v-for="(data, i) in printData" :key="i" v-show="isListShow">
        <h3>订单出库拣货单</h3>
        <section v-if="data">
          <p>
            <span class="title">发货单编号：</span>
            <span class="desc">{{data.outboundOrderCode}}</span>
          </p>
          <p></p>
          <p></p>
          <p></p>
        </section>
        <section v-if="data">
          <p>
            <span class="title">销售渠道订单号：</span>
            <span class="desc">{{ data.shopOrderCode}}</span>
          </p>
          <p>
            <span class="title">商品总数量：</span>
            <span class="desc">{{ data.totalItemNum}}</span>
          </p>
          <p>
            <span class="title">所属业务线：</span>
            <span class="desc">{{ data.channelName }}</span>
          </p>
          <p>
            <span class="title">销售渠道：</span>
            <span class="desc">{{ data.sellChannelName}}</span>
          </p>
        </section>
        <section v-if="data">
          <p >
            <span class="title">收货人：</span>
            <span class="desc">{{ data.receiver}}</span>
          </p>
          <p >
            <span class="title">收货人手机号：</span>
            <span class="desc">{{ data.receiverPhone}}</span>
          </p>
          <p style="width: 49%">
            <span class="title">收件方省份.城市.地区：</span>
            <span class="desc">{{ data.receiverProvince}}.{{ data.receiverCity}}.{{ data.receiverDistrict }}</span>
          </p>
        </section>
        <p class="name">商品明细</p>
        <div class="table_list">
          <el-table :data="data.tableData" style="width: 100%; border: solid 1px #ccc;" border>
            <el-table-column align="center" type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column prop="skuCode" label="SKU编号" align="center">
            </el-table-column>
            <el-table-column prop="skuName" label="SKU名称" align="center">
            </el-table-column>
            <el-table-column prop="specInfo" label="规格" align="center">
            </el-table-column>
            <el-table-column prop="barCode" label="条形码" align="center">
            </el-table-column>
            <!-- <el-table-column label="调拨库存类型" align="center">
              <template slot-scope="scope">
                {{ typeChange(scope.row.inventoryType ) }}
              </template>
            </el-table-column> -->
            <el-table-column prop="shouldOutNum" label="应发数量" align="center">
            </el-table-column>
            <el-table-column prop="needSendNum" label="剩余发货数量" align="center">
            </el-table-column>
            <el-table-column prop="" label="拣货情况" align="center">
            </el-table-column>
          </el-table>
        </div>
        <div class="page_break"></div>
      </div>

      <!-- 编辑弹窗 -->
      <el-dialog title="物流信息" class="wuliu" :visible.sync="isEidtorShow">
        <el-form :model="editorParams" label-width="120px">
          <el-form-item label="快递公司">
            <el-select clearable @change="companyChange" v-model="editorParams.logistictsCode" size="mini" filterable placeholder="请选择公司名称">
              <el-option v-for="(item, i) in companyList" :key="i" :label="item.logisticsCorporationName" :value="item.logisticsCode" size='mini'>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="运单号：">
            <el-input v-model.trim="editorParams.wayBill" :maxlength='50' size="mini" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量：">
            <el-input v-model.trim="editorParams.itemNum" size="mini" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="活动区域" >
      <el-select v-model="form.region" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
    </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isEidtorShow = false" size="mini">取 消</el-button>
          <el-button type="primary" size="mini" @click="makeSure">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import Vuex, { mapActions, mapState } from 'vuex';
import tools from '@/utils/tools';
import purchase from '@/api/purchase';
import select from '@/api/select';
import axios from '@/api/interception';
import Vue from 'vue';
import qs from 'qs';

export default {
  data() {
    return {
      remainOutNum: 0,
      isShow: false, // 默认不显示仓库
      lastCount: 0, // 修改时不能超过的数量
      defCountList: [], // 默认出库剩余数字数组
      isCode: '', // 是否为纯仓库
      printId: [],
      memo: '', // 发货备注
      paramsIndexArr: [], // 索引值参数
      addParams: {
        wayBill: '', // 运单号
        logistictsCode: '', // 物流公司编码
        logistictsName: '', // 物流公司名称
        itemNum: '' // 商品数量
      },
      editorParams: {
        wayBill: '', // 运单号
        logistictsCode: '', // 物流公司编码
        logistictsName: '', // 物流公司名称
        itemNum: '' // 商品数量
      },
      isEidtorShow: false, // 编辑弹窗
      logisticList: [], // 物流控制布尔值
      multipleSelection: [], // 多选
      isDisbaled: true, // 是否可以操作
      detailList: [], // 明细table
      detailInfo: {}, // 详情
      detailInfoRow: {}, // 非门店详情
      shopUnOrderList: [], // 门店订单列表
      outboundOrderCode: '', // 发货单编号
      shopOrderList: [], // 门店订单列表
      dialogFormVisible: false, // 增加包裹信息模态框
      // 门店列表请求参数
      shopParams: {
        outboundOrderCode: '', // 发货单编号
        shopOrderCode: '', // 销售渠道订单号
        startDate: '', // 开始日期
        endDate: '', // 截止日期
        pageNumber: 1, // 页码
        pageSize: 10 // 条数
      },
      logParams: {
        // 日志入参
        pageSize: 10,
        pageNumber: 1,
        entityType: 'WmsOrderOut',
        entityId: ''
      },
      logTableList: [], // 日志列表
      logTotal: 0, // 日志总条数
      totalCount: 0, // 总条数
      isShopActive: true, // 默认点击
      isActive: false, // 点击非门店
      activeName: 'detail', // 选项卡默认展开名字
      isShopOrder: true, // 默认显示门店订单
      printData: [{ otherInfoDetail: { allocateOutOrderCode: '' } }], // 打印的数据
      printDisabled: true, // 默认打印为不可点
      companyList: [], //  物流公司列表
      channelsList: [], //  所属业务线列表
      sellChannelsList: [], //  销售渠道列表
      isRequie: false, // 列表中的实际出货量必填
      outParams: {
        // 保存订单参数
        waybillNo: '', // 运单号
        logisticsCorporationCode: '' // 公司code
      },
      arr: [], // 保存input输入值
      goodOutInfoList: [], // 商品出库信息列表
      otherInfoDetail: {}, // 获取其他信息和收货信息
      statusOrderList: [],
      isListShow: false, // 隐藏打印表格
      tableData: [
        {
          // 隐藏打印表格的数据
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          list: [
            {
              name: 'wang'
            },
            {
              name: 'yang'
            }
          ]
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          list: [
            {
              name: 'liang'
            },
            {
              name: 'xiang'
            }
          ]
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      goodStatus: [
        {
          value: '待出库',
          label: '0'
        },
        {
          value: '出库完成',
          label: '1'
        },
        {
          value: '已取消',
          label: '2'
        }
      ],
      textarea: '',
      childData: {},
      childNameList: ['入库单编号', '调拨单编号', '调出仓库'],
      childNameKey: [
        'allocateOutOrderCode',
        'allocateOrderCode',
        'outWarehouseName'
      ],
      childContentName: [
        '序号',
        'SKU编号',
        'SKU名称',
        '规格',
        '条形码',
        '调拨库存类型',
        '采购数量'
      ],
      showHome: true, // 是否显示主页
      activeTab: 'goods', // 切换名称
      allSelected: true, // 全选按钮
      headerTitles: [
        '序号',
        '调拨入库单编号',
        '调拨单编号',
        '调出仓库',
        '入库单联系人',
        '联系人电话',
        '入库单状态',
        '系统接收时间',
        '操作'
      ],
      currentPage: 1, // 翻页按键
      code: '', // 入库调拨的所选列表项的入库单编号
      id: '', // 调拨入库单ID
      params: {
        allocateOutOrderCode: '', // 发货单编号
        shopOrderCode: '', // 销售渠道订单号
        status: '', // 状态
        receiver: '', // 收货人
        channelCode: '', // 业务线编码
        sellChannelCode: '', // 销售渠道编码
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        pageNumber: 1, // 页码
        pageSize: 10 // 条数
      }, // 提交订单
      pagetotal: 10, // 调拨记录的总条数
      tableList: [], // 调拨入库分页数据对象
      // pages: {
      //   //分页参数
      //   pageSize: 5,
      //   pageNumber: 1
      // },
      goodsInfo: [], // 货物详情
      noticeInfo: {}, // 明细详情
      warehouseNoticeStatus: [], // 地址详情
      purchaseTypes: [], // 类型
      purchaseTypesMap: {},
      goodsColumns: [
        { label: 'SKU编号', field: 'skuCode', align: 'center' },
        { label: 'SKU名称', field: 'skuName', align: 'center' },
        { label: '规格', field: 'specNatureInfo', align: 'center' },
        { label: '条形码', field: 'barCode', align: 'center' },
        { label: '品牌名称', field: 'brandName', align: 'center' },
        {
          label: '调拨库存类型',
          field: 'inventoryType',
          align: 'center',
          formatter: (row, column, cellValue) => {
            if (row.inventoryType == 1) {
              return '正品';
            } else if (row.inventoryType == 2) {
              return '残次品';
            }
          }
        },
        { label: '实际出库数量', field: 'realOutNum', align: 'center' },
        {
          label: '仓库反馈入库信息',
          children: [
            {
              label: '实际入库总量',
              width: '120',
              align: 'center',
              field: 'realInNum'
            },
            {
              label: '正品入库数量',
              width: '120',
              align: 'center',
              field: 'nornalInNum'
            },
            {
              label: '残次品入库数量',
              width: '120',
              align: 'center',
              field: 'defectInNum'
            }
          ]
        }
      ],
      resultTable: [],
      operateData: [] // 操作日志的数据
    };
  },
  computed: {
    ...mapState('printBuyInStore', ['data', 'datalist', 'goodsInfos']),
    isShowTab() {
      return this.$store.state.isShowTab;
    }
  },
  methods: {
    ...mapActions('printBuyInStore', ['aList', 'aDetailList']),
    ceshi() {
      this.showHome = false;
    },
    // 计算剩余商品数量
    calcRemainCount(row) {
      // console.log('row: ', row);
      let count = 0;
      // if (row.wmsOrderOutLogisticsDetailList.length) {
      //   row.wmsOrderOutLogisticsDetailList.forEach(item => {
      //     count += item.itemNum * 1;
      //   });
      // }
      let defCount = row.shouldOutNumLast || row.needSendNum;
      if (row.shouldOutNumLast == '0') {
        defCount = 0;
      }
      return defCount - count;
    },
    chooseChannel(val) {
      console.log('选中的业务线：', val);
      if (val) {
        this.isDisbaled = false;
        this.params.sellChannelCode = '';
        this.getSellChannel(val);
      } else {
        this.isDisbaled = true;
      }
    },
    // 保存数据
    saveData(submitType) {
      let dataInfo = this.detailInfo;
      let length = dataInfo.wmsOrderOutDetailList.length;
      let reqParams = {};
      let orderDeatilArr = [];
      reqParams.outboundOrderCode = dataInfo.outboundOrderCode;
      reqParams.submitType = submitType;
      reqParams.memo = this.memo;
      dataInfo.wmsOrderOutDetailList.forEach(item => {
        let obj = {};
        if (item.wmsOrderOutLogisticsDetailList.length && item.state != 6) {
          obj.id = item.id;
          obj.status = item.status;
          obj.shouldOutNum = item.shouldOutNum;
          obj.realOutNum = item.realOutNum;
          obj.skuCode = item.skuCode;
          let subArr = [];
          item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
            let objSub = {};
            objSub.id = subItem.id;
            objSub.logistictsCode = subItem.logistictsCode;
            objSub.logistictsName = subItem.logistictsName;
            objSub.itemNum = subItem.itemNum;
            objSub.wayBill = subItem.wayBill;
            subArr.push(objSub);
          });
          obj.orderOutRecordLogisticsDetailVOList = subArr;

          orderDeatilArr.push(obj);
        }
      });
      reqParams.wmsOrderOutSkuDetailInfoList = orderDeatilArr;

      console.log('reqParams: ', reqParams);
      let isMore = false; // 判断实发大于应发数量
      let isLess = false; // 判断实发小于应发数量
      let lessArr = []; // 实际出库数量小于计划出库数量列表
      let result = ''; // 提示信息文字

      // 保存接口
      if (submitType == '0') {
        // console.log('进来了吗');
        this.PUT('/wmsOrderOut/recordLoginstics', reqParams).then(res => {
          console.log('保存数据：', res);
          if (res.code == '200') {
            this.$message({
              message: '数据保存成功',
              type: 'success'
            });
            // 返回非门店列表
            setTimeout(() => {
              this.isShopOrder = false;
              this.isShopActive = false;
              this.isActive = true;
              this.showHome = true;
              this.isShow = true;
              this.initUnShopData();
            }, 20);
          }
        });
      } else {
        if (
          reqParams.wmsOrderOutSkuDetailInfoList &&
          reqParams.wmsOrderOutSkuDetailInfoList &&
          reqParams.wmsOrderOutSkuDetailInfoList.length < 1
        ) {
          this.$message({
            message: '物流信息不能为空！',
            type: 'warning'
          });
          return;
        }
        let orderList = [];
        let isRepet = false;
        reqParams.wmsOrderOutSkuDetailInfoList.forEach(item => {
          console.log(item);
          // 添加订单编号和快递公司相同的判断
          if (item.orderOutRecordLogisticsDetailVOList && item.orderOutRecordLogisticsDetailVOList.length) {
            item.orderOutRecordLogisticsDetailVOList.forEach(subItem => {
              let obj = {};
              obj.logistictsCode = subItem.logistictsCode;
              obj.wayBill = subItem.wayBill;
              if (JSON.stringify(orderList).indexOf(JSON.stringify(obj)) > -1) {
                isRepet = true;
              } else {
                orderList.push(obj);
              }
            });
          }
          if (item.realOutNum < item.shouldOutNum) {
            lessArr.push(item.skuCode);
          }
          if (item.shouldOutNum < item.realOutNum) {
            isMore = true;
            this.$message({
              message: '实发数量不得大于应发数量',
              type: 'warning'
            });

          } else if (item.shouldOutNum > item.realOutNum) {
            isLess = true;
            return;
          }


        });
        console.log();
        // 判断
        if (isMore) {
          return;
        }
        if (isLess && !this.memo) {
          this.$message({
            message: '存在SKU的实发数量小于应发数量，请填写“发货备注”！',
            type: 'warning'
          });
          return;
        }
        if (this.memo.length > 200) {
          this.$message({
            message: '备注长度不能超过200个字符',
            type: 'warning'
          });
          return;
        }

        // if (isRepet) {
        //   this.$message({
        //     message: '该运单号已存在！',
        //     type: 'warning'
        //   });
        //   return;
        // }

        if (lessArr.length) {
          result = `[${lessArr}]的实际出库数量小于计划出库数量，`;
        } else {
          result = '';
        }
        this.$confirm(
          '确定后将不能再修改数据!',
          `${result}您确定“出库完成”吗？`,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }
        )
          .then(() => {
            this.PUT('/wmsOrderOut/recordLoginstics', reqParams).then(res => {
              console.log('保存数据：', res);
              if (res.code == '200') {
                this.$message({
                  message: '出库完成',
                  type: 'success'
                });
                // 返回非门店列表
                setTimeout(() => {
                  this.isShopOrder = false;
                  this.isShopActive = false;
                  this.isActive = true;
                  this.showHome = true;
                  this.initUnShopData();
                }, 20);
              }
            });
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
      }
    },
    // 编辑 确定按钮
    makeSure() {
      if (!this.editorParams.logistictsCode) {
        this.$message({
          message: '请选择物流公司!',
          type: 'warning'
        });
        return;
      }
      if (!this.editorParams.wayBill) {
        this.$message({
          message: '请输入运单号!',
          type: 'warning'
        });
        return;
      }
      if (!this.editorParams.itemNum) {
        this.$message({
          message: '请输入商品数量',
          type: 'warning'
        });
        return;
      }
      let Reg = /^[0-9]+$/;
      if (
        this.editorParams.itemNum <= 0 ||
        !Reg.test(this.editorParams.itemNum)
      ) {
        this.$message({
          message: '商品数量只能为正整数',
          type: 'warning'
        });
        return;
      }
      if (this.editorParams.itemNum > this.lastCount) {
        this.$message({
          message: '修改的商品数量不能超过剩余发货数量：' + this.lastCount,
          type: 'warning'
        });
        return;
      }
      // 添加订单编号和快递公司相同的判断
      let orderList = [];
      let isRepet = false;
      console.log(this.detailList);
      this.detailList.forEach(item => {
        if (item.wmsOrderOutLogisticsDetailList && item.wmsOrderOutLogisticsDetailList.length) {
          item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
            let obj = {};
            obj.logistictsCode = subItem.logistictsCode;
            obj.wayBill = subItem.wayBill;
            orderList.push(obj);
          });
        }
      });

      if (this.editorParams.wayBill && this.editorParams.logistictsCode) {
        let obj = {};
        obj.logistictsCode = this.editorParams.logistictsCode;
        obj.wayBill = this.editorParams.wayBill;
        console.log(obj);
        console.log(orderList);
        if (JSON.stringify(orderList).indexOf(JSON.stringify(obj)) > -1) {
            isRepet = true;
          }
      }

    //   if (isRepet) {
    //     this.$message({
    //       message: '该运单号已存在！',
    //       type: 'warning'
    //     });
    //     return;
    //   }
      console.log(this.editorParams);
      if (this.editorParams.logistictsCode) {
        this.companyList.forEach(item => {
          if (item.logisticsCode === this.editorParams.logistictsCode) {
            this.editorParams.logistictsName = item.logisticsCorporationName; // 查找公司名字
          }
        });
      }
      this.detailInfo.wmsOrderOutDetailList[
        this.paramsIndexArr[0]
      ].wmsOrderOutLogisticsDetailList[
        this.paramsIndexArr[1]
      ].itemNum = this.editorParams.itemNum;
      this.detailInfo.wmsOrderOutDetailList[
        this.paramsIndexArr[0]
      ].wmsOrderOutLogisticsDetailList[
        this.paramsIndexArr[1]
      ].logistictsCode = this.editorParams.logistictsCode;
      this.detailInfo.wmsOrderOutDetailList[
        this.paramsIndexArr[0]
      ].wmsOrderOutLogisticsDetailList[
        this.paramsIndexArr[1]
      ].logistictsName = this.editorParams.logistictsName;
      this.detailInfo.wmsOrderOutDetailList[
        this.paramsIndexArr[0]
      ].wmsOrderOutLogisticsDetailList[
        this.paramsIndexArr[1]
      ].wayBill = this.editorParams.wayBill;
      this.isEidtorShow = false;

      this.detailList = this.detailInfo.wmsOrderOutDetailList;
      this.detailList.forEach((item, index) => {
        let count = 0;
        if (item.wmsOrderOutLogisticsDetailList.length) {
          item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
            count += subItem.itemNum * 1;
          });
          item.shouldOutNumLast = item.shouldOutNum - count;
        }
      });

      // 去掉剩余数量<0的数据
      let detailArr = [];
      this.detailList.forEach(item => {
        let shouldOutNumLast = item.shouldOutNumLast || item.shouldOutNum;
        if (
          item.shouldOutNumLast == '0' &&
          item.wmsOrderOutLogisticsDetailList.length
        ) {
          shouldOutNumLast = 0;
        }
        if (item.wmsOrderOutLogisticsDetailList.length == '0') {
          item.shouldOutNumLast = item.shouldOutNum;
        }
        if (shouldOutNumLast > 0) {
          detailArr.push(item);
        }
      });
      this.detailList = detailArr;
      this.getRealOutNum(); // 重新计算包裹
    },
    // 监听出库数量
    outNumChange(itemNum, shouldOutNum) {
      console.log(itemNum);
      console.log(shouldOutNum);
      if (itemNum > shouldOutNum) {
        this.$message({
          message: '发货数量不能大于剩余发货数量',
          type: 'warning'
        });
      }
    },
    // 增加包裹物流信息 保存并关闭
    saveAndClose(isShow = true) {
      let isNormal = true;
      let logisticInfo = {};
      // 查找公司名字
      if (this.addParams.logistictsCode) {
        this.companyList.forEach(item => {
          if (item.logisticsCode === this.addParams.logistictsCode) {
            this.addParams.logistictsName = item.logisticsCorporationName; // 查找公司名字
          }
        });
      }
      console.log('multipleSelection: ', this.multipleSelection);
      console.log(this.detailList);
      let arr = []; // 物流信息
      this.multipleSelection.forEach((item, i) => {
        let obj = {};
        obj.itemNum = item.itemNum;
        obj.id = item.id;
        arr.push(obj);
      });
      // let obj = {};
      // obj.itemNum = arr[0].itemNum;
      // obj.logistictsCode = this.addParams.logistictsCode;
      // obj.logistictsName = this.addParams.logistictsName;
      // obj.wayBill = this.addParams.wayBill;
      // this.detailInfo.wmsOrderOutDetailList[0].wmsOrderOutLogisticsDetailList.push(
      //   obj
      // );

      console.log('arr: ', arr);
      if (!this.addParams.logistictsCode) {
        this.$message({
          message: '请选择物流公司!',
          type: 'warning'
        });
        return;
      }
      if (!this.addParams.wayBill) {
        this.$message({
          message: '请输入运单号!',
          type: 'warning'
        });
        return;
      }
      let reg = /^[a-zA-Z0-9]+$/;
      if (!reg.test(this.addParams.wayBill)) {
        this.$message({
          message: '运单号只能输入英文、数字!',
          type: 'warning'
        });
        return;
      }
      if (this.addParams.wayBill.length > 50) {
        this.$message({
          message: '运单编号长度不能超过50个!',
          type: 'warning'
        });
        return;
      }
      if (!this.multipleSelection.length) {
        this.$message({
          message: '请先勾选包裹中的SKU!',
          type: 'warning'
        });
        return;
      }

      if (!arr.length) {
        this.$message({
          message: '请输入发货数量!',
          type: 'warning'
        });
        return;
      } else {
        let isNull = false;
        let patrn = /^[0-9]*$/;
        arr.forEach((item, index) => {
          if (item.itemNum == undefined || item.itemNum == '') {
            isNull = true;
            this.$message({
              message: '请输入发货数量!',
              type: 'warning'
            });
            return;
          }
          if (item.itemNum <= 0 || !patrn.test(item.itemNum)) {
            isNormal = false;
            this.$message({
              message: '发货数量只能为正整数!',
              type: 'warning'
            });
            return;
          }
          let cuttentI = -1;
          let defCount;
          this.detailList.forEach((detaiItem, i) => {
            if (detaiItem.id == item.id) {
              cuttentI = i;
            }
          });
          if (cuttentI >= 0) {
            defCount =
              this.detailList[cuttentI].shouldOutNumLast ||
              this.detailList[cuttentI].shouldOutNum;
          }

          if (this.detailList[cuttentI].shouldOutNumLast == '0') {
            defCount = 0;
          }
          console.log('发货数量：123', item.itemNum, defCount);
          if (item.itemNum > defCount) {
            isNormal = false;
            this.$message({
              message: '发货数量不得大于剩余发货数量!',
              type: 'warning'
            });

          }
        });
        if (isNull) {
          return;
        }
      }
      // 添加订单编号和快递公司相同的判断
      let orderList = [];
      let isRepet = false;
      console.log(this.detailList);
      this.detailList.forEach(item => {
        if (item.wmsOrderOutLogisticsDetailList && item.wmsOrderOutLogisticsDetailList.length) {
          item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
            let obj = {};
            obj.logistictsCode = subItem.logistictsCode;
            obj.wayBill = subItem.wayBill;
            orderList.push(obj);
          });
        }
      });

      if (this.addParams.wayBill && this.addParams.logistictsCode) {
        let obj = {};
        obj.logistictsCode = this.addParams.logistictsCode;
        obj.wayBill = this.addParams.wayBill;
        console.log(obj);
        console.log(orderList);
        if (JSON.stringify(orderList).indexOf(JSON.stringify(obj)) > -1) {
            isRepet = true;
          }
      }
    //   if (isRepet) {
    //     this.$message({
    //       message: '该运单号已存在！',
    //       type: 'warning'
    //     });
    //     return;
    //   }

      console.log(this.detailInfo.wmsOrderOutDetailList);
      if (isShow && isNormal) {
        console.log('物流信息数组：', arr);
        this.detailInfo.wmsOrderOutDetailList.forEach((item, i) => {
          arr.forEach((subItem, j) => {
            if (item.id == subItem.id) {
              let obj = {};
              obj.itemNum = subItem.itemNum;
              obj.logistictsCode = this.addParams.logistictsCode;
              obj.logistictsName = this.addParams.logistictsName;
              obj.wayBill = this.addParams.wayBill;
              this.detailInfo.wmsOrderOutDetailList[
                i
              ].wmsOrderOutLogisticsDetailList.push(obj);
            }
          });
        });
        console.log('商品物流信息：', this.detailList);

        this.detailList.forEach((item, index) => {
          let count = 0;
          if (item.wmsOrderOutLogisticsDetailList.length) {
            item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
              count += subItem.itemNum * 1;
            });
            item.shouldOutNumLast = item.shouldOutNum - count;
          }
        });

        // 去掉剩余数量<0的数据
        let detailArr = [];
        this.detailList.forEach(item => {
          let shouldOutNumLast = item.shouldOutNumLast || item.shouldOutNum;
          if (
            item.shouldOutNumLast == '0' &&
            item.wmsOrderOutLogisticsDetailList.length
          ) {
            shouldOutNumLast = 0;
          }
          if (item.wmsOrderOutLogisticsDetailList.length == '0') {
            item.shouldOutNumLast = item.shouldOutNum;
          }
          if (shouldOutNumLast > 0) {
            detailArr.push(item);
          }
        });
        this.detailList = detailArr;

        this.getRealOutNum();
        this.dialogFormVisible = false;
      }

      if (!isShow && isNormal) {
        this.detailInfo.wmsOrderOutDetailList.forEach((item, i) => {
          arr.forEach((subItem, j) => {
            if (item.id == subItem.id) {
              let obj = {};
              obj.itemNum = subItem.itemNum;
              obj.logistictsCode = this.addParams.logistictsCode;
              obj.logistictsName = this.addParams.logistictsName;
              obj.wayBill = this.addParams.wayBill;
              this.detailInfo.wmsOrderOutDetailList[
                i
              ].wmsOrderOutLogisticsDetailList.push(obj);
            }
          });
        });
        console.log('商品物流信息：', this.detailList);
        this.detailList.forEach((item, index) => {
          let count = 0;
          if (item.wmsOrderOutLogisticsDetailList.length) {
            item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
              count += subItem.itemNum * 1;
            });
            item.shouldOutNumLast = item.shouldOutNum - count;
          }
        });
        // 去掉剩余数量<0的数据
        let detailArr = [];
        this.detailList.forEach(item => {
          let shouldOutNumLast = item.shouldOutNumLast || item.shouldOutNum;
          if (
            item.shouldOutNumLast == '0' &&
            item.wmsOrderOutLogisticsDetailList.length
          ) {
            shouldOutNumLast = 0;
          }
          if (item.wmsOrderOutLogisticsDetailList.length == '0') {
            item.shouldOutNumLast = item.shouldOutNum;
          }
          if (shouldOutNumLast > 0) {
            detailArr.push(item);
          }
        });
        this.detailList = detailArr;

        this.getRealOutNum();
        this.addMsg(false);
      }
    },
    // 根据物流包裹数，计算应发包裹数
    getRealOutNum() {
      this.detailInfo.wmsOrderOutDetailList.forEach((item, i) => {
        let realOutNum = 0;
        if (item.wmsOrderOutLogisticsDetailList) {
          item.wmsOrderOutLogisticsDetailList.forEach(item => {
            realOutNum += item.itemNum * 1;
          });
        }
        item.realOutNum = realOutNum;
      });
      console.log('计算包裹数量：', this.detailInfo.wmsOrderOutDetailList);
    },
    // 保存并继续添加
    saveAndAgain() {
      this.saveAndClose(false);
    },
    cancelBtn() {
      this.dialogFormVisible = false;
      this.addMsg(false);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length) {
        // 重置清空
        this.detailList.forEach(item => {
          item.isChecked = false;
          // item.itemNum = '';
        });

        this.multipleSelection.forEach((item, i) => {
          // item.isChecked = false;
          this.detailList.forEach((subItem, j) => {
            if (item.id == subItem.id) {
              subItem.isChecked = true;
            }
          });
        });
      } else {
        this.detailList.forEach(item => {
          item.isChecked = false;
        });
      }
    },
    checkSelectable(row, index) {
      return row.status === '0';
    },
    // 获取门店订单列表信息
    initShopData() {
      this.GET('/wmsOrderOut/selectStorePage', this.shopParams).then(res => {
        console.log('门店订单：', res);
        if (res.code === '200') {
          this.shopOrderList = res.body.objects;
          this.totalCount = res.body.recordTotal;
          if (this.shopOrderList.length) {
            setTimeout(() => {
              this.$refs.tableRow1.setCurrentRow(this.shopOrderList[0]);
            }, 20);
            this.logParams.entityId = this.shopOrderList[0].id; // 第一条数据
            this.outboundOrderCode = this.shopOrderList[0].outboundOrderCode; // 获取详情数据
            this.getShopOrderDeatail();
            this.needOperateData();
          } else {
            this.detailInfo = {};
            this.logTableList = [];
            this.logTotal = 0;
          }
        }
      });
    },
    // 获取录入详情
    getShopOrderDeatail(load) {
      this.detailList = [];
      this.detailInfo = [];
      // this.outboundOrderCode = 'ZYFHTZ2018042300001-wdx5';
      this.GET('/wmsOrderOut/wmsOrderOutDetail/' + this.outboundOrderCode,'',load).then(
        res => {
          console.log('订单详情：', res);
          if (res.code === '200') {
            this.detailList = [];
            this.detailInfo = res.body;
            if (this.detailInfo.memo) {
              this.memo = this.detailInfo.memo
            }
            let wmsOrderOutDetailList = this.detailInfo.wmsOrderOutDetailList;
            console.log(wmsOrderOutDetailList);
            wmsOrderOutDetailList.forEach(item => {
              // 未出库
              if (item.isFinish == '0') {
                item.isChecked = false;
                item.shipNum = '';
                this.detailList.push(item);
              }
              // 给物流添加可修改状态
              if (
                item.wmsOrderOutLogisticsDetailList &&
                item.wmsOrderOutLogisticsDetailList.length
              ) {
                item.wmsOrderOutLogisticsDetailList.forEach((subItem, i) => {
                  let obj = {};
                  obj.isEditor = false;
                  this.logisticList.push(obj);
                });
              }
            });
            this.detailInfo.wmsOrderOutDetailList = wmsOrderOutDetailList;
          }
        }
      );
    },
    // 获取非门店订单列表信息
    initUnShopData() {
      this.GET('/wmsOrderOut/selectNotStorePage', this.params).then(res => {
        console.log('非门店订单：', res);
        if (res.code === '200') {
          this.shopUnOrderList = res.body.objects;
          this.pagetotal = res.body.recordTotal;
          if (this.shopUnOrderList.length) {
            setTimeout(() => {
              this.$refs.tableRow2.setCurrentRow(this.shopUnOrderList[0]);
            }, 20);
            this.logParams.entityId = this.shopUnOrderList[0].id; // 第一条数据
            this.outboundOrderCode = this.shopUnOrderList[0].outboundOrderCode; // 获取详情数据
            this.getShopOrderDeatailRow();
            this.needOperateData();
          } else {
            this.detailInfo = {};
            this.logTableList = [];
            this.logTotal = 0;
          }
        }
      });
    },
    // 获取详情
    getShopOrderDeatailRow(load) {
      this.detailInfoRow = [];
      // this.outboundOrderCode = 'ZYFHTZ2018042300001-wdx5';
      this.GET('/wmsOrderOut/wmsOrderOutDetail/' + this.outboundOrderCode,'',load).then(
        res => {
          console.log('订单详情：', res);
          if (res.code === '200') {
            this.detailInfoRow = res.body;
          }
        }
      );
    },
    addMsg(isShow = true) {
      console.log('detailList: ', this.detailList);
      this.addParams = {
        wayBill: '', // 运单号
        logistictsCode: '', // 物流公司编码
        logistictsName: '', // 物流公司名称
        itemNum: '' // 商品数量
      };
      // 重置清空
      this.detailList.forEach(item => {
        item.isChecked = false;
        item.realOutNum = item.realOutNum ? item.realOutNum : 0;
       // if (item.itemNum) {
          item.itemNum = item.shouldOutNum - item.realOutNum;
       // }
        // if (item.wmsOrderOutLogisticsDetailList.length) {
        //   item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
        //     subItem.itemNum = '';
        //   })
        // }
      });
      // 清空表格选择
      if (this.multipleSelection.length) {
        this.$refs.multipleTable.clearSelection();
      }
      if (isShow) {
        this.dialogFormVisible = true;
        this.$nextTick( ()=> {
          this.detailList.forEach(key => {
            this.$refs.multipleTable.toggleRowSelection(key,true);
          });
        })
      }

        this.detailList = this.detailList.filter(item => {
            if(item.status != 6){
                return item
            }
        })
        console.log(this.detailList)
      this.getCompanyList();

      // let count = 0;
      // if (row.wmsOrderOutLogisticsDetailList.length) {
      //   row.wmsOrderOutLogisticsDetailList.forEach(item => {
      //     count += item.itemNum * 1;
      //   });
      // }
    },
    handleEdit(parentIndex, index, row) {
      // 重新获取物流公司
      this.getCompanyList();

      this.paramsIndexArr = [];
      this.paramsIndexArr.push(parentIndex);
      this.paramsIndexArr.push(index);
      let rowDetail = this.detailInfo.wmsOrderOutDetailList[parentIndex]
        .wmsOrderOutLogisticsDetailList[index];
      // 获取应发商品数量
      let count = 0;
      this.detailInfo.wmsOrderOutDetailList[
        parentIndex
      ].wmsOrderOutLogisticsDetailList.forEach((item, i) => {
        if (index !== i) {
          count += item.itemNum * 1;
        }
      });
      this.lastCount =
        this.detailInfo.wmsOrderOutDetailList[parentIndex].shouldOutNum - count;
      console.log('this.lastCount: ', this.lastCount);
      this.editorParams.wayBill = rowDetail.wayBill;
      this.editorParams.logistictsCode = rowDetail.logistictsCode;
      this.editorParams.itemNum = rowDetail.itemNum;
      this.isEidtorShow = true;
      console.log(rowDetail);
    },

    handleDelete(parentIndex, index, row) {
      this.$confirm('确定要删除这条物流信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(index, row);
          this.detailInfo.wmsOrderOutDetailList[
            parentIndex
          ].wmsOrderOutLogisticsDetailList.splice(index, 1);
          this.detailList = this.detailInfo.wmsOrderOutDetailList;
          this.detailList.forEach((item, index) => {
            let count = 0;
            if (item.wmsOrderOutLogisticsDetailList.length) {
              item.wmsOrderOutLogisticsDetailList.forEach(subItem => {
                count += subItem.itemNum * 1;
              });
              item.shouldOutNumLast = item.shouldOutNum - count;
            }
          });

          // 去掉剩余数量<0的数据
          let detailArr = [];
          console.log('this.detailList: ', this.detailList);
          this.detailList.forEach(item => {
            let shouldOutNumLast = item.shouldOutNumLast || item.shouldOutNum;
            console.log('shouldOutNumLast: ', shouldOutNumLast);
            if (
              item.shouldOutNumLast == '0' &&
              item.wmsOrderOutLogisticsDetailList.length
            ) {
              shouldOutNumLast = 0;
            }
            if (item.wmsOrderOutLogisticsDetailList.length == '0') {
              item.shouldOutNumLast = item.shouldOutNum;
            }
            if (shouldOutNumLast > 0) {
              detailArr.push(item);
            }
          });
          console.log('detailArr: ', detailArr);
          this.detailList = detailArr;
          this.getRealOutNum(); // 重新计算包裹
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // tab切换
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 分页事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.shopParams.pageNumber = 1;
      this.shopParams.pageSize = val;
      this.initShopData(this.shopParams);
    },
    // 日志 当前页
    handleLogCurrentChange(val) {
      console.log('当前页：', val);
      // 分页点击触发事件
      this.$nextTick(() => {
        this.logParams.pageNumber = val;
        this.needOperateData();
      });
    },
    // 日志 每页多少条
    handleLogSizeChange(val) {
      this.logParams.pageSize = val;
      this.logParams.pageNumber = 1;
      this.needOperateData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$nextTick(() => {
        this.shopParams.pageNumber = val;
        this.initShopData(this.shopParams);
      });
    },
    needOperateData() {
      // 操作日志获取数据
      axios({
        method: 'get',
        url: '/wms-web' + '/wmsLogInformation/wmsLogInformationPage',
        params: this.logParams
      }).then(res => {
        console.log('日志列表：', res);
        if (res.data.code === '200') {
          this.logTableList = res.data.body.objects;
          this.logTotal = res.data.body.recordTotal;
        }
      });
    },
    // 非门店订单 条数
    handleUnShopSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.params.pageNumber = 1;
      this.params.pageSize = val;
      this.initUnShopData(this.params);
    },
    // 非门店订单 页数
    handleUnShopCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.$nextTick(() => {
        this.params.pageNumber = val;
        this.initUnShopData(this.params);
      });
    },
    // 切换类名和显示
    toggle(i) {
      this.detailInfo = {};
      this.detailInfoRow = {};
      if (i === 1) {
        this.isShopOrder = true;
        this.isShopActive = true;
        this.isActive = false;
        this.initShopData();
      } else {
        this.isShopOrder = false;
        this.isShopActive = false;
        this.isActive = true;
        this.showHome = true;
        this.initUnShopData();
        this.getChannels(); // 获取所属业务线
      }
    },
    // 选择打印事件获取要打印的数据
    selectBox(select, row) {
      console.log('selectBox', select);
      if (select.length) {
        this.printDisabled = false;
      } else {
        this.printDisabled = true;
      }
      this.printId = select;
    },
    selectAll(select) {
      console.log('selectAll', select);
      if (select.length) {
        this.printDisabled = false;
      } else {
        this.printDisabled = true;
      }
      this.printId = select;
    },
    needPrintData(select) {
      this.printData = [];
      const loading = this.$loading({
        // 遮罩对象
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // this.ajax(select,0)
      let promise = select.map((item, index) => {
        let json = item;
        let code = item.outboundOrderCode;
        // 记录打印次数
        this.PUT('/wmsOrderOut/printWmsOrderOut/' + code).then(res => {
          console.log('日志: ', res);
        });
        return this.GET('/wmsOrderOut/wmsOrderOutDetail/' + code + '?isPrint=true').then(res => {
          console.log('打印数据：', res);
          json['tableData'] = res.body.wmsOrderOutDetailList;
          json['totalItemNum'] = res.body.totalItemNum;
          this.printData.push(json);
        });
      });

      axios.all(promise).then(
        axios.spread((res1, res2) => {
          loading.close();
          setTimeout(() => {
            this.isListShow = false;
            window.print();
            this.$store.commit('changeShowTab', true);
          }, 10);
        })
      );
    },
    // input的输入监听事件
    inputChange(i, row) {
      let planAllocateNum = row.planAllocateNum;
      if (this.arr[i] > planAllocateNum) {
        this.$message({
          showClose: true,
          message: '实际出库数量不能大于计划出库数量',
          type: 'warning'
        });
        this.isRequie = false;
        return;
      }
      this.isRequie = true;
    },
    statasflag(str) {
      switch (str) {
        case '0':
          return '待出库';
        case '1':
          return '出库完成';
        case '2':
          return '已取消';
      }
    },
    typeChange(str) {
      if (str == '1') {
        return '正品';
      } else if (str == '2') {
        return '残品';
      }
    },
    // 导出订单
    exportOrderExcel() {
      window.open('/wms-web/wmsOrderOut/exportOrder?' + qs.stringify(this.params));
    },
    printBtn() {
      // 没有选中一个
      if (this.printDisabled) {
        this.$message({
          message: '请先选择出库单',
          type: 'warning'
        });
      } else {
        this.isListShow = true;
        this.$store.commit('changeShowTab', false);
        setTimeout(() => {
          this.needPrintData(this.printId);
        }, 20);
      }
    },
    getPurchaseTypes() {
      select.getPurchaseTypes().then(res => {
        let map = {};
        let result = res.data.result;
        this.purchaseTypes = result;
        tools.getMap(result, map, 'value');
        this.purchaseTypesMap = map;
      });
    },
    getWarehouseNoticeStatus() {
      select.getWarehouseNoticeStatus().then(res => {
        let result = res.data.result;
        this.warehouseNoticeStatus = result;
      });
    },
    // 门店 搜索
    searchShop() {
      if (
        new Date(this.shopParams.startDate).getTime() >
        new Date(this.shopParams.endDate).getTime()
      ) {
        this.$message({
          message: '开始日期不得大于结束日期',
          type: 'warning'
        });
        return;
      }
      this.params.pageNumber = 1;
      this.initShopData(this.shopParams);
    },
    searchUnShop() {
      // this.showHome = false;
      if (
        new Date(this.params.startDate).getTime() >
        new Date(this.params.endDate).getTime()
      ) {
        this.$message({
          message: '开始日期不得大于结束日期',
          type: 'warning'
        });
        return;
      }
      this.params.pageNumber = 1;
      this.initUnShopData(this.params);
    },
    save() {
      setTimeout(() => {
        this.isShopOrder = false;
        this.isShopActive = false;
        this.isActive = true;
        this.showHome = true;
        this.initUnShopData();
      }, 20);
    },
    resetForm() {
      // 重置门店订单
      this.shopParams = {
        outboundOrderCode: '', // 发货单编号
        shopOrderCode: '', // 销售渠道订单号
        startDate: '', // 开始日期
        endDate: '', // 截止日期
        pageNumber: 1, // 页码
        pageSize: 10 // 条数
      };
      this.initShopData(this.shopParams);
    },
    resetUnShopForm() {
      // 重置非门店订单
      this.params = {
        allocateOutOrderCode: '', // 发货单编号
        shopOrderCode: '', // 销售渠道订单号
        status: '', // 状态
        receiver: '', // 收货人
        channelCode: '', // 业务线编码
        sellChannelCode: '', // 销售渠道编码
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        pageNumber: 1, // 页码
        pageSize: 10 // 条数
      }; // 提交订单

      this.isDisbaled = true;
      this.getChannels(); // 获取所属业务线
      this.initUnShopData(this.params);
    },
    selectedAll(selected) {
      //   全选 反选逻辑
      if (selected) {
        for (let i = 0, j = this.datalist.length; i < j; i++) {
          let order = this.datalist[i];
          if (!order.createOperator) continue;
          this.$set(order, 'contractCode', true);
        }
      } else {
        for (let i = 0, j = this.datalist.length; i < j; i++) {
          let order = this.datalist[i];
          if (!order.createOperator) continue;
          this.$set(order, 'contractCode', false);
        }
      }
      this.allSelected = selected;
    },
    change(item) {
      console.log(item.contractCode);
    },
    // 门店订单详情
    cellShopClick(row, event, column) {
      let text = event.target.innerText;
      this.logParams.entityId = row.id;
      this.outboundOrderCode = row.outboundOrderCode;
      this.goodsInfo = [];
      // if(text == '出库结果录入'){
      //       // this.detailInfo = {}
      //       // this.getShopOrderDeatail(true);
      //   } else {
      //       this.getShopOrderDeatailRow();
      //   }
        this.getShopOrderDeatailRow();
        this.needOperateData();
    //   setTimeout(() => {
    //       if(text == '出库结果录入'){
    //           this.detailInfo = {}
    //           this.getShopOrderDeatail(true);
    //           this.needOperateData();
    //       } else {
    //           this.getShopOrderDeatail();
    //       }
    //   }, 20);
    },
    saveAll() {
      if (!this.outParams.logisticsCorporationCode) {
        this.$message({
          message: '请选择运输物流公司!',
          type: 'warning'
        });
        return;
      }
      if (!this.outParams.waybillNo) {
        this.$message({
          message: '请输入运单编号!',
          type: 'warning'
        });
        return;
      }
      if (!this.isRequie) {
        this.$message({
          message: '请输入实际出库数量!',
          type: 'warning'
        });
        return;
      }
      if (!this.textarea) {
        this.$message({
          message: '请输入备注',
          type: 'warning'
        });
        return;
      }
      if (this.textarea.length > 200) {
        this.$message({
          message: '备注长度不能超过200个字符',
          type: 'warning'
        });
        return;
      }

      let obj = {};
      let paramsArr = [];
      this.goodsInfo.forEach((item, i) => {
        obj.skuCode = item.skuCode;
        obj.planAllocateNum = item.planAllocateNum;
        obj.realOutNum = this.arr[i];
        paramsArr.push(obj);
      });
      // 查找公司名字
      if (this.outParams.logisticsCorporationCode) {
        this.companyList.forEach(item => {
          if (item.logisticsCode === this.outParams.logisticsCorporationCode) {
            this.outParams.logisticsCorporationName =
              item.logisticsCorporationName; // 查找公司名字
          }
        });
      }
      this.outParams.id = this.id; // 主键
      this.outParams.outMemo = this.textarea; // 出库备注
      this.outParams.wmsAllocateOutDetailExtVOList = paramsArr;
      this.$confirm('确定后将不能再修改数据！', '您确定“出库完成”吗？', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      })
        .then(() => {
          this.POST(
            '/wmsAllocateOut/wmsAllocateOutDetail/' + this.id,
            this.outParams, true
          ).then(res => {
            if (res.code == '200') {
              this.$message({
                type: 'success',
                message: '出库完成!'
              });
              setTimeout(() => {
                this.backHome();
              }, 1200);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    backHome() {
      this.showHome = true;
      this.isShow = true;
      this.initUnShopData();
    },
    hideHome(outboundOrderCode) {
      this.outboundOrderCode = outboundOrderCode;
      // 切换显示内容页面 请求下层数据
      // this.goodOutInfoList = this.goodsInfo;
      this.detailInfo = {}
      this.memo = '';
      this.getShopOrderDeatail(true);
      console.log('detailList： ', this.detailList);
      this.showHome = false;
      this.isShow = false;
    },
    sureArrive() {
      this.$prompt('确认已到货？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '备注： 不超过200个字符'
      })
        .then(({ value }) => {
          this.$nextTick(() => {
            axios({
              method: 'PUT',
              url: '/wms-web' + '/wmsAllocateIn/confirm/' + this.code
            }).then(res => {
              this.$message({
                type: 'success',
                message: '备注信息是：' + value
              });
            });
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
    },
    getDeatails(item) {
      console.log(item);
    },
    needData(params) {
      // 获取调拨入库列表
      // return axios({
      //   methods: 'get',
      //   url: '/wms-web' + '/wmsAllocateOut/wmsAllocateOutPage',
      //   params: params
      // }).then(res => {
      //   console.log('挑拨入库列表：', res);
      //   this.pagetotal = res.data.body.recordTotal;
      //   this.tableList = res.data.body.objects;
      //   if (this.tableList[0]) {
      //     let code = this.tableList[0].allocateOrderCode;
      //     let id = this.tableList[0].id;
      //     let data = {
      //       pageSize: 10,
      //       pageNumber: 1,
      //       entityType: 'WmsAllocateIn',
      //       entityId: this.tableList[0].id
      //     };
      //     this.code = code; // 获取第一条数据的code
      //     this.id = id; // 获取第一条数据的id
      //     console.log(this.code + '--' + this.id);
      //     this.needTableDatail(this.code);
      //     this.getOtherInfo(this.id);
      //     // this.needOperateData(data);
      //   } else {
      //     this.goodsInfo = [];
      //     this.noticeInfo = [];
      //   }
      // });
    },
    // 获取调拨入库单个列表的详情
    needTableDatail(allocateOrderCode) {
      // axios({
      //   methods: 'get',
      //   url: '/wms-web' + '/wmsAllocateDetail/wmsAllocateDetails',
      //   params: { allocateOrderCode: allocateOrderCode }
      // }).then(res => {
      //   console.log('单个列表详情：', res.data.body);
      //   this.goodsInfo = res.data.body;
      //   // this.noticeInfo = res.data.body;
      // });
    },
    // 获取发件方信息和其他信息
    getOtherInfo(id) {
      axios({
        methods: 'get',
        url: '/wms-web' + '/wmsAllocateOut/' + id
      }).then(res => {
        console.log('获取发件方信息和其他信息: ', res);
        this.otherInfoDetail = res.data.body;
      });
    },
    // 快递列表
    getCompanyList() {
      axios({
        method: 'get',
        url: '/wms-web' + '/logisticsCorporation/express'
      }).then(res => {
        console.log('快递列表：', res);
        if (res.data.code == '200') {
          this.companyList = res.data.body;
          // console.log(this.companyList);
        }
      });
    },
    // 所属业务线
    getChannels() {
      axios({
        method: 'get',
        url: '/wms-web' + '/wmsOrderOut/getChannels'
      }).then(res => {
        if (res.data.code == '200') {
          this.channelsList = res.data.body;
          console.log('所属业务线', this.channelsList);
        }
      });
    },
    // 销售渠道
    getSellChannel(channelCode) {
      axios({
        method: 'get',
        url: '/wms-web' + '/wmsOrderOut/getSellChannel/' + channelCode
      }).then(res => {
        console.log('销售渠道', res);
        if (res.data.code == '200') {
          this.sellChannelsList = res.data.body;
          console.log('销售渠道', this.sellChannelsList);
        }
      });
    },
    // 根据仓库地址显示门店或者非门店
    getUserWarehouseType() {
      let warehouseCode = localStorage.getItem('code') || '';
      this.isShow = false;
      if (warehouseCode) {
        axios({
          method: 'get',
          url: '/wms-web' + '/wmsOrderOut/getUserWarehouseType/' + warehouseCode
        }).then(res => {
          console.log('状态', res);
          if (res.data.code == '200') {
            this.isCode = res.data.body;
            if (this.isCode == '1') {
              this.toggle(2);
              this.isShow = true;
            } else {
              this.toggle(1);
              this.isShow = true;
            }
          }
        });
      }
    },
    // 新增包裹信息快递公司联想搜索
    companyChange(value){
      this.addParams.logistictsCode = value;
    }
  },
  mounted() {
    this.initShopData();
    this.getUserWarehouseType(); // 根据仓库显示
    // this.needData(this.params);
  }
};
</script>

<style lang="less" scoped>
.red_tip {
  padding-right: 5px;
  color: #ff0000;
}
.search_outparams {
  width: 100%;
  margin: 15px 0;
  p {
    width: 45%;
    display: inline-block;
    span {
      display: inline-block;
      vertical-align: top;
    }
    .title {
      line-height: 28px;
      text-align: right;
    }
  }
}
.breadcrumb {
  width: 100%;
  // font-size: 12px;
  margin-bottom: 15px;
  p {
    margin-right: 10px;
    display: inline-block;
    cursor: pointer;
  }
  .active {
    color: rgb(64, 158, 255);
  }
}

.shop_order {
  .paging {
    margin-top: 10px;
    text-align: right;
  }
  .table_detail {
    margin-top: 30px;
  }
}
.value {
  padding-left: 10px;
  vertical-align: middle;
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
    // font-size: 12px;
    border-bottom: solid 1px #000;
    display: flex;
    justify-content: space-between;
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
  .page_break{
    page-break-after: always;
  }
}
.header-btn {
  display: flex;
  line-height: 30px;
  justify-content: space-between;
  z-index: 3000;
}
.header-btn-right {
  text-align: right;
}

.border {
  width: 100%;
  // padding: 35px 0;
  text-align: center;
  border-bottom: solid 1px #f5f7fa;
}
.bordernone:last-child {
  border: none;
}

.printChild {
  position: relative;
  width: 100%;
  min-width: 1440px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @fColor: #f2f2f2;
  @eColor: #ec6337;
  @d8line: 1px solid #d8d8d8;

  .item {
    display: flex;
    justify-content: center;
    color: #333;
    border-left: @d8line;
    border-top: @d8line;
    word-break: break-all;
    &:nth-child(n) {
      width: 10%;
    }

    &:nth-child(1) {
      width: 5%;
    }
    &:nth-child(3) {
      width: 20%;
    }
    &:nth-child(5) {
      width: 20%;
    }
    &:nth-child(6) {
      width: 15%;
    }
    &:nth-child(7) {
      width: 20%;
    }
  }

  .secondHomeHead {
    display: flex;
    flex-direction: column;
    width: 100%;
    .header {
      background-color: #f5f7fa;
      height: 30px;
      // font-size: 14px;
      padding: 5px;
    }
    .content {
      margin: 15px 10px;
      // font-size: 14px;
      div {
        width: 100%;
        display: flex;
        justify-content: space-around;
        margin: 15px 0;
        p {
          width: 400px;
          .title {
            width: 140px;
            text-align: right;
            display: inline-block;
          }
        }
      }
      // .content-ul {
      //   display: flex;
      //   flex-direction: row;
      // }
    }
  }

  .second-home-content {
    display: flex;
    border: 1px solid #d8d8d8;
    flex-direction: column;
    overflow: hidden;
    width: 100%;
    .header-ul {
      display: flex;
      background-color: #999;
      .header {
        display: flex;
        width: 10%;
        // font-size: 14px;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #d8d8d8;

        &:nth-child(1) {
          width: 5%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(5) {
          width: 20%;
        }
        &:nth-child(6) {
          width: 15%;
        }
        &:nth-child(7) {
          width: 20%;
        }
      }
      & > .header:nth-child(7) {
        display: flex;
        flex-direction: column;
        .header-item {
          width: 100%;
          .header-item-specW {
            display: flex;
            flex-direction: row;
            justify-content: center;
            justify-content: space-around;
            border-bottom: 1px solid #d8d8d8;
          }
          .header-item-specS {
            display: flex;
            flex-direction: row;
            justify-content: center;
            justify-content: space-around;
            & > div {
              width: 50%;
              border-left: 1px solid #d8d8d8;
              text-align: center;
              .red-span {
                color: red;
              }
            }
            & > div:nth-child(1) {
              border-left: transparent;
            }
          }
        }
      }
    }
    .contents {
      display: flex;
      width: 100%;
      min-height: 30px;
      border-bottom: 1px solid #d8d8d8;
      .content-item {
        display: flex;
        width: 10%;
        // font-size: 14px;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #d8d8d8;

        // &:nth-child(n) {
        // //   width: 10%;
        //   font-size: 12px;
        //   word-break: break-all;
        // }
        &:nth-child(1) {
          width: 5%;
        }
        &:nth-child(3) {
          width: 20%;
        }
        &:nth-child(5) {
          width: 20%;
        }
        &:nth-child(6) {
          width: 15%;
        }
        &:nth-child(7) {
          width: 20%;
          display: flex;
          flex-direction: row;
          justify-content: space-around;
        }
      }

      // &>.content-item{
      //     display: inline-flex;
      //     flex-direction: row;
      //     min-height: 30px;
      //     .item;
      //     font-size: 12px;
      // }
      // &>.content-item:nth-child(1){
      //     border-left: transparent;
      // }
    }
  }

  .second-home-remark {
    display: flex;
    align-items: center;
    width: 100%;
    padding-left: 5px;
    // font-size: 14px;
    padding: 50px 0;
  }

  .second-home-footer {
    .usualBtn {
      width: 80px;
      height: 30px;
      border-radius: 5px;
      border: 1px solid #999;
    }
    .blueBtn {
      background-color: rgb(68, 68, 157);
      color: white;
    }
  }
}
</style>

<style lang="less">
.el-table div.cell {
  padding: 0;
}
.data_list thead tr th:nth-child(8) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}
</style>



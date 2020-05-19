<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted: function() {}
};
</script>

<style lang="less">
// 全局表格样式
.content {
  position: relative;
  width: 100%;
  min-width: 1440px;
  height: e('calc(100% - 60px)');
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: @d8line;

  @fColor: #f2f2f2;
  @eColor: #ec6337;
  @d8line: 1px solid #d8d8d8;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #333;
    border-left: @d8line;
    border-bottom: @d8line;
    word-break: break-all;
    &:nth-child(n) {
      width: 10%;
    }

    &:nth-child(1) {
      width: 5%;
    }
    &:nth-child(2) {
      width: 5%;
    }
    &:nth-child(3) {
      width: 15%;
    }
    &:nth-child(4) {
      width: 15%;
    }
    &:nth-child(6) {
      width: 20%;
    }
  }

  .header {
    display: flex;
    height: 40px;
    box-sizing: border-box;
    background-color: #f8f8f8;
    width: 100%;

    .h-item {
      .item;
      font-size: 14px;
    }
  }

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: e('calc(100% - 72px)');
    overflow-y: scroll;

    .c-items {
      width: 100%;
      display: flex;
      flex-direction: row;
      min-height: 30px;
      .c-item {
        .item;
        font-size: 12px;
      }
    }
  }
}
.content-item-child {
  input {
    padding-left: 20px;
    padding: 5px;
  }
  .el-input {
    text-align: center;
  }
  .el-input__inner {
    padding: 0;
    margin: 0;
    padding-left: 10px;
    width: 80%;
  }
  .el-form-item {
    margin: 5px 0;
  }
}
.main {
  font-size: 12px;
  color: #606266;
  .el-table .cell {
    // padding: 4px 0;
    line-height: 32px;
  }
  .el-table td,
  .el-table th {
    padding: 1px;
  }
  .el-table th {
    background: rgb(245, 247, 250);
    color: #606266;
  }
  .el-table .cell,
  .el-table th div,
  .el-table--border td:first-child .cell,
  .el-table--border th:first-child .cell {
    padding-left: 0px;
  }
  .tab_wapper .el-row {
    padding: 0;
  }
  // div.el-form-item--mini.el-form-item,
  // .el-form-item--small.el-form-item {
  //   margin-bottom: 0;
  // }
  .el-form-item {
    margin-bottom: 5px;
  }
  .el-row div.el-col-6 {
    font-size: 12px;
    height: 28px;
    overflow: hidden;
  }
  .wuliu .el-input__inner {
    width: 200px;
  }
}
// .requreRed .el-table__header-wrapper{
//   padding-right: 5px;
//   color: #ff0000;
// }
.requreRed  thead tr th:nth-child(5) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}
.requreRed  thead tr th:nth-child(4) div::before {
  content: '*';
  padding-right: 5px;
  color: #ff0000;
}
.ware_table thead tr:nth-child(2) th:nth-child(1) div::before,.ware_table thead tr:nth-child(2) th:nth-child(2) div::before {
    content: '*';
    padding-right: 5px;
    color: #ff0000;
}
.out_table thead tr th:nth-child(8) div::before{
    content: '*';
    padding-right: 5px;
    color: #ff0000;
}
</style>



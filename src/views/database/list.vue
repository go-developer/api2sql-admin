<template>
  <div class="className">
    <el-card class="anoCard">
      <div slot="header">
        <span>复杂操作表格</span>
      </div>
      <div class="searchDiv">
        <el-input
          type="text"
          placeholder="请输入订单号"
          class="width1"
          v-model="sch_order"
        ></el-input>
        <el-select
          v-model="sch_status"
          clearable
          class="width1"
          placeholde="请选择状态"
        >
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value"
            :key="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          class="width1"
          v-model="sch_date"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="searchTab()"
          >搜索</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addTab"
          >添加</el-button
        >
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column
          prop="id"
          label="数据库ID"
          width="60"
        ></el-table-column>
        <el-table-column prop="host" label="数据库IP"></el-table-column>
        <el-table-column prop="port" label="数据库端口"></el-table-column>
        <el-table-column
          prop="database"
          label="数据库名称"
          width="210"
        ></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column
          prop="password"
          label="密码"
          width="70"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | tagClass">{{
              scope.row.status | statusText
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="editTable(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              type="warning"
              @click="toConfirm(scope.row)"
              :disabled="scope.row.status === 1 ? false : true"
              >发布</el-button
            >
            <el-button
              type="success"
              @click="toSuccess(scope.row)"
              :disabled="scope.row.status === 2 ? false : true"
              >验证</el-button
            >
            <el-button
              type="danger"
              @click="toDelete(scope.row)"
              :disabled="scope.row.status !== 3 ? false : true"
              >下线</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :current-page="currentPage"
        :total="total"
        class="fyDiv"
        @size-change="handleSize"
        @current-change="handlePage"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="添加数据库实例" :visible.sync="diaIsShow" class="diaForm">
      <el-form
        ref="diaForm"
        :model="formData"
        :rules="rules"
        label-width="140px"
      >
        <el-form-item label="数据库标识" prop="flag">
          <el-input
            type="text"
            placeholder="请输入数据库标识"
            v-model="formData.flag"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库Host" prop="host">
          <el-input
            type="text"
            placeholder="请输入数据库host"
            v-model="formData.host"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库端口" prop="port">
          <el-input
            type="text"
            placeholder="请输入数据库端口"
            v-model="formData.port"
          ></el-input>
        </el-form-item>
        <el-form-item label="使用的数据库" prop="database">
          <el-input
            type="text"
            placeholder="使用的数据库"
            v-model="formData.database"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库账号" prop="username">
          <el-input
            type="text"
            placeholder="数据库账号"
            v-model="formData.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            type="password"
            placeholder="数据库密码"
            v-model="formData.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据库描述" prop="description">
          <el-input
            type="text"
            placeholder="数据库描述"
            v-model="formData.description"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changeTab('diaForm', 'add')"
            >确认</el-button
          >
          <el-button @click="diaIsShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAllDatabaseList, createDatabaseInstance } from "@/api/database";
export default {
  data() {
    return {
      tableData: [],
      allList: [],
      schArr: [],
      sch_order: "",
      sch_status: null,
      sch_date: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageSizes: [10, 20, 30, 40],
      diaIsShow: false,
      formData: {},
      editType: "",
      options: [
        { label: "使用中", value: 1 },
        { label: "已下线", value: 2 },
        { label: "待发布", value: 0 },
      ],
      rowIndex: 0,
      rules: {
        flag: [
          {
            required: true,
            message: "请输入数据库标识",
            trigger: "change",
          },
        ],
        host: [
          {
            // type: 'datetime',
            required: true,
            message: "请输入时间",
            trigger: "change",
          },
        ],
        port: [
          {
            required: true,
            message: "请输入数据库端口",
            trigger: "change",
          },
        ],
        username: [
          {
            required: true,
            message: "请输入数据库名称",
            trigger: "change",
          },
        ],
        database: [
          {
            // type: 'datetime',
            required: true,
            message: "请输入时间",
            trigger: "change",
          },
        ],
        username: [
          {
            required: true,
            message: "请输入数据库账号",
            trigger: "change",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入数据库密码",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this._getAllDatabaseList();
  },
  filters: {
    statusText(val) {
      if (val === undefined) return;
      if (val === 0) {
        return "待发布";
      } else if (val === 1) {
        return "使用中";
      } else if (val === 2) {
        return "已下线";
      } else {
        return "未知 - " + val;
      }
    },
    tagClass(val) {
      if (val === undefined) return;
      if (val === 0) {
        return "success";
      } else if (val === 1) {
        return "info";
      } else if (val === 2) {
        return "warning";
      } else {
        return "danger";
      }
    },
  },
  methods: {
    handleSize(val) {
      this.pageSize = val;
      this.getPageData();
    },
    handlePage(val) {
      this.currentPage = val;
      this.getPageData();
    },
    _getAllDatabaseList() {
      getAllDatabaseList()
        .then((res) => {
          this.allList = res.data.list;
          this.schArr = this.allList;
          this.getPageData();
          this.total = res.data.total;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    getPageData() {
      let start = (this.currentPage - 1) * this.pageSize;
      let end = start + this.pageSize;
      this.tableData = this.schArr.slice(start, end);
    },
    // 查找
    searchTab() {
      let arrList = [];
      for (let item of this.allList) {
        if (
          this.sch_order.trim() === "" &&
          this.sch_status === null &&
          this.sch_date === null
        ) {
          arrList = this.allList;
          break;
        } else if (
          item.order.startsWith(this.sch_order) &&
          (this.sch_status !== null ? item.status === this.sch_status : true) &&
          (this.sch_date !== null ? item.time.startsWith(this.sch_date) : true)
        ) {
          let obj = Object.assign({}, item);
          arrList.push(obj);
        }
      }
      this.schArr = arrList;
      this.total = arrList.length;
      this.currentPage = 1;
      this.pageSize = 10;
      this.getPageData();
    },
    // add
    addTab() {
      this.formData = {};
      this.diaIsShow = true;
      // this.formData.order = (Math.random() * 10e18).toString();
      // this.formData.id = this.allList.length + 1;
      this.editType = "add";
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
    },
    // 审核
    toConfirm(row) {
      row.status = 2;
      this.$notify({
        title: "成功",
        message: "审核提交成功",
        type: "success",
      });
    },
    // 完成
    toSuccess(row) {
      row.status = 0;
      this.$notify({
        title: "成功",
        message: "该订单已完成配送",
        type: "success",
      });
    },
    // 取消
    toDelete(row) {
      row.status = 3;
      this.$notify({
        title: "成功",
        message: "已取消该订单",
        type: "success",
      });
    },
    // 编辑
    editTable(index, row) {
      this.formData = Object.assign({}, row);
      this.editType = "update";
      this.diaIsShow = true;
      this.$nextTick(() => {
        this.$refs.diaForm.clearValidate();
      });
      this.rowIndex = index;
    },
    changeTab(form, type) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (type === "update") {
            // 改变整个表格数据
            let start = (this.currentPage - 1) * this.pageSize;
            this.allList[start + this.rowIndex] = Object.assign(
              {},
              this.formData
            );
            // 解决数组不能通过索引响应数据变化
            this.$set(
              this.tableData,
              this.rowIndex,
              Object.assign({}, this.formData)
            );
            this.$notify({
              title: "成功",
              message: "订单已修改成功",
              type: "success",
            });
          } else if (type === "add") {
            // 新建数据库实例
            console.log("表单数据", this.formData);
            createDatabaseInstance(this.formData)
              .then((res) => {
                this.formData.id = res.data.db_id;
                this.allList = this.allList.push(this.formData);
                this.schArr = this.allList;
              })
              .catch((error) => {
                this.$message.error(error.message);
              });
          } else {
            this.tableData.unshift(Object.assign({}, this.formData));
            this.allList.push(Object.assign({}, this.formData));
          }
          this.diaIsShow = false;
        } else {
          return;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.fyDiv {
  float: right;
  margin-top: 30px;
  padding-bottom: 20px;
}
.anoCard .el-table .el-button {
  padding: 8px 18px;
  font-size: 12px;
}
.searchDiv {
  margin-bottom: 20px;
  .el-button {
    padding: 11px 20px;
  }
}
.width1 {
  width: 180px;
  margin-right: 10px;
}
.diaForm {
  .el-input {
    width: 350px;
  }
}
</style>
<style lang="scss">
.anoCard {
  .el-card__body:after {
    content: "";
    clear: both;
    width: 0;
    height: 0;
    visibility: hidden;
    display: block;
  }
}
.diaForm .el-form-item__label {
  padding-right: 20px;
}
.searchDiv [class^="el-icon"] {
  color: #fff;
}
</style>

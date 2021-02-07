<template>
  <section class="home">
    <vs-navbar target-scroll="#padding-scroll-content" fixed shadow centerCollapsed>
      <template #left>
        <h2>Quick Jira</h2>
        <span style="color: #f5f5f5">v2.0.2</span>
      </template>
      <template #default>
        <vs-tooltip bottom warn>
          <vs-button warn icon>
            <i class="bx bx-question-mark"></i>
          </vs-button>
          <template #tooltip>
            现在Quick Jira还在成长中，如果遇到问题可至GayHub提交相关问题
            <br />已知问题：
            <br />1.所知现在只支持大部分BMW项目，安利项目及CS产品研发项目，其他项目未经测试无法预料
            <br />2.同一批只能填同一个项目
            <br />3.如果出现无法选择分类的情况，请至公司Jira切换到对应项目再进入Quick Jira进行操作
          </template>
        </vs-tooltip>
      </template>
      <template #right>
        <div style="display: inline-block;margin-right:10px;font-size:10px;">
          <vs-button @click="toGithub" transparent icon>
            <i class="bx bxl-github"></i>
          </vs-button>
        </div>
        <h2>{{ issueData.assignee }}</h2>
        <vs-button @click="openSetting" border icon>
          <i class="bx bx-cog"></i>
        </vs-button>
        <vs-button @click="out">退出</vs-button>
      </template>
    </vs-navbar>
    <div class="content">
      <div :key="i" v-for="(tr, i) in workLogData" class="div-content">
        <vs-button
          :disabled="workLogData.length === 1"
          @click="delWorklogData(i)"
          style="font-size:18px"
          class="del-button"
          icon
          transparent
          danger
          animation-type="rotate"
        >
          <i class="bx bx-x"></i>
          <template #animate>
            <i class="bx bxs-x-square"></i>
          </template>
        </vs-button>
        <div class="card-contnet">
          <vs-select
            @change="projectChange(tr, i)"
            filter
            plaFceholder="请选择项目"
            v-model="tr.projectId"
          >
            <vs-option
              :key="item.id"
              v-for="item in issueData.projects"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</vs-option>
          </vs-select>
          <div style="height: 5px;"></div>
          <vs-select
            v-if="tr.typeSelectIsShow"
            placeholder="请选择问题类型"
            style="width: 100px"
            v-model="tr.issueTypeId"
            :disabled="!tr.issueTypes"
            @change="issueTypeChange(tr, i)"
          >
            <vs-option
              v-for="item in tr.issueTypes"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</vs-option>
          </vs-select>
          <div style="height: 5px;"></div>
          <textarea
            @change="summaryChange(tr)"
            v-model="tr.summary"
            style="border:2px solid transparent;border-radius:12px;color:rgba(44,62,80,1);background-color:rgba(244,247,248);width: 275px;height: 38px;padding: 10px;resize: none;"
            placeholder="请填写标题"
          ></textarea>
          <div style="height: 5px;"></div>
          <vs-select
            @change="categoryChange(tr, i)"
            placeholder="请选择分类"
            style="width: 100px"
            v-model="tr.categoryId"
          >
            <vs-option
              :key="item.id"
              v-for="item in issueData.categorys"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</vs-option>
          </vs-select>
          <div style="height: 5px;"></div>
          <vs-select
            @change="subChange(tr, i)"
            v-if="tr.subSelectIsShow"
            placeholder="请选择子类"
            style="width: 100px"
            v-model="tr.subCategoryId"
            :disabled="!tr.subCategorys"
          >
            <vs-option
              v-for="item in tr.subCategorys"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >{{ item.name }}</vs-option>
          </vs-select>
          <div style="height: 5px;"></div>
          <vs-input type="date" v-model="tr.logDate" placeholder="请选择日期" />
          <div style="height: 5px;"></div>
          <vs-input
            type="number"
            :min="1"
            class="hours"
            @change="hoursChange(tr)"
            v-model="tr.hours"
            placeholder="请填写"
          ></vs-input>
        </div>
      </div>
      <div class="add-div">
        <div class="add-button" @click="addWorkLogData">
          <i class="bx bx-add-to-queue"></i>
        </div>
      </div>
      <!-- <vs-table striped>
        <template #thead>
          <vs-tr>
            <vs-th>ID</vs-th>
            <vs-th>项目</vs-th>
            <vs-th>问题类型</vs-th>
            <vs-th>标题</vs-th>
            <vs-th>分类</vs-th>
            <vs-th>子分类</vs-th>
            <vs-th>日期</vs-th>
            <vs-th>工时(hours)</vs-th>
            <vs-th>操作</vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr :key="i" v-for="(tr, i) in workLogData" :data="tr">
            <vs-td>{{ i + 1 }}</vs-td>
            <vs-td>
              <vs-select
                @change="projectChange(tr, i)"
                filter
                style="width: 200px"
                placeholder="请选择"
                v-model="tr.projectId"
              >
                <vs-option
                  :key="item.id"
                  v-for="item in issueData.projects"
                  :label="item.name"
                  :value="item.id"
                >{{ item.name }}</vs-option>
              </vs-select>
            </vs-td>
            <vs-td>
              <vs-select
                v-if="tr.typeSelectIsShow"
                placeholder="请选择"
                style="width: 100px"
                v-model="tr.issueTypeId"
                :disabled="!tr.issueTypes"
                @change="issueTypeChange(tr, i)"
              >
                <vs-option
                  v-for="item in tr.issueTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >{{ item.name }}</vs-option>
              </vs-select>
            </vs-td>
            <vs-td>
              <vs-input @change="summaryChange(tr)" v-model="tr.summary" placeholder="请填写" />
            </vs-td>
            <vs-td>
              <vs-select
                @change="categoryChange(tr, i)"
                placeholder="请选择"
                style="width: 100px"
                v-model="tr.categoryId"
              >
                <vs-option
                  :key="item.id"
                  v-for="item in issueData.categorys"
                  :label="item.name"
                  :value="item.id"
                >{{ item.name }}</vs-option>
              </vs-select>
            </vs-td>
            <vs-td>
              <vs-select
                @change="subChange(tr, i)"
                v-if="tr.subSelectIsShow"
                placeholder="请选择"
                style="width: 100px"
                v-model="tr.subCategoryId"
                :disabled="!tr.subCategorys"
              >
                <vs-option
                  v-for="item in tr.subCategorys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >{{ item.name }}</vs-option>
              </vs-select>
            </vs-td>
            <vs-td>
              <vs-input type="date" style="width: 180px" v-model="tr.logDate" placeholder="请选择" />
            </vs-td>
            <vs-td>
              <vs-input
                type="number"
                :min="1"
                class="hours"
                @change="hoursChange(tr)"
                v-model="tr.hours"
                placeholder="请填写"
              ></vs-input>
            </vs-td>
            <vs-td>
              <vs-button
                :disabled="workLogData.length === 1"
                icon
                flat
                color="danger"
                @click="delWorklogData(i)"
              >
                <i class="bx bxs-x-square"></i>
              </vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>-->
      <!-- <div style="margin-top: 10px">
        <vs-button
          icon
          flat
          @click="addWorkLogData"
          color="success"
          style="display: block; margin: 0 auto"
        >
          <i class="bx bx-add-to-queue"></i>
        </vs-button>
      </div>-->
      <div style="margin-top: 10px">
        <vs-button style="display: block; margin: 0 auto" @click="submit">提交</vs-button>
      </div>
    </div>
    <vs-dialog :loading="loginLoading" prevent-close blur v-model="loginDialogActive">
      <template #header>
        <h4 class="not-margin">
          Welcome to
          <b>Quick-Jira</b>
        </h4>
      </template>

      <div class="con-form">
        <vs-input v-model="user.loginName" placeholder="LoginName">
          <template #icon>
            <i class="bx bx-user"></i>
          </template>
          <template v-if="user.loginName === ''" #message-danger>Required</template>
        </vs-input>
        <vs-input type="password" v-model="user.password" placeholder="Password">
          <template #icon>
            <i class="bx bxs-lock"></i>
          </template>
          <template v-if="user.password === ''" #message-danger>Required</template>
        </vs-input>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block @click="sign">Sign In</vs-button>
        </div>
      </template>
    </vs-dialog>
    <vs-dialog blur width="550px" not-center v-model="confirmActive">
      <template #header>
        <h4>确认提交？</h4>
      </template>

      <div>
        <p>提交后，你填写的数据将会上传到Jira服务器，请谨慎操作！</p>
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button @click="confirm" transparent>确认</vs-button>
          <vs-button @click="confirmActive = false" dark transparent>取消</vs-button>
        </div>
      </template>
    </vs-dialog>
    <vs-dialog blur v-model="settingActive">
      <template #header>
        <h4 class="not-margin">
          <b>设置</b>
        </h4>
      </template>
      <div class="setting">
        <div style="margin-bottom:50px">
          <vs-input type="number" :min="1" label-placeholder="默认工时" v-model="setting.hours" />
        </div>
        <vs-input
          type="number"
          :min="1"
          label-placeholder="时间递增间隔"
          v-model="setting.dateIncrementalInterval"
        />
      </div>
      <template #footer>
        <div class="con-footer">
          <vs-button @click="settingOk" transparent>确认</vs-button>
          <vs-button @click="settingActive = false" dark transparent>取消</vs-button>
        </div>
      </template>
    </vs-dialog>
  </section>
</template>

<script>
import tip from "./Tip";
import { getIssueInfo, createIssueLog } from "../api/apis";
import { Base64, format } from "../utils/tools";
import moment from "moment";
export default {
  name: "Home",
  data() {
    return {
      loginDialogActive: false,
      loginLoading: false,
      user: {},
      issueData: {
        assignee: "User",
        projects: [],
      },
      localUser: false,
      workLogData: [],
      projects: [],
      defaultWorkLog: {
        projectId: "",
        issueTypeId: "",
        categoryId: "",
        subCategoryId: "",
        typeSelectIsShow: true,
        subSelectIsShow: true,
      },
      confirmActive: false,
      settingActive: false,
      setting: {
        hours: 8,
        dateIncrementalInterval: 1,
      },
    };
  },
  methods: {
    sign() {
      this.loginLoading = true;
      let loading = null;
      if (this.localUser) {
        loading = this.$vs.loading({ type: "corners" });
      }
      if (this.user.loginName && this.user.password) {
        let params = {
          loginName: this.user.loginName,
          password: this.localUser
            ? this.user.password
            : Base64.encode(this.user.password),
          q: moment().unix(),
        };
        getIssueInfo(params)
          .then((data) => {
            this.issueData = data;
            this.loginDialogActive = false;
            this.loginLoading = false;
            if (loading) {
              loading.close();
            }
            localStorage.setItem(
              "userInfo",
              JSON.stringify({
                loginName: params.loginName,
                password: params.password,
              })
            );
            this.user.password = params.password;
            this.workLogData.push(this.newWorkLog());
            this.reload(0);
          })
          .catch((err) => {
            localStorage.removeItem("userInfo");
            this.loginLoading = false;
            if (!this.loginDialogActive) {
              location.reload();
            }
            if (loading) {
              loading.close();
            }
          });
      }
    },
    projectChange(tr, i, val) {
      this.workLogData[i].issueTypeId = "";
      this.workLogData[i].issueTypes = this.issueData.issueTypes[tr.projectId];
      this.workLogData[i].typeSelectIsShow = false;
      this.$nextTick(() => {
        setTimeout(() => {
          this.workLogData[i].typeSelectIsShow = true;
        }, 0);
        localStorage.setItem("projectId", tr.projectId);
        if (val) {
          this.workLogData[i].issueTypeId = val;
        }
      });
    },
    issueTypeChange(tr, i) {
      localStorage.setItem(`${tr.projectId}_issueTypeId`, tr.issueTypeId);
    },
    categoryChange(tr, i, val) {
      this.workLogData[i].subCategoryId = "";
      this.workLogData[i].subCategorys = this.issueData.subCategorys[
        tr.categoryId
      ];
      this.workLogData[i].subSelectIsShow = false;
      this.$nextTick(() => {
        this.workLogData[i].subSelectIsShow = true;
        localStorage.setItem("categoryId", tr.categoryId);
        if (val) {
          this.workLogData[i].subCategoryId = val;
        }
      });
    },
    subChange(tr, i) {
      localStorage.setItem(`${tr.categoryId}_subCategoryId`, tr.subCategoryId);
    },
    hoursChange(tr) {
      if (tr.hours) {
        localStorage.setItem("hours", tr.hours + "");
      }
    },
    summaryChange(tr) {
      if (tr.summary) {
        localStorage.setItem("summary", tr.summary);
      }
    },
    addWorkLogData() {
      this.workLogData.push(this.newWorkLog());
      let idx = this.workLogData.length - 1;
      this.reload(idx);
    },
    delWorklogData(i) {
      this.workLogData.splice(i, 1);
    },
    newWorkLog() {
      let date = moment().startOf("isoWeek").toDate();
      let dataLen = this.workLogData.length;
      if (dataLen >= 1) {
        if (dataLen % this.setting.dateIncrementalInterval === 0) {
          date = moment(
            this.workLogData[dataLen - 1].logDate,
            "YYYY-MM-DD"
          ).add(1, "days");
        } else {
          date = moment(this.workLogData[dataLen - 1].logDate, "YYYY-MM-DD");
        }
      }
      let newWorkLog = {};
      Object.assign(newWorkLog, this.defaultWorkLog);
      newWorkLog.logDate = format(date);
      newWorkLog.projectId = this.getLocalCache("projectId");
      newWorkLog.issueTypeId = this.getLocalCache(
        `${newWorkLog.projectId}_issueTypeId`
      );
      newWorkLog.categoryId = this.getLocalCache("categoryId");
      newWorkLog.subCategoryId = this.getLocalCache(
        `${newWorkLog.categoryId}_subCategoryId`
      );
      newWorkLog.hours = this.getLocalCache("hours")
        ? parseInt(this.getLocalCache("hours"))
        : this.setting.hours;
      newWorkLog.summary = this.getLocalCache("summary");
      return newWorkLog;
    },
    getLocalCache(name) {
      let val = localStorage.getItem(name);
      return val || "";
    },
    reload(idx) {
      this.projectChange(
        this.workLogData[idx],
        idx,
        this.workLogData[idx].issueTypeId
      );
      this.categoryChange(
        this.workLogData[idx],
        idx,
        this.workLogData[idx].subCategoryId
      );
    },
    submit() {
      // check data
      if (this.dataCheck()) {
        // submit
        this.confirmActive = true;
      }
    },
    dataCheck() {
      let i = 1;
      for (let item of this.workLogData) {
        let text = `第${i++}条数据,`;
        if (!item.projectId) {
          text += "项目未选择";
          this.dataErr(text);
          return false;
        } else if (!item.issueTypeId) {
          text += "问题类型未选择";
          this.dataErr(text);
          return false;
        } else if (!item.summary) {
          text += "标题未填写";
          this.dataErr(text);
          return false;
        } else if (!item.categoryId) {
          text += "分类未选择";
          this.dataErr(text);
          return false;
        } else if (!item.subCategoryId) {
          text += "子分类未选择";
          this.dataErr(text);
          return false;
        } else if (!item.logDate) {
          text += "日期未选择";
          this.dataErr(text);
          return false;
        } else if (!item.hours) {
          text += "工时未填写";
          this.dataErr(text);
          return false;
        }
      }
      return true;
    },
    dataErr(text) {
      this.$vs.notification({
        progress: "auto",
        position: "top-center",
        color: "danger",
        title: "数据填写错误！",
        text: text,
      });
    },
    confirm() {
      let params = {
        loginName: this.user.loginName,
        password: this.user.password,
        works: [],
      };
      for (let item of this.workLogData) {
        params.works.push({
          projectId: item.projectId,
          issueTypeId: item.issueTypeId,
          atlToken: this.issueData.atlToken,
          formToken: this.issueData.formToken,
          summary: item.summary,
          categoryId: item.categoryId,
          subCategoryId: item.subCategoryId,
          assignee: this.issueData.assignee,
          logDate: item.logDate,
          hours: item.hours,
          categoryType: this.issueData.ext,
        });
      }
      this.confirmActive = false;
      const loading = this.$vs.loading({
        text: "啪一下，很快啊！就提交了...",
      });
      createIssueLog(params)
        .then((data) => {
          this.$vs.notification({
            progress: "auto",
            position: "top-center",
            color: "success",
            title: "工时提交成功！",
            content: tip,
          });
          loading.close();
          // 重置数据
          this.workLogData = [];
          setTimeout(() => {
            this.workLogData.push(this.newWorkLog());
            this.reload(0);
          }, 50);
        })
        .catch((data) => {
          loading.close();
        });
    },
    out() {
      localStorage.removeItem("userInfo");
      location.reload();
    },
    openSetting() {
      let setting = localStorage.getItem("setting");
      if (setting) {
        this.setting = JSON.parse(setting);
      } else {
        this.setting.hours = 8;
        this.setting.dateIncrementalInterval = 1;
      }
      this.settingActive = true;
    },
    settingOk() {
      localStorage.setItem("setting", JSON.stringify(this.setting));
      this.settingActive = false;
    },
    toGithub() {
      window.open("https://github.com/yinjunonly");
    },
  },
  mounted() {
    let user = localStorage.getItem("userInfo");
    if (!user) {
      this.loginDialogActive = true;
    } else {
      user = JSON.parse(user);
      this.localUser = true;
      this.user = user;
      this.sign();
    }
    let setting = localStorage.getItem("setting");
    if (setting) {
      this.setting = JSON.parse(setting);
    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  .content {
    margin: 80px;
    max-width: 98%;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    .div-content {
      vertical-align: top;
      display: inline-block;
      position: relative;
      width: 326px;
      height: 320px;
      margin: 0 5px 5px 0;
      border-radius: 12px;
      padding: 10px;
      background-color: rgba(30, 30, 30, 0.1);
      .del-button {
        position: absolute;
        right: 0px;
        top: 0px;
      }
    }
    .add-div {
      vertical-align: top;
      display: inline-block;
      position: relative;
      width: 326px;
      height: 320px;
      margin: 0 5px 5px 0;
      border-radius: 12px;
      padding: 10px;
      background-color: rgba(30, 30, 30, 0.1);
      border: 2px dashed grey;
      .add-button {
        text-align: center;
        line-height: 320px;
        font-size: 50px;
        color: grey;
        &:hover {
          font-size: 55px;
          color: gray;
        }
      }
    }
  }
}
.not-margin {
  margin: 0;
  font-weight: normal;
  padding: 10px;
}
</style>
<style lang="scss">
.con-form {
  width: 100%;
  .vs-input-content {
    margin: 10px 0px;
    width: calc(100%);
    .vs-input {
      width: 100%;
    }
  }
}
.con-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .vs-button {
    margin: 0;
    .vs-button__content {
      padding: 10px 30px;
    }
    ~ .vs-button {
      margin-left: 10px;
    }
  }
}
.hours {
  .vs-input {
    width: 300px;
  }
}
.card-contnet {
  height: 320px;
  .vs-select {
    width: 300px;
  }
  .vs-input {
    width: 300px;
  }
}
.setting {
  .vs-input {
    width: 100%;
  }
}
</style>

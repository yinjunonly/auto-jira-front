<template>
  <section class="home">
    <vs-navbar
      target-scroll="#padding-scroll-content"
      fixed
      shadow
      centerCollapsed
    >
      <template #left>
        <h2>XXXX</h2>
      </template>
      <template #right>
        <h2>{{ issueData.assignee }}</h2>
      </template>
    </vs-navbar>
    <div class="content">
      <vs-table striped>
        <template #thead>
          <vs-tr>
            <vs-th> 项目 </vs-th>
            <vs-th> 问题类型 </vs-th>
            <vs-th> 标题 </vs-th>
            <vs-th> 分类 </vs-th>
            <vs-th> 子分类 </vs-th>
            <vs-th> 日期 </vs-th>
            <vs-th> 工时(hours) </vs-th>
            <vs-th> 操作 </vs-th>
          </vs-tr>
        </template>
        <template #tbody>
          <vs-tr :key="i" v-for="(tr, i) in workLogData" :data="tr">
            <vs-td>
              <vs-select placeholder="Select" v-model="tr.projectId">
                <vs-option
                  v-for="item in issueData.projects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  {{ item.name }}
                </vs-option>
              </vs-select>
            </vs-td>
            <vs-td>
              2
              <!-- <vs-select filter placeholder="Select" v-model="tr.issueTypeId">
                <vs-option
                  v-for="item in curIssueTypes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  {{ item.name }}
                </vs-option>
              </vs-select> -->
            </vs-td>
            <vs-td> 3</vs-td>
            <vs-td> 4</vs-td>
            <vs-td> 5</vs-td>
            <vs-td> 6</vs-td>
            <vs-td> 7</vs-td>
            <vs-td>
              <vs-button icon flat color="danger">
                <i class="bx bxs-x-square"></i>
              </vs-button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <div>
        <vs-button
          icon
          flat
          color="success"
          style="display: block; margin: 0 auto"
        >
          <i class="bx bx-add-to-queue"></i>
        </vs-button>
      </div>
    </div>
    <vs-dialog
      :loading="loginLoading"
      prevent-close
      blur
      v-model="loginDialogActive"
    >
      <template #header>
        <h4 class="not-margin">Welcome to <b>Auto-jira</b></h4>
      </template>

      <div class="con-form">
        <vs-input v-model="user.loginName" placeholder="LoginName">
          <template #icon>
            <i class="bx bx-user"></i>
          </template>
          <template v-if="user.loginName === ''" #message-danger>
            Required
          </template>
        </vs-input>
        <vs-input
          type="password"
          v-model="user.password"
          placeholder="Password"
        >
          <template #icon>
            <i class="bx bxs-lock"></i>
          </template>
          <template v-if="user.password === ''" #message-danger>
            Required
          </template>
        </vs-input>
      </div>

      <template #footer>
        <div class="footer-dialog">
          <vs-button block @click="sign"> Sign In </vs-button>
        </div>
      </template>
    </vs-dialog>
  </section>
</template>

<script>
import { getIssueInfo } from "../api/apis";
import { Base64 } from "../utils/tools";
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
      workLogData: [
        {
          projectId: "",
        },
      ],
      curIssueTypes: [],
      aa: "",
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
              "user",
              JSON.stringify({
                loginName: params.loginName,
                password: params.password,
              })
            );
          })
          .catch((err) => {
            this.loginLoading = false;
            if (loading) {
              loading.close();
            }
          });
      }
    },
  },
  mounted() {
    let user = localStorage.getItem("user");
    if (!user) {
      this.loginDialogActive = true;
    } else {
      user = JSON.parse(user);
      this.localUser = true;
      this.user = user;
      this.sign();
    }
  },
};
</script>

<style lang="scss" scoped>
.home {
  .content {
    margin: 80px;
    height: 900px;
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
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
</style>

<template>
  <section class="home">
    <div class="center examplex">
      <vs-navbar center-collapsed v-model="active">
        <template #left>
          <h2>{{ issueData.assignee }}</h2>
        </template>
      </vs-navbar>
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
      },
      localUser: false,
    };
  },
  methods: {
    sign() {
      this.loginLoading = true;
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
  max-width: 1200px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
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

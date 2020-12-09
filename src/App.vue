<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC,
    Hiragino Sans GB, Microsoft YaHei, Helvetica Neue, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
HTML {
  padding: 0;
  background-color:white;
  background-image: url("./assets/test.png");
}
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

/*定义滚动条轨道 内阴影*/
::-webkit-scrollbar-track {
  //border-radius: 0.15em;
  background-color: rgba(50, 50, 50, 0.1);
}

/*定义滑块 内阴影*/
::-webkit-scrollbar-thumb {
  //border-radius: 0.15em;
  background-color: rgba(50, 50, 50, 0.3);
  // background-image: -webkit-linear-gradient(
  //   45deg,
  //   rgba(255, 255, 255, 0.2) 25%,
  //   transparent 25%,
  //   transparent 50%,
  //   rgba(255, 255, 255, 0.2) 50%,
  //   rgba(255, 255, 255, 0.2) 75%,
  //   transparent 75%,
  //   transparent
  // );
}
</style>

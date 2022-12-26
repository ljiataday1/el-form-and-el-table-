<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

</script>

<style>
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
*{
  box-sizing: border-box;
}
/* margin-top: 60px; */
/* 自适应代码 */
/* position: fixed;
  left: 50%;
  top: 50%;
  transform-origin: 0 0;
  transition: 0.3s;
} */
.p {
  background-color: #2c3e50;
  color: #fff;
  font-size: 14px;
  word-break: break-all;
}
body {
  padding: 0;
  margin: 0;
}
.test {
  font-size: 14px;
  border: 1px solid #333;
  /* height: 40px; */
  display: inline-block;
  padding-top: 12px;
  padding-bottom: 12px;
  line-height: 1;
  text-align: center;
  border-radius: 4px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
}
.test-vh {
  height: 30vh;
  background-color: #2c3e50;
}
</style>

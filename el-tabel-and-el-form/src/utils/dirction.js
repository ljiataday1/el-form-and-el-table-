/* eslint-disable semi */
/* eslint-disable quotes */
import Vue from "vue";
const copy = Vue.directive("copyata", {
  bind: (el, bind, vnode) => {
    console.log(el.$value = bind.value);
    console.log(bind.value)
    console.log(vnode)
  }
});
export default {
  copy
};

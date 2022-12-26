const getPath = require.context("@/components/appForm", true, /\.vue$/);
const copObj = {};
getPath.keys().forEach(item => {
  console.log(item);
  if (item !== "./index.vue") {
    const cop = getPath(item).default || getPath(item);
    copObj[cop.name] = cop;
  }
});
export default copObj

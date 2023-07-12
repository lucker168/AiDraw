
<template>
  <router-view></router-view>
</template>
<script>
export default {
  mounted() {
    function placeholderPic () {
      document.documentElement.style.fontSize=document.documentElement.offsetWidth/80+"px";
    }
    placeholderPic ();
    window.addEventListener('resize', () => {placeholderPic()}, false);
  }
}
</script>
<style scoped></style>

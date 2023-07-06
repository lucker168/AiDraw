
<template>
  <AppIndex />
</template>
<script>
import AppIndex from './components/AppIndex.vue'
export default {
  components: { AppIndex },
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

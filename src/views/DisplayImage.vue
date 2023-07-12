<template>
    <div class="img-view-content">
      <img :src = "imgUrl">
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return { 
        imgUrl: ""
      }
    },
    mounted() {
      const taskId = localStorage.getItem("taskId");
      const btnId = localStorage.getItem("btnId");
      this.imgUrl = "https://mydreamypaint.oss-cn-hongkong.aliyuncs.com/" + taskId + ".png"
    }
  };
  </script>
<style>
.img-view-content {
  width: 800px;
  height: 800px;
}
.img-view-content img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
  
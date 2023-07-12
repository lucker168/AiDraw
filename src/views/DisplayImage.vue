<template>
    <div>
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
  
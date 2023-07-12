<template>
  <div class="image-container">
    <div ref="myImage" class="inner-image" 
    :style="{ 'background-Image': `url(${imgUrl})`,'background-position': `${position}`}">
  </div>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return { imgUrl: "", position: ""}
    },
    methods: {
      backgroundPosition(btnId) {
        switch(btnId) {
          case "1": return "top left";
          case "2": return "top right";
          case "3": return "bottom left";
          case "4": return "bottom right";
        }
      }
    },
    mounted() {
      this.imgUrl = localStorage.getItem("imgUrl");
      const btnId = localStorage.getItem("btnId");
      this.position = this.backgroundPosition(btnId);
    }
  };
  </script>
<style>
.image-container {
  display: flex; /* 使用 Flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.inner-image {
    width: 1000px; /* 设置内部图像容器宽度 */
    height: 1000px; /* 设置内部图像容器高度 */
    /* background-image: url(''); /* 设置背景图路径 */
    /* background-position: top right;  /* 设置背景图位置 */
    /* background-size: 400% auto; /* 设置背景图尺寸为四倍宽度 */
    background-repeat: no-repeat; /* 禁止背景图重复 */
}
</style>
  
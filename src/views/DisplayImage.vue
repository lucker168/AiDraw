<template>
  <div class="image-container">
    <img :src="croppedImage">
  </div>
</template>

<style>
.image-container {
  display: flex; /* 使用 Flex 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
</style>

<script>
export default {
  data() {
    return {
      imageSrc: '', // 用于显示原始图片的URL
      croppedImage: '', // 存储裁剪后的图片URL
    };
  },
  mounted() {
      const img = new Image();
      img.src = localStorage.getItem("imgUrl");
      const btnId = localStorage.getItem("btnId");
      img.setAttribute("crossOrigin",'Anonymous');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const originalWidth = img.width;
        const originalHeight = img.height;

        const croppedWidth = originalWidth / 2; // 裁剪后的宽度
        const croppedHeight = originalHeight / 2; // 裁剪后的高度
        canvas.width = croppedWidth;
        canvas.height = croppedHeight;
        let sx = 0;    // 源图像的左上角 x 坐标
        let sy = 0;    // 源图像的左上角 Y 坐标

        switch(btnId) {
          case "1": {sx = 0; sy = 0}; break;
          case "2": {sx = croppedWidth; sy = 0}; break;
          case "3": {sx = 0; sy = croppedHeight}; break;
          case "4": {sx = croppedWidth; sy = croppedHeight}; break;
        }
        ctx.drawImage(img, sx, sy, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
        this.croppedImage = canvas.toDataURL();  // 获取裁剪后的图片URL
        console.log("croppedImage===>  "+this.croppedImage);
      };
  }
};
</script>

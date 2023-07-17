<template>
  <div>
    <div class="top-contain">
      <div class="top-item">关于我们</div>
      <div class="top-item">联系我们</div>
    </div>
    <el-carousel :autoplay="false" arrow="always" :height="height">
      <el-carousel-item v-for="(e, i) in carouselList" :key="e">
        <div class="c-item" :style="{ backgroundImage: 'url(' + e.img + ')' }"></div>
      </el-carousel-item>
    </el-carousel>
    <div class="brand-contain">
      <div v-for="(e, i) in brandList" :key="e">
        <div :style="{ backgroundImage: 'url(' + e.img + ')' }" class="brand-img"></div>
        <div class="brand-text">
          <div>{{ e.name }}</div>
          <div>{{ e.subName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      height: "25vw", // 轮播图比例: 4:1
      carouselList: [
        {img:"", url:""},
        {img:"", url:""},
        {img:"", url:""},
        {img:"", url:""},
        {img:"", url:""},
      ],
      brandList: [
        {img:"", name:"儿童装饰画", subName: "装饰"},
        {img:"", name:"趣味素描", subName: "sketh"},
        {img:"", name:"漫画阅读", subName: "comic"},
        {img:"", name:"手工制作", subName: "manual"},
      ]
    };
  },
}
</script>

<style>
body {
  margin: 0;
}
div {
  box-sizing: border-box;
}

.top-contain {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.8333333333rem;
  font-family: HannotateSC-W7, HannotateSC;
  font-weight: normal;
  color: #19202e;
  line-height: 1.1666666667rem;
}

.top-item {
  padding: 0 1.5rem;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.c-item {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.brand-contain {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 3rem;
}
.brand-img {
  width: 7rem;
  height: 7rem;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-color: #d3dce6;
}
.brand-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  font-size: 0.8333333333rem;
  font-family: HannotateSC-W7, HannotateSC;
  font-weight: normal;
  color: #19202e;
  line-height: 1.1666666667rem;
}
</style>

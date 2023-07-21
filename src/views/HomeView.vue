<template>
  <div>
    <div class="top-contain">
      <div class="top-item" @click="login()">关于我们</div>
      <div class="top-item" @click="hello()">联系我们</div>
    </div>
    <el-carousel :autoplay="false" arrow="always" :height="height">
      <el-carousel-item v-for="(e, i) in carouselList" :key="e">
        <div class="c-item" :style="{ backgroundImage: 'url(' + e.img + ')' }"></div>
      </el-carousel-item>
    </el-carousel>
    <div class="brand-contain">
      <div v-for="(e, i) in brandList" :key="e">
        <div :style="{ backgroundImage: 'url(' + e.img + ')' }" class="brand-img" @click="routeTo(e)"></div>
        <div class="brand-text">
          <div>{{ e.name }}</div>
          <div>{{ e.subName }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios  from 'axios';
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

export default {
  data() {
    return {
      height: "25vw", // 轮播图比例: 4:1
      carouselList: [
        {img:"./img/pic1.png", url:""},
        {img:"./img/pic2.png", url:""},
        {img:"./img/pic3.png", url:""},
        {img:"./img/pic4.png", url:""}
      ],
      brandList: [
        {img:"./img/myDrawBrand.png", name:"我的梦幻画板", subName: "draw"},
        {img:"", name:"插画故事", subName: "sketh"},
        {img:"", name:"AI绘画学习", subName: "comic"},
        {img:"", name:"会员登录", subName: "manual"},
      ]
    };
  },
  methods: {
    routeTo(brand) {
      console.log(brand);
      if(brand.subName === "draw") {
        this.$router.push({name: 'draw'});
      }
    },
    async login() {
      const res = await axios({
          method: 'post',
          url: '/user/login',
          data: {
            userName: "lucker168",
            password: "test123"
          }
        });
      console.log(res.data);
    },
    async hello() {
      // const token = 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJkOTE3YWFkYzYwMDA0ODY3OGFjZjI4YTEyOWUyYjI1YiIsInN1YiI6IjIiLCJpc3MiOiJzZyIsImlhdCI6MTY4OTkwOTA1OCwiZXhwIjoxNjg5OTEyNjU4fQ.sKctrY-DbVeCHJmlTiak00b-4WEVxxHTTUHYm_pZA70';
      const encodeToken = encodeURIComponent(token)
      const res = await axios({
          headers: {
            token: encodeToken
          },
          method: 'post',
          url: '/hello',
        });
      console.log(res.data);
    }
  }
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

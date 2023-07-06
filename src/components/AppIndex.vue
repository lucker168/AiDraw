<template>
  <div class="p-contain">
    <div class="p-content">
      <div class="p-logo">
        <div class="p-logo1"></div>
        <div class="p-logo2"></div>
      </div>
      <div class="p-action">
        <div class="p-tool-classify">
          <div class="ptc-item" v-for="(e, i) of menuList" :key="i" @click="handleClickMenu(e, i)">
            <!-- <img class="ptc-item-img" :src="activeNav == i ? e.activeImg : e.img"/>
            <div class="ptc-item-text" :class="activeNav == i ? 'isActive' : ''">
              {{ e.name }}
            </div> -->
            <img class="ptc-item-img" :src="baseImgUrl + e.img"/>
            <div class="ptc-item-text">{{ e.name }}</div>
          </div>
        </div>
        <div class="p-tool-list" v-show="showSubMenu">
          <div
            class="p-tool-item"
            v-for="(e, i) of subMenu"
            :key="i"
            :class="e.isSelected ? 'is-selected' : ''"
            @click="handleClickSubMenu(e)"
          >
            <div class="p-tool-sub-item">
              <!-- <img class="p-tool-item-img" :class="e.className" :src="e.img" /> -->
              <img class="p-tool-item-img" :src="baseImgUrl + e.img" style="width: 80%,height:80%;"/>
              <div class="p-tool-item-text">{{ e.name }}</div>
            </div>
          </div>
        </div>
        <div class="p-sub-contain">
          <div class="p-desc-contain">
            <div class="p-desc">{{ description }}</div>
          </div>
          <div class="p-action-contain">
            <div class="p-selection">
              <div v-show="selectList.length > 0" class="p-select-title">
                已选：
              </div>
              <div class="p-select-list">
                <div
                  class="p-select-item"
                  v-for="(e, i) in selectList"
                  :key="i"
                >
                  <div class="p-select-text">{{ e }}</div>
                  <div class="p-select-icon"></div>
                </div>
              </div>
            </div>
            <textarea
              class="p-textarea"
              placeholder="请输入描述词语…" v-model="inputDesc"
            ></textarea>
            <div class="p-voice" @click="startSpeechRecognition()"></div>
            <div class="p-btn" @click="draw()">
              <div>开始绘画</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-res-content">
      <div v-if="!showImage" class="p-paper">
        <div class="p-loading">
          <div class="p-loading-img"></div>
          <div class="p-loading-text" @click="getImage()">绘画生成中…</div>
        </div>
      </div>
      <div v-else class="p-paper p-paper-nobg">
        <div class="p-img-content">
          <!-- 返回结果为1张 -->
          <el-image :src="imgUrl" :preview-src-list="[imgUrl]"></el-image>
          <!-- <img class="ptc-item-img" :src="imgUrl" style="width: 100%;height: 100%;"/> -->
          <!-- 返回结果为4张 -->
          <!-- <div class="p-img-group">
            <el-image
              v-for="(e, i) in imgGroup"
              :key="i"
              :src="e"
              :preview-src-list="[e]"
            >
            </el-image>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      inputDesc: '',
      baseImgUrl: "src/components/img/",
      activeNav: 0,
      showImage: false,
      imgUrl: "",
      imgGroup: [],
      description: "",
      selectList: [],
      subMenu: [],
      showSubMenu: false,
      menuList: []
      // menuList: [
      //   {
      //     name: "情绪",
      //     img: new URL("./img/qingxu.svg", import.meta.url).href,
      //     activeImg: new URL("./img/qingxu_a.png", import.meta.url).href,
      //     subMenu: [
      //       {
      //         name: "快乐",
      //         img: new URL("./img/qx_kuaile.png", import.meta.url).href,
      //         className: "p-tool-item-img-kuaile",
      //         desc: "快乐是人类精神上的一种愉悦，是一种心灵上的满足，是由内而外感受到的一种非常舒服的感觉。比喻人的一种开心、高兴的状态。快乐是无法定义的、是模糊的、是要用心感受的",
      //         isSelected: false,
      //       },
      //       {
      //         name: "恐惧",
      //         img: new URL("./img/qx_kongju.png", import.meta.url).href,
      //         className: "p-tool-item-img-kongju",
      //         desc: "内容过长可滚动",
      //         isSelected: false,
      //       },
      //       {
      //         name: "期待",
      //         img: new URL("./img/qx_qidai.png", import.meta.url).href,
      //         className: "p-tool-item-img-qidai",
      //         desc: "描述三",
      //         isSelected: false,
      //       },
      //       {
      //         name: "愤怒",
      //         img: new URL("./img/qx_fennu.png", import.meta.url).href,
      //         className: "p-tool-item-img-fennu",
      //         desc: "描述一",
      //         isSelected: false,
      //       },
      //       {
      //         name: "惊喜",
      //         img: new URL("./img/qx_jingxi.png", import.meta.url).href,
      //         className: "p-tool-item-img-jingxi",
      //         desc: "描述二",
      //         isSelected: false,
      //       },
      //       {
      //         name: "悲伤",
      //         img: new URL("./img/qx_beishang.png", import.meta.url).href,
      //         className: "p-tool-item-img-beishang",
      //         desc: "描述三",
      //         isSelected: false,
      //       },
      //       {
      //         name: "信任",
      //         img: new URL("./img/qx_xinren.png", import.meta.url).href,
      //         className: "p-tool-item-img-xinren",
      //         desc: "描述二",
      //         isSelected: false,
      //       },
      //       {
      //         name: "厌恶",
      //         img: new URL("./img/qx_yanwu.png", import.meta.url).href,
      //         className: "p-tool-item-img-yanwu",
      //         desc: "描述三",
      //         isSelected: false,
      //       },
      //     ],
      //   },
      //   {
      //     name: "光线",
      //     img: new URL("./img/guangxian.png", import.meta.url).href,
      //     activeImg: new URL("./img/guangxian_a.svg", import.meta.url).href,
      //     subMenu: [
      //       {
      //         name: "光线一",
      //         img: new URL("./img/qx_kuaile.png", import.meta.url).href,
      //         className: "p-tool-item-img-kuaile",
      //         desc: "内容一",
      //         isSelected: false,
      //       },
      //     ],
      //   },
      //   {
      //     name: "媒介",
      //     img: new URL("./img/meijie.png", import.meta.url).href,
      //     activeImg: new URL("./img/meijie_a.svg", import.meta.url).href,
      //     subMenu: [
      //       {
      //         name: "媒介一",
      //         img: new URL("./img/qx_kuaile.png", import.meta.url).href,
      //         className: "p-tool-item-img-kuaile",
      //         desc: "内容一",
      //         isSelected: false,
      //       },
      //     ],
      //   },
      //   {
      //     name: "艺术风格",
      //     img: new URL("./img/yishu.png", import.meta.url).href,
      //     activeImg: new URL("./img/yishu_a.svg", import.meta.url).href,
      //     subMenu: [
      //       {
      //         name: "艺术风格一",
      //         img: new URL("./img/qx_kuaile.png", import.meta.url).href,
      //         className: "p-tool-item-img-kuaile",
      //         desc: "内容一",
      //         isSelected: false,
      //       },
      //     ],
      //   },
      // ]
    }
  },
  methods: {
    loadJsonData() {
      fetch('src/assets/config.json')
        .then(response => response.json())
        .then(data => {
          console.log("data ==>" + data.menulist);
          this.menuList = data.menulist;
          console.log(this.menuList[0]);
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleClickMenu (item, index) {
      this.showSubMenu = !this.showSubMenu;
      this.activeNav = index;
      if (item.subMenu && item.subMenu.length > 0) {
        this.subMenu = item.subMenu;
      } else {
        this.subMenu = [];
      }
    },
    handleClickSubMenu (item) {
      this.selectList = [];
      item.isSelected = !item.isSelected;
      if (item.isSelected) {
        this.description = item.desc;
      } else {
        this.description = "";
      }
      this.menuList.forEach((e) => {
        let arr = e.subMenu
          .filter((ee) => {
            return ee.isSelected;
          })
          .map((eee) => {
            return e.name + "-" + eee.name;
          });
        this.selectList = [...this.selectList, ...arr];
      });
    },
    draw() {
      this.showImage = true;
      axios({
        method: 'post',
        url: '/mj/submit/imagine',
        data: {
          prompt: 'a girl near sea'
        }
      }).then((res) => {
        this.getImage(123);
        console.log(res)
      }).catch(err => {
        console.log(err)
      });
      console.log("drawing")
    },
    getImage(id) {
      console.log("getImage")
      this.showImage = true;
      const taskId = '5698911826219220';
      axios.get(`/mj/task/${taskId}/fetch`)
      .then((res) => {
        if(res.data.status = "SUCCESS") {
          console.log(res.data.imageUrl)
          this.imgUrl = res.data.imageUrl;
        }
      }).catch(err => {
        console.log(err)
      });
    },
    startSpeechRecognition() {
      this.recognition.start();
      this.inputDesc = '正在识别...';
    },
    handleRecognitionResult(event) {
      const result = event.results[0][0].transcript;
      this.inputDesc = result;
      console.log('result...'+ result);
    },
    handleRecognitionError(event) {
      console.error(event.error);
    }
  },
  mounted() {
    this.loadJsonData();
    // 创建语音识别实例
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'zh-CN'; // 设置语言为中文
    this.recognition.onresult = this.handleRecognitionResult;
    this.recognition.onerror = this.handleRecognitionError;
    // this.subMenu = this.menuList[this.activeNav].subMenu;
  }
}
</script>
<style>
  @import './normalize.css';
  @import './index.css';
</style>

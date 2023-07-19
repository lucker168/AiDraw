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
        <div class="p-tool-list">
          <div
            class="p-tool-item"
            v-for="(e, i) of subMenu"
            :key="i"
            :class="e.isSelected ? 'is-selected' : ''"
            @click="handleClickSubMenu(e)"  
            @mouseenter="handleMouseover(e)">
            <div class="p-tool-sub-item">
              <!-- <img class="p-tool-item-img" :class="e.className" :src="e.img" /> -->
              <img class="p-tool-item-img" :src="baseImgUrl + e.img"/>
              <div class="p-tool-item-text">{{ e.name }}</div>
            </div>
          </div>
        </div>
        <div class="p-sub-contain">
          <div class="p-desc-contain">
            <div class="p-title">情绪：悲伤</div>
            <div class="p-desc">{{ description ? description: defaultDesc}}</div>
            <div class="p-button" @click="showTip=!showTip">
              <div class="p-button-img"></div>
              <div class="p-button-text">更多学习</div>
            </div>
            <div v-show="showTip" class="p-tip-contain">
              <div class="p-tip-top">
                <div class="p-tip-top-notes"></div>
                <div class="p-tip-top-clip"></div>
                <div class="p-tip-top-close" @click="showTip=!showTip"></div>
                <div class="p-tip-top-text">
                  一个伤感的面部表情，可以注意以下细节：眼睛变大变湿，流眼泪；眉毛皱成一团；嘴巴垂下，嘴角向下弯；脸变瘦，脸肌肉变松；鼻子红红的，有时会流鼻涕；额头有很多皱纹；脸变得没力气。这些细节可以帮助我们画出伤感或难受的表情！记得，如果感到伤心，可以找人倾诉，我们都会在困难中互相支持。加油！
                </div>
              </div>
            </div>
          </div>
          <div class="p-action-contain">
            <div class="p-selection">
              <div v-show="selectList.length > 0" class="p-select-title">
                已选：
              </div>
              <div class="p-select-text" v-if="selectList.length == 0">{{ defaultSelTxt }}</div>
              <div class="p-select-list">
                <div
                  class="p-select-item"
                  v-for="(e, i) in selectList"
                  :key="i"
                >
                  <div class="p-select-text">{{ e.name }}</div>
                  <div class="p-select-icon"></div>
                </div>
              </div>
            </div>
            <textarea
              class="p-textarea"
              placeholder="请输入描述词语…" v-model="inputDesc"
            ></textarea>
            <div class="p-voice" @click="startSpeechRecognition()"></div>
            <div class="p-btn" :class="drawing?'is-drawing':''" @click="draw()" :disabled="drawing">
              <div>开始绘画</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-res-content">
      <div v-if="!imgUrl" class="p-paper">
          <div class="p-loading">
            <div class="p-loading-img"></div>
            <div class="p-loading-text">{{ processStatus }}</div>
            <!-- <div class="scroll-container">
              <div class="scroll-content">{{ storyText }}</div>
            </div> -->
          </div>
      </div>
      <div v-else class="p-paper">
        <div class="p-img-content">
          <!-- 返回结果为1张 -->
          <el-image :src="imgUrl" :preview-src-list="[imgUrl]"></el-image>
        </div>
      </div>

      <div class="p-color-contain">
        <div class="p-color-text">背景色</div>
        <div class="p-color-bg p-white"></div>
        <div class="p-color-bg p-blue"></div>
        <div class="p-color-bg p-yellow"></div>
        <div class="p-color-bg p-palette">
          <div class="p-palette-box" @click="showColor = !showColor"></div>
          <div v-show="showColor" class="p-color-selector">
            <div
              class="c-color-item"
              v-for="(e, i) in color"
              :key="i"
              :style="'background:' + e"
              @click="showColor = !showColor"
            ></div>
          </div>
        </div>
      </div>
      <div class="p-choose-contain">
        <div class="p-choose-groue">
          <div :class="{'p-c-item': true , 'is-selected' : uBtn == 1}" @click="openImageInNewTab(1)">图1</div>
          <div :class="{'p-c-item': true , 'is-selected' : uBtn == 2}" @click="openImageInNewTab(2)">图2</div>
          <div :class="{'p-c-item': true , 'is-selected' : uBtn == 3}" @click="openImageInNewTab(3)">图3</div>
          <div :class="{'p-c-item': true , 'is-selected' : uBtn == 4}" @click="openImageInNewTab(4)">图4</div>
        </div>
        <!-- <div class="p-choose-groue">
          <div class="p-c-item">V1</div>
          <div class="p-c-item">V2</div>
          <div class="p-c-item">V3</div>
          <div class="p-c-item">V4</div>
        </div> -->
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import config from "../../config.json";
import story from "../../storylist.json";

export default {
  data() {
    return {
      inputDesc: '',
      baseImgUrl: "./img/",
      activeNav: 0,
      showImage: false,
      drawing: false,
      progress: "initial",
      downLoadPer: 0,
      imgUrl: "",
      description: "",
      defaultDesc: "",
      selectList: [],
      defaultSelTxt: "",
      interval: 10,
      subMenu: [],
      showSubMenu: false,
      menuList: [],
      showColor: false,
      color: ["#e2bc34","#fa9435","#ff6a45","#f1465c","#d33072","#a52e82","#2c58b6","#0079d7","#59b27d","#f4f7a4","#cecece","#000000"],
      taskId: "",
      uBtn: 1,
      storyText: "",
      showTip: true,
    }
  },
  computed:{
      processStatus() {
         switch(this.progress) {
            case "0%":   return "队列等待中。。";
            case "100%": return "绘图成功，图片下载中。。"+ this.downLoadPer +"%";
            case "": return "任务超时，请稍后再试。。";
            case "initial": return "点击按钮，上传图片";
            default: return "绘画生成中。。" + this.progress;
         }
      }
  },
  methods: {
    handleClickMenu(item, index) {
      this.showSubMenu = !this.showSubMenu;
      this.activeNav = index;
      if (item.subMenu && item.subMenu.length > 0) {
        this.subMenu = item.subMenu;
      } else {
        this.subMenu = [];
      }
    },
    handleClickSubMenu(item) {
      this.selectList = [];
      item.isSelected = !item.isSelected;
      if (item.isSelected) {
        this.description = item.desc;
      } else {
        this.description = "";
      }
      this.menuList.forEach((e) => {
        let arr = e.subMenu.filter((ee) => { return ee.isSelected;});
        this.selectList = [...this.selectList, ...arr];
      });
    },
    handleMouseover(e) { this.description = e.desc;},
    handleMouseout() { this.description = this.defaultDesc },
    draw() {
      try {
        if (this.drawing) {
          return;
        }
        this.drawing = true;
        this.showImage = false;
        this.progress = "0%"
        let keywords = "";
        this.selectList.map(e => {
          keywords = keywords + e.keyword;
          return keywords;
        });
        let paras = "";
        this.selectList.map(e => {
          paras = paras + e.para;
          return paras;
        });
        axios({
          method: 'post',
          url: '/mj/submit/imagine',
          data: {
            prompt: this.inputDesc,
            keyWord: keywords,
            sizePara: paras
          }
        }).then((res) => {
          alert(res.data.description);
          if (res.data.code == 1) {
            this.getImage(res.data.result);
          } else {
            this.drawing = false;
          }
        }).catch(err => {
          console.log(err);
          this.drawing = false;
        });
      } catch (e) {
        this.drawing = false;
      }
    },
    getImage(taskId) {
      this.taskId = taskId;
      const interval = setInterval(() => {
        axios.get(`/mj/task/${taskId}/fetch`)
          .then((res) => {
            this.progress = res.data.progress;
            if (res.data && res.data.progress == "100%") {
              clearInterval(interval);
              const imageUrl = res.data.imageUrl;
              this.downLoadPic(imageUrl, taskId);
            } else if (res.data.status == "FAILURE") {
              this.drawing = false;
              alert(res.data.progress);
            }
          }).catch(err => {
            console.log(err)
            this.drawing = false;
          });
      }, config.getInterval);
    },
    downLoadPic(imgUrl,taskId) {
      this.downLoadPer = 0;
      if(imgUrl && taskId) {
        const interval = setInterval(() => {
          if(this.downLoadPer == 100) {
            this.downLoadPer = 99;
            clearInterval(interval);
          } else {
            this.downLoadPer = this.downLoadPer + 10;
          }
      }, 1500);
        axios({
          method: 'get',
          url: 'http://47.242.36.60:8889/oss/download',
          params: {"imgURL": imgUrl,"taskId": taskId}
        }).then((res) => {
          if (res.data == "success") {
            this.imgUrl = "https://mydreamypaint.oss-cn-hongkong.aliyuncs.com/" + taskId + ".png";
            this.showImage = true;
            this.drawing = false;
          }
        }).catch(err => {
          console.log(err);
          this.drawing = false;
        });
      }
    },
    startSpeechRecognition() {
      this.recognition.start();
      this.inputDesc = '正在识别...';
    },
    handleRecognitionResult(event) {
      const result = event.results[0][0].transcript;
      this.inputDesc = result;
      console.log('result...' + result);
    },
    handleRecognitionError(event) {
      console.error(event.error);
    },
    openImageInNewTab(id) {
      this.uBtn = id;
      localStorage.setItem("imgUrl",this.imgUrl);
      localStorage.setItem("btnId",id);
      window.open("/new-page", '_blank');
    }
  },
  mounted() {
    this.menuList = config.menuList;
    this.defaultDesc = config.defaultDesc;
    this.defaultSelTxt = config.defaultSelTxt;

    this.storyText = story.storyList[0].story1;
    // this.interval = config.getInterval;
    // console.log(this.interval);
    // 创建语音识别实例
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'zh-CN'; // 设置语言为中文
    this.recognition.onresult = this.handleRecognitionResult;
    this.recognition.onerror = this.handleRecognitionError;
    this.subMenu = this.menuList[this.activeNav].subMenu;
  }
}
</script>
<style>
  @import './normalize.css';
  @import './index.css';

  
.scroll-container {
  /* height: 5%; 设置滚动容器的高度 */
  width: 80%;
  overflow: hidden; /* 隐藏溢出内容 */
  line-height: 1rem;
}

.scroll-content {
  animation: scroll-up 10s linear infinite; /* 使用动画实现滚动效果 */
}

@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%); /* 从 0% 平移至 -100%，实现向上滚动 */
  }
}

</style>

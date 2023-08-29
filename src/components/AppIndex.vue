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
            <div class="p-title">{{ desTitle }}</div>
            <div class="p-desc" v-html="description ? description: defaultDesc"></div>
            <div class="p-button" @click="loadContext" :disabled="isDisabled">
              <div class="p-button-img"></div>
              <div class="p-button-text">更多学习</div>
            </div>
            <div v-show="showTip" class="p-tip-contain">
              <div class="p-tip-top">
                <div class="p-tip-top-notes"></div>
                <div class="p-tip-top-clip"></div>
                <div class="p-tip-top-close" @click="showTip=!showTip"></div>
                <div class="p-tip-top-text">
                  <div class="p-tip-top-html" v-if="isDisabled">
                    <img :src="baseImgUrl + 'loading.gif'"/>
                  </div>
                  <div class="p-tip-top-html" v-if="!isDisabled" v-html="blogContext"></div>
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
            <div class="p-loading-img" @click="uploadFile">
              <input ref="fileInput" type="file" @change="onFileChange" style="display: none;">
            </div>
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

      <!-- <div class="p-color-contain">
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
      </div> -->
      <div class="p-choose-contain">
        <div class="p-choose-groue" v-if="subImages.length > 0">
          <div v-for="(imageUrl,index) in subImages" :key="index" 
          :class="{'p-c-item': true , 'is-selected' : uBtn == index}" :style="{'background-image': 'url(' + imageUrl + ')'}"
          @click="openImageInNewTab(imageUrl,index)">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
// import config from "../../config.json";
import story from "../../storylist.json";
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

export default {
  data() {
    return {
      inputDesc: '',
      baseImgUrl: "./img/",
      activeNav: 0,
      drawing: false,
      progress: "initial",
      downLoadPer: 0,
      imgUrl: "",
      description: "",
      selWordNm: "",
      isDisabled: false,
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
      showTip: false,
      desTitle: "",
      imageSrc: "",
      blogContext: "",
      subImages: []
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
    async loadContext() {
      if (this.isDisabled) {
        return;
      }
      try {
        if (this.selWordNm) {
          this.isDisabled = true;
          this.showTip = true;
          await axios.get('/mj/data/getWordInfo?name=' + this.selWordNm).then(
            res => {
              if (res.data.result) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = res.data.result;
                const firstDiv = tempDiv.querySelector('div');
                firstDiv.removeAttribute('style');
                this.blogContext = tempDiv.innerHTML;
                this.isDisabled = false;
              } else {
                this.blogContext = "没找到对应的文件";
              }
            });
        } else {
          alert("请选择一个关键字!");
        }
      } finally {
        this.isDisabled = false;
      }
    },
    loadConfig() {
      axios.get('/mj/data/getConfig').then(
        res => { 
          const config = res.data.result;
          this.menuList = config.menuList;
          this.defaultDesc = config.defaultDesc;
          this.defaultSelTxt = config.defaultSelTxt;
          this.interval = config.getInterval;
          this.subMenu = this.menuList[this.activeNav].subMenu;
        }).catch(error => {
          console.error('Error loading config.json', error);
        });
      // fetch("config.json")
      //   .then(response => response.json())
      //   .then(data => {
      //     this.menuList = data.menuList;
      //     this.defaultDesc = data.defaultDesc;
      //     this.defaultSelTxt = data.defaultSelTxt;
      //     this.interval = data.getInterval;
      //     this.subMenu = this.menuList[this.activeNav].subMenu;
      //   })
      //   .catch(error => {
      //     console.error('Error loading config.json', error);
      //   });
    },
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
    handleMouseover(e) { 
      this.desTitle = e.name;
      this.description = e.desc;
      this.selWordNm = e.img.split(".")[0];
    },
    handleMouseout() { this.description = this.defaultDesc },
    uploadFile(e) {
      if (this.drawing) {
          return;
      }
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      console.log('event 编码：', event);
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
          this.imgUrl = e.target.result;
          this.imageSrc = e.target.result;
          console.log('Base64 编码：', this.imgUrl);
        };
        reader.readAsDataURL(file);
    },
    draw() {
      try {
        if (this.drawing) {
          return;
        }
        this.drawing = true;
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
            base64: this.imageSrc,
            prompt: this.inputDesc,
            keyWord: keywords,
            sizePara: paras
          }
        }).then((res) => {
          alert(res.data.description);
          if (res.data.code == 1) {
            this.getImage(res.data.result);
          }
        }).catch(err => {
          console.log(err);
          this.drawing = false;
        });
      } catch (e) {
        this.drawing = false;
      } finally {
        this.imgUrl = "";
        this.imageSrc = "";
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
              this.downLoadPic(taskId);
            } else if (res.data.status == "FAILURE") {
              clearInterval(interval);
              this.drawing = false;
              alert(res.data.failReason);
            }
          }).catch(err => {
            console.log(err)
            this.drawing = false;
          });
      }, this.interval);
    },
    downLoadPic(taskId) {
      this.downLoadPer = 0;
      if(taskId) {
        this.imgUrl = this.baseImgUrl + "loading.gif";
        axios({
          method: 'get',
          url: '/mj/data/getImage',
          params: {"taskId": taskId}
        }).then((res) => {
          if (res.data.code == 1) {
            this.subImages = res.data.result; 
            this.imgUrl = this.subImages[0];
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
    openImageInNewTab(imageUrl,id) {
      this.uBtn = id;
      // localStorage.setItem("imgUrl",this.imgUrl);
      // localStorage.setItem("btnId",id);
      // window.open("/new-page", '_blank');
      this.imgUrl = imageUrl;
    }
  },
  mounted() {
    this.loadConfig();
    this.storyText = story.storyList[0].story1;
    // 创建语音识别实例
    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'zh-CN'; // 设置语言为中文
    this.recognition.onresult = this.handleRecognitionResult;
    this.recognition.onerror = this.handleRecognitionError;
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

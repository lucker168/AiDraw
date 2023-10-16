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
            <div class="p-voice" @click="startSpeechRecognition()"> 
              <div class="p-message">{{ messages }}</div>
            </div>
            <div class="p-btn" :class="drawing?'is-drawing':''" @click="drawWithLogin()" :disabled="drawing">
              <div>开始绘画</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-res-content">
      <div class="p-res-wrap">
      <div v-if="!imgUrl" class="p-paper">
          <div class="p-loading">
            <div class="p-loading-img" @click="uploadFile">
              <input ref="fileInput" type="file" @change="onFileChange" style="display: none;">
            </div>
            <div class="p-loading-text">{{ processStatus }}</div>
            <!-- <div class="scroll-container">
              <div class="scroll-content">{{ storyText }}</div>
            </div> -->
            <!-- <div v-if="processStatus === '0%'" class="p-loading-text">测试文本</div> -->
          </div>
      </div>
      <div v-else class="p-paper">
        <div class="p-img-content">
          <!-- 返回结果为1张 -->
          <el-image :src="imgUrl" :preview-src-list="[imgUrl]"></el-image>
        </div>
      </div>
      <div class="p-choose-contain">
        <div class="p-choose-group" v-if="subImages.length > 0">
          <div v-for="(imageUrl,index) in subImages" :key="index" 
          :class="{'p-c-item': true , 'is-selected' : uBtn == index}" :style="{'background-image': 'url(' + imageUrl + ')'}"
          @click="openImageInNewTab(imageUrl,index)">
          </div>
        </div>
      </div>
    </div>
    </div>
    <ModelMsg v-if="modalBVisible" :imageUrl="qrCode" :status_desc="status_desc" @close="closeModal">
      <!-- 这里可以放组件B的内容 -->
    </ModelMsg>
  </div>
</template>


<script>
import axios from "axios";
// import config from "../../config.json";
import story from "../../storylist.json";
import ModelMsg from "../views/ModelMessage.vue";
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8';

export default {
  components: {
    ModelMsg
  },
  data() {
    return {
      inputDesc: '',
      baseImgUrl: "/img/",
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
      interval: 100,
      subMenu: [],
      showSubMenu: false,
      menuList: [],
      showColor: false,
      color: ["#e2bc34","#fa9435","#ff6a45","#f1465c","#d33072","#a52e82","#2c58b6","#0079d7","#59b27d","#f4f7a4","#cecece","#000000"],
      taskId: "",
      uBtn: 0,
      storyText: "",
      showTip: false,
      desTitle: "",
      imageSrc: "",
      blogContext: "",
      subImages: [],
      appUrl: "https://paintapi.braveeer.com",
      modalBVisible: false,
      qrCode: "",
      status_desc: "未扫码",
      token: "",
      queueSize: 1,
      messages: "",
      leftTime: ""
    }
  },
  computed:{
      processStatus() {
         switch(this.progress) {
            case "0%":   return "队列等待中。。当前为第 "+this.queueSize+" 个，预计需要 "+ this.leftTime;
            case "100%": return "绘图成功，图片下载中。。"+ this.downLoadPer +"%";
            case "": return "任务超时，请稍后再试。。";
            case "initial": return "点击按钮，上传图片";
            case "start": return "任务处理中。。";
            default: return "绘画生成中。。" + this.progress;
         }
      }
  },
  methods: {
    closeModal() {
      this.modalBVisible = false;
    },
    async loadContext() {
      if (this.isDisabled) {
        return;
      }
      try {
        if (this.selWordNm) {
          this.isDisabled = true;
          this.showTip = true;
          // await axios.get('/mj/data/getWordInfo?name=' + this.selWordNm).then(
            await axios.get(this.appUrl+'/api/keywords/desc?keyword=' + this.selWordNm).then(
            res => {
              if (res.data.result) {
                const tempDiv = document.createElement('div');
                // const firstDiv = tempDiv.querySelector('div');
                // firstDiv.removeAttribute('style');
                const imgList = res.data.result.img_list;
                let index = 0;
                const image = document.createElement('img');
                tempDiv.appendChild(image);
                const textNode = document.createTextNode(res.data.result.desc);
                tempDiv.appendChild(textNode);
                image.src = imgList[index];
                image.alt = 'image' + index;
                this.blogContext = tempDiv.innerHTML;
                setInterval(()=>{
                  index = index === imgList.length - 1 ? 0 : index + 1;
                  image.src = imgList[index];
                  image.alt = 'image' + index;
                  this.blogContext = tempDiv.innerHTML;
                }, 3000);
                this.isDisabled = false;
              } else {
                this.blogContext = "没找到对应的描述！";
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
      this.selWordNm = e.dtls;
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
    async drawWithLogin() {
      this.token = sessionStorage.getItem("Authorization");
      if (this.token) {
        // this.getUserInfo(this.token);
        this.draw();
      } else {
        let scene = "";
        await axios.get(this.appUrl + '/api/web/login/qrcode').then(
          res => {
            scene = res.data.result.scene;
            this.qrCode = res.data.result.qrcode_img;
            this.modalBVisible = true;
          }
        );
        const checkInterval = setInterval(() => {
          axios.get(this.appUrl + '/api/web/login/check', { params: { "scene": scene } }).then(
            res => {
              const status = res.data.result.status;
              const openId = res.data.result.open_id;
              this.status_desc = res.data.result.status_desc;
              this.token = res.data.result.access_token;
              if (status === 3) {
                sessionStorage.setItem("Authorization", this.token);
                clearInterval(checkInterval);
                this.modalBVisible = false;
                this.draw();
              }
            }
          );}, 1000);
      }
    },
    getUserInfo(token) {
      axios({
        method: 'get',
        url: this.appUrl + '/api/user/info',
        headers: {
          'Authorization': "bearer "+token, // 设置Authorization头属性
          'Content-Type': 'application/json', // 设置请求的Content-Type
        },
      }).then(
        res => {
          alert(res);
      });
    },
    updateApp(token, taskId, keywords, paras, dtls) {
      axios({
        method: 'post',
        url: this.appUrl + '/api/imgTask/submit',
        data: {
          prompt: this.inputDesc,
          task_id: taskId,
          keyWord: keywords,
          size_param: paras,
          dtls: dtls
        },
        headers: {
          'Authorization': "bearer "+token, // 设置Authorization头属性
          'Content-Type': 'application/json', // 设置请求的Content-Type
        },
      });
    },
    draw() {
      try {
        if (this.drawing) {
          return;
        }
        this.drawing = true;
        this.progress = "start";
        this.subImages = [];
        let keywords="", paras="", name="",dtls="";
        this.selectList.map(e => {
          keywords = keywords + e.keyword;
          paras = paras + e.para;
          name = (name ? name+",": name) + e.name;
          dtls = (dtls ? dtls+",": dtls) + e.dtls;
        });
        axios({
          method: 'post',
          url: '/mj/submit/imagine',
          data: {
            base64: this.imageSrc,
            prompt: this.inputDesc,
            keyWord: keywords,
            sizePara: paras,
            state: name
          }
        }).then((res) => {
          if (res.data.code == 1) {
            this.messages = "";
            const totolSize = res.data.properties.queueSize;
            const coreSize = res.data.properties.coreSize;
            this.queueSize = totolSize > coreSize ? Math.floor(totolSize / coreSize) : 1;
            const taskId = res.data.result;
            this.updateApp(this.token,taskId, keywords, paras, dtls);
            this.getImage(taskId);
          } else if(res.data.code == 24){
            const riskTips = JSON.parse(res.data.properties.bannedWord).riskTips;
            const riskWords = JSON.parse(res.data.properties.bannedWord).riskWords;
            this.messages = riskTips + " "+ riskWords;
            this.drawing = false;
          } else {
            this.messages = res.data.description;
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
      let time = this.queueSize*120;
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
      const timer = setInterval(() => {
        if (time > 0) {
          this.leftTime = this.countDown(time);
          time--;
        } else {
          clearInterval(timer);
        }
      }, 1000);
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
      this.imgUrl = imageUrl;
    },
    countDown(time) {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const remainingSeconds = time % 60;
      const hoursStr = hours > 0 ? `${hours} 小时` : '';
      const minutesStr = minutes > 0 ? `${minutes} 分` : '';
      const secondsStr = remainingSeconds > 0 ? `${remainingSeconds} 秒` : '';
      return `${hoursStr}${minutesStr}${secondsStr}`;
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

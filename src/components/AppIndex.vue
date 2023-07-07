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
      axios({
        method: 'post',
        url: '/mj/submit/imagine',
        data: {
          prompt: this.inputDesc
        }
      }).then((res) => {
        alert(res.data.description);
        if(res.data.code == 1) {
          this.getImage(res.data.result);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    getImage(taskId) {
      console.log("taskId"+taskId);
      const interval = setInterval(() => {
        console.log("开始取图");
        axios.get(`/mj/task/${taskId}/fetch`)
          .then((res) => {
            if (res.data && res.data.progress == "100%") {
              this.imgUrl = res.data.imageUrl;
              this.showImage = true;
            }
          }).catch(err => {
            console.log(err)
          });
        if (this.showImage) {
          console.log("达到最大值结束执行");
          clearInterval(interval);
        }
      }, 20000);
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

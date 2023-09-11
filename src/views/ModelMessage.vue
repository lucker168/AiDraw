<template>
  <div class="modal">
    <div class="modal-content">
      <!-- 图片显示区域 -->
      <div class="image-container">
        <img :src="imageUrl" alt="QR Code" />
      </div>
      <div class="status-description">{{ status_desc }}</div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    imageUrl: String, // 图片的URL
    status_desc: String
  },
  methods: {
    closeModal() {
      // 触发关闭模态框事件，通知父组件
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
/* 弹窗样式 */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
  justify-content: center;
  align-items: center;
  display: flex; /* 使用 Flexbox 布局 */
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  width: 50%; /* 设置宽度为屏幕的一半 */
  max-width: 400px; /* 设置最大宽度，以防止内容过宽 */
  height: 50%; /* 设置高度为屏幕的一半 */
  max-height: 400px; /* 设置最大高度，以防止内容过高 */
  display: flex; /* 使用 Flexbox 布局 */
  flex-direction: column; /* 垂直居中的内容 */
  justify-content: center; /* 垂直居中的内容 */
}

/* 图片容器样式 */
.image-container {
  flex: 1; /* 图片容器占据剩余空间 */
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 图片水平居中 */
  align-items: center; /* 图片垂直居中 */
}

/* 图片样式 */
img {
  max-width: 100%; /* 图片宽度不超过容器宽度 */
  max-height: 100%; /* 图片高度不超过容器高度 */
}

/* status_desc 样式 */
.status-description {
  margin-top: 10px; /* 设置与图片的间距 */
  /* 添加其他样式以满足您的需求，如字体大小、颜色等 */
}

</style>

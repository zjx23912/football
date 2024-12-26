<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 定义一个 ref 来存储从后端获取的数据
const message = ref('');

// 使用 onMounted 钩子在组件挂载时发送请求
onMounted(async () => {
  try {
    const response = await axios.get('/api/orders'); // 替换为你的后端 API 端点
    message.value = response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>

<template>
  <header>
    <p>data</p>
  </header>

  <main>
    <p>{{ message }}</p> <!-- 显示从后端获取的数据 -->
  </main>
</template>

<style scoped>
</style>

<!-- <script setup>
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
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Expenditure</th>
        <th>Income</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in message" :key="item.id">
        <td>{{ item.id }}</td>
        <td>{{ item.expenditure }}</td>
        <td>{{ item.income }}</td>
        <td>{{ item.date }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}
</style> -->
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const newOrder = ref({ expenditure: null, income: null, date: '' }); // 新订单数据
const errors = ref({}); // 错误提示

// 获取订单数据
const fetchOrders = async () => {
  try {
    const response = await axios.get('/api/orders');
    orders.value = response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

// 验证表单数据
const validateForm = () => {
  errors.value = {};
  let isValid = true;

  // 验证 expenditure
  if (newOrder.value.expenditure === null || !Number.isInteger(newOrder.value.expenditure) || newOrder.value.expenditure <= 0 || newOrder.value.expenditure % 2 !== 0) {
    errors.value.expenditure = 'Expenditure must be a positive integer and a multiple of 2.';
    isValid = false;
  }

  // 验证 income
  const incomeRegex = /^\d+(\.\d{1,2})?$/; // 匹配最多两位小数
  if (newOrder.value.income === null || !incomeRegex.test(newOrder.value.income) || parseFloat(newOrder.value.income) > 999.99 || parseFloat(newOrder.value.income) < 0) {
    errors.value.income = 'Income must be a decimal number with up to 2 decimal places and not exceed 999.99.';
    isValid = false;
  }

  // 验证 date
  if (!newOrder.value.date) {
    errors.value.date = 'Date is required.';
    isValid = false;
  }

  return isValid;
};

// 添加订单
const addOrder = async () => {
  if (!validateForm()) return; // 验证失败则退出

  try {
    const response = await axios.post('/api/orders', newOrder.value);
    if (response.data) {
      await fetchOrders();
      newOrder.value = { expenditure: null, income: null, date: '' }; // 重置表单
    }
  } catch (error) {
    console.error('Error adding order:', error);
  }
};

// 删除订单
const deleteOrder = async (id) => {
  if (confirm('Are you sure you want to delete this order?')) {
    try {
      const response = await axios.delete(`/api/orders/${id}`);
      if (response.data) {
        await fetchOrders();
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  }
};

onMounted(fetchOrders);
</script>

<template>
  <div>
    <!-- 表格展示订单 -->
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Expenditure</th>
          <th>Income</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.expenditure }}</td>
          <td>{{ order.income }}</td>
          <td>{{ order.date }}</td>
          <td>
            <button @click="deleteOrder(order.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 添加订单表单 -->
    <div>
      <h3>Add Order</h3>
      <form @submit.prevent="addOrder">
        <div>
          <label for="expenditure">Expenditure:</label>
          <input
            type="number"
            id="expenditure"
            v-model.number="newOrder.expenditure"
            min="1"
            required
          />
          <p v-if="errors.expenditure" class="error">{{ errors.expenditure }}</p>
        </div>
        <div>
          <label for="income">Income:</label>
          <input
            type="text"
            id="income"
            v-model="newOrder.income"
            required
          />
          <p v-if="errors.income" class="error">{{ errors.income }}</p>
        </div>
        <div>
          <label for="date">Date:</label>
          <input
            type="date"
            id="date"
            v-model="newOrder.date"
            required
          />
          <p v-if="errors.date" class="error">{{ errors.date }}</p>
        </div>
        <button type="submit">Add Order</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

form {
  margin-top: 20px;
}

form div {
  margin-bottom: 10px;
}

label {
  margin-right: 10px;
}

.error {
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}
</style>

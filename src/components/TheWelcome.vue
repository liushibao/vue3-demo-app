<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import InfoItem from './InfoItem.vue'
import { useBusinessStore } from '@/stores/business';
import * as echarts from 'echarts';
import { storeToRefs } from 'pinia';
import { nextTick, onMounted, reactive, watch } from 'vue';
import { Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const businessStore = useBusinessStore();
const { loadMore, getGdps } = businessStore;
const { gdps, infos, pageNumber, hasMore } = storeToRefs(businessStore);

const breakpoints = reactive({
  1200: {
    // 当屏幕宽度小于等于1200
    rowPerView: 2,
  },
  300: {
    // 当屏幕宽度小于等于800
    rowPerView: 2,
  },
  150: {
    // 当屏幕宽度小于等于500
    rowPerView: 1,
  },
})


if (pageNumber.value == 0) {
  getGdps(2019, 2024);
  loadMore();
}

let barChart: echarts.ECharts;
let lineChart: echarts.ECharts;

onMounted(() => {
  const barDom = document.getElementById("bar");
  const lineDom = document.getElementById("line");
  barChart = echarts.init(barDom);
  lineChart = echarts.init(lineDom);
})

watch(
  gdps,
  (newG) => {
    console.log("watched")
    if (newG?.length <= 0)
      return;
    nextTick(() => {
      console.log("nextTick")
      barChart.setOption<echarts.EChartsOption>({
        title: {
          text: `${newG[0].year}-${newG[newG.length - 1].year}中国GDP`
        },
        grid: { containLabel: true },
        xAxis: {
          type: "category",
          data: newG.map(t => t.year)
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: newG.map(t => t.amount),
            type: "bar"
          }
        ]
      });
      lineChart.setOption<echarts.EChartsOption>({
        title: {
          text: `${newG[0].year}-${newG[newG.length - 1].year}中国GDP增长率`
        },
        grid: { containLabel: true },
        xAxis: {
          type: "category",
          data: newG.map(t => t.year)
        },
        yAxis: {
          type: "value",
          axisLabel: {
            show: true,
            // width: "120",
            formatter: v => v * 100 + "%"
          },
        },
        series: [
          {
            data: newG.map(t => t.growthRate),
            type: "line"
          }
        ]
      });
    });
  },
  { immediate: true });
</script>

<template>
  <div class="flex-end">
    <RouterLink v-if="isRegistered == true" to="/user-info">我的账号</RouterLink>
    <RouterLink v-else to="/register">注册/登录</RouterLink>
  </div>
  <div>
    <div id="bar" style="height: 300px;"></div>
    <div id="line" style="height: 300px;"></div>
  </div>
  <div :class="{ content: true, 'limit-box': true }">
    <div>
      <Waterfall :list="infos" :row-key="'id'" :breakpoints="breakpoints">
        <template #item="{ item }">
          <InfoItem :item="item"></InfoItem>
        </template>
      </Waterfall>
      <di class="flex-center">
        <button v-if="hasMore" @click="loadMore">加载更多</button>
        <div v-else>没有更多了</div>
      </di>
    </div>

  </div>
</template>

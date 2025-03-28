import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { IGdp, IInfo } from '../models/business'
import { httpClient } from '@/composables/HttpClient';

export const useBusinessStore = defineStore('business', () => {

  const gdps = ref<IGdp[]>([]);
  const infos = ref<IInfo[]>([]);

  const hasMore = ref<boolean>(true);
  const pageNumber = ref<number>(0);

  const pageSize = 10;

  async function getGdps(yearStart: number, yearEnd: number): Promise<void> {
    const res = await httpClient.get("/api/business/public/GdpData", { yearStart, yearEnd });
    gdps.value = res;
  }

  async function loadMore(): Promise<void> {
    const res = await httpClient.get("/api/business/public/Info", { pageNumber: pageNumber.value + 1, pageSize });
    infos.value.push(...res.data);
    pageNumber.value = res.pageNumber;
    hasMore.value = res.pageNumber != res.totalPage;
  }

  return { gdps, infos, hasMore, pageNumber, loadMore, getGdps };
})

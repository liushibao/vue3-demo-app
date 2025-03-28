<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import ModalWindow from './ModalWindow.vue';

import * as qrcode from 'qrcode-generator';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const isQrCodeShow = ref<boolean>(false);

function onQrCodeModalMounted() {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("qr-canvas");
  const qr = qrcode.default(0, "H");
  qr.addData(`www.baidu.com`);
  qr.make();

  const cellSize = 6;
  const margin = 8;
  const size = qr.getModuleCount() * cellSize + margin * 2;
  const titleFontSize = 16;
  const titleY = titleFontSize / 2 + margin;
  const qrCodeY = margin * 2 + titleFontSize;
  const footerFontSize = 8;
  const footerY = margin + titleFontSize + size + footerFontSize / 2;
  canvas.width = size;
  canvas.height = size + titleFontSize + footerFontSize + margin * 2;
  const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

  // fill background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const addText = (text: string, fontSize: number, x: number, y: number) => {
    ctx.font = `${fontSize}px serif`;
    ctx.fillStyle = "#000000";
    ctx.fillText(text, x, y);
  }

  addText("某某邀约二维码", titleFontSize, size / 2, titleY);

  // draw cells
  ctx.fillStyle = '#000000';
  for (let row = 0; row < qr.getModuleCount(); row += 1) {
    for (let col = 0; col < qr.getModuleCount(); col += 1) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(
          col * cellSize + margin,
          row * cellSize + qrCodeY,
          cellSize, cellSize);
      }
    }
  }

  addText("长按二维码保存或转发邀请", footerFontSize, size / 2, footerY);
}

</script>


<template>
  <div style="position: relative;">
    <RouterLink to="/" class="flex-end">返回主页</RouterLink>
    <div>
      <div>账号信息：</div>
      <div class="flex-space-between"><span>姓名：</span><span>{{ user.name }}</span></div>
      <div class="flex-space-between"><span>手机：</span><span>{{ user.mob }}</span></div>
      <div class="flex-space-between"><span>身份证号：</span><span>{{ user.idCardNumber }}</span></div>
      <div class="flex-space-between"><span>出生日期：</span><span>{{ user.birthday }}</span></div>
    </div>
    <div class="flex-end"> <button id="show-modal" @click="isQrCodeShow = true">邀约二维码</button>
    </div>
  </div>
  <Teleport to="body">
    <ModalWindow v-if="isQrCodeShow" @close="isQrCodeShow = false" @mounted="onQrCodeModalMounted">
      <template #body>
        <div class="flex-center"><canvas id="qr-canvas"></canvas></div>
      </template>
      <template #footer>
        <!-- <div class="flex-center" style="font-size: 8px;margin-bottom: 8px;">长按二维码保存或转发邀约</div> -->
      </template>
    </ModalWindow>
  </Teleport>
</template>

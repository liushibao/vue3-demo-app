<script setup lang="ts">
import { httpClient } from '@/composables/HttpClient';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import LabeledInput from './LabeledInput.vue';

const router = useRouter();

const authStore = useAuthStore();
const { user, isRegistered, isMobPass, isUserValid, errors, errorsFromServer } = storeToRefs(authStore);

const isMobSmsCodeGet = ref<boolean>(false);
const isMobSmsCodeSent = ref<boolean>(false);
const isMobVerified = ref<boolean>(false);
const smsCode = ref<string | null>(null);
const isSmsCodePass = computed(() => smsCode.value != null && /^\d{6}$/.test(smsCode.value));

async function submit() {
  const res = await httpClient.post("/api/auth/reg", user.value);
  if (res.isSuccess == true) {
    user.value = res.user;
    isRegistered.value = true;
    alert("用户注册成功。");
    router.push("/");
  }
  else {
    errorsFromServer.value = res.errors;
    alert("注册失败，请重新提交。");
  }
}

async function getSmsCode() {
  const res = await httpClient.post("/api/auth/reg/SendSmsCode", { mob: user.value.mob });
  isMobSmsCodeGet.value = true;
  alert(`验证码已发送，将在${res.expireSeconds / 60}分钟后失效，请查看手机信息。`);
}

async function sendSmsCode() {
  const res = await httpClient.post("/api/auth/reg/VerifySmsCode", { mob: user.value.mob, smsCode: smsCode.value });
  isMobSmsCodeSent.value = true;
  if (res.isSuccess == true) {
    isMobVerified.value = true;
    alert("手机号验证通过。");
  }
  else {
    smsCode.value = null;
    alert("验证码错误，请重新输入。");
  }
}

watch(smsCode, () => isMobSmsCodeSent.value = false);

</script>


<template>
  <div style="position: relative;">
    <RouterLink to="/" class="flex-end">返回主页</RouterLink>
    <div>填写注册信息：</div>
    <LabeledInput :id="'name'" :title="'姓名：'" :errors="errors.name" v-model="user.name" />
    <LabeledInput :id="'mob'" :title="'手机：'" :errors="errors.mob" v-model="user.mob" />
    <div v-if="!isMobVerified && isMobPass">
      <div class="flex-end"><button :disabled="isMobSmsCodeGet" @click="getSmsCode">获取验证码</button></div>
      <div class="flex-space-between">
        <label for="smsCode">手机验证码：</label>
        <input id="smsCode" v-model="smsCode">
      </div>
      <div class="flex-end"><button :disabled="!isMobSmsCodeGet || isMobSmsCodeSent || isSmsCodePass != true"
          @click="sendSmsCode">验证</button>
      </div>
    </div>
    <LabeledInput :id="'birthday'" :title="'出生日期：'" :errors="errors.birthday" v-model="user.birthday" />
    <LabeledInput :id="'idCardNumber'" :title="'身份证号：'" :errors="errors.idCardNumber" v-model="user.idCardNumber" />
    <div class="flex-end"><button :disabled="isUserValid != true || isMobVerified != true"
        @click="submit">注册/登录</button>
    </div>
  </div>
</template>

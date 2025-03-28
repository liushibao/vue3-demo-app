import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { User } from '../models/auth'

export const useAuthStore = defineStore('auth', () => {
  const isRegistered = ref<boolean>(false);
  const user = ref<User>(new User());

  const isNamePass = computed(() => user.value.isNamePass);
  const isMobPass = computed(() => user.value.isMobPass);
  const isBirthdayPass = computed(() => user.value.isBirthdayPass);
  const isIdCardNumberPass = computed(() => user.value.isIdCardNumberPass);
  const isBirthdayEqual = computed(() => user.value.isBirthdayEqual);
  const isUserValid = computed(() => user.value.isValid);
  const errorsFromServer = ref<Record<string, string[]> | null>(null);
  const errors = computed(() => errorsFromServer.value ?? user.value.errors);

  function $reset() {
    user.value = new User();
  }

  return { isRegistered, user, isNamePass, isMobPass, isBirthdayPass, isIdCardNumberPass, isBirthdayEqual, isUserValid, errors, errorsFromServer, $reset };
})

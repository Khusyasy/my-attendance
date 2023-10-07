import { defineRule } from 'vee-validate'
import { required, email } from '@vee-validate/rules';

export default defineNuxtPlugin(() => {
  defineRule('required', required)
  defineRule('email', email)
})

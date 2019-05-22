<template>
  <div class="captcha-container" :class="[captchaError ? 'error' : '']">
    <span class="captcha-label">Veuillez sélectionner <strong>{{captchaTextValue}}</strong></span>
    <div class="captcha-item-container">
      <button class="captcha-btn" :class="[captcha.value, captcha.value === captchaResponse ? 'selected' : '']" v-for="captcha in captchaValues" :key="captcha.value" @click="setCaptchaValue(captcha.value)"></button>
    </div>
  </div>
</template>
<script>
  import { bus } from '../main.js'
  export default {
    props: ['status'],
    data () {
      return {
        captchaValues: [
          {
            value: 'circle',
            textValue: 'le cercle'
          },
          {
            value: 'cross',
            textValue: 'la croix'
          },
          {
            value: 'triangle',
            textValue: 'le triangle'
          },
          {
            value: 'square',
            textValue: 'le carré'
          }
        ],
        captchaValue: '',
        captchaTextValue: '',
        captchaResponse: '',
        captchaError: false
      }
    },
    watch: {
      status: function (data) {
        if(data === 'error') {
          this.captchaError = true
        } else {
          this.captchaError = false
        }
      }
    },
    mounted () {
      this.captchaValues.sort(function() { return 0.5 - Math.random() })
      let arrayIndex = Math.floor(Math.random() * this.captchaValues.length)
      this.captchaTextValue = this.captchaValues[arrayIndex].textValue
      this.captchaValue = this.captchaValues[arrayIndex].value
    },
    methods: {
      setCaptchaValue (value) {
        this.captchaResponse = value
        bus.$emit('contact_captcha', {value: this.verifyCaptcha(value)})
      },
      verifyCaptcha (value) { 
        if(this.captchaValue === value) {
          return true
        }
        return false
      }
   }

  }
</script>
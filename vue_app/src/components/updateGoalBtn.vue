<template>
  <div class="update-goal-container">
    <div class="update-goal" :class="[show ? 'visible' : 'hidden']">
      <input
        type="number"
        class="input"
        :class="[validationGoalError.length > 0 ? 'error': '']"
        v-model="validationGoal"
        v-on:keyup.13="updateGoal(ww)"
        min="100"
        step="100"
      />
      <button @click="updateGoal(ww)">valider</button>
    </div>
    <button @click="toggleUpdate()">
      <span class="label record">Objectif</span><br/>
      <span class="number record">{{ ww.validationGoal }}</span>
    </button>
  </div>
</template>
<script>
import axios from 'axios'
import { bus } from '../main.js'
export default {
  props: ['ww'],
  data () {
    return {
      show: false,
      validationGoal: null,
      validationGoalError: ''
    }
  },
  mounted () {
    this.validationGoal = this.ww.validationGoal
  },
  methods: {
    toggleUpdate () {
      this.show = !this.show
    },
    async updateGoal (ww) {
      const payload = {
        ...ww,
        validationGoal: this.validationGoal
      }
      const updateGoal = await axios(`${process.env.VUE_APP_URL}/api/scenarios`, {
        method: 'put',
        data: payload
      })
      bus.$emit('notify_app', {
        status: updateGoal.data.status,
        msg: updateGoal.data.msg,
        redirect: false
      })
      this.show = false
      if(updateGoal.data.status === 'success') {
        this.dispatchScenarios()
      }
    },
    dispatchScenarios () {
      bus.$emit('wakeword_updated', {})
    }
  }
}
</script>
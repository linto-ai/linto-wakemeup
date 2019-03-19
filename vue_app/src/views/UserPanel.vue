<template>
  <div>
    <div id="page-content">
      User infos : {{ userInfos }}
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  computed : {
    userInfos () {
      return this.$store.state.userInfos
    }
  }
}
</script>
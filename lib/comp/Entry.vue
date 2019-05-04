<template>
  <div>
    <h1 class="tac">人类杀游戏</h1>
    <img
      class="tac title-image"
      alt="newspaper"
      src="assets/img/newspaper.jpg"
      @load="attachMediumZoom"
    />
    <div class="setting-container">
      <span>昵称：</span>
      <Input
        v-model="$app.username"
        placeholder="请输入昵称"
        :size="1.1"
        :inactive="!hoverSettings"
        @mouseenter.native="hoverSettings = true"
        @mouseleave.native="hoverSettings = false"
      />
    </div>
    <div class="button-container">
      <Button
        @click="$app.login"
        :disabled="!$app.username || !!$app.clientState || $app.lobbyState === 1"
      >
        <template v-if="$app.clientState">
          无法连接至服务器
        </template>
        <template v-else-if="$app.lobbyState === 1">
          <i class="icon-loading"/>正在进入<i class="icon-loading"/>
        </template>
        <template v-else>
          进入大厅
        </template>
      </Button>
      <Button @click="toAboutPage">
        关于人类杀
      </Button>
    </div>
  </div>
</template>

<script>

import { Button, Input } from '@uzkk/components'

export default {
  components: { Button, Input },

  inject: ['$app'],

  data: () => ({
    hoverSettings: false,
  }),

  methods: {
    attachMediumZoom () {
      this.$vuepress.mediumZoom.update('img.title-image')
    },
    toAboutPage () {
      this.$router.push(this.UZKK_KILLGAME_BASE + 'about.html')
    },
  },
}

</script>

<style lang="stylus" scoped>

@keyframes rotating
  0%
    transform rotateZ(0)
  100%
    transform:rotateZ(360deg)

h1
  margin 3rem 0

img.title-image
  display block
  width 100%
  max-width 486.5px
  margin 0 auto

.setting-container
  span
    font-size 1.1rem
    width 4rem
    min-width 3rem

i.icon-loading
  font-size 1.2rem
  vertical-align middle
  margin 0 4px
  animation rotating 1s linear infinite

</style>

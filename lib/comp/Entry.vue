<template>
  <div>
    <h1 class="tac">人类杀游戏</h1>
    <img
      class="tac title-image"
      src="/img/newspaper.jpg"
      alt="newspaper"
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
        @click="$app.login(() => $app.phase = 'Lobby')"
        :disabled="!$app.username || $app.clientState || $app.lobbyState === 1"
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

.setting-container
  font-size 1.1rem
  display flex
  flex-direction row
  align-items baseline
  justify-content center
  max-width 400px
  margin 2rem auto
  transition 0.3s ease

  span
    width 4rem
    min-width 3rem
    font-weight bold
    display inline-block

  .input.inactive:not(.focused)
    margin-right -1em

img.title-image
  display block
  width 100%
  max-width 486.5px
  margin 0 auto

i.icon-loading
  font-size 1.2rem
  vertical-align middle
  margin 0 4px
  animation rotating 1s linear infinite

</style>

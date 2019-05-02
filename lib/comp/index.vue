<template>
  <FadeSlideTransition>
    <component class="killgame" :is="phase" :key="phase"/>
  </FadeSlideTransition>
</template>

<script>

import Entry from './Entry'
import Lobby from './Lobby'
import ClientMixin from '../client'
import FadeSlideTransition from '@theme-uzkk/transitions/FadeSlide'

export default {
  components: {
    Entry,
    Lobby,
    FadeSlideTransition,
  },

  mixins: [ClientMixin],

  provide () {
    return {
      $app: this,
    }
  },

  data: () => ({
    phase: 'Entry',
  }),
}

</script>

<style lang="stylus" src="../styles/index.styl"></style>

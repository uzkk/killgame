<template>
  <FadeSlideTransition>
    <component class="killgame" :is="phase" :key="phase"/>
  </FadeSlideTransition>
</template>

<script>

import Hall from './Hall'
import FadeSlideTransition from '@theme-uzkk/transitions/FadeSlide'

export default {
  components: {
    Hall,
    FadeSlideTransition,
  },

  data: () => ({
    phase: 'Hall',
  }),
}

</script>

<style lang="stylus" src="../styles/index.styl"></style>

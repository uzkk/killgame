<template>
  <div>
    <div class="section" v-if="!$app.isReady">
    </div>
    <div class="section">
      <div class="setting">
        <span>昵称：</span>
        <Input
          v-model="$app.username"
          placeholder="请输入昵称"
          :validate="_ => _"
          inactive
        />
      </div>
      <div class="setting">
        <span>房间名：</span>
        <Input
          v-model="roomname"
          placeholder="请输入房间名"
          :validate="_ => _"
          inactive
        />
        <Button
          class="create"
          @click="create"
          :disabled="!$app.isReady || !roomname || !$app.username"
        >创建</Button>
      </div>
    </div>
    <div v-if="currentRoom">
      {{ currentRoom.id }}
      {{ currentRoom.options }}
    </div>
    <collapse-view class="section" initial="open">
      <h3 slot="header">当前房间列表</h3>
      <table class="available-rooms" v-if="rooms.length">
        <tr v-for="(room, index) in rooms" :key="index">
          <td>{{ room.roomId }}</td>
          <td>{{ room.metadata.name }}</td>
          <td>{{ room.clients }}</td>
          <td><a @click.stop="join(room.roomId)">加入</a></td>
        </tr>
      </table>
      <p v-else>
        当前没有房间。
      </p>
    </collapse-view>
  </div>
</template>

<script>

import { Button, Input, CollapseView } from '@uzkk/components'
import { Client } from 'colyseus.js'

export default {
  components: {
    Button,
    Input,
    CollapseView,
  },

  inject: ['$app'],

  data: () => ({
    roomname: '',
    rooms: [],
    updater: null,
    currentRoom: null,
  }),

  methods: {
    create () {
      if (!this.$app.client) return
      const room = this.$app.client.join('killgame', {
        create: true,
        name: this.roomname,
      })
      this.addRoomListener(room)
    },
    join (id) {
      if (!this.$app.client) return
      const room = this.$app.client.join(id)
      this.addRoomListener(room)
    },
    addRoomListener (room) {
      room.onJoin.add(() => {
        this.currentRoom = room
      })
      room.onLeave.add(() => {
        this.currentRoom = null
      })
      room.onStateChange.add((data) => {
        console.log('chat update: ', data)
      })
    },
  },
}

</script>

<style lang="stylus" scoped>

.setting
  display table
  max-width 400px
  width 100%
  margin-left 50%
  margin-bottom 0.5rem
  transform translateX(-50%)

  span
    width 4rem
    font-weight bold

  > *
    display table-cell

  .create
    transform translateX(0.5em)

.available-rooms
  a
    cursor pointer

</style>

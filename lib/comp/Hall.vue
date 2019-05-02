<template>
  <div>
    <div class="section">
      <div class="setting">
        <span>昵称：</span>
        <Input
          v-model="nickname"
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
          :disabled="!connected || !roomname || !nickname"
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

export default {
  components: {
    Button,
    Input,
    CollapseView,
  },

  data: () => ({
    nickname: '',
    roomname: '',
    connected: false,
    rooms: [],
    updater: null,
    currentRoom: null,
  }),

  async mounted () {
    const { Client } = await import('colyseus.js')
    this.client = new Client(this.UZKK_KILLGAME_HOST)

    this.client.onOpen.add(() => {
      this.connected = true
      this.updater = setInterval(() => {
        if (!this.client) return
        this.client.getAvailableRooms('killgame', (rooms, error) => {
          if (error) {
            console.err(error)
            return
          }
          this.rooms = rooms
        })
      }, 100)
    })

    this.client.onClose.add(() => {
      clearInterval(this.updater)
    })
  },

  methods: {
    create () {
      if (!this.client) return
      const room = this.client.join('killgame', {
        create: true,
        name: this.roomname,
      })
      this.addRoomListener(room)
    },
    join (id) {
      if (!this.client) return
      const room = this.client.join(id)
      this.addRoomListener(room)
    },
    addRoomListener (room) {
      room.onJoin.add(() => {
        this.currentRoom = room
      })
      room.onLeave.add(() => {
        this.currentRoom = null
      })
      room.onStateChange.add(function(data) {
        console.log("chat update: ", data)
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

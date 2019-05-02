<template>
  <div>
    <div class="section">
      <h3>当前信息</h3>
      <table class="current-info">
        <tr>
          <td class="title">用户名</td>
          <td>{{ $app.username }}</td>
        </tr>
        <tr>
          <td class="title">当前在线人数</td>
          <td>{{ Object.keys($app.users).length }}</td>
        </tr>
      </table>
    </div>
    <div class="section">
      <div class="setting-container">
        <span>房间名：</span>
        <Input
          v-model="$app.roomname"
          placeholder="请输入房间名"
        />
      </div>
      <div class="button-container">
        <Button
          @click="$app.createRoom"
          :disabled="!$app.roomname"
        >创建</Button>
      </div>
    </div>
    <div v-if="currentRoom">
      {{ currentRoom.id }}
      {{ currentRoom.options }}
    </div>
    <collapse-view class="section" initial="open">
      <h3 slot="header">当前房间列表</h3>
      <table class="available-rooms" v-if="$app.rooms.length">
        <tr v-for="(room, index) in $app.rooms" :key="index">
          <td>{{ room.id }}</td>
          <td>{{ room.name }}</td>
          <td>{{ room.clients.length }}</td>
          <td>{{ room.ownerId }}</td>
          <td><a @click.stop="$app.joinRoom(room.roomId)">加入</a></td>
        </tr>
      </table>
      <p v-else>
        当前没有房间。
      </p>
    </collapse-view>
    <div class="button-container">
      <Button @click="$app.logout" type="warning">
        返回主页
      </Button>
    </div>
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
    currentRoom: null,
  }),

  methods: {
  },
}

</script>

<style lang="stylus" scoped>

.setting-container
  span
    width 6rem
    min-width 4rem

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

.available-rooms
  a
    cursor pointer

</style>

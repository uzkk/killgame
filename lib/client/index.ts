import { Client, Room } from 'colyseus.js'
import { getSettings, setSettings, Settings } from './storage'

interface UserOptions {
  name: string
}

interface RoomMessage {
  type: string
  data: any
}

interface RoomOptions {
  id: string
  name: string
  clients: string[]
  ownerId: string
}

interface ClientInstance extends Settings {
  UZKK_KILLGAME_SERVER: string
  clientState: 0 | 1 | 2
  lobbyState: 0 | 1 | 2
  client: Client
  lobby: Room
  rooms: RoomOptions[]
  users: Record<string, UserOptions>
  phase: 'Entry' | 'Lobby' | 'Room' | 'Play'
  currentRoom: Room
  isReadyForLogin: boolean
  login (this: ClientInstance, saveSettings: boolean): void
  logout (this: ClientInstance): void
  createRoom (this: ClientInstance): void
  joinRoom (this: ClientInstance, roomId: string): void
  monitorRoom (this: ClientInstance, room: Room): void
}

const messageHandler: Record<string, (this: ClientInstance, data: any) => void> = {
  rooms (data: RoomOptions[]) {
    this.rooms = data.map(room => {
      room.name = decodeURIComponent(room.name)
      return room
    })
  },
  users (data) {
    this.users = data
    for (const key in data) {
      this.users[key].name = decodeURIComponent(data[key].name)
    }
  },
}

export default {
  data: () => ({
    ...getSettings(),
    clientState: 2,
    lobbyState: 2,
    roomname: '',
    phase: 'Entry',
    rooms: [],
    users: {},
  }),

  computed: {
    isReady () {
      return !this.clientState && !this.lobbyState
    },

    isReadyForLogin (this: ClientInstance) {
      return this.username && !this.clientState && this.lobbyState === 2
    },
  },

  mounted (this: ClientInstance) {
    const client = new Client(this.UZKK_KILLGAME_SERVER)
    this.clientState = 1

    client.onOpen.addOnce(() => {
      this.client = client
      this.clientState = 0
      this.login(false)
    })

    client.onClose.addOnce(() => {
      this.client = null
      this.clientState = 2
      this.phase = 'Entry'
    })

    client.onError.add((error: Error) => {
      console.error('Client error:', error)
    })
  },

  methods: {
    login (this: ClientInstance, saveSettings = true) {
      if (!this.isReadyForLogin) return
      const lobby = this.client.join('killgame-lobby', {
        name: encodeURIComponent(this.username),
      })
      this.lobbyState = 1

      lobby.onJoin.addOnce(() => {
        this.lobby = lobby
        this.lobbyState = 0
        lobby.onMessage.add((message: RoomMessage) => {
          if (message.type in messageHandler) {
            messageHandler[message.type].call(this, message.data)
          } else {
            console.warn('Unknown message:', message)
          }
        })
        if (saveSettings) {
          setSettings(this)
        }
        this.phase = 'Lobby'
      })

      lobby.onLeave.addOnce(() => {
        this.lobby = null
        this.lobbyState = 2
        this.phase = 'Entry'
      })

      lobby.onError.add((error: Error) => {
        console.error('Lobby error:', error)
      })
    },

    logout (this: ClientInstance, saveSettings = true) {
      if (!this.lobby) return
      this.username = ''
      if (saveSettings) {
        setSettings(this)
      }
      this.lobby.leave()
      this.phase = 'Entry'
    },

    createRoom (this: ClientInstance) {
      if (this.clientState) return
      const room = this.client.join('killgame', {
        create: true,
        name: encodeURIComponent(this.roomname),
        userId: this.client.id,
      })
      this.monitorRoom(room)
    },

    joinRoom (this: ClientInstance, roomId: string) {
      if (this.clientState || !roomId) return
      const room = this.client.join(roomId, {
        userId: this.client.id,
      })
      this.monitorRoom(room)
    },

    monitorRoom (this: ClientInstance, room: Room) {
      room.onJoin.add(() => {
        this.currentRoom = room
      })
      room.onLeave.add(() => {
        this.currentRoom = null
      })
      room.onStateChange.add((data) => {
        console.log('update: ', data)
      })
    },
  },
}

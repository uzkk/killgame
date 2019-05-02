import { Client, Room } from 'colyseus.js'

interface ClientInstance {
  UZKK_KILLGAME_HOST: string
  clientState: 0 | 1 | 2
  lobbyState: 0 | 1 | 2
  username: string
  client: Client
  lobby: Room
}

export default {
  data: () => ({
    username: '',
    clientState: 2,
    lobbyState: 2,
  }),

  computed: {
    isReady () {
      return !this.clientState && !this.lobbyState
    },
  },

  mounted (this: ClientInstance) {
    const client = new Client(this.UZKK_KILLGAME_HOST)
    this.clientState = 1

    client.onOpen.addOnce(() => {
      this.client = client
      this.clientState = 0
    })

    client.onClose.addOnce(() => {
      this.client = null
      this.clientState = 2
    })
  },

  methods: {
    login (this: ClientInstance, callback: Function) {
      if (this.clientState) return
      const lobby = this.client.join('killgame-lobby', {
        username: this.username,
      })
      this.lobbyState = 1

      lobby.onJoin.addOnce(() => {
        this.lobby = lobby
        this.lobbyState = 0
        if (callback) callback()
        lobby.onMessage.add((message) => {
          console.log(message)
        })
      })

      lobby.onLeave.addOnce(() => {
        this.lobby = null
        this.lobbyState = 2
      })
    },

    logout (this: ClientInstance) {
      if (!this.lobby) return
      this.lobby.leave()
    },
  },
}

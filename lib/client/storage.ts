const VERSION = 1

export interface Settings {
  username: string
  roomname: string
  maxClients: number
  roomPassword: string
}

const getFallback = (): Settings => ({
  username: '',
  roomname: '',
  maxClients: 16,
  roomPassword: '',
})

export function getSettings (): Settings {
  const fallbackSettings = getFallback()

  if (typeof localStorage === 'undefined') return fallbackSettings

  const oldSettings = localStorage.getItem('uzkk.killgame.settings')
  if (!oldSettings) return fallbackSettings

  try {
    const { version, settings } = JSON.parse(oldSettings)
    if (version === VERSION) {
      return { ...fallbackSettings, ...settings }
    } else {
      return fallbackSettings
    }
  } catch (error) {
    console.warn('An error was encounted when parsing settings:\n' + oldSettings)
    return fallbackSettings
  }
}

export function setSettings (settings: Settings) {
  const userSettings = {}
  for (const key in getFallback()) {
    userSettings[key] = settings[key]
  }

  if (typeof localStorage !== 'undefined') {
    try {
      const newSettings = { version: VERSION, settings: userSettings }
      localStorage.setItem('uzkk.killgame.settings', JSON.stringify(newSettings))
    } catch (error) {
      console.warn('An error was encounted when stringifying settings.')
      console.warn(error)
    }
  }

  return userSettings as Settings
}

export function useFallback (settings: Settings): Settings {
  const fallbackSettings = getFallback()
  return Object.assign(settings, fallbackSettings)
}

export const twitchLogin = () => {
    if (process.client) {
      const { TWITCH_CLIENT_ID } = useRuntimeConfig()
      window.location.replace(
        `https://id.twitch.tv/oauth2/authorize?response_type=token&client_id=${TWITCH_CLIENT_ID}&redirect_uri=http://localhost:3000/api/twitch/callback&scope=channel%3Amanage%3Apolls+channel%3Aread%3Apolls`
      ) 
    }
  }


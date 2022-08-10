import express from "express"
import fetch from 'node-fetch'
import qs from 'querystring'
import TwitchOAuth from '@callowcreation/basic-twitch-oauth'
import crypto from 'crypto'
import 'dotenv/config'

const app = express()

app.use(express.json())

const buffer = crypto.randomBytes(16)
const state = buffer.toString('hex')

const twitchOAuth = new TwitchOAuth({
    client_id: process.env.TWITCH_CLIENT_ID,
    client_secret: process.env.TWITCH_CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    scopes: [
        'user:read:subscriptions',
        'user:read:email'
    ]
}, state)

app.get('/auth-callback', async (req, res) => {
    const req_data = qs.parse(req.url.split('?')[1])
    const code = req_data['code']
    const state = req_data['state']

    try {
        twitchOAuth.confirmState(state)
        let token = await twitchOAuth.fetchToken(code)

        fetch("https://id.twitch.tv/oauth2/validate",
            {
                headers: {
                    Authorization: 'OAuth ' + token
                }
            }
        )
            .then((c) => { return c.json() })
            .then(function (user) {
                fetch("https://api.twitch.tv/helix/users?id=" + user.user_id,
                    {
                        headers: {
                            Authorization: 'Bearer ' + token,
                            "Client-Id": user.client_id
                        }
                    }
                )
                    .then((c) => { return c.json() })
                    .then(function (info) {
                        res.cookie('tw_token', token, {
                            maxAge: 86400 * 10000,
                            httpOnly: false,
                            secure: false
                        })
                        res.cookie('tw_login', info.data[0].display_name, {
                            maxAge: 86400 * 10000,
                            httpOnly: false,
                            secure: false
                        })
                        res.cookie('tw_id', user.user_id, {
                            maxAge: 86400 * 10000,
                            httpOnly: false,
                            secure: false
                        })
                        res.cookie('tw_img', info.data[0].profile_image_url, {
                            maxAge: 86400 * 10000,
                            httpOnly: false,
                            secure: false
                        })
                        res.redirect('/')
                    })

            })
            .catch((err) => { console.log('e', err) })
    } catch (err) {
        console.error(err)
        res.redirect('/')
    }
})

app.get('/authorize', (req, res) => {
    res.redirect(twitchOAuth.authorizeUrl)
})

export default app


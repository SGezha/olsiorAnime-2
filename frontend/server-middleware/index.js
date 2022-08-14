import express from "express"
import fetch from 'node-fetch'
import qs from 'querystring'
import TwitchOAuth from '@callowcreation/basic-twitch-oauth'
import crypto from 'crypto'
import 'dotenv/config'
import { writeFileSync, readFileSync, existsSync } from "fs"

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

let parsedInfo = []

if(existsSync('profiles.json')) parsedInfo = JSON.parse(readFileSync('profiles.json', 'utf8'))

app.get('/gettop', async (req, res) => {
    const req_data = qs.parse(req.url.split('?')[1])
    if (req_data.page && req_data.page > 1) {
        res.json(parsedInfo.sort((a, b) => b.countMsg - a.countMsg).slice(50 * (req_data.page - 1), (50 * (req_data.page - 1)) + 50))
    } else {
        res.json(parsedInfo.sort((a, b) => b.countMsg - a.countMsg).slice(0, 50))
    }
})

app.get('/getprofile', async (req, res) => {
    const req_data = qs.parse(req.url.split('?')[1])
    if (req_data.name) {
        let place = parsedInfo.sort((a, b) => b.countMsg - a.countMsg).findIndex(x => x.author === req_data.name)
        res.json({ data: parsedInfo.filter(a => a.author === req_data.name), profiles: parsedInfo.length, place: place })
    } else {
        res.json(parsedInfo)
    }
})

// fetchProfiles()

function fetchProfiles() {
    fetch('https://olsioradmin.smotrel.net/api/animes')
        .then((c) => { return c.json() })
        .then(function (animes) {
            let allEpisodes = []
            animes.data.forEach(anime => {
                anime.attributes.episodes.forEach((ep, ind) => {
                    if (ep.chat) allEpisodes.push({ chat: ep.chat, episode: ep.title, anime: anime })
                })
            })

            getInfo(0)

            async function getInfo(id) {
                if(id == allEpisodes.length) {
                    console.log('Готово')
                    writeFileSync('profiles.json', JSON.stringify(parsedInfo))
                    return
                }
                try {
                    let s = allEpisodes[id]
                    let response = await fetch(s.chat)
                    let chatText = await response.text()
                    console.log(`Загрузка профилей: ${id+1} из ${allEpisodes.length}`)
                    chatText.split("\r\n").forEach(async (text, ind) => {
                        try {
                            let author = text.split("] ")[1].split(":")[0]
                            let msg = text.split("] ")[1].split(`${text.split("] ")[1].split(":")[0]}: `).join("")
                            let findAuthor = parsedInfo.find(a => a.author === author)
                            if (findAuthor) {
                                let findAnime = parsedInfo.find(a => a.author === author).animes.find(a => a.anime === s.anime.id)
                                if (findAnime) {
                                    findAnime.msgs.push({ text: msg, episode: s.episode })
                                } else {
                                    parsedInfo.find(a => a.author === author).animes.push({ anime: s.anime.id, msgs: [{ text: msg, episode: s.episode }] })
                                }
                                findAuthor.countMsg = findAuthor.countMsg + 1
                            } else {
                                parsedInfo.push({
                                    author: author,
                                    animes: [{ anime: s.anime.id, msgs: [{ text: msg, episode: s.episode }] }],
                                    countMsg: 1
                                })
                            } 
                        } catch (err) { }
                    })
                    getInfo(id + 1)
                } catch (er) { }
            }
            
        })
}


export default app


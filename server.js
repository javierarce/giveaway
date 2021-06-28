'use strict'

require('dotenv').config()

const { spawn } = require('child_process')
const fs = require('fs')

const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy

const path = require('path')
const bodyParser = require('body-parser')

const fetch = require('node-fetch')
const express = require('express')

const session = require('express-session')({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SECRET,
  expires: new Date(Date.now() + (30 * 86400 * 1000)),
  cookie: {
    secure: false, 
    httpOnly: false, 
    maxAge: 1000 * 60 * 10 
  }
})

const DB = require('./lib/db')

const app = express()
const http = require('http').createServer(app)

app.use(session)
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

if (process.env.CONSUMER_KEY && process.env.CONSUMER_SECRET) {
  passport.use(new TwitterStrategy({
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  }, (token, tokenSecret, profile, done) => {

    let twitterID = profile.id
    let username = profile.username
    let displayName = profile.displayName
    let profileImage = profile._json.profile_image_url_https.replace('_normal', '')

    DB.findOrCreate({ twitterID, username, displayName, profileImage }).then((user) => {
      done(null, user)
    })
  }))
}

app.get('/auth/twitter', passport.authenticate('twitter'))
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }))

app.get('/', (request, response) => {
  const isLoggedIn = request.session.passport?.user ? true : false
  const isDevelopment = process.env.ENVIRONMENT === 'DEVELOPMENT' ? true : false

  response.render(__dirname + '/views/index.html', { isLoggedIn, isDevelopment })
})

app.get('/login', (request, response) => {
  response.redirect('/auth/twitter')
})

app.get('/api/all', (request, response) => {
  DB.getAll().then((result) => {
    response.json(result)
  }).catch((error) => {
    response.json(error)
  })
})

app.get('/logout', (request, response) => {
  request.session.destroy()
})

if (process.env.ENVIRONMENT == 'DEVELOPMENT') {
  fs.watch('./public/js/', (eventType, filename) => {
    console.log(`${eventType}: ${filename}`)
    spawn('./concat')
  })
}

http.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + process.env.PORT)
}) 

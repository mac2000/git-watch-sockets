const bodyParser = require('body-parser')
const EventEmitter = require('events');
const express = require('express')
const http = require('http')
const jwt = require('jsonwebtoken')
const url = require('url')
const WebSocket = require('ws')
const secret = process.env.JwtConfig__Secret || 'Put me to JwtConfig__Secret ENVIRONMENT variable'
const app = express()
const event = new EventEmitter();

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('trust proxy', true)

const server = http.createServer(app)
const wss = new WebSocket.Server({
	verifyClient: (info, done) => {
		const { query: { access_token } } = url.parse(info.req.url, true)

		if (!access_token) {
			done(false)
		} else {
			jwt.verify(access_token.replace('Bearer ', ''), secret, (err, decoded) => done(err ? false : decoded))
		}
	},
	server
})

wss.on('connection', ws => {
	event.on('broadcast', body => {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(JSON.stringify(body))
		}
	})
})

app.post('/bitbucket', (req, res) => {
	req.body.ip = req.ip
	// if (req.ip.indexOf('104.192.143') === 0) {
	event.emit('broadcast', req.body)
	// }
	res.sendStatus(200)
})

server.listen(process.env.PORT || 3000)

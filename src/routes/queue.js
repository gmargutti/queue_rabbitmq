const amqp = require('amqplib/callback_api')
const Router = require('express').Router
const mongoose = require('mongoose')

const queueRouter = Router()

let id = 0

mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:27017/teste_queue`, { useNewUrlParser: true, useUnifiedTopology: true })
const ModelItem = mongoose.model('ItemQueue', { count: String })

let connection = {}
let channel = {}
const queueName = 'testando'

amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, function(error, conn) {
    console.log('RabbitMQ Connected!')
    connection = conn

    connection.createChannel(function(err, cnl) {
        cnl.assertQueue(queueName, { durable: true })
        console.log('RabbitMQ Channel Connected!')
        channel = cnl
    })
})


queueRouter.post('/add',  async (req, res) => {
    let { queueData } = req.body
    queueData = queueData || { status: 'ok', message: 'done' }
    queueData.id = id
    id++
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(queueData)), { persistent: true })
    console.log(`Mensagem enviada - Fila: ${queueName} - Conteúdo: ${JSON.stringify(queueData)}`)
    return res.status(200).json({ message: 'sent to queue' })
})

queueRouter.post('/save_db', async (req, res) => {
    const { count } = req.body
    const item = new ModelItem({ count })
    await item.save()
    const delay = new Promise((resolve, reject) => {
        const min = 5000
        const max = 10000
        const random = Math.floor(Math.random() * (max - min) + min)
        setTimeout(() => {
            resolve()
        }, random)
    })
    await delay
    return res.status(200).json()
})


module.exports = queueRouter
const amqp = require('amqplib/callback_api')
const Router = require('express').Router

const queueRouter = Router()

let id = 0

queueRouter.post('/add',  async (req, res) => {
    const { queueName, queueData } = req.body
    const connectionPromise = new Promise((resolve, reject) => {
        amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, function(error, connection) {
            resolve(connection)
        })
    })
    const connection = await connectionPromise
    const channelPromise = new Promise((resolve, reject) => {
        connection.createChannel(function(err, channel) {
            channel.assertQueue(queueName, { durable: true })
            resolve(channel)
        })
    })
    const channel = await channelPromise
    queueData.id = id
    id++
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(queueData)))
    console.log(`Mensagem enviada - Fila: ${queueName} - Conteúdo: ${JSON.stringify(queueData)}`)
    return res.status(200).json({ message: 'sent to queue' })
})


module.exports = queueRouter
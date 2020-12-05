const amqp = require('amqplib/callback_api');
const dotenv = require('dotenv').config({ path: '.env'})
const axios = require('axios')


setTimeout(() => {
    amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, function(error0, connection) {
        if (error0) {
            console.log(error0)
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            var queue = 'testando';
    
            channel.assertQueue(queue, {
                durable: true
            });
    
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

            channel.consume(queue, (msg) => {
                const { id: count } = JSON.parse(msg.content.toString())
                axios({
                    url: `${process.env.API_HOST}/queue/save_db`,
                    method: 'POST',
                    data: {
                        count
                    },
                }).then(res => {
                    console.log(`Mensagem recebida: ${msg.content.toString()}`)
                    channel.ack(msg)
                }).catch(err => {
                    console.log(err)
                })
            }, {
                noAck: false
            })
    
        });
    });
}, 5000)

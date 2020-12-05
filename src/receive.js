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
    
            // setInterval(() => {
            //     channel.get(queue, {}, function(err, msg) {
            //         channel.ack(msg)
            //         console.log(" [x] Received %s", msg ? msg.content.toString() : '');
            //     }, {
            //         noAck: true
            //     });
            // }, 1000)

            channel.consume(queue, (msg) => {
                // const random = Math.random() * (5000 - 1000) + 1000;
                // const end = Date.now() + random;
                // while (Date.now() < end) {
                //     const doSomethingHeavyInJavaScript = 1 + 2 + 3;
                // }
                // Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, random);
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
                })
            }, {
                noAck: false
            })
    
        });
    });
}, 5000)

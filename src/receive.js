const amqp = require('amqplib/callback_api');
const dotenv = require('dotenv').config({ path: '.env'})

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
                console.log(`Mensagem recebida: ${msg.content.toString()}`)
            }, {
                noAck: false
            })
    
        });
    });
}, 5000)

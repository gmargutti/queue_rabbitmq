const amqp = require('amqplib/callback_api')
const dotenv = require('dotenv').config({ path: '.env'})

setTimeout(() => {
    amqp.connect(`amqp://${process.env.RABBITMQ_HOST}`, function(error0, connection) {
        let count = 0
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
    
            let queue = 'testando';
            let msg = 'Teste Mensagem!';
    
            channel.assertQueue(queue, {
                durable: true
            });
            
            const interval = setInterval(() => {
                if(count > 1000) {
                    connection.close()
                    process.exit(0)
                }
                channel.sendToQueue(queue, Buffer.from(count.toString()), { persistent: true });
                count += 1
                console.log(" [x] Enviado %s", count);
            }, 0)
        });
        // setTimeout(function() {
        //     connection.close();
        //     process.exit(0);
        // }, 500);
    });
}, 3000)
const amqp = require('amqplib/callback_api')

setTimeout(() => {
    amqp.connect('amqp://rabbitmq', function(error0, connection) {
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
                durable: false
            });
            
            const interval = setInterval(() => {
                if(count > 100) {
                    connection.close()
                    process.exit(0)
                }
                channel.sendToQueue(queue, Buffer.from(count.toString()));
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
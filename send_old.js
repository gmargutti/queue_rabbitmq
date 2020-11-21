const amqp = require('amqplib/callback_api');

const canais = {}

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        canais.teste = channel

        let queue = 'hello';
        let msg = 'Teste Mensagem!';

        channel.assertQueue(queue, {
            durable: false
        });
        channel.sendToQueue(queue, Buffer.from(msg));

        console.log(" [x] Sent %s", msg);
    });
    // setTimeout(function() {
    //     connection.close();
    //     process.exit(0);
    // }, 500);
});

function send(obj) {
    const stringfied = JSON.stringify(obj)
    canais.teste.sendToQueue('testando', Buffer.from(stringfied))
    console.log(`Enviando: ${stringfied}`)
}

module.exports = send
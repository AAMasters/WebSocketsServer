const WebSocket = require('ws')
let wss 

let ipc = require('node-ipc');

ipc.config.id = 'hello';
ipc.config.retry = 1500;
ipc.config.silent = true;


ipc.connectTo(
    'world',
    function () {
        ipc.of.world.on(
            'connect',
            function () {
                ipc.log('## connected to world ##'.rainbow, ipc.config.delay);

                let eventCommand = {
                    action: 'greetings',
                    from: 'Web Sockets Server'
                }

                ipc.of.world.emit(
                    'message',  
                    JSON.stringify(eventCommand)
                )
                
                wss = new WebSocket.Server({ port: 8080 })

                wss.on('connection', ws => {
                    ws.on('message', message => {

                        if (ipc.config.silent !== true) {
                            console.log(`Received message from browser => ${message}`)
                        }

                        ipc.of.world.emit(
                            'message',   
                            message
                        )
                    })

                    ipc.of.world.on(
                        'message',   
                        function (data) {
                            ipc.log('got a message from world : '.debug, data);

                            ws.send(data)
                        }
                    );
                })

                console.log('Web Socket Server Started.')
            }
        );
        ipc.of.world.on(
            'disconnect',
            function () {
                ipc.log('disconnected from world'.notice);
            }
        );
    }
);



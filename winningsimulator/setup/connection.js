


import io from 'socket.io-client';


let socket = io('wss://botws.generals.io/', {
    rejectUnauthorized: false,
});

socket.on("error", (error) => console.error('[socket.io]', error));
socket.on("connect_error", (error) => console.error('[socket.io]', error));




// // main.js
// // import { Command } from 'commander';
// // import Redis from './redis.js';
// import io from 'socket.io-client';
// import fs from 'node:fs/promises';
// import Bot from './scripts/bot.js';
// import { Log } from './utils.js';
// // import crypto from 'crypto';
// // var io = require('socket.io-client');
// // var process = require('process')
// // const io = require('socket.io-client');
// // const socket = io('wss://botws.generals.io/', { rejectUnauthorized: false });
// // // const socket = io('wss://botws.generals.io/', { transports: ['websocket'] });

// // var socket = io('wss://bot.generals.io/socket.io/?EIO=3&transport=websocket', { rejectUnauthorized: false });
// // var socket = io('wss://botws.generals.io/', { rejectUnauthorized: false });

// // const socket = io('https://bot.generals.io/', { rejectUnauthorized: false });
// // var socket = io('https://bot.generals.io/socket.io/?EIO=3&transport=websocket', { rejectUnauthorized: false });

// // var socket = io('http://botws.generals.io', { rejectUnauthorized: false });

// // // let socket = io('wss://botws.generals.io/', {
//     // //     rejectUnauthorized: false
//     // // // })
//     // // let socket = io('wss://botws.generals.io/socket.io/?EIO=3&transport=websocket', {
//         // //     rejectUnauthorized: false
//         // // })
        
        
//         // const config = require('./config.js');
//         // 'std': "ws://generals.io/socket.io/?EIO=3&transport=websocket",
//         // 'std1':"wss://generals.io/socket.io/?EIO=3&transport=websocket",
//         // 'eu': "wss://euws.generals.io/socket.io/?EIO=3&transport=websocket",
//         // 'bot': "wss://botws.generals.io/socket.io/?EIO=3&transport=websocket",
//         // 'B114': "wss://generals.io/socket.io/?EIO=3&transport=websocket",
// let gameConfig;
// let redisConfig;
// let botId;
// Log.stdout(`[initilizing] ${pkg.name} v${pkg.version}`);
// Log.stdout(`[initilizing] botId: ${botId}`);
// Log.setDebugOutput(options['debug']);
// Log.debug("[debug] debugging enabled");
// Log.debugObject("gameConfig", gameConfig);
// Log.debugObject("options", options);
// let redis = new Redis(redisConfig);
// let socket = io(gameConfig.GAME_SERVER_URL, {
//     rejectUnauthorized: false,
// });
// socket.on("error", (error) => console.error('[socket.io]', error));
// socket.on("connect_error", (error) => console.error('[socket.io]', error));
// socket.on("gio_error", (message) => {
//     Log.stderr(`[gio_error] ${message}`);
//     process.exit(4);
// });
// socket.on('connect', async () => {
//     Log.stdout(`[connected] ${gameConfig.GAME_SERVER_URL}`);
//     socket.emit('get_username', gameConfig.userId, (username) => {
//         Log.debug(`recv: username: ${username}`);
//         Log.stdout(`[connected] username: ${username}`);
//         redis.publish("state", { connected: username });
//         if (username !== gameConfig.username) {
//             Log.stdout(`[connected] current username: ${username}, changing to: ${gameConfig.username}`);
//             socket.emit('set_username', gameConfig.userId, gameConfig.username);
//             Log.debug(`sent: set_username, ${gameConfig.userId}, ${gameConfig.username}`);
//         }
//         gameConfig.username = username;
//         joinGame();
//     });
// });
// socket.on('disconnect', async (reason) => {
//     await redis.publish("state", { disconnected: reason });
//     switch (reason) {
//         case 'io server disconnect':
//             console.error("disconnected: " + reason);
//             if (redis !== undefined)
//                 await redis.quit();
//             process.exit(3);
//         case 'io client disconnect':
//             if (redis !== undefined)
//                 await redis.quit();
//             process.exit(0);
//         default:
//             console.error("disconnected: " + reason);
//     }
// });
// socket.on('error_set_username', (message) => {
//     if (message === '')
//         Log.stdout(`[set_username] username set to ${gameConfig.username}`);
//     else {
//         Log.stderr(`[error_set_username] ${message}`);
//     }
// });


// // var user_id = process.env.BOT_USER_ID;
// // password: ,tUP!knu5@9vZm)M // hashed pass as user_id
// var user_id = 'a15cfd6b9f7ed5c6a63b6fcf791bf66f92703965';
// var username = '[Bot] Winner Wills';

// // Set the username for the bot.
// // This should only ever be done once. See the API reference for more details.
// socket.emit('set_username', user_id, username);

// // export default {
// //     socket,
// //     user_id
// // };


// main.js
// var io = require('socket.io-client');
const io = require('socket.io-client');
const socket = io('wss://botws.generals.io/');

socket.on('disconnect', function() {
    console.error('Disconnected from server.');
    process.exit(1);
});

socket.on('connect', function() {
    console.log('Connected to server.');
});

/* Don't lose this user_id or let other people see it!
 * Anyone with your user_id can play on your bot's account and pretend to be your bot.
 * If you plan on open sourcing your bot's code (which we strongly support), we recommend
 * replacing this line with something that instead supplies the user_id via an environment variable, e.g.
 * var user_id = process.env.BOT_USER_ID;
 */


// var user_id = process.env.BOT_USER_ID;
// password: ,tUP!knu5@9vZm)M // hashed pass as user_id
var user_id = 'a15cfd6b9f7ed5c6a63b6fcf791bf66f92703965';
var username = '[Bot] Winner Wills';

// Set the username for the bot.
// This should only ever be done once. See the API reference for more details.
socket.emit('set_username', user_id, username);

module.exports = {
    socket,
    user_id
};


const { socket, user_id } = require('./connection.js').default;

var custom_game_id = 'willsalwayswins';
socket.emit('join_private', custom_game_id, user_id);
socket.emit('set_force_start', custom_game_id, true);
console.log('Joined custom game at http://bot.generals.io/games/' + encodeURIComponent(custom_game_id));


module.exports = {
    socket,
    user_id,
    custom_game_id
};
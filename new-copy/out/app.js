// import fs from 'fs';
import { Command } from 'commander';
import Redis from './redis.js';
import io from 'socket.io-client';
import fs from 'node:fs/promises';
import Bot from './scripts/bot.js';
import { Log } from './utils.js';
import crypto from 'crypto';
const BOT_TYPE = 'WillsBot';
const packageJsonPath = new URL('../package.json', import.meta.url);
const pkg = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
let gameConfig;
let redisConfig;
let botId;
let gameHistoryFlag = 0;

// Generate a unique timestamp for the file name
const timestamp = Date.now();
const directoryPath = '/Users/willsliou/Documents/GitHub/generals.io_bot/new-copy/out/gameState_history'
const filePath = `${directoryPath}/gamestate_${timestamp}.txt`;

process.once('SIGINT', async () => {
    Log.stderr('Interrupted. Exiting gracefully.');
    if (gameJoined) {
        socket.emit('leave_game');
        Log.debug('sent: leave_game');
    }
    socket.disconnect().once('disconnect', () => {
        redis.quit();
    });
});
process.once('SIGTERM', async () => {
    Log.stderr('Terminated. Exiting gracefully.');
    if (gameJoined) {
        socket.emit('leave_game');
        Log.debug('sent: leave_game');
    }
    socket.disconnect().once('disconnect', () => {
        redis.quit();
    });
});
const gameType = "custom";
let bot;
let playerIndex;
let replay_id = "";
let usernames;
let currentGameNumber = 0;
let gameJoined = false;
const program = new Command();
program
    .name(pkg.name)
    .version(pkg.version)
    .description(pkg.description)
    .option('-n, --number-of-games <number>', 'number of games to play', '1')
    .option('-d, --debug', 'enable debugging', false)
    .arguments('<configFile>')
    .showHelpAfterError()
    .action(run);
async function run(configFile) {
    const config = JSON.parse(await fs.readFile(configFile, 'utf8'));
    gameConfig = config.gameConfig;
    redisConfig = config.redisConfig;
    botId = BOT_TYPE + '-' + crypto.createHash('sha256').update(gameConfig.userId).digest('base64').replace(/[^\w\s]/gi, '').slice(-7);
    redisConfig.CHANNEL_PREFIX = botId;
    redisConfig.USERNAME = process.env['REDIS_USERNAME'] || redisConfig.USERNAME;
    redisConfig.PASSWORD = process.env['REDIS_PASSWORD'] || redisConfig.PASSWORD;
    redisConfig.HOST = process.env['REDIS_HOST'] || redisConfig.HOST;
    redisConfig.PORT = parseInt(process.env['REDIS_PORT']) || redisConfig.PORT;
    redisConfig.TLS = process.env['REDIS_TLS'] === 'true' || redisConfig.TLS;
    gameConfig.customGameSpeed = gameConfig.customGameSpeed || 1;
}
await program.parseAsync();
const options = program.opts();
options['numberOfGames'] = parseInt(options['numberOfGames']) || 1;
Log.stdout(`[initilizing] ${pkg.name} v${pkg.version}`);
Log.stdout(`[initilizing] botId: ${botId}`);
Log.setDebugOutput(options['debug']);
Log.debug("[debug] debugging enabled");
Log.debugObject("gameConfig", gameConfig);
Log.debugObject("options", options);
let redis = new Redis(redisConfig);
let socket = io(gameConfig.GAME_SERVER_URL, {
    rejectUnauthorized: false,
});
socket.on("error", (error) => console.error('[socket.io]', error));
socket.on("connect_error", (error) => console.error('[socket.io]', error));
socket.on("gio_error", (message) => {
    Log.stderr(`[gio_error] ${message}`);
    process.exit(4);
});

socket.on('connect', async () => {
    Log.stdout(`[connected] ${gameConfig.GAME_SERVER_URL}`);
    socket.emit('get_username', gameConfig.userId, (username) => {
        Log.debug(`recv: username: ${username}`);
        Log.stdout(`[connected] username: ${username}`);
        redis.publish("state", { connected: username });
        if (username !== gameConfig.username) {
            Log.stdout(`[connected] current username: ${username}, changing to: ${gameConfig.username}`);
            socket.emit('set_username', gameConfig.userId, gameConfig.username);
            Log.debug(`sent: set_username, ${gameConfig.userId}, ${gameConfig.username}`);
        }
        gameConfig.username = username;
        joinGame();
        Log.stdout(`https://bot.generals.io/games/${gameConfig.customGameId}`);
    });
});


socket.on('disconnect', async (reason) => {
    await redis.publish("state", { disconnected: reason });
    switch (reason) {
        case 'io server disconnect':
            console.error("disconnected: " + reason);
            if (redis !== undefined)
                await redis.quit();
            process.exit(3);
        case 'io client disconnect':
            if (redis !== undefined)
                await redis.quit();
            process.exit(0);
        default:
            console.error("disconnected: " + reason);
    }
});
socket.on('error_set_username', (message) => {
    if (message === '')
        Log.stdout(`[set_username] username set to ${gameConfig.username}`);
    else {
        Log.stderr(`[error_set_username] ${message}`);
    }
});


socket.on('game_start', (data) => {
    playerIndex = data.playerIndex;
    bot = undefined;
    replay_id = data.replay_id;
    usernames = data.usernames;
    Log.stdout(`[game_start] replay: ${replay_id}, users: ${usernames}`);
    redis.publish("state", { game_start: data });
    redis.setKeyspaceName(data.replay_id);
    redis.setKeys(data);
    function later(delay) {
        return new Promise(function (resolve) {
            setTimeout(resolve, delay);
        });
    }
    for (let i = 0; i < gameConfig.warCry.length; i++) {
        later(1000 * i).then(() => {
            socket.emit('chat_message', data.chat_room, gameConfig.warCry[i]);
            Log.debug(`sent: [chat_message] ${gameConfig.warCry[i]}`);
        });
    }

    // Write the header to the file
    writeHeader(filePath);
});

// Write header to file for .csv
function writeHeader(filePath) {
    const header = 'turn,width,height,size,ownGeneral,cities,discoveredTiles,armies,terrain,enemyGeneral,ownTiles,enemyTiles\n';

    fs.writeFile(filePath, header, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Header written to file:', filePath);
        }
    });
}

// Function to append game state to the CSV file
function appendGameState(filePath, bot) {
    const content = `${bot.gameState.turn},\n${bot.gameState.width},\n${bot.gameState.height},\n${bot.gameState.size},\n${bot.gameState.ownGeneral},\n${JSON.stringify(bot.gameState.cities)},\n${JSON.stringify(bot.gameState.discoveredTiles)},\n${JSON.stringify(bot.gameState.armies)},\n${JSON.stringify(bot.gameState.terrain)},\n${bot.gameState.enemyGeneral},\n${JSON.stringify(Array.from(bot.gameState.ownTiles.entries()))},\n${JSON.stringify(Array.from(bot.gameState.enemyTiles.entries()))}\n`;
    console.log(content)
    fs.writeFile(filePath, content, { flag: 'a' }, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Variables written to file:', filePath);
        }
    });
}

socket.on('game_update', (data) => {
    if (bot === undefined) {
        bot = new Bot(socket, playerIndex, data);
        Log.debug('recv: first game update');
    }
    else {
        bot.update(data);
    }
    redis.publish("gameUpdate", data);
    if (data.turn === 1) {
        redis.setKeys({
            ["width"]: bot.gameState.width,
            ["height"]: bot.gameState.height,
            ["size"]: bot.gameState.size,
            ["ownGeneral"]: bot.gameState.ownGeneral,
        });
    }
    redis.setKeys({
        ["turn"]: bot.gameState.turn,
        ["cities"]: bot.gameState.cities,
        ["discoveredTiles"]: bot.gameState.discoveredTiles,
        ["armies"]: bot.gameState.armies,
        ["terrain"]: bot.gameState.terrain,
        ["enemyGeneral"]: bot.gameState.enemyGeneral,
        ["ownTiles"]: Array.from(bot.gameState.ownTiles.entries()),
        ["enemyTiles"]: Array.from(bot.gameState.enemyTiles.entries()),
    });
    let maxArmyOnTile = 0;
    for (let [, value] of bot.gameState.ownTiles) {
        if (value > maxArmyOnTile) {
            maxArmyOnTile = value;
        }
    }
    redis.listPush("scores", data.scores);
    redis.listPush("maxArmyOnTile", maxArmyOnTile);
    redis.listPush("moveCount", bot.moveCount);



    // console.log("Entering findNearestCity(). Printing GameState...")
    // console.log('turn=', bot.gameState.turn)
    // console.log('width=', bot.gameState.width)
    // console.log('height=', bot.gameState.height)
    // console.log('size=', bot.gameState.size)
    // console.log('ownGeneral=', bot.gameState.ownGeneral)
    // console.log('cities=', bot.gameState.cities)
    // console.log('discoveredTiles=', bot.gameState.discoveredTiles)
    // console.log('armies=', bot.gameState.armies)
    // console.log('terrain=', bot.gameState.terrain)
    // console.log('enemyGeneral=', bot.gameState.enemyGeneral)
    // console.log('ownTiles=', bot.gameState.ownTiles)
    // own tiles is a dictionary. Each tile is indexed. 1 2 3 4.... 20 for the first row 21 22.... for the second row etc.
    // key is the index
    // value is the number of army troops.
    console.log('enemyTiles=', bot.gameState.enemyTiles)


    // const index = 0
    // In your game loop, append the current game state to the file
    appendGameState(filePath, bot);

});






socket.on('game_lost', (data) => {
    Log.stdout(`[game_lost] ${replay_id}, killer: ${usernames[data.killer]}`);
    redis.publish("state", {
        game_lost: {
            replay_id: replay_id,
            killer: data.killer,
            killer_name: usernames[data.killer],
        }
    });
    leaveGame();
});





socket.on('game_won', () => {
    Log.stdout(`[game_won] ${replay_id}`);
    redis.publish("state", {
        game_won: {
            replay_id: replay_id
        }
    });
    leaveGame();
});







let queueNumPlayers = 0;
let forceStartSet = false;
let customOptionsSet = false;
socket.on('queue_update', (data) => {
    if (!data.isForcing) {
        forceStartSet = false;
        setTimeout(setForceStart, 1000);
    }
    if (gameType === "custom"
        && data.usernames[0] === gameConfig.username
        && data.numPlayers != queueNumPlayers
        && data.options.game_speed != gameConfig.customGameSpeed) {
        customOptionsSet = false;
        setTimeout(setCustomOptions, 100);
    }
    queueNumPlayers = data.numPlayers;
});

function joinGame() {
    currentGameNumber++;
    Log.stdout(`[joining] game ${currentGameNumber} of ${options['numberOfGames']}`);
    switch (gameType) {
        case "ffa":
            socket.emit('play', gameConfig.userId);
            Log.stdout('[joined] FFA');
            redis.publish("state", {
                joined: {
                    gameType: 'FFA',
                }
            });
            break;
        case "1v1":
            socket.emit('join_1v1', gameConfig.userId);
            Log.stdout('[joined] 1v1');
            redis.publish("state", {
                joined: {
                    gameType: '1v1',
                }
            });
            break;
        case "custom":
            socket.emit('join_private', gameConfig.customGameId, gameConfig.userId, process.env['AUTH_TOKEN']);
            setTimeout(setCustomOptions, 100);
            setTimeout(setForceStart, 2000);
            Log.stdout(`[joined] custom: ${gameConfig.customGameId}`);
            redis.publish("state", {
                joined: {
                    gameType: 'custom',
                    gameId: gameConfig.customGameId,
                }
            });
            break;
    }
    gameJoined = true;
}
function leaveGame() {
    socket.emit('leave_game');
    Log.debug('sent: leave_game');
    gameJoined = false;
    forceStartSet = false;
    customOptionsSet = false;
    bot = undefined;
    if (currentGameNumber >= options['numberOfGames']) {
        Log.stdout(`Played ${options['numberOfGames']} games. Exiting.`);
        socket.close();
    }
    else {
        joinGame();
    }
}
function setForceStart() {
    if (!forceStartSet) {
        forceStartSet = true;
        socket.emit('set_force_start', gameConfig.customGameId, true);
        Log.debug('sent: set_force_start');
    }
}
function setCustomOptions() {
    if (gameType === "custom" && !customOptionsSet) {
        customOptionsSet = true;
        socket.emit('set_custom_options', gameConfig.customGameId, {
            "game_speed": gameConfig.customGameSpeed
        });
        Log.debug('sent: set_custom_options');
    }
}
//# sourceMappingURL=app.js.map
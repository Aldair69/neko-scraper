const fs = require('fs');
const https = require('https');
const path = require('path');
const {
    Client
} = require('discord.js-selfbot-v13');
const client = new Client();
const prefix = "!";
const actions = ["banghead", "boom", "claps", "cook", "cry", "dab", "dance", "eat", "facepalm", "fly", "glare", "jump", "laugh", "like", "play", "pout", "run", "sing", "sip", "sleep", "smug", "think", "vomit", "wag", "wink", "bang", "bite", "bye", "cheeks", "cuddle", "feed", "handhold", "heal", "hi", "highfive", "hug", "kick", "kiss", "knockout", "lick", "pat", "poke", "punch", "slap", "smack", "spank", "splash", "spray", "stare", "tickle", "angry", "baka", "blush", "bored", "confused", "disgust", "drunk", "fail", "happy", "lewd", "nope", "peek", "psycho", "sad", "scared", "scream", "shrug", "smile", "teehee", "thinking", "wasted"];
var actionIndex = 0;
var contador = 0;
var procesoIniciado = false;

client.on('ready', async () => {
    console.log(`${client.user.username} lista para scrapear!`);
});

client.on('message', async (message) => {
    if (message.author.id === client.user.id) return;

    if (message.content === `${prefix}iniciar`) {
        if (!procesoIniciado) {
            procesoIniciado = true;
            console.log("Proceso de scrapeo iniciado.");
            enviarMensaje(message.channel);
        } else {
            console.log("El proceso de scrapeo ya está iniciado.");
        }
    }

    if (message.author.id == 429457053791158281) {
        var lastMessages = await message.channel.messages.fetch({
            limit: 2
        });
        var previousMessage = lastMessages.last();

        if (previousMessage.content === prefix + actions[actionIndex] && procesoIniciado) {
            var url = message.embeds[0].image.url;
            var filename = message.embeds[0].image.url.split("https://cdn.nekotina.com/images/")[1];
            var anime = message.embeds[0].footer.text.split(": ")[1];
            var dir = path.join(actions[actionIndex], anime);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, {
                    recursive: true
                });
            }

            if (!fs.existsSync(path.join(dir, filename))) {
                contador++;
                // Descarga el archivo
                var file = fs.createWriteStream(path.join(dir, filename));
                https.get(url, (response) => {
                    response.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        console.log(`Archivo ${filename} descargado con éxito`);
                    });
                }).on('error', (error) => {
                    console.error(`Error al descargar el archivo: ${error}`);
                });
            } else {
                contador++;
                console.log(`Archivo ${filename} ya existe en el directorio`);
            }

            console.log("Acciones terminadas: " + actionIndex + " Accion actual: " + actions[actionIndex] + " Porcentaje: " + contador + "%");

            // **Envío del próximo mensaje con un retardo**
            if (contador >= 120) {
                contador = 0;
                actionIndex++;
                if (actionIndex >= actions.length) {
                    actionIndex = 0;
                }
            }

            // Verifica si el contador ha alcanzado el límite o si es la primera vez
            if (contador === 0 || contador >= 120) {
                setTimeout(() => {
                    enviarMensaje(message.channel);
                }, 2000); // 2000ms = 2 segundos, ajusta según tus necesidades
            }
        }
    }
});

function enviarMensaje(channel) {
    channel.send(prefix + actions[actionIndex]);
}

client.login('token');

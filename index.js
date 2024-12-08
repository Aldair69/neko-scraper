const fs = require('fs');
const https = require('https');
const path = require('path');
const {
    Client
} = require('discord.js-selfbot-v13');
const client = new Client();
const prefix = "!";
const actions = ["banghead", "boom", "claps", "cook", "cry", "dab", "dance", "eat", "facepalm", "fly", "glare", "jump", "laugh", "like", "play", "pout", "run", "sing", "sip", "sleep", "smug", "think", "vomit", "wag", "wink", "bang", "bite", "bye", "cheeks", "cuddle", "feed", "handhold", "heal", "hi", "highfive", "hug", "kick", "kiss", "knockout", "lick", "pat", "poke", "punch", "slap", "smack", "spank", "splash", "spray", "stare", "tickle", "angry", "baka", "blush", "bored", "confused", "disgust", "drunk", "fail", "happy", "lewd", "nope", "peek", "psycho", "sad", "scared", "scream", "shrug", "smile", "teehee", "thinking", "wasted"
];
var actionIndex = 0;
var contador = 0;

client.on('ready', async () => {
    console.log(`${client.user.username} esta listo para scrapear!`);
})

client.on('message', async (message) => {
    const channel = client.channels.cache.get('1314665963903258685'); // reemplaza con el ID del canal donde deseas enviar los mensajes
    var lastMessages = await message.channel.messages.fetch({
        limit: 2
    });
    // Ultimo mensaje enviado antes de que nekotina envie algo
    var previousMessage = lastMessages.last();
    // Si el mensaje es de la lista entonces obtener url y anime nombre
        if (contador == 0) {
        channel.send(prefix + actions[actionIndex]);
}
    if (message.author.id == 429457053791158281 && previousMessage.content === prefix + actions[actionIndex]) {
setInterval(() => {
        channel.send(prefix + actions[actionIndex]);
        var url = message.embeds[0].image.url //Url de la imagen 
        var filename = message.embeds[0].image.url.split("https://cdn.nekotina.com/images/")[1]; // Nombre de la imagen
        var anime = message.embeds[0].footer.text.split(": ")[1]; // Anime: "Nombre" sin ": "
        var dir = path.join(actions[actionIndex], anime); // Directorio a guardar
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            });
        }
        if (!fs.existsSync(path.join(dir, filename))) {
            // Descarga el archivo
            var file = fs.createWriteStream(path.join(dir, filename));
            https.get(url, (response) => {
            contador++;
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
console.log("Acciones terminadas: " + actionIndex + " Accion actual: " + actions[actionIndex] + " Porcentaje: " + contador+"%")
        if (contador >= 120) {
            contador = 0;
            actionIndex++;
            if (actionIndex >= actions.length) {
                actionIndex = 0;
            }
        }
       }, 3000);
    }
});

client.login('');

// set up dotenv
require('dotenv').config()
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js');
const ytdl = require('ytdl-core')
const { channel_id, video_urls, webserver, text_id } = require('./config.json')
const client = new Discord.Client()
const port = 3000
const express = require('express')
const app = express()


if (webserver) {
  app.get('/', (req, res) => {
    res.send('pong')
  })

  app.listen(port)
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
  const voiceChannel = client.channels.cache.get(channel_id)
  voiceChannel.join().then((connection) => {
    console.log('Joined voice channel')
    function play(connection) {
      var thelink = video_urls[Math.floor(Math.random() * video_urls.length)]
      const stream = ytdl(
        thelink,
        { filter: 'audioonly' },
      );
      stream.on('info', (info) => {
        var songTitle = info.videoDetails.title
        console.log(songTitle)
        const embedtest = new MessageEmbed()
          .setTitle(`${info.videoDetails.title}`)
          .setURL(thelink)
          .setAuthor(info.videoDetails.author.name, info.videoDetails.author.thumbnails[0].url, info.videoDetails.author.channel_url)
          .setThumbnail(info.videoDetails.author.thumbnails[0].url)
          .setImage(`https://i.ytimg.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`)
          .setFooter ('HoloEN Insomniac Radio', 'https://cdn.donmai.us/original/28/97/__mori_calliope_and_death_sensei_hololive_and_1_more_drawn_by_hurybone__2897434bbc538556a039edfb23ee74ab.jpg');
        client.channels.cache.get(text_id).send(`:arrow_forward: Now playing: **${info.videoDetails.title}**`, {embed: embedtest });
        client.user.setActivity(`${info.videoDetails.title}`,{
          type: "LISTENING"
        })
      });
      const dispatcher = connection.play(stream)
      dispatcher.on('finish', () => {
        play(connection)
      })
    }
    
    play(connection)
  })
})

client.login(process.env.TOKEN)

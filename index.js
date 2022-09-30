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
    res.send('wake me up inside')
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
        console.log(info.videoDetails.title)
        var who = info.videoDetails.author.name
        var channelavatar = (info.videoDetails.author.thumbnails[0].url)
        var big = channelavatar.replace('s48-', '')
        var min = Math.floor(info.videoDetails.lengthSeconds / 60)
        var sec = info.videoDetails.lengthSeconds % 60
        var color = "#000000"
        if (who.includes("Suisei") == true) {
          color = "#7BACEC"
        else {
          color = "#FFFFFF"
        }
        const embedtest = new MessageEmbed()
          .setColor(color)
          .setTitle(`${info.videoDetails.title}`)
          .setURL(thelink)
          .setAuthor(info.videoDetails.author.name, big, info.videoDetails.author.channel_url)
          .setThumbnail(big)
          .addField("Duration", `${min} min ${sec} sec`)
          .setImage(`https://i.ytimg.com/vi/${info.videoDetails.videoId}/maxresdefault.jpg`)
          .setFooter ('Hoshimachi Insomniac Radio', 'https://yt3.ggpht.com/ytc/AMLnZu-0m7dbn-y21dl-MfaM8t36EbRRwib1hnHzCMkwbg=c-k-c0x00ffffff-no-rj');
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

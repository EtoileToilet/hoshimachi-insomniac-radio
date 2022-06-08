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
        if (who.includes("Mori") == true) {
          color = "#C90D40"
        } else if (who.includes("Kiara") == true) {
          color = "#FF511C"
        } else if (who.includes("Ina'nis") == true) {
          color = "#62567E"
        } else if (who.includes("Gura") == true) {
          color = "#5D81C7"
        } else if (who.includes("Amelia") == true) {
          color = "#F8DB92"
        } else if (who.includes("Sana") == true) {
          color = "#F2D7C4"
        } else if (who.includes("Fauna") == true) {
          color = "#A4E5CF"
        } else if (who.includes("Kronii") == true) {
          color = "#0869EC"
        } else if (who.includes("Mumei") == true) {
          color = "#998274"
        } else if (who.includes("Baelz") == true) {
          color = "#D2251E"
        } else if (who.includes("IRyS") == true) {
          color = "#3C0024"
        } else if (who.includes("Watame") == true) {
          color = "#F6ECA5"
        } //special guest 1
          else if (who.includes("Rikka") == true) {
          color = "#EAB3B8"
        } //special guest 2
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

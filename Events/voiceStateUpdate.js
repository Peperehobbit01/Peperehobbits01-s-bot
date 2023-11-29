const Discord = require("discord.js");
const ms = require("ms");

module.exports = async(bot, oldState, newState) => {

  const db = bot.db;
  const oldChannel = oldState.channel;
  const newChannel = newState.channel;
  const logsChannel = "931457930660835333";

  if (oldChannel === newChannel) {
    return;
  }
  
  if (!oldChannel && newChannel) {

    //db.query(`INSERT INTO voicestateupdate (user, channel, time) VALUES ('${user.id}', '${newState.channel.id}', '0')`)

    const JoinCall = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${newState.user} à rejoint un vocal`)
    .setDescription(`**Salon**\n${oldChannel}\n**ID**\nUtilisateur : ${newState.user}\nSalon : ${oldChannel}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.newState.user.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()

    await logsChannel.send({embeds: [JoinCall]})

  }
  
  if (oldChannel && !newChannel) {

    //db.query(`DELETE INTO voicestateupdate WHERE channel = '${oldState.channel.id}' AND user = '${user.id}'`)

    const LeaveCall = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${oldState.user} à quittée un vocal`)
    .setDescription(`**Salon**\n${oldChannel}\n**ID**\nUtilisateur : ${oldState.user}\nSalon : ${oldChannel.name}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.oldState.user.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()

    await logsChannel.send({embeds: [LeaveCall]})

  }
  
  if (oldChannel && newChannel) {

    //db.query(`UPDATE voicestateupdate SET channel = '${newState.channel.id}', AND user = '${user.id}' AND time = '0'`)

    const MooveCall = new Discord.EmbedBuilder()
    .setColor(bot.color)
    .setTitle(`${newState.user} à changée de vocal`)
    .setDescription(`**Salon**\n${oldChannel.name} et maintenant ${newChannel.name}\n**ID**\nUtilisateur : ${newState.user}\nAncien salon : ${oldChannel.name}\nNouveau salon : ${newChannel.name}`)
    .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.newState.user.displayAvatarURL({ dynamic: true }) })
    .setTimestamp()

    await logsChannel.send({embeds: [MooveCall]})
  }
};
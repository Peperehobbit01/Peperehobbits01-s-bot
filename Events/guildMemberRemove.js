const Discord = require("discord.js")
const timedAt = require("discord.js")

module.exports = async (bot, member, guild) => {

    const logsChannel = "931457930660835333"

    const removeMember = new Discord.EmbedBuilder()
        .setColor(bot.color)
        .setTitle("Un membre a quittée le serveur")
        .setDescription(`Le membre ${member.username} , ${member.tag}\nID ${member.id}\nRejoint le ${member.join.timedAt}`)
        .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) })

        logsChannel.send({ embeds: [removeMember] })
}
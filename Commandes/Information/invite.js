const Discord = require('discord.js');

module.exports = {

    name: 'invite',
    description: `Voir combien d'invitations les membres ont déjà envoyées`,
    permission: "Aucune",
    category: "📚・Informations",
    dm: false,
    options: [
        {   
            type: "user",
            name: 'membres',
            description: `L'utilisateur dont vous voulez vérifier les invitations.`,
            required: true,
            autocomplete: false
        }
    
    ],
    
    run: async (bot, message) => {
      
        let user = args.getUser("membre")
        if(!user) return message.user.cache.get()
        
        let invites = await message.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id);

        let i = 0;
        userInv.forEach(inv => i += inv.uses);

        const invitations = new Discord.EmbedBuilder()
            .setColor(bot.color)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setTitle("Nombre d'invitations de l'utilisateur")
            .setDescription(`${user.tag} a **${i}** invitations.`)
            .setFooter({ text: "Gérée par l'instance de Peperehobbits01's Bot", iconURL: bot.user.displayAvatarURL({ dynamic: true }) });

        await message.reply({ embeds: [invitations], ephemeral: false });
    }
}
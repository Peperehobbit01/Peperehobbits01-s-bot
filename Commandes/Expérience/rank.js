const Discord = require("discord.js")
const Canvas = require("canvas")
const { executeQuery } = require(`../../Fonctions/databaseConnect.js`);

module.exports = {

    name: "rank",
    description: "Permet de savoir le nombre d'xp d'un membre.",
    permission: "Aucune",
    dm: false,
    category: "📊・Système d'expérience",
    options: [
        {
            type: "user",
            name: "utilisateur",
            description: "L'utilisateur dont ont veux savoir l'xp",
            required: false,
            autocomplete: false
        }
    ],

    async run(bot, message, args) {

        let user;
        if(args.getUser("utilisateur")) {
            user = args.getUser("utilisateur")
            if(!user || !message.guild.members.cache.get(user?.id)) return message.reply("Aucun membre sélectionnée!")
        } else user = message.user;

        const querySearch = `SELECT * FROM xp WHERE guild = '${message.guildId}'`
        const results = await executeQuery(querySearch);

        if(results.length < 1) return message.reply("Il n'est pas renseignée dans ma liste des gens ayant de l'xp!")
        
        await message.deferReply()

        const calculXp = (xp, level) => {
            let xptotal = 0;
            for(let i = 0; i < level + 1; i++) xptotal += i * 1000
            xptotal += xp;
            return xptotal;
        }

        let leaderboard = results.toSorted((a, b) => calculXp(parseInt(b.xp), parseInt(b.level)) - calculXp(parseInt(a.xp), parseInt(a.level)))
        let userInLeaderboard = results.find(u => u.user === user.id)
        let xp = parseInt(userInLeaderboard.xp)
        let level = parseInt(userInLeaderboard.level)
        let rank = leaderboard.findIndex(r => r.user === user.id) + 1
        let need = (level + 1) * 1000;
        let guild = message.guild

        const canvas = Canvas.createCanvas(800, 300)
        const ctx = canvas.getContext("2d")

        const background = await Canvas.loadImage('Assets/Niveau.jpg')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        const opacity = await Canvas.loadImage(`Assets/leaderboard_black.png`)
        ctx.drawImage(opacity, 0, 0, canvas.width, canvas.height)

        const member = message.guild.members.cache.get(user.id);
        const status = member?.presence?.status ?? "offline";
        const badges = await user.fetchFlags()
        const badge = badges.toArray()
        .filter(b => b !== "BotHTTPInteractions" 
            && b !== "Quarantined" 
            && b !== "Spammer" 
            && b !== "TeamPseudoUser"
            && b !== "VerifiedBot"
        );

        if(xp > need) xp = need
        if(xp < 0) xp = 0

        const barre = Math.floor(xp / need * 490)

        //Barre d'xp qui ne se remplie pas
        ctx.beginPath()
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.fillStyle = "#ffffff"
        ctx.moveTo(220, 92.5)
        ctx.quadraticCurveTo(220, 75, 240, 75)
        ctx.lineTo(710, 75)
        ctx.quadraticCurveTo(730, 75, 730, 92.5)
        ctx.quadraticCurveTo(730, 110, 710, 110)
        ctx.lineTo(240, 110)
        ctx.quadraticCurveTo(220, 110, 220, 92.5)
        ctx.fill()
        ctx.closePath()

        //Barre d'xp qui se remplie
        ctx.beginPath()
        ctx.globalAlpha = 1;
        ctx.lineWidth = 2;
        ctx.fillStyle = "#ff0000"
        ctx.moveTo(220, 92.5)
        ctx.quadraticCurveTo(220, 75, 240, 75)
        ctx.lineTo(240 + barre - 20, 75)
        ctx.quadraticCurveTo(240 + barre, 75, 240 + barre, 92.5)
        ctx.quadraticCurveTo(240 + barre, 110, 240 + barre - 20, 110)
        ctx.lineTo(240, 110)
        ctx.quadraticCurveTo(220, 110, 220, 92.5)
        ctx.fill()
        ctx.closePath()

        //Pourcentage + Xp
        ctx.font = '20px "Futura Book"'
        ctx.fillStyle = "#08490c"
        ctx.fillText(`${Math.floor(xp * 100 / need)}%`, 665, 100)
        ctx.fillText(`${xp} / ${need} xp`, 275, 100)

        //Level + Rang
        ctx.font = '36px "Futura Book"'
        ctx.fillStyle = "#ffffff"
        ctx.fillText(`Level : ${level}`, 275, 150)
        rank === 1 ? ctx.fillText(`Rang : ${rank}er`, 520, 150) : ctx.fillText(`Rang : ${rank}ème`, 475, 150)

        //Tag de l'utilisateur
        ctx.font = '36px "Futura Book"'
        ctx.fillStyle = "#ffffff"
        ctx.fillText(`${user.tag.length > 15 ? user.tag.slice(0, 15) + "..." : user.tag}`, 275, 210)

        //Badge de l'utilisateur                    
        if(badges.bitfield !== 0) {
                    
            for(let i = 0; i < badge.length; i++) {
                let b;
                switch (badge[i]) {
                    case "HypeSquadOnlineHouse1":
                        b = await Canvas.loadImage(`Assets/Hypesquad1.png`);
                        break;
                    case "HypeSquadOnlineHouse2":
                        b = await Canvas.loadImage(`Assets/Hypesquad2.png`);
                        break;
                    case "HypeSquadOnlineHouse3":
                        b = await Canvas.loadImage(`Assets/Hypesquad3.png`);
                        break;
                    case "Staff":
                        b = await Canvas.loadImage(`Assets/Staff.png`);
                        break;
                    case "Partner":
                        b = await Canvas.loadImage(`Assets/Partner.png`);
                        break;
                    case "Hypesquad":
                        b = await Canvas.loadImage(`Assets/Hypesquad4.png`);
                        break;
                    case "BugHunterLevel1":
                        b = await Canvas.loadImage(`Assets/BugHunter1.png`);
                        break;
                    case "BugHunterLevel2":
                        b = await Canvas.loadImage(`Assets/BugHunter2.png`);
                        break;
                    case "PremiumEarlySupporter":
                        b = await Canvas.loadImage(`Assets/PremiumEarlySupport.png`);
                        break;
                    case "VerifiedDeveloper":
                        b = await Canvas.loadImage(`Assets/VerifiedDeveloper.png`);
                        break;
                    case "CertifiedModerator":
                        b = await Canvas.loadImage(`Assets/CertifiedModerator.png`);
                        break;
                    case "ActiveDeveloper":
                        b = await Canvas.loadImage(`Assets/ActiveDeveloper.png`);
                        break;
                    case "OldUserName":
                        b = await Canvas.loadImage(`Assets/OldUserNameBadge.png`);
                        break;
                    default:
                        break;
                }
                ctx.drawImage(b, 275 + i * 50, 220, 50, 50)

                if(i === (badge.length - 1)) {
                    if((await guild.fetchOwner()).id === user.id) {
                        const b = await Canvas.loadImage(`Assets/OwnerServer.png`)
                        ctx.drawImage(b, 275 + (i+1) * 50, 220, 50, 50)
                    }
                    if(member && member.premiumSinceTimestamp !== null) {
                        if((await guild.fetchOwner()).id === user.id) {
                            const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? "https://cdn.discordapp.com/emojis/885885300721741874.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? "https://cdn.discordapp.com/emojis/885885268538851379.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? "https://cdn.discordapp.com/emojis/885885230945296384.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? "https://cdn.discordapp.com/emojis/885885188457001070.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? "https://cdn.discordapp.com/emojis/885885137802366996.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? "https://cdn.discordapp.com/emojis/885885091652440104.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? "https://cdn.discordapp.com/emojis/885885056814575697.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? "https://cdn.discordapp.com/emojis/885885020269584404.png?size=96" : "https://cdn.discordapp.com/emojis/885884977831620708.png?size=96")
                            ctx.drawImage(b, 275 + (i+2) * 50, 220, 50, 50)
                        } else {
                            const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? "https://cdn.discordapp.com/emojis/885885300721741874.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? "https://cdn.discordapp.com/emojis/885885268538851379.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? "https://cdn.discordapp.com/emojis/885885230945296384.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? "https://cdn.discordapp.com/emojis/885885188457001070.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? "https://cdn.discordapp.com/emojis/885885137802366996.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? "https://cdn.discordapp.com/emojis/885885091652440104.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? "https://cdn.discordapp.com/emojis/885885056814575697.png?size=96" : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? "https://cdn.discordapp.com/emojis/885885020269584404.png?size=96" : "https://cdn.discordapp.com/emojis/885884977831620708.png?size=96")
                            ctx.drawImage(b, 275 + (i+1) * 50, 220, 50, 50)
                        }
                    }
                    if(user.displayAvatarURL({dynamic: true}).endsWith(".gif") || (member ? member.presence ? member.presence.activities[0] ? member.presence.activities[0].emoji !== null ? member.presence.activities[0].emoji.id !== undefined : "" : "" : "" : "") || (member ? member.premiumSinceTimestamp !== null : "") || (await bot.users.fetch(user.id, {force: true})).banner) {
                        if((await guild.fetchOwner()).id === user.id && member && member.premiumSinceTimestamp !== null) {
                            const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                            ctx.drawImage(b, 275 + (i+3) * 50, 220, 72, 50)
                        } else if((await guild.fetchOwner()).id === user.id && member && member.premiumSinceTimestamp === null) {
                            const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                            ctx.drawImage(b, 275 + (i+2) * 50, 220, 72, 50)
                        } else if((await guild.fetchOwner()).id !== user.id && member && member.premiumSinceTimestamp !== null) {
                            const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                            ctx.drawImage(b, 275 + (i+2) * 50, 220, 72, 50)
                        } else {
                            const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                            ctx.drawImage(b, 275 + (i+1) * 50, 220, 72, 50)
                        }
                    }
                }
            }

        } else {
            
            if((await guild.fetchOwner()).id === user.id) {
                const b = await Canvas.loadImage(`Assets/OwnerServer.png`)
                ctx.drawImage(b, 275, 220, 50, 50)
            }
            if(member && member.premiumSinceTimestamp !== null) {
                if((await guild.fetchOwner()).id === user.id) {
                    const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? `Assets/NitroBoost1.png` : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? `Assets/NitroBoost2.png` : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? `Assets/NitroBoost3.png` : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? `Assets/NitroBoost4.png` : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? `Assets/NitroBoost5.png` : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? `Assets/NitroBoost6.png` : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? `Assets/NitroBoost7.png` : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? `Assets/NitroBoost8.png` : Date.now() - member.premiumSinceTimestamp >= 2629800000 `Assets/NitroBoost9.png`)
                    ctx.drawImage(b, 275 + 50, 220, 50, 50)
                } else {
                    const b = await Canvas.loadImage(Date.now() - member.premiumSinceTimestamp >= 63115200000 ? `Assets/NitroBoost1.png` : Date.now() - member.premiumSinceTimestamp >= 47336400000 ? `Assets/NitroBoost2.png` : Date.now() - member.premiumSinceTimestamp >= 39447000000 ? `Assets/NitroBoost3.png` : Date.now() - member.premiumSinceTimestamp >= 31557600000 ? `Assets/NitroBoost4.png` : Date.now() - member.premiumSinceTimestamp >= 23668200000 ? `Assets/NitroBoost5.png` : Date.now() - member.premiumSinceTimestamp >= 15778800000 ? `Assets/NitroBoost6.png` : Date.now() - member.premiumSinceTimestamp >= 7889400000 ? `Assets/NitroBoost7.png` : Date.now() - member.premiumSinceTimestamp >= 5259600000 ? `Assets/NitroBoost8.png` : Date.now() - member.premiumSinceTimestamp >= 2629800000 `Assets/NitroBoost9.png`)
                    ctx.drawImage(b, 275, 220, 50, 50)
                }
            }
            if(user.displayAvatarURL({dynamic: true}).endsWith(".gif") || (member ? member.presence ? member.presence.activities[0] ? member.presence.activities[0].emoji !== null ? member.presence.activities[0].emoji.id !== undefined : "" : "" : "" : "") || (member ? member.premiumSinceTimestamp !== null : "") || (await bot.users.fetch(user.id, {force: true})).banner) {
                if((await guild.fetchOwner()).id === user.id && member && member.premiumSinceTimestamp !== null) {
                    const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                    ctx.drawImage(b, 275 + 100, 220, 72, 50)
                } else if((await guild.fetchOwner()).id === user.id && member && member.premiumSinceTimestamp === null) {
                    const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                    ctx.drawImage(b, 275 + 50, 220, 72, 50)
                } else if((await guild.fetchOwner()).id !== user.id && member && member.premiumSinceTimestamp !== null) {
                    const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                    ctx.drawImage(b, 275 + 50, 220, 72, 50)
                } else {
                    const b = await Canvas.loadImage(`Assets/NitroBadge.png`)
                    ctx.drawImage(b, 275, 220, 72, 50)
                }
            }
        }

        //Status
        ctx.beginPath()
        ctx.arc(160, 150, 108, 0, 2 * Math.PI, true)
        ctx.closePath()
        ctx.fillStyle = status === "online" ? "#3ba55c" : status === "dnd" ? "#ed4245" : status === "stream" ? "#593695" : status === "idle" ? "#faa61a" : status === "offline" ? "#747f8d" : ""
        ctx.fill()

        //Avatar
        ctx.beginPath()
        ctx.arc(160, 150, 100, 0, 2 * Math.PI, true)
        ctx.closePath()
        ctx.clip()

        const avatar = await Canvas.loadImage(member ? member.avatar ? member.avatarURL({extension: 'png'}) : user.displayAvatarURL({extension: 'png'}) : user.displayAvatarURL({extension: 'png'}))
        ctx.drawImage(avatar, 60, 50, 200, 200)

        await message.followUp({files: [new Discord.AttachmentBuilder(canvas.toBuffer(), {name: "rank.png"})]})
    }
}

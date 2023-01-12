import { Client, ClientOptions, GatewayIntentBits, Partials, PermissionsBitField, Collection, ActivityType, ActionRowBuilder, ButtonBuilder, EmbedBuilder, User, Role } from 'discord.js'
import { Routes } from 'discord-api-types/v9'
import { REST } from '@discordjs/rest'
import * as fs from "fs"
class Bot extends Client {
  constructor(options: ClientOptions) {
    super(options)
  }

  addSlashCommands(token: string, directoryName: string) {
    const rest = new REST({
      version: '9'
    }).setToken(token)
    const slashCommands: Array<object> = []
    const files = fs.readdirSync(`./${directoryName}`).filter(file => file.endsWith('.js'))
    for (const file of files) {
      const slashCommand = require(`./${directoryName}/${file}`)
      slashCommands.push({
        name: slashCommand.name,
        description: slashCommand.description,
        type: slashCommand.type,
        options: slashCommand.options ? slashCommand.options : null,
        default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
        default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null
      })
    }
    (async () => {
      try {
        await rest.put(
          Routes.applicationCommands(process.env.client),
          { body: slashCommands },
        )
        console.log(`/ commands registered`)
      } catch (error) {
        console.log(error);
      }
    })();
  }
}

const Intents = {
  All: 3276799,
  Guilds: 1,
  GuildMembers: 2,
  GuildBans: 4,
  GuildEmojisAndStickers: 8,
  GuildIntegrations: 16,
  GuildWebhooks: 32,
  GuildInvites: 64,
  GuildVoiceStates: 128,
  GuildPresences: 256,
  GuildMessages: 512,
  GuildMessageReactions: 1024,
  GuildMessageTyping: 2048,
  DirectMessages: 4096,
  DirectMessageReactions: 8192,
  DirectMessageTyping: 16384,
  MessageContent: 32768,
  GuildScheduledEvents: 65536,
  AutoModerationConfiguration: 1048576,
  AutoModerationExecution: 2097152,
}

function mention(entity: User | Role) {
  if (entity instanceof User) {
    return `<@${entity.id}>`
  } else if (entity instanceof Role) {
    return `<@&${entity.id}>`
  }
}

export {
  Bot,
  Intents,
  Partials,
  mention,
}
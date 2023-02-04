async function everyoneCommand(message) {
  if (message.body == "/everyone" || message.body == "@everyone") {
    const chat = await message.getChat();
    if (chat.isGroup) {
      let text = "";
      let mentions = [];

      for (let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);

        mentions.push(contact);
        text += `@${participant.id.user} `;
      }

      await message.reply(text, { mentions });
    } else {
      message.reply(message.from, "please specify the command, see '/help'");
    }
  }
}

module.exports = {
  everyoneCommand,
};

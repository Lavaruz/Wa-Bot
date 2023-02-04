async function groupDescCommand(message) {
  if (message.body === "/groupdesc") {
    let chat = await message.getChat();
    if (chat.isGroup) {
      message.reply(`
    ==========Group Description==========
    ${chat.description}
            `);
    } else {
      message.reply("This command can only be used in a group!, see '/help'");
    }
  }
}

module.exports = {
  groupDescCommand,
};

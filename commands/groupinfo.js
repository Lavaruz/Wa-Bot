async function groupInfoCommand(message) {
  if (message.body === "/groupinfo") {
    let chat = await message.getChat();
    if (chat.isGroup) {
      message.reply(`
==========Group Details==========
Name: ${chat.name}
Description: ${chat.description}
Created At: ${chat.createdAt.toString()}
Created By: ${chat.owner.user}
Participant count: ${chat.participants.length}
        `);
    } else {
      message.reply("This command can only be used in a group!, see '/help'");
    }
  }
}

module.exports = {
  groupInfoCommand,
};

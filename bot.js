const qrcode = require("qrcode-terminal");

const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("message", async (message) => {
  if (message.body == "/help") {
    message.reply(`
==========COMMANDS HELPER==========

**** Group and Non-Group ****
/stciker
membuat sticker dari image
how to use: kirim gambar dan sertakan caption '/stciker'

**** Group Only ****
/groupinfo
menampilkan informasi lengkap group

/groupdesc
menampilkan deskripsi group

/everyone atau @everyone
tag semua anggota group

    `);
  }

  if (message.body == "/sticker") {
    if (message.hasMedia) {
      const media = await message.downloadMedia();
      const newMedia = new MessageMedia(media.mimetype, media.data);
      await client.sendMessage(message.from, newMedia, {
        sendMediaAsSticker: true,
        stickerAuthor: "Assami Muzaki",
        stickerName: media.filename,
        stickerCategories: ["🤩", "🎉"],
        caption: "here's your sticker",
      });
      client.sendMessage(message.from, "Here's your sticker 🤩");
    } else {
      client.sendMessage(
        message.from,
        "please specify the command, see '/help'"
      );
    }
  }

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

  if (message.body === "/groupdesc") {
    let chat = await message.getChat();
    if (chat.isGroup) {
      message.reply(`
==========Group Description==========
${chat.description}
        `);
    } else {
      message.reply("This command can only be used in a group! see '/help'");
    }
  }

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

      await chat.sendMessage(text, { mentions });
    }
  }
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

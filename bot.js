require("dotenv").config();

const http = require("http");
const qrcode = require("qrcode-terminal");
const mongoose = require("mongoose");
const { Client, RemoteAuth, MessageMedia } = require("whatsapp-web.js");
const { MongoStore } = require("wwebjs-mongo");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    puppeteer: {
      args: ["--no-sandbox"],
    },
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000,
    }),
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", async () => {
    console.log("Client is ready!");
  });

  client.on("authenticated", () => {
    const port = process.env.PORT || 3001;

    const server = http.createServer((req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end("Hello World");
    });

    server.listen(port, () => {
      console.log(`Server running at port ${port}`);
    });

    client.on("message", async (message) => {
      if (message.body == "/help") {
        message.reply(`
==========COMMANDS HELPER==========

**** Group and Non-Group ****
/stciker
📖 membuat sticker dari image
❔ how to use: kirim gambar dan sertakan caption '/stciker'

**** Group Only ****
/groupinfo
📖 menampilkan informasi lengkap group

/groupdesc
📖 menampilkan deskripsi group

/everyone atau @everyone
📖 tag semua anggota group
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
          message.reply(
            "This command can only be used in a group!, see '/help'"
          );
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
          message.reply(
            "This command can only be used in a group! see '/help'"
          );
        }
      }

      if (message.body == "/everyone" || message.body == "@everyone") {
        const chat = await message.getChat();
        if (chat.isGroup) {
          let text = "";
          let mentions = [];

          for (let participant of chat.participants) {
            const contact = await client.getContactById(
              participant.id._serialized
            );

            mentions.push(contact);
            text += `@${participant.id.user} `;
          }

          await chat.sendMessage(text, { mentions });
        }
      }
    });
  });

  client.on("remote_session_saved", () => {
    // Do Stuff...
    console.log("session saved");
  });

  client.initialize();
});

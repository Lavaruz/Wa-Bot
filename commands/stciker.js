async function stcikerCommand(message) {
  // ======================== MEDIA TO STICKER
  if (message.hasMedia) {
    if (message.body == "/sticker") {
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
}

module.exports = {
  stcikerCommand,
};

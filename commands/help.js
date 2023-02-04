async function helpCommand(message) {
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
}

module.exports = {
  helpCommand,
};

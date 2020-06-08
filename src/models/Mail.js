const mailer = require("nodemailer");

var message = {
  from: "smartprint3d.io@gmail.com",
  to: "smartprint3d.io@gmail.com",
  subject: "Test Email from NodeJS",
  text: "Plaintext version of the message",
  html: "<p>HTML version of the message</p>",
  attachments: [
    {
      filename: "qrcode.png",
      path: "http://localhost:8082/qrcodes/Sk3eaIZYhvH1fSSb.pending",
    },
  ],
};

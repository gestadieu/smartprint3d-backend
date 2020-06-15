const nodemailer = require("nodemailer");

// var message = {
//   from: "smartprint3d.io@gmail.com",
//   to: "smartprint3d.io@gmail.com",
//   subject: "Test Email from NodeJS",
//   text: "Plaintext version of the message",
//   html: "<p>HTML version of the message</p>",
//   attachments: [
//     {
//       filename: "qrcode.png",
//       path: "http://localhost:8082/qrcodes/Sk3eaIZYhvH1fSSb.pending",
//     },
//   ],
// };

let transporter = nodemailer.createTransport({
  sendmail: true,
  newline: "unix",
  path: "/usr/sbin/sendmail",
});

transporter.sendMail(
  {
    from: "smartprint3d.io@gmail.com",
    to: "gestadieu@usj.edu.mo",
    subject: "Test from SmartPrint3D",
    text: "I hope this message gets delivered!",
  },
  (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  }
);

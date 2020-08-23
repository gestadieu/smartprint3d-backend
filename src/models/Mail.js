require("dotenv").config();
const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     type: "OAuth2",
//     user: process.env.GMAIL_ADDRESS,
//     clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
//     clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
//     accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
//     expires: Number.parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE, 10),
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = (mailOptions) =>
  new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error(error.stack || error);
        return reject(error);
      }
      resolve();
    });
  });

const emailOrderConfirmation = (order) => {
  return {
    from: "SmartPrint3D <noreply@edm.smartprint3d.io>",
    replyTo: "smartprint3d.io@gmail.com",
    to: order.email,
    subject: `「智打印3D」SmartPrint3D - Order#${order._id}`,
    html: `<div style="text-align:center">
      <a href="https://www.smartprint3d.io/">
        <img src="https://api.smartprint3d.io/images/logo-smartprint3d.jpg"/ style="width:128px;">
      </a>
    </div>
    <p>感謝您體驗「智打印3D」。這是一個把先進科技帶進社區的項目，由科技發展委員會資 助，澳門智慧城市概念下的其中一步。 您的訂單已安全發送並確認！在一週內，我們會把提取3D打印品之詳細資料發給您 。請密切期待！
    </p> 
    <p>Thank you for experiencing the Smart Print 3D, a project funded by FDCT and being part of the Macau Smart City project. Your order is well received and confirmed. We will send you the details to collect your 3D Print Object within one week. Please look forward to!
    </p>
    <p style="text-align:center;">
      <a href="https://api.smartprint3d.io/api/orders/${order._id}">
        <img src="https://api.smartprint3d.io/qrcodes/${order._id}.png"/>
      </a>
    </p>
     `,
  };
};

const emailPrinted = (order) => {
  return {
    from: "SmartPrint3D <noreply@edm.smartprint3d.io>",
    replyTo: "smartprint3d.io@gmail.com",
    to: order.email,
    subject: "您的訂單已在 / Your order is ready!",
    html: `<div style="text-align:center">
      <a href="https://www.smartprint3d.io/">
        <img src="https://api.smartprint3d.io/images/logo-smartprint3d.jpg"/ style="width:128px;">
      </a>
    </div>
    <p>感謝您體驗「智打印3D」。這是一個把先進科技帶進社區的項目，由科技發展委員會資助，澳門智慧城市概念下的其中一步。</p>
    <p>您的訂單已在 創意空間 (文化中心地下) 等待你！要領取你的3D寶貝，請向我們的工作人員顯示以下的二維碼。 我們的開放時間為下午2點至7點，星期一至六。跟我們一同走進澳門先進科技的旅程吧！</p>
    <p>服務熱線: 63451604
    </p>
    <p>Thank you for experiencing the Smart Print 3D, a project funded by FDCT and being part of the Macau Smart City project.</p>
    <p>Your order is ready for pick-up at Creative Macau (G/F Macau Cultural Centre), please present the following QR code to our staff at the kiosk to collect your 3D prints. Our opening hours are 2:00 - 7:00 pm Monday to Saturday. Enjoy the technology advancement of Macau!</p>
    <p>Service Hotline: 63451604
    </p> 
    <p style="text-align:center;">
      <a href="https://api.smartprint3d.io/api/orders/${order._id}">
        <img src="https://api.smartprint3d.io/qrcodes/${order._id}.png"/>
      </a>
    </p>
     `,
    // attachments: [
    //   {
    //     filename: "QRCode.png",
    //     path: `https://api.smartprint3d.io/qrcodes/5ee5c7c4518392410ad7de08.png`,
    //   },
    // ],
  };
};

module.exports = {
  sendEmail,
  emailOrderConfirmation,
  emailPrinted,
};

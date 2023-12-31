import nodemailer from "nodemailer";
// 2. email body
// 3. send method

export const accountVerificationEmail = async (obj) => {
  const { email, fName, link } = obj;
  // 1. smtp config
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"EST Store " <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Account activation required", // Subject line
    text: `hello ${fName}, please follow the link to activate your account. ${link}`, // plain text body
    html: `
    <p>
    Hello ${fName}
</p>
<p>
please follow the link below to activate your account.
</p>
<br />
<br />
<p>
   <a href=${link}>  ${link} </a>
</p>
<br />
<br />

<p>
    Regareds, <br />
    EST Store <br />
    Customer Support Team
</p>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export const accountVerifiedNotification = async (obj) => {
  const { email, fName } = obj;
  // 1. smtp config
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"EST Store " <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Account has been verified", // Subject line
    text: `hello ${fName}, Your account has been verified, you may sign in now`, // plain text body
    html: `
    <p>
    Hello ${fName}
</p>
<p>
Your account has been verified, you may 
<a href="${process.env.WEB_DOMAIN}">
sign
</a>
in now
</p>
<br />
<br />
 

<p>
    Regards, <br />
    EST Store <br />
    Customer Support Team
</p>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export const sendOTPNotification = async (obj) => {
  const { email, fName, otp } = obj;
  // 1. smtp config
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"EST Store " <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Password Rest OTP", // Subject line
    text: `hello ${fName}, Here is the OTP for password reset ${otp}`, // plain text body
    html: `
    <p>
    Hello ${fName}
</p>
<p>
Here is your otp.

</p>
<p>
${otp}

</p>

<br />
<br />
If you ddin't request opt, pelase contact us or change your passowrd.
 

<p>
    Regareds, <br />
    EST Store <br />
    Customer Support Team
</p>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export const passwordChangedNotification = async (obj) => {
  const { email, fName } = obj;
  // 1. smtp config
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"EST Store " <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Your account info is changed", // Subject line
    text: `hello ${fName}, recently your password is changed, if this is not you, contact us immideatly`, // plain text body
    html: `
    <p>
    Hello ${fName}
</p>
<p>
recently your password is changed, if this is not you, contact us immideatly

</p>
<p>
 

</p>

<br />
 
 

<p>
    Regareds, <br />
    EST Store <br />
    Customer Support Team
</p>
    
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
};

export const orderConfirmationEmail = async (user, result) => {
  const { email, fName, lName } = user;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Footwears" <${process.env.SMTP_USER}>`, // sender address
    to: email, // list of receivers
    subject: "Order received ✔", // Subject line
    text: `Dear ${fName} ${lName}. We have received your order.
    Your Order ID is : ${result._id}`,
    html: `
    <p>
    Dear ${fName}.${lName}
</p>
<p>
We have  received your order.
</p>
<br />
<br />
<p>
Your Order ID is : ${result._id}
</p>
<br />
<br />

<p>
    Regareds, <br />
    EST Store <br />
    Customer Support Team
</p>`,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

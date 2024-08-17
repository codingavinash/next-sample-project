import User from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {

    const hassedToken = await bcryptjs.hash(userId.toString(),10)

    if(emailType === "VERIFY"){
      await User.findByIdAndUpdate(userId,
        {
          verifyToken: hassedToken,
          verifyTokenExpirey: Date.now() + 3600000,
        }
      )
    }
    else if(emailType === "RESET"){
      await User.findByIdAndUpdate(userId,
        {
          forgotPasswordToken: hassedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        }
      )
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "6514e7396aa633",
        pass: "2b77570d127b1c"
      }
    });

    const mailOption = {
      from: 'vishwakarmaavinash299@gmail.com',
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click<a href ="${process.env.DOMAIN}/verifyemail?token=${hassedToken}">here</a> to ${emailType === "VERIFY"? "Verify your email": "Reset your password"}
      or copy and paste the link below in your browser.
      <br>
      ${process.env.DOMAIN}/verifyemail?token=${hassedToken}
      </p>`, 
    };
    const mailResponse = await transport.sendMail(mailOption)
    return mailResponse
  } catch (error:any) {
    throw new Error(error.message)
  }
};

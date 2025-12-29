import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {prisma} from "./prisma";
import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USERNAME!,
        pass: process.env.APP_PASSWORD!,
    },
});


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins:[process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {type: "string", defaultValue: "user", required: false},
            phone: {type: "string", required: false},
            status: {type: "string", defaultValue: "active", required: false},
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn:false,
        requireEmailVerification:true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendVerificationEmail: async ( { user, url, token }, request) => {
           try {
               const verificationUrl =`${process.env.APP_URL!}/verify-email?token=${ token}`
               const info = await transporter.sendMail({
                   from: '"Prisma Blog" <prismablog@gmail.com>',
                   to: user.email,
                   subject: "Verify Your Email Address",
                   text: "Hello world?",
                   html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        body {
            background-color: #f6f9fc;
            padding: 20px;
            color: #333;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .header p {
            opacity: 0.9;
            font-size: 16px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            margin-bottom: 24px;
            color: #333;
        }
        
        .instructions {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            margin-bottom: 32px;
        }
        
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
        
        .link-container {
            margin-top: 24px;
            text-align: center;
        }
        
        .verification-link {
            font-size: 14px;
            color: #666;
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
            border: 1px solid #eaeaea;
        }
        
        .expiry-note {
            font-size: 14px;
            color: #e74c3c;
            text-align: center;
            margin: 24px 0;
            padding: 12px;
            background: #fee;
            border-radius: 6px;
            border-left: 4px solid #e74c3c;
        }
        
        .help-text {
            font-size: 14px;
            color: #777;
            line-height: 1.5;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #eee;
        }
        
        .footer {
            background: #f8f9fa;
            padding: 24px 30px;
            text-align: center;
            color: #777;
            font-size: 14px;
        }
        
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        @media (max-width: 480px) {
            .content, .header, .footer {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .verify-button {
                padding: 14px 28px;
                font-size: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">Prisma Blog</div>
            <h1>Verify Your Email Address</h1>
            <p>Welcome to our community!</p>
        </div>
        
        <div class="content">
            <p class="greeting">Hello ${user.name},</p>
            
            <p class="instructions">
                Thank you for signing up for Prisma Blog! To complete your registration and start exploring our content, please verify your email address by clicking the button below:
            </p>
            
            <div class="button-container">
                <a href="${verificationUrl}" class="verify-button">
                    Verify Email Address
                </a>
            </div>
            
            <p class="instructions">
                If the button above doesn't work, you can copy and paste the following link into your browser:
            </p>
            
            <div class="link-container">
                <div class="verification-link">
                    ${verificationUrl}
                </div>
            </div>
            
            <div class="expiry-note">
                ⏰ This verification link will expire in 24 hours for security reasons.
            </div>
            
            <div class="help-text">
                <p><strong>Need help?</strong> If you didn't create an account with us, please ignore this email. If you're having trouble verifying your email, please contact our support team at support@prismablog.com.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>© <%= new Date().getFullYear() %> Prisma Blog. All rights reserved.</p>
            <p>
                <a href="<%= process.env.APP_URL %>">Visit our website</a> | 
                <a href="#">Privacy Policy</a> | 
                <a href="#">Unsubscribe</a>
            </p>
            <p style="margin-top: 12px; font-size: 12px; color: #999;">
                This email was sent to <%= user.email %>
            </p>
        </div>
    </div>
</body>
</html>`
               });
           }
           catch (error) {
               console.log("Error sending verification email:", error);
           }

        },
    },
});
 export function  generateOtp(){
    return Math.floor(100000 + Math.random() * 900000).toString();
 }

 export function getOtpHtml(otp){
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 90%;
        }
        .logo {
            font-size: 32px;
            margin-bottom: 10px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 24px;
        }
        p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .otp-box {
            background-color: #e7f3ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            display: inline-block;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #0056b3;
            letter-spacing: 4px;
        }
        .note {
            font-size: 12px;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🔐</div>
        <h1>OTP Verification</h1>
        <p>Thank you for registering! Please use the code below to verify your email address.</p>
        
        <div class="otp-box">
            <span class="otp-code">${otp}</span>
        </div>
        
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you did not initiate this request, please ignore this email.</p>
        
        <div class="note">
            Sent by: Your Application Name
        </div>
    </div>
</body>
</html>
    `
 }

 
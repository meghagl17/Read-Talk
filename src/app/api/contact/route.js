// app/api/contact/route.js

import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, message } = await req.json(); // parse JSON data from request body

    // Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other email services
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ message: 'Email sent successfully' }), { status: 200 });
    
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({ message: 'Error sending email' }), { status: 500 });
  }
}

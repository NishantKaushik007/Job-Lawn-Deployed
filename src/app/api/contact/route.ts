import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // Extract subject, email, and message from the request body
    const { subject, email, message } = await request.json();

    // Basic input validation
    if (!subject || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a transporter object using SMTP
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465, // true for port 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options using subject instead of name
    const mailOptions = {
      from: `"Job Lawn Contact" <${process.env.SMTP_USER}>`,
      to: 'support@joblawn.com',
      subject: `New Contact Form Submission: ${subject}`,
      text: `You have a new contact form submission:\n\nSubject: ${subject}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p>You have a new contact form submission:</p>
             <p><strong>Subject:</strong> ${subject}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message}</p>`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending email:', error.message || error);
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}

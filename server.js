import express from 'express';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function getResendClient() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  const response = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  );
  
  const data = await response.json();
  const connectionSettings = data.items?.[0];

  if (!connectionSettings || !connectionSettings.settings.api_key) {
    throw new Error('Resend not connected');
  }
  
  return {
    client: new Resend(connectionSettings.settings.api_key),
    fromEmail: connectionSettings.settings.from_email
  };
}

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, service, address } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const { client, fromEmail } = await getResendClient();

    const emailContent = `
New lead from Turf Pro website:

Service Requested: ${service || 'Not specified'}
Address: ${address || 'Not provided'}
Name: ${name || 'Not provided'}
Email: ${email || 'Not provided'}
Phone: ${phone}
Message: ${message || 'No message provided'}

---
This lead was submitted through the Turf Pro Inc. website contact form.
    `.trim();

    const htmlContent = `
<h2>New Lead from Turf Pro Website</h2>
<table style="border-collapse: collapse; width: 100%; max-width: 600px;">
  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f0fdf4;">
    <td style="padding: 12px; font-weight: bold; color: #166534;">Service:</td>
    <td style="padding: 12px; color: #166534; font-weight: bold;">${service || 'Not specified'}</td>
  </tr>
  <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f0fdf4;">
    <td style="padding: 12px; font-weight: bold; color: #166534;">Address:</td>
    <td style="padding: 12px; color: #166534;">${address || 'Not provided'}</td>
  </tr>
  <tr style="border-bottom: 1px solid #e2e8f0;">
    <td style="padding: 12px; font-weight: bold; color: #475569;">Name:</td>
    <td style="padding: 12px; color: #1e293b;">${name || 'Not provided'}</td>
  </tr>
  <tr style="border-bottom: 1px solid #e2e8f0;">
    <td style="padding: 12px; font-weight: bold; color: #475569;">Email:</td>
    <td style="padding: 12px; color: #1e293b;">${email ? `<a href="mailto:${email}">${email}</a>` : 'Not provided'}</td>
  </tr>
  <tr style="border-bottom: 1px solid #e2e8f0;">
    <td style="padding: 12px; font-weight: bold; color: #475569;">Phone:</td>
    <td style="padding: 12px; color: #1e293b;"><a href="tel:${phone}">${phone}</a></td>
  </tr>
  <tr>
    <td style="padding: 12px; font-weight: bold; color: #475569; vertical-align: top;">Message:</td>
    <td style="padding: 12px; color: #1e293b;">${message || 'No message provided'}</td>
  </tr>
</table>
<hr style="margin-top: 24px; border: none; border-top: 1px solid #e2e8f0;">
<p style="color: #94a3b8; font-size: 12px;">This lead was submitted through the Turf Pro Inc. website contact form.</p>
    `.trim();

    await client.emails.send({
      from: fromEmail,
      to: ['frank.sturm@greenacelawncare.com', 'justin@aryocg.com'],
      subject: 'New Turf Pro Lead',
      text: emailContent,
      html: htmlContent
    });

    res.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again or call us directly.' });
  }
});

app.use(express.static(__dirname, {
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache');
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

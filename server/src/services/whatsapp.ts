import axios from 'axios';

const WHATSAPP_API_URL = 'https://graph.instagram.com/v18.0';

export const sendWhatsAppMessage = async (
  toNumber: string,
  name: string,
  email: string,
  subject: string,
  message: string
) => {
  const apiKey = process.env.WHATSAPP_API_KEY;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiKey || !phoneNumberId) {
    console.log('WhatsApp credentials not configured, skipping notification');
    return;
  }

  try {
    const messageText = `New enquiry from ${name}
Email: ${email}
Subject: ${subject}
Message: ${message.substring(0, 200)}${message.length > 200 ? '...' : ''}`;

    const response = await axios.post(
      `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toNumber,
        type: 'text',
        text: {
          preview_url: false,
          body: messageText,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('WhatsApp message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
};

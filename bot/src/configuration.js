module.exports.Configuration = {
  botframeworkAdapter:{
      appId: process.env.MICROSOFT_APP_ID,
      appPassword: process.env.MICROSOFT_APP_PASSWORD
  },
  twilioWhatsAppAdapter: {
      accountSid: process.env.TWILIO_ACCOUNT_SID, // Account SID
      authToken: process.env.TWILIO_AUTH_TOKEN, // Auth Token
      phoneNumber: process.env.TWILIO_PHONE_NUMBER, // The From parameter consisting of whatsapp: followed by the sending WhatsApp number (using E.164 formatting)
      endpointUrl: process.env.TWILIO_ENDPOINT_URL // Endpoint URL you configured in the sandbox, used for validation
      //Nota: el endpoint como es de ngrok, solo dura 8h.
    },
    bpm: { 
      bpmUsername: 'autogestion.bot', 
      bpmPassword: 'bpm', 
      processName: 'autogestion-domicilios'
    },
    apibpms: {
      host:  process.env.BPM_HOST || 'localhost',
      port:  process.env.BPM_PORT || 8080
    },
  defaultChannel: 'whatsapp' //botframework
  
};
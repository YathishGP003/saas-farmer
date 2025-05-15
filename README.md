# Farmer's Assistant App

A Next.js application that helps farmers with various tasks, including plant disease detection using GPT-4 Vision API.

## Features

### Plant Disease Detection

Upload an image of a diseased plant and get:
- Disease name
- Cure recommendations
- Prevention tips

The app uses OpenAI's GPT-4 Vision API to analyze plant images and provide detailed information.

### WhatsApp Bot Integration

Send plant images via WhatsApp and receive:
- Disease identification
- Cure recommendations
- Prevention measures
- Additional agricultural advice

The WhatsApp bot uses Twilio's API and OpenAI's GPT-4 Vision to analyze plant images and provide detailed responses.

## Getting Started

### Prerequisites

1. Node.js 18.x or higher
2. OpenAI API key with access to GPT-4 Vision
3. Twilio account (for WhatsApp integration)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:

```
OPENAI_API_KEY=your_openai_api_key_here
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

6. Navigate to [Plant Disease Detection](http://localhost:3000/plant-disease) to use the plant disease analysis feature.
7. Navigate to [WhatsApp Bot Setup](http://localhost:3000/whatsapp-bot) to set up the WhatsApp integration.

## How to Use Plant Disease Detection

1. Click on the "Plant Disease Detection" card on the homepage
2. Upload an image of a plant showing disease symptoms
3. Click the "Analyze Plant Disease" button
4. View the results that include disease name, cure recommendations, and prevention tips

## How to Set Up WhatsApp Bot

1. Create a Twilio account at [twilio.com](https://www.twilio.com/try-twilio)
2. Set up WhatsApp Sandbox in the Twilio console
3. Configure your webhook URL to point to your application's `/api/whatsapp` endpoint
4. Set the required environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
5. Send messages to your WhatsApp Sandbox number to test the bot
   - Send "help" to get information about the bot
   - Send an image of a plant to get disease analysis

## Technologies Used

- Next.js 15
- React 19
- OpenAI GPT-4 Vision API
- Twilio API for WhatsApp
- TailwindCSS

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs/guides/vision)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## License

MIT

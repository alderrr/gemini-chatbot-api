# GeminiBot - AI Chatbot using Google Gemini API

GeminiBot is a lightweight, responsive AI chatbot interface that connects to Google's Gemini Generative AI via the Gemini 1.5 Flash model. It features theme toggling, clean user input handling, markdown rendering, and smooth scrollable chat history.

## Features

- Responsive and modern UI using HTML, CSS, and JavaScript
- Chat interaction with Google's Gemini 1.5 Flash API
- Dark and Light mode toggle with persistent user preference
- Typing indicator for improved UX
- Markdown rendering of bot responses
- Smooth scroll and adaptive layout
- Secure API key usage via environment variables

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- AI Integration: `@google/generative-ai` (Gemini 1.5 Flash)

## Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/alderrr/gemini-chatbot-api.git
cd gemini-chatbot-api/1.5-gemini-flash
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
GOOGLE_API_KEY=your_google_api_key_here
PORT=3000
```

### 4. Start the Server

```
node index.js
```

The server will start on `http://localhost:3000`.

## Project Structure

```
/public
  ├── index.html       # Main UI
  ├── style.css        # Styling with dark/light mode
  ├── script.js        # Frontend logic and chat handling
index.js               # Express server and Gemini API interaction
.env                   # Environment variables (not committed)
```

## API Endpoint

**POST** `/api/chat`

Request Body:
```json
{
  "message": "Your message here"
}
```

Response:
```json
{
  "reply": "AI-generated response"
}
```

## License

This project is licensed under the MIT License.
import { Elysia, t } from 'elysia'
import { staticPlugin } from '@elysiajs/static'
import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const app = new Elysia()
  .use(staticPlugin({
    assets: './public',
    prefix: ''
  }))
  .get('/', ({ set }) => {
    set.headers['Content-Type'] = 'text/html'
    return Bun.file('./public/index.html')  
  })
  .post('/api/chat', async ({ body }) => {
  try {
    const { messages } = body as { messages: ChatMessage[] };
    
    // Create or continue chat session
    const chat = ai.chats.create({
      model: 'gemini-2.0-flash',
      history: messages
    });

    // Get last user message
    const lastMessage = messages[messages.length - 1].parts[0].text;
    
    // Send to Gemini
    const response = await chat.sendMessage({
      message: lastMessage
    });

    return {
      response: response.text,
      history: [
        ...messages,
        {
          role: 'user',
          parts: [{ text: lastMessage }]
        },
        {
          role: 'model',
          parts: [{ text: response.text }]
        }
      ]
    }
  } catch (error) {
    console.error('Chat error:', error);
    return new Response('Chat error', { status: 500 });
  }
}).listen(3000)

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`)


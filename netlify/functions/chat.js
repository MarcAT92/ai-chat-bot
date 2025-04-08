const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async function(event, context) {
  try {
    // Initialize the API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // Parse the request body
    const body = JSON.parse(event.body);
    const { messages } = body;
    
    // Generate a response
    const result = await model.generateContent(messages[0].parts[0].text);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ response: result.response.text() })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request' })
    };
  }
};
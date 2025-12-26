const { HfInference } = require('@huggingface/inference');

// Initialize HuggingFace client
const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

// Prompt template for generating personalized birthday messages
const PROMPT_TEMPLATE = `You are a friendly birthday invitation generator. Create a warm, personalized birthday message based on the following information:

- Name: {name}
- Relationship to Harsh: {relation}
- Availability for 18th January: {availability}

Generate a heartfelt message that:
1. Addresses the person by name
2. Acknowledges their relationship with Harsh
3. Responds appropriately to their availability
4. Expresses excitement about celebrating together
5. Includes emojis to make it festive
6. Is around 50-80 words long

Message:`;

// Handler for the serverless function
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse request body
    const { name, relation, availability } = req.body;
    
    // Validate input
    if (!name || !relation || !availability) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, relation, availability' 
      });
    }
    
    // Create prompt
    const prompt = PROMPT_TEMPLATE
      .replace('{name}', name)
      .replace('{relation}', relation)
      .replace('{availability}', availability);
    
    // Generate message using HuggingFace API
    const response = await hf.textGeneration({
      model: 'google/flan-t5-base',
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.8,
        top_p: 0.9,
        do_sample: true
      }
    });
    
    // Extract and clean the generated message
    let generatedMessage = response.generated_text.trim();
    
    // Remove the prompt part if it's included in the response
    if (generatedMessage.includes('Message:')) {
      generatedMessage = generatedMessage.split('Message:')[1].trim();
    }
    
    // If the message is too short or empty, use a fallback
    if (generatedMessage.length < 20) {
      generatedMessage = generateFallbackMessage(name, relation, availability);
    }
    
    // Return the personalized message
    return res.status(200).json({ 
      message: generatedMessage,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating message:', error);
    
    // Fallback message in case of API failure
    const fallbackMessage = generateFallbackMessage(
      req.body.name || 'Friend',
      req.body.relation || 'special person',
      req.body.availability || 'excited'
    );
    
    return res.status(200).json({ 
      message: fallbackMessage,
      timestamp: new Date().toISOString(),
      note: 'Using fallback message due to API error'
    });
  }
};

// Fallback message generator
function generateFallbackMessage(name, relation, availability) {
  const messages = {
    yes: `Hey ${name}! As my ${relation}, your presence would make my birthday absolutely special! 🎉 I'm so excited to celebrate with you on 18th January. Get ready for lots of fun, cake, and amazing memories! 🎂✨`,
    no: `Hey ${name} 😢 I understand things come up, but I'll really miss having my ${relation} there to celebrate with me. Hope you can join us next time! The party starts at 7 PM on 18th January.`,
    maybe: `Hey ${name}! 🤔 A maybe from my ${relation} has me on the edge of my seat! I'm really hoping you can make it to celebrate with me on 18th January at 7 PM. Let me know your final decision soon! 🎂`
  };
  
  return messages[availability] || 
    `Hey ${name}! Your presence would make my birthday special as my ${relation}. Looking forward to celebrating with you on 18th January! 🎂🎉`;
}

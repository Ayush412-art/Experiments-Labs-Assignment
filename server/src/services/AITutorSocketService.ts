import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

interface AITutorMessage {
  text: string;
  userId?: string;
  goalId?: string;
  currentWeek?: string;
  messageType?: 'question' | 'theory' | 'practice' | 'example';
  timestamp: string;
  sessionId: string;
}

interface AIResponse {
  id: string;
  text: string;
  type: 'text' | 'theory' | 'example' | 'practice';
  data?: any;
  timestamp: string;
}

class AITutorSocketService {
  private io: SocketIOServer;
  private connectedSessions: Map<string, any> = new Map();
  private genAi: GoogleGenerativeAI;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
        credentials: true
      }
    });

   
    const GEMINI_API_KEY = "AIzaSyCWriA3yAc7cNCU1eAZkv4qJr0Uk2qvrZc";
    this.genAi = new GoogleGenerativeAI(GEMINI_API_KEY);

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

0
      socket.on('userMessage', (message: AITutorMessage) => {
        this.handleAITutorMessage(socket, message);
      });

      
      socket.on('user_typing', (data: { isTyping: boolean; sessionId: string }) => {
        this.handleTypingIndicator(socket, data);
      });

      
      socket.on('request_help', (data: { topic: string; helpType: string; sessionId: string; timestamp: string }) => {
        this.handleHelpRequest(socket, data);
      });

      socket.on('disconnect', (reason) => {
        console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
        this.cleanupSession(socket.id);
      });

  
      socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  private async handleAITutorMessage(socket: any, message: AITutorMessage): Promise<void> {
    try {
      console.log('Received AI tutor message:', message);

      this.connectedSessions.set(socket.id, {
        sessionId: message.sessionId,
        goalId: message.goalId,
        currentWeek: message.currentWeek,
        lastActivity: new Date()
      });

      
      socket.emit('ai_typing', true);

      
      const response = await this.generateGeminiResponse(message);

      
      socket.emit('ai_tutor_response', response);

    
      socket.emit('ai_typing', false);

    } catch (error) {
      console.error('Error handling AI tutor message:', error);
   
      const errorResponse: AIResponse = {
        id: Date.now().toString(),
        text: "I'm sorry, I encountered an error processing your message. Please try again.",
        type: 'text',
        timestamp: new Date().toISOString()
      };

      socket.emit('ai_tutor_response', errorResponse);
      socket.emit('ai_typing', false);
    }
  }

  private async handleTypingIndicator(socket: any, data: { isTyping: boolean; sessionId: string }): Promise<void> {
    
    socket.emit('ai_typing', data.isTyping);
  }

  private async handleHelpRequest(socket: any, data: { topic: string; helpType: string; sessionId: string; timestamp: string }): Promise<void> {
    try {
      console.log('Received help request:', data);

  
      socket.emit('ai_typing', true);

      
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

     
      const response = await this.generateHelpResponse(data.topic, data.helpType as 'theory' | 'practice' | 'example');

      socket.emit('ai_tutor_response', response);

      socket.emit('ai_typing', false);

    } catch (error) {
      console.error('Error handling help request:', error);
      socket.emit('ai_typing', false);
    }
  }

  private async generateAIResponse(message: AITutorMessage): Promise<AIResponse> {
    const lowerText = message.text.toLowerCase();
    
    // Determine response type based on message content
    let responseType: 'text' | 'theory' | 'example' | 'practice' = 'text';
    let responseData: any = null;

    if (lowerText.includes('explain') || lowerText.includes('theory') || lowerText.includes('what is')) {
      responseType = 'theory';
      responseData = this.generateTheoryResponse(message.currentWeek || 'current topic');
    } else if (lowerText.includes('practice') || lowerText.includes('exercise') || lowerText.includes('problem')) {
      responseType = 'practice';
      responseData = this.generatePracticeResponse(message.currentWeek || 'current topic');
    } else if (lowerText.includes('example') || lowerText.includes('show me') || lowerText.includes('demonstrate')) {
      responseType = 'example';
      responseData = this.generateExampleResponse(message.currentWeek || 'current topic');
    }

    return {
      id: Date.now().toString(),
      text: this.generateResponseText(message.text, message.currentWeek || 'current topic', responseType),
      type: responseType,
      data: responseData,
      timestamp: new Date().toISOString()
    };
  }

  private async generateHelpResponse(topic: string, helpType: 'theory' | 'practice' | 'example'): Promise<AIResponse> {
    try {
      // Use Gemini for help responses
      const prompt = this.createHelpPrompt(topic, helpType);
      const geminiResponse = await this.callGeminiAPI(prompt);
      
      return {
        id: Date.now().toString(),
        text: geminiResponse.text,
        type: helpType,
        data: geminiResponse.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating help response:', error);
      // Fallback to static response
      return this.generateFallbackHelpResponse(topic, helpType);
    }
  }

  // New Gemini-powered response generation
  private async generateGeminiResponse(message: AITutorMessage): Promise<AIResponse> {
    try {
      const prompt = this.createContextualPrompt(message);
      const geminiResponse = await this.callGeminiAPI(prompt);
      
      return {
        id: Date.now().toString(),
        text: geminiResponse.text,
        type: geminiResponse.type,
        data: geminiResponse.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating Gemini response:', error);
      return this.generateFallbackResponse(message);
    }
  }

  private createContextualPrompt(message: AITutorMessage): string {
    const lowerText = message.text.toLowerCase();
    const currentWeek = message.currentWeek || 'current learning topic';
    
    let promptType = 'general';
    if (lowerText.includes('explain') || lowerText.includes('theory') || lowerText.includes('what is')) {
      promptType = 'theory';
    } else if (lowerText.includes('practice') || lowerText.includes('exercise') || lowerText.includes('problem')) {
      promptType = 'practice';
    } else if (lowerText.includes('example') || lowerText.includes('show me') || lowerText.includes('demonstrate')) {
      promptType = 'example';
    }

    const basePrompt = `You are an AI tutor helping a student with their learning journey. 
The student is currently working on: "${currentWeek}"
Student's question: "${message.text}"

Please provide a helpful, educational response.`;

    switch (promptType) {
      case 'theory':
        return `${basePrompt}

Please explain the theory behind ${currentWeek} in a clear, structured way. Include:
1. Key concepts and definitions
2. Important principles
3. How it relates to their overall learning goal
4. Practical applications

Format your response as JSON:
{
  "text": "Brief explanation text",
  "type": "theory",
  "data": {
    "keyPoints": ["point1", "point2", "point3"],
    "examples": ["example1", "example2"],
    "explanation": "Detailed explanation"
  }
}`;

      case 'practice':
        return `${basePrompt}

Please provide a practice problem related to ${currentWeek}. Include:
1. A clear, actionable problem statement
2. Difficulty level (beginner/intermediate/advanced)
3. Helpful hints for solving it
4. Learning objectives

Format your response as JSON:
{
  "text": "Practice problem introduction",
  "type": "practice", 
  "data": {
    "problem": "The practice problem statement",
    "difficulty": "beginner/intermediate/advanced",
    "hints": ["hint1", "hint2", "hint3"],
    "solution": "Solution will be provided after attempt"
  }
}`;

      case 'example':
        return `${basePrompt}

Please provide a practical example related to ${currentWeek}. Include:
1. A real-world scenario
2. Code example (if applicable)
3. Step-by-step explanation
4. How it applies to their learning goal

Format your response as JSON:
{
  "text": "Example introduction",
  "type": "example",
  "data": {
    "example": "Real-world scenario description",
    "code": "Code example if applicable",
    "explanation": "Step-by-step explanation"
  }
}`;

      default:
        return `${basePrompt}

Please provide a helpful response that guides the student in their learning. Be encouraging and educational.

Format your response as JSON:
{
  "text": "Your helpful response",
  "type": "text",
  "data": null
}`;
    }
  }

  private createHelpPrompt(topic: string, helpType: 'theory' | 'practice' | 'example'): string {
    const basePrompt = `You are an AI tutor. The student needs help with ${helpType} for the topic: "${topic}".

Please provide comprehensive ${helpType} content.`;

    switch (helpType) {
      case 'theory':
        return `${basePrompt}

Explain the theory clearly with:
1. Key concepts
2. Important principles  
3. Practical applications
4. Learning objectives

Format as JSON:
{
  "text": "Theory explanation",
  "type": "theory",
  "data": {
    "keyPoints": ["concept1", "concept2"],
    "examples": ["example1", "example2"],
    "explanation": "Detailed explanation"
  }
}`;

      case 'practice':
        return `${basePrompt}

Create a practice problem with:
1. Clear problem statement
2. Appropriate difficulty
3. Helpful hints
4. Learning goals

Format as JSON:
{
  "text": "Practice introduction",
  "type": "practice",
  "data": {
    "problem": "Problem statement",
    "difficulty": "beginner/intermediate/advanced", 
    "hints": ["hint1", "hint2"],
    "solution": "Solution guidance"
  }
}`;

      case 'example':
        return `${basePrompt}

Provide a practical example with:
1. Real-world scenario
2. Code example (if applicable)
3. Step-by-step walkthrough
4. Key takeaways

Format as JSON:
{
  "text": "Example introduction",
  "type": "example",
  "data": {
    "example": "Scenario description",
    "code": "Code example",
    "explanation": "Detailed explanation"
  }
}`;

      default:
        return basePrompt;
    }
  }

  private async callGeminiAPI(prompt: string): Promise<any> {
    try {
      const geminiModel = this.genAi.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const result = await geminiModel.generateContent(prompt);
      const response = result.response.text().replace(/```json|```/g, "").trim();

      // Parse JSON response
      const parsed = JSON.parse(response);
      return parsed;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  // Fallback methods for when Gemini fails
  private generateFallbackResponse(message: AITutorMessage): AIResponse {
    const lowerText = message.text.toLowerCase();
    const currentWeek = message.currentWeek || 'current topic';
    
    let responseType: 'text' | 'theory' | 'example' | 'practice' = 'text';
    let responseData: any = null;

    if (lowerText.includes('explain') || lowerText.includes('theory') || lowerText.includes('what is')) {
      responseType = 'theory';
      responseData = this.generateTheoryResponse(currentWeek);
    } else if (lowerText.includes('practice') || lowerText.includes('exercise') || lowerText.includes('problem')) {
      responseType = 'practice';
      responseData = this.generatePracticeResponse(currentWeek);
    } else if (lowerText.includes('example') || lowerText.includes('show me') || lowerText.includes('demonstrate')) {
      responseType = 'example';
      responseData = this.generateExampleResponse(currentWeek);
    }

    return {
      id: Date.now().toString(),
      text: this.generateResponseText(message.text, currentWeek, responseType),
      type: responseType,
      data: responseData,
      timestamp: new Date().toISOString()
    };
  }

  private generateFallbackHelpResponse(topic: string, helpType: 'theory' | 'practice' | 'example'): AIResponse {
    let responseData: any = null;
    let responseText = '';

    switch (helpType) {
      case 'theory':
        responseData = this.generateTheoryResponse(topic);
        responseText = `Let me explain the theory behind ${topic}:`;
        break;
      case 'practice':
        responseData = this.generatePracticeResponse(topic);
        responseText = `Here's a practice problem for ${topic}:`;
        break;
      case 'example':
        responseData = this.generateExampleResponse(topic);
        responseText = `Here's an example related to ${topic}:`;
        break;
    }

    return {
      id: Date.now().toString(),
      text: responseText,
      type: helpType,
      data: responseData,
      timestamp: new Date().toISOString()
    };
  }

  private generateResponseText(userMessage: string, currentWeek: string, responseType: string): string {
    const responses = {
      theory: `I understand you're asking about "${userMessage}". Let me explain the theory behind ${currentWeek}.`,
      practice: `Great question! Here's a practice problem tailored to ${currentWeek} that will help you understand the concepts better.`,
      example: `Perfect! Let me show you a practical example related to ${currentWeek} that demonstrates these concepts in action.`,
      text: `I understand you're asking about "${userMessage}". Based on your current progress in "${currentWeek}", I can help you with theory explanations, practice problems, or personalized examples. What would you like to focus on?`
    };

    return responses[responseType as keyof typeof responses] || responses.text;
  }

  private generateTheoryResponse(topic: string): any {
    const theoryData: { [key: string]: any } = {
      'Python Fundamentals': {
        explanation: 'Python is a high-level, interpreted programming language known for its simplicity and readability.',
        keyPoints: [
          'Variables and data types (int, float, string, boolean)',
          'Control flow (if/else, loops)',
          'Functions and scope',
          'Object-oriented programming concepts',
          'Error handling with try/except'
        ],
        examples: [
          'Creating a simple calculator',
          'Building a to-do list application',
          'Implementing a basic game'
        ]
      },
      'Backend Basics': {
        explanation: 'Backend development involves server-side programming that handles data processing and business logic.',
        keyPoints: [
          'RESTful API design principles',
          'HTTP methods (GET, POST, PUT, DELETE)',
          'Database design and relationships',
          'Authentication and authorization'
        ],
        examples: [
          'Creating a user registration API',
          'Building a blog post system',
          'Implementing authentication middleware'
        ]
      }
    };

    return theoryData[topic] || {
      explanation: 'This topic covers important concepts that will help you build a strong foundation.',
      keyPoints: ['Key concepts will be covered in this module'],
      examples: ['Practical examples will be provided']
    };
  }

  private generatePracticeResponse(topic: string): any {
    const practiceData: { [key: string]: any } = {
      'Python Fundamentals': {
        problem: 'Create a Python function that takes a list of numbers and returns the sum of all even numbers. Include error handling for invalid inputs.',
        difficulty: 'beginner',
        hints: [
          'Use list comprehension to filter even numbers',
          'Implement try-except for error handling',
          'Test with different input types'
        ],
        solution: 'The solution will be provided after you attempt the problem.'
      },
      'Backend Basics': {
        problem: 'Design a REST API endpoint that allows users to create, read, update, and delete blog posts.',
        difficulty: 'intermediate',
        hints: [
          'Use proper HTTP methods for each operation',
          'Implement data validation',
          'Include proper error responses'
        ],
        solution: 'The solution will be provided after you attempt the problem.'
      }
    };

    return practiceData[topic] || {
      problem: 'Practice problems will be generated based on your current learning module.',
      difficulty: 'beginner',
      hints: ['Start by understanding the requirements', 'Break down the problem into smaller steps'],
      solution: 'The solution will be provided after you attempt the problem.'
    };
  }

  private generateExampleResponse(topic: string): any {
    const exampleData: { [key: string]: any } = {
      'Python Fundamentals': {
        example: 'This example demonstrates Python fundamentals in a real-world scenario.',
        code: `# Example: Simple function with error handling
def sum_even_numbers(numbers):
    try:
        return sum(num for num in numbers if num % 2 == 0)
    except TypeError:
        return "Invalid input: Please provide a list of numbers"`,
        explanation: 'This example shows how to handle errors gracefully in Python.'
      },
      'Backend Basics': {
        example: 'This example shows how to create a basic API endpoint.',
        code: `# Example: Flask API endpoint
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/posts', methods=['POST'])
def create_post():
    data = request.get_json()
    # Validate and save post
    return jsonify({"message": "Post created successfully"})`,
        explanation: 'This example demonstrates basic API endpoint creation.'
      }
    };

    return exampleData[topic] || {
      example: 'This example is tailored to your specific learning goal.',
      code: 'Code examples will be provided based on your current module.',
      explanation: 'This example demonstrates key concepts from your current topic.'
    };
  }

  private cleanupSession(socketId: string): void {
    this.connectedSessions.delete(socketId);
  }


  public getConnectedSessionsCount(): number {
    return this.connectedSessions.size;
  }

 
  public broadcastMessage(message: any): void {
    this.io.emit('broadcast_message', message);
  }
}

export default AITutorSocketService;

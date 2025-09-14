// import React, { useState, useRef, useEffect } from 'react';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'ai';
//   timestamp: Date;
//   type?: 'text' | 'theory' | 'example' | 'practice';
//   data?: any;
// }

// interface AITutorProps {
//   currentGoal?: {
//     title: string;
//     complexity: string;
//     roadmap: Array<{
//       week: number;
//       title: string;
//       description: string;
//       completed: boolean;
//       _id: string;
//     }>;
//   };
// }

// const AITutor: React.FC<AITutorProps> = ({ currentGoal }) => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: '1',
//       text: `Hello! I'm your AI Tutor. I can help you with your learning journey. I see you're working on "${currentGoal?.title || 'your goal'}". How can I assist you today?`,
//       sender: 'ai',
//       timestamp: new Date(),
//       type: 'text'
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [isVideoActive, setIsVideoActive] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Context-aware responses based on current learning module
//   const getContextualResponse = (userMessage: string): Message => {
//     const lowerMessage = userMessage.toLowerCase();
//     const currentWeek = currentGoal?.roadmap.find(week => !week.completed);
    
//     // Theory explanation
//     if (lowerMessage.includes('explain') || lowerMessage.includes('theory') || lowerMessage.includes('what is')) {
//       return {
//         id: Date.now().toString(),
//         text: `Let me explain the theory behind ${currentWeek?.title || 'your current topic'}:`,
//         sender: 'ai',
//         timestamp: new Date(),
//         type: 'theory',
//         data: {
//           topic: currentWeek?.title || 'Current Topic',
//           explanation: getTheoryExplanation(currentWeek?.title || ''),
//           keyPoints: getKeyPoints(currentWeek?.title || ''),
//           examples: getExamples(currentWeek?.title || '')
//         }
//       };
//     }

//     // Practice problems
//     if (lowerMessage.includes('practice') || lowerMessage.includes('exercise') || lowerMessage.includes('problem')) {
//       return {
//         id: Date.now().toString(),
//         text: `Here's a practice problem tailored to your current learning module:`,
//         sender: 'ai',
//         timestamp: new Date(),
//         type: 'practice',
//         data: {
//           problem: generatePracticeProblem(currentWeek?.title || ''),
//           difficulty: 'beginner',
//           hints: getHints(currentWeek?.title || ''),
//           solution: getSolution(currentWeek?.title || '')
//         }
//       };
//     }

//     // Personalized examples
//     if (lowerMessage.includes('example') || lowerMessage.includes('show me') || lowerMessage.includes('demonstrate')) {
//       return {
//         id: Date.now().toString(),
//         text: `Here's a personalized example based on your goal "${currentGoal?.title}":`,
//         sender: 'ai',
//         timestamp: new Date(),
//         type: 'example',
//         data: {
//           example: getPersonalizedExample(currentGoal?.title || '', currentWeek?.title || ''),
//           code: getCodeExample(currentWeek?.title || ''),
//           explanation: getExampleExplanation(currentWeek?.title || '')
//         }
//       };
//     }

//     // General help
//     return {
//       id: Date.now().toString(),
//       text: `I understand you're asking about "${userMessage}". Based on your current progress in "${currentWeek?.title || 'your learning path'}", I can help you with theory explanations, practice problems, or personalized examples. What would you like to focus on?`,
//       sender: 'ai',
//       timestamp: new Date(),
//       type: 'text'
//     };
//   };

//   // Theory explanation functions
//   const getTheoryExplanation = (topic: string): string => {
//     const explanations: { [key: string]: string } = {
//       'Python Fundamentals': 'Python is a high-level, interpreted programming language known for its simplicity and readability. It uses indentation to define code blocks and supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
//       'Backend Basics': 'Backend development involves server-side programming that handles data processing, business logic, and database interactions. It includes creating APIs, managing user authentication, and ensuring data security.',
//       'Frontend Fundamentals': 'Frontend development focuses on creating user interfaces using HTML for structure, CSS for styling, and JavaScript for interactivity. Modern frontend frameworks like React provide component-based architecture for scalable applications.',
//       'API Integration': 'API integration involves connecting frontend applications with backend services through RESTful APIs. This includes making HTTP requests, handling responses, and managing data flow between client and server.',
//       'Deployment': 'Deployment involves making your application accessible to users through web hosting platforms. This includes configuring servers, managing databases, setting up CI/CD pipelines, and ensuring application scalability.'
//     };
//     return explanations[topic] || 'This topic covers important concepts that will help you build a strong foundation in your learning journey.';
//   };

//   const getKeyPoints = (topic: string): string[] => {
//     const keyPoints: { [key: string]: string[] } = {
//       'Python Fundamentals': [
//         'Variables and data types (int, float, string, boolean)',
//         'Control flow (if/else, loops)',
//         'Functions and scope',
//         'Object-oriented programming concepts',
//         'Error handling with try/except'
//       ],
//       'Backend Basics': [
//         'RESTful API design principles',
//         'HTTP methods (GET, POST, PUT, DELETE)',
//         'Database design and relationships',
//         'Authentication and authorization',
//         'Data validation and sanitization'
//       ],
//       'Frontend Fundamentals': [
//         'HTML semantic structure',
//         'CSS layout and styling',
//         'JavaScript DOM manipulation',
//         'Event handling',
//         'Responsive design principles'
//       ]
//     };
//     return keyPoints[topic] || ['Key concepts will be covered in this module'];
//   };

//   const getExamples = (topic: string): string[] => {
//     const examples: { [key: string]: string[] } = {
//       'Python Fundamentals': [
//         'Creating a simple calculator',
//         'Building a to-do list application',
//         'Implementing a basic game',
//         'Working with file I/O'
//       ],
//       'Backend Basics': [
//         'Creating a user registration API',
//         'Building a blog post system',
//         'Implementing authentication middleware',
//         'Setting up database models'
//       ]
//     };
//     return examples[topic] || ['Practical examples will be provided'];
//   };

//   // Practice problem generation
//   const generatePracticeProblem = (topic: string): string => {
//     const problems: { [key: string]: string } = {
//       'Python Fundamentals': 'Create a Python function that takes a list of numbers and returns the sum of all even numbers. Include error handling for invalid inputs.',
//       'Backend Basics': 'Design a REST API endpoint that allows users to create, read, update, and delete blog posts. Include proper validation and error responses.',
//       'Frontend Fundamentals': 'Build a responsive navigation menu that collapses on mobile devices and includes smooth transitions.',
//       'API Integration': 'Create a frontend component that fetches user data from an API and displays it in a table with sorting and filtering capabilities.'
//     };
//     return problems[topic] || 'Practice problems will be generated based on your current learning module.';
//   };

//   const getHints = (topic: string): string[] => {
//     return [
//       'Start by understanding the requirements',
//       'Break down the problem into smaller steps',
//       'Test your solution with different inputs',
//       'Consider edge cases and error handling'
//     ];
//   };

//   const getSolution = (topic: string): string => {
//     return 'The solution will be provided after you attempt the problem. This helps reinforce learning through practice.';
//   };

//   // Personalized examples
//   const getPersonalizedExample = (goal: string, topic: string): string => {
//     if (goal.includes('Python Full Stack')) {
//       return `For your Python Full Stack Development goal, here's how ${topic} applies: You'll use Python fundamentals to build the backend API, then integrate it with a frontend framework to create a complete web application.`;
//     }
//     return `This example is tailored to your specific learning goal and current module.`;
//   };

//   const getCodeExample = (topic: string): string => {
//     const codeExamples: { [key: string]: string } = {
//       'Python Fundamentals': `# Example: Simple function with error handling
// def sum_even_numbers(numbers):
//     try:
//         return sum(num for num in numbers if num % 2 == 0)
//     except TypeError:
//         return "Invalid input: Please provide a list of numbers"`,
//       'Backend Basics': `# Example: Flask API endpoint
// from flask import Flask, request, jsonify

// app = Flask(__name__)

// @app.route('/api/posts', methods=['POST'])
// def create_post():
//     data = request.get_json()
//     # Validate and save post
//     return jsonify({"message": "Post created successfully"})`
//     };
//     return codeExamples[topic] || 'Code examples will be provided based on your current module.';
//   };

//   const getExampleExplanation = (topic: string): string => {
//     return `This example demonstrates key concepts from ${topic} and shows how they apply to real-world development scenarios.`;
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: inputText,
//       sender: 'user',
//       timestamp: new Date(),
//       type: 'text'
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputText('');
//     setIsTyping(true);

//     // Simulate AI thinking time
//     setTimeout(() => {
//       const aiResponse = getContextualResponse(inputText);
//       setMessages(prev => [...prev, aiResponse]);
//       setIsTyping(false);
//     }, 1000 + Math.random() * 2000);
//   };
    
//   return (
//     <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <div className="relative">
//             <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                 <img src='/assets/voice.png' alt='ai-avtar'></img>
//               </div>
//             </div>
//             {isVideoActive && (
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
//             )}
//           </div>
//           <div>
//             <h3 className="font-semibold">AI Tutor</h3>
//             <p className="text-xs opacity-90">Learning Assistant</p>
//           </div>
//         </div>
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setIsVideoActive(!isVideoActive)}
//             className={`p-2 rounded-full transition-colors ${
//               isVideoActive ? 'bg-green-500' : 'bg-white bg-opacity-20'
//             }`}
//             title={isVideoActive ? 'Disable Video' : 'Enable Video'}
//           >
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
//             </svg>
//           </button>
//         </div>
//       </div>

      
//       {isVideoActive && (
//         <div className="bg-gray-100 p-4 border-b border-gray-200">
//           <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg h-32 flex items-center justify-center">
//             <div className="text-center text-white">
//               <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-2 flex items-center justify-center">
//                 <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <p className="text-sm font-medium">AI Avatar</p>
//               <p className="text-xs opacity-90">Video simulation active</p>
//             </div>
//           </div>
//         </div>
//       )}

     
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div
//               className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                 message.sender === 'user'
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-100 text-gray-800'
//               }`}
//             >
//               <p className="text-sm">{message.text}</p>
              
//               {/* Enhanced message types */}
//               {message.type === 'theory' && message.data && (
//                 <div className="mt-3 space-y-2">
//                   <div className="bg-white bg-opacity-20 p-3 rounded">
//                     <h4 className="font-semibold text-sm mb-2">Key Points:</h4>
//                     <ul className="text-xs space-y-1">
//                       {message.data.keyPoints.map((point: string, index: number) => (
//                         <li key={index}>• {point}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               )}

//               {message.type === 'practice' && message.data && (
//                 <div className="mt-3 space-y-2">
//                   <div className="bg-white bg-opacity-20 p-3 rounded">
//                     <h4 className="font-semibold text-sm mb-2">Practice Problem:</h4>
//                     <p className="text-xs mb-2">{message.data.problem}</p>
//                     <div className="text-xs">
//                       <p className="font-medium">Hints:</p>
//                       <ul className="space-y-1">
//                         {message.data.hints.map((hint: string, index: number) => (
//                           <li key={index}>• {hint}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {message.type === 'example' && message.data && (
//                 <div className="mt-3 space-y-2">
//                   <div className="bg-white bg-opacity-20 p-3 rounded">
//                     <h4 className="font-semibold text-sm mb-2">Code Example:</h4>
//                     <pre className="text-xs bg-black bg-opacity-20 p-2 rounded overflow-x-auto">
//                       <code>{message.data.code}</code>
//                     </pre>
//                   </div>
//                 </div>
//               )}

//               <p className="text-xs opacity-70 mt-1">
//                 {message.timestamp.toLocaleTimeString()}
//               </p>
//             </div>
//           </div>
//         ))}

//         {isTyping && (
//           <div className="flex justify-start">
//             <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
//               <div className="flex space-x-1">
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="p-4 border-t border-gray-200">
//         <div className="flex space-x-2">
//           <input
//             type="text"
//             value={inputText}
//             onChange={(e) => setInputText(e.target.value)}
//             onKeyUp={(e) => {
//               if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//               }
//             }}
//             placeholder="Ask me anything about your learning..."
//             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//           />
//           <button
//             onClick={handleSendMessage}
//             disabled={!inputText.trim()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//           >
//             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
//             </svg>
//           </button>
//         </div>
//         <div className="flex space-x-2 mt-2">
//           <button
//             onClick={() => setInputText('Explain the theory behind my current topic')}
//             className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
//           >
//             Theory
//           </button>
//           <button
//             onClick={() => setInputText('Give me a practice problem')}
//             className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
//           >
//             Practice
//           </button>
//           <button
//             onClick={() => setInputText('Show me an example')}
//             className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
//           >
//             Example
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AITutor;
// AI service utility for CareerCraft
// This provides centralized AI functionality for the application

interface AIResponse {
  content: string;
  suggestions?: string[];
  error?: string;
}

// Gemini API types
interface GeminiMessage {
  role: 'user' | 'model' | 'system';
  parts: Array<{text: string}>;
}

interface GeminiRequest {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{text: string}>;
    };
  }>;
}

// API key management - in a real app, this would be stored securely
// For demo purposes, we'll allow users to provide their API key
let geminiApiKey: string | null = localStorage.getItem('gemini_api_key');

export const setGeminiApiKey = (key: string): void => {
  geminiApiKey = key;
  localStorage.setItem('gemini_api_key', key);
  // Reset quota error flag when setting a new key
  localStorage.removeItem('gemini_api_quota_error');
};

export const hasGeminiApiKey = (): boolean => {
  return !!geminiApiKey;
};

export const clearGeminiApiKey = (): void => {
  geminiApiKey = null;
  localStorage.removeItem('gemini_api_key');
  localStorage.removeItem('gemini_api_quota_error');
};

// Helper function to check if error is a quota error
const isQuotaError = (response: Response, errorData: any): boolean => {
  return (
    response.status === 429 || 
    (errorData?.error?.status === "RESOURCE_EXHAUSTED") ||
    (errorData?.error?.message?.includes("quota"))
  );
};

// Helper function to call Gemini API
const callGeminiAPI = async (
  prompt: string,
  systemPrompt: string = "You are a helpful career assistant. Provide concise, accurate advice."
): Promise<string> => {
  if (!geminiApiKey) {
    throw new Error("Gemini API key not set");
  }

  const messages: GeminiMessage[] = [
    { 
      role: "system", 
      parts: [{ text: systemPrompt }]
    },
    { 
      role: "user", 
      parts: [{ text: prompt }]
    }
  ];
  
  const requestBody: GeminiRequest = {
    contents: messages,
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024
    }
  };
  
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" + geminiApiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      
      // Check if this is a quota error
      if (isQuotaError(response, errorData)) {
        localStorage.setItem('gemini_api_quota_error', 'true');
        throw new Error("Gemini API quota exceeded. Please check your API usage limits.");
      } else {
        throw new Error(`Gemini API error: ${response.status}`);
      }
    }
    
    // Clear any previous quota error if the call succeeds
    localStorage.removeItem('gemini_api_quota_error');
    
    const data = await response.json() as GeminiResponse;
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

/**
 * Process user input through AI to generate tailored responses
 */
export const generateAIResponse = async (
  prompt: string,
  context: string = "career"
): Promise<AIResponse> => {
  console.log(`Processing AI request with prompt: ${prompt} (context: ${context})`);
  
  try {
    // If Gemini API key is available, use it
    if (geminiApiKey) {
      let systemPrompt = "You are a helpful career assistant. Provide concise, professional advice.";
      let suggestions: string[] = [];
      
      // Customize system prompt based on context
      if (context === "resume") {
        systemPrompt = "You are a resume optimization expert. Provide actionable advice to improve resumes for ATS compatibility and professional presentation. Be specific and concise.";
        suggestions = [
          "How to add metrics to my resume",
          "Optimize my skills section",
          "Best format for work experience"
        ];
      } else if (context === "interview") {
        systemPrompt = "You are an interview preparation coach. Provide specific tactics and sample answers for job interviews. Be concise and practical.";
        suggestions = [
          "How to answer 'tell me about yourself'",
          "Handling salary negotiations",
          "Questions to ask interviewers"
        ];
      } else {
        // Default career context
        suggestions = [
          "Career path advice",
          "Skill development tips",
          "Industry trends"
        ];
      }
      
      try {
        const content = await callGeminiAPI(prompt, systemPrompt);
        return { content, suggestions };
      } catch (error: any) {
        console.error("Gemini API error:", error);
        
        // Check if we should fall back to mock responses
        if (error.message?.includes("quota") || localStorage.getItem('gemini_api_quota_error') === 'true') {
          console.log("Using fallback response due to API quota limits");
          // Fall through to mock responses below
        } else {
          throw error; // Re-throw if not a quota error
        }
      }
    } 
    
    // Fallback to mock responses if no API key or quota exceeded
    // Mock AI response based on context and prompt keywords
    if (context === "resume") {
      return {
        content: `Here are some suggestions for improving your resume based on industry standards:
        
1. Quantify your achievements with metrics
2. Use action verbs at the beginning of bullet points
3. Tailor your keywords to match the job description
4. Keep your resume to 1-2 pages in length
5. Use a clean, professional format`,
        suggestions: [
          "Add more quantifiable achievements",
          "Remove outdated experience",
          "Reorganize skills section"
        ]
      };
    } else if (context === "interview") {
      return {
        content: `Based on the job role you're targeting, be prepared to answer these questions:
        
1. Tell me about a time you faced a significant challenge in your previous role
2. How do you prioritize tasks when dealing with multiple deadlines?
3. What are your greatest professional strengths and weaknesses?
4. Where do you see yourself in five years?
5. Why are you interested in working for this company?`,
        suggestions: [
          "Practice the STAR method",
          "Research company values",
          "Prepare questions to ask"
        ]
      };
    } else {
      return {
        content: `Based on your profile, here are some career development recommendations:
        
1. Focus on developing technical skills in high-demand areas
2. Network with professionals in your target industry
3. Consider obtaining relevant certifications
4. Join professional organizations in your field
5. Create a portfolio showcasing your best work`,
        suggestions: [
          "Update LinkedIn profile",
          "Join industry webinars",
          "Find a mentor in your field"
        ]
      };
    }
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      content: "I apologize, but I encountered an error processing your request. Please try again.",
      error: "Failed to generate AI response"
    };
  }
};

/**
 * Generate personalized career path recommendations based on user profile
 */
export const generateCareerRecommendations = async (
  userProfile: any
): Promise<string[]> => {
  // Simulate processing user profile data
  console.log("Generating career recommendations for user profile:", userProfile);
  
  try {
    // If Gemini API key is available, use it
    if (geminiApiKey) {
      const prompt = `Based on the following user profile, suggest 5 suitable career paths that match their skills, interests and values. Only return the job titles as a comma separated list: ${JSON.stringify(userProfile)}`;
      const systemPrompt = "You are a career counselor specializing in job recommendations. Analyze user profiles and suggest appropriate career paths.";
      
      const result = await callGeminiAPI(prompt, systemPrompt);
      // Parse the response and return as an array
      return result.split(',').map(item => item.trim()).filter(item => item);
    }
    
    // Fallback to mock data
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock recommendations
    return [
      "Full Stack Developer",
      "UX/UI Designer",
      "Product Manager",
      "Data Scientist",
      "DevOps Engineer"
    ];
  } catch (error) {
    console.error("Error generating career recommendations:", error);
    // Return fallback recommendations in case of error
    return [
      "Software Developer",
      "Digital Marketing Specialist",
      "Business Analyst",
      "Project Manager",
      "Content Strategist"
    ];
  }
};

/**
 * Generate tailored interview questions for a specific job role
 */
export const generateInterviewQuestions = async (
  jobRole: string
): Promise<{question: string, tip: string}[]> => {
  console.log(`Generating interview questions for role: ${jobRole}`);
  
  try {
    // If Gemini API key is available, use it
    if (geminiApiKey) {
      const prompt = `Generate 5 interview questions with preparation tips for a ${jobRole} position. Format the response as JSON with an array of objects, each having 'question' and 'tip' properties.`;
      const systemPrompt = "You are an interview preparation expert. Create challenging but common interview questions with helpful preparation tips.";
      
      const result = await callGeminiAPI(prompt, systemPrompt);
      
      try {
        // Try to parse the response as JSON
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed) && parsed.length > 0 && 'question' in parsed[0] && 'tip' in parsed[0]) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse Gemini API response as JSON:", e);
        // Continue to fallback
      }
    }
    
    // Fallback to role-specific interview questions
    if (jobRole.toLowerCase().includes("developer") || jobRole.toLowerCase().includes("engineer")) {
      // ... keep existing code (developer questions fallback)
      return [
        {
          question: "Explain how you would design a scalable web application architecture.",
          tip: "Focus on microservices, load balancing, and database optimization strategies."
        },
        {
          question: "Describe a challenging bug you encountered and how you solved it.",
          tip: "Highlight your debugging process and problem-solving methodology."
        },
        {
          question: "How do you stay updated with the latest technologies and best practices?",
          tip: "Mention specific resources, communities, or learning methods you use."
        },
        {
          question: "Tell me about a time you had to refactor code to improve performance.",
          tip: "Quantify the performance improvement and explain your approach."
        },
        {
          question: "How do you ensure code quality and prevent regression bugs?",
          tip: "Discuss testing strategies, code reviews, and CI/CD practices."
        }
      ];
    } else if (jobRole.toLowerCase().includes("design")) {
      // ... keep existing code (designer questions fallback)
      return [
        {
          question: "Walk me through your design process from concept to implementation.",
          tip: "Emphasize user research, wireframing, prototyping, and iteration."
        },
        {
          question: "How do you gather and incorporate user feedback into your designs?",
          tip: "Discuss usability testing methods and how you prioritize changes."
        },
        {
          question: "Describe a design challenge you faced and how you overcame it.",
          tip: "Focus on the problem-solving aspects and business constraints you navigated."
        },
        {
          question: "How do you balance aesthetic choices with usability requirements?",
          tip: "Highlight your understanding of accessibility and inclusive design principles."
        },
        {
          question: "Tell me about a time when you had to defend a design decision to stakeholders.",
          tip: "Demonstrate your communication skills and ability to articulate design reasoning."
        }
      ];
    } else {
      // ... keep existing code (generic professional questions fallback)
      return [
        {
          question: "What interests you about this role and our company?",
          tip: "Show that you've researched the company and understand how your skills align."
        },
        {
          question: "Describe a time when you had to adapt to a significant change at work.",
          tip: "Highlight your flexibility and positive attitude toward change."
        },
        {
          question: "How do you handle working under pressure and tight deadlines?",
          tip: "Give a specific example showing your prioritization skills and calm approach."
        },
        {
          question: "Tell me about a time you collaborated with a difficult team member.",
          tip: "Focus on your communication and conflict resolution strategies."
        },
        {
          question: "Where do you see yourself professionally in 3-5 years?",
          tip: "Connect your career goals to the position and company growth."
        }
      ];
    }
  } catch (error) {
    console.error("Error generating interview questions:", error);
    // Return generic questions in case of error
    return [
      {
        question: "What are your greatest professional strengths?",
        tip: "Focus on strengths relevant to the position and provide specific examples."
      },
      {
        question: "Why are you interested in this role?",
        tip: "Research the company and role beforehand to give a targeted answer."
      },
      {
        question: "Describe a challenging situation at work and how you handled it.",
        tip: "Use the STAR method: Situation, Task, Action, Result."
      },
      {
        question: "Where do you see yourself in 5 years?",
        tip: "Show ambition while being realistic about career progression."
      },
      {
        question: "Do you have any questions for us?",
        tip: "Always prepare thoughtful questions that show your interest in the role."
      }
    ];
  }
};

/**
 * Analyze resume content and provide improvement recommendations
 */
export const analyzeResume = async (
  resumeContent: string
): Promise<{score: number, feedback: string[]}> => {
  console.log("Analyzing resume content:", resumeContent.substring(0, 50) + "...");
  
  try {
    // If Gemini API key is available, use it
    if (geminiApiKey) {
      const prompt = `
Analyze this resume content and provide:
1. An overall ATS optimization score from 0-100
2. A list of 5 specific improvement recommendations

Format your response as JSON with two fields:
- score: a number from 0-100
- feedback: an array of 5 string recommendations

Here's the resume to analyze:
${resumeContent}`;

      const systemPrompt = "You are a professional resume analyzer specializing in ATS optimization. Provide clear, specific feedback with actionable recommendations.";
      
      const result = await callGeminiAPI(prompt, systemPrompt);
      
      try {
        // Try to parse the response as JSON
        const parsed = JSON.parse(result);
        if ('score' in parsed && 'feedback' in parsed && Array.isArray(parsed.feedback)) {
          return {
            score: parsed.score,
            feedback: parsed.feedback
          };
        }
      } catch (e) {
        console.error("Failed to parse Gemini API response as JSON:", e);
        // Continue to fallback
      }
    }
    
    // Fallback to mock resume analysis
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock resume analysis response
    return {
      score: 78,
      feedback: [
        "Consider adding more quantifiable achievements",
        "Skills section could be expanded with relevant keywords",
        "Professional summary should be more concise and impactful",
        "Education section formatting needs improvement",
        "Add relevant certifications to strengthen credentials"
      ]
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return {
      score: 65,
      feedback: [
        "Error processing detailed analysis",
        "Make sure your resume uses industry keywords",
        "Ensure your resume is in a standard format",
        "Quantify your achievements where possible",
        "Keep formatting simple for ATS systems"
      ]
    };
  }
};

/**
 * Generate a personalized career roadmap based on current skills and target role
 */
export const generateCareerRoadmap = async (
  currentSkills: string[],
  targetRole: string
): Promise<{milestone: string, timeframe: string, skills: string[]}[]> => {
  console.log(`Generating career roadmap from current skills to ${targetRole}`);
  
  try {
    // If Gemini API key is available, use it
    if (geminiApiKey) {
      const prompt = `
Create a career development roadmap for someone with these skills: ${currentSkills.join(", ")}
who wants to become a ${targetRole}.

Format the response as JSON with this structure:
[
  {
    "milestone": "Milestone name",
    "timeframe": "Time period (e.g., 0-3 months)",
    "skills": ["Skill 1", "Skill 2", "Skill 3"]
  }
]

Include 5 milestones total, with the final milestone being the target role.
`;

      const systemPrompt = "You are a career development expert. Create practical, detailed roadmaps for career progression with realistic timelines.";
      
      const result = await callGeminiAPI(prompt, systemPrompt);
      
      try {
        // Try to parse the response as JSON
        const parsed = JSON.parse(result);
        if (Array.isArray(parsed) && parsed.length > 0 && 
            'milestone' in parsed[0] && 'timeframe' in parsed[0] && 'skills' in parsed[0]) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse Gemini API response as JSON:", e);
        // Continue to fallback
      }
    }
  
    // Return mock career roadmap as fallback
    return [
      {
        milestone: "Foundational Skills Development",
        timeframe: "0-3 months",
        skills: ["Core technologies", "Industry fundamentals", "Project management basics"]
      },
      {
        milestone: "Practical Application & Portfolio Building",
        timeframe: "3-6 months",
        skills: ["Personal projects", "Open source contributions", "Technical documentation"]
      },
      {
        milestone: "Entry-Level Position",
        timeframe: "6-12 months",
        skills: ["Team collaboration", "Version control", "Production environment experience"]
      },
      {
        milestone: "Specialized Skill Development",
        timeframe: "1-2 years",
        skills: ["Advanced techniques", "Leadership skills", "Cross-functional collaboration"]
      },
      {
        milestone: targetRole,
        timeframe: "2-3 years",
        skills: ["Strategic thinking", "Mentoring", "Industry best practices"]
      }
    ];
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    // Return simplified roadmap in case of error
    return [
      {
        milestone: "Skill Foundation",
        timeframe: "0-6 months",
        skills: ["Core skills", "Fundamental knowledge", "Basic tools"]
      },
      {
        milestone: "Practical Experience",
        timeframe: "6-12 months",
        skills: ["Applied learning", "Portfolio development", "Industry networking"]
      },
      {
        milestone: "Professional Growth",
        timeframe: "1-2 years",
        skills: ["Specialized techniques", "Team collaboration", "Project experience"]
      },
      {
        milestone: targetRole,
        timeframe: "2-3 years",
        skills: ["Advanced expertise", "Leadership", "Strategic thinking"]
      }
    ];
  }
};

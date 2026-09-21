export const DOMAINS = [
  {
    id: 'hotel',
    name: 'Hotel & Hospitality',
    icon: 'Hotel',
    tag: 'Hospitality / Concierge',
    color: '#10B981',
    description: 'Hotel reception, room reservations, guest concierge, dining service, and amenities.',
    defaultName: 'Grand Aurora Concierge',
    defaultRole: 'Front Desk Hospitality & Guest Services Specialist',
    welcomeGreeting: 'Welcome to Grand Aurora Luxury Hotel! I am your 24/7 Hotel Staff & Concierge Assistant. How may I assist your stay today?',
    discoveryQuestions: [
      'What are the standard check-in (3:00 PM) and check-out (11:00 AM) policies?',
      'Can I book a Deluxe Suite or request complimentary room upgrades?',
      'Can I reserve a table at the rooftop Aurora Sky Lounge restaurant for tonight?',
      'What complimentary breakfast options and dining hours are available?',
      'How do I schedule an airport luxury shuttle or valet parking?',
      'What spa treatments, heated pool hours, and wellness amenities are open?',
      'Can you arrange an early check-in, late check-out, or secure luggage storage?',
      'What are the top local attractions and curated city tour packages available nearby?'
    ],
    samplePrompts: [
      'What are the check-in and check-out times?',
      'Can I request a late check-out or airport shuttle?',
      'Recommend the chef special at your restaurant',
      'Book a deluxe suite for this weekend with breakfast'
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Tourism',
    icon: 'Plane',
    tag: 'Tours / Itineraries',
    color: '#3B82F6',
    description: 'Trip planning, flight & hotel booking guidance, sightseeing itineraries, and travel advice.',
    defaultName: 'VoyageAI Travel Agent',
    defaultRole: 'Global Itinerary Planner & Destination Specialist',
    welcomeGreeting: 'Hello traveler! I am your AI Travel Agent. Where are you planning your next adventure?',
    discoveryQuestions: [
      'Can you build a customized 5-day budget itinerary for Bali or Thailand?',
      'What are the best flight booking strategies and cheapest months to fly?',
      'Which boutique hotels or beach resorts offer the best ratings and private views?',
      'What are the visa-on-arrival, passport validity, and entry requirements for Japan/Europe?',
      'What is an estimated daily budget for backpacking vs luxury travel in Europe?',
      'What are the must-visit cultural sights, hidden gems, and local food spots in Paris?',
      'How do I get reliable eSIM cards, local transport passes, and currency exchange?'
    ],
    samplePrompts: [
      'Plan a 5-day budget trip itinerary for Bali',
      'What are top attractions to visit in Paris in 3 days?',
      'Compare direct flights and best hotel areas in Tokyo',
      'What visa requirements are needed for Japan?'
    ]
  },
  {
    id: 'study',
    name: 'Study & Education',
    icon: 'GraduationCap',
    tag: 'Academic / STEM',
    color: '#8B5CF6',
    description: 'Socratic tutoring, interactive problem-solving, homework help, and language learning.',
    defaultName: 'Socrates STEM Tutor',
    defaultRole: 'Interactive Educational Companion & STEM Tutor',
    welcomeGreeting: 'Hello! I am your AI Study & Education Tutor. I am here to guide you step-by-step through any subject or problem.',
    discoveryQuestions: [
      'What subject or topic are we studying today?',
      'Would you like a step-by-step concept breakdown or practice questions?',
      'Should we explain with real-world analogies or formulas?'
    ],
    samplePrompts: [
      'Explain Quantum Entanglement in simple terms',
      'Give me a calculus problem with hints',
      'Teach me French basics with phonetic pronunciation'
    ]
  },
  {
    id: 'code',
    name: 'Code Generation & Dev',
    icon: 'Code2',
    tag: 'Software Engineering',
    color: '#06B6D4',
    description: 'Full-stack development, code generation, bug fixing, refactoring, and system architecture.',
    defaultName: 'DevPulse Architect',
    defaultRole: 'Senior Full-Stack Software Engineer & Debugger',
    welcomeGreeting: 'Greetings! I am your AI Software Engineer. What codebase, API, or bug are we working on today?',
    discoveryQuestions: [
      'What programming language or framework are you using?',
      'Are we writing new code, fixing an error, or designing architecture?',
      'Do you need automated test cases and type annotations included?'
    ],
    samplePrompts: [
      'Write a clean React hook for real-time speech recognition',
      'Optimize this SQL database query with indexes',
      'Build a FastAPI backend with JWT authentication'
    ]
  },
  {
    id: 'medical',
    name: 'Medical & Healthcare',
    icon: 'Stethoscope',
    tag: 'Clinical / Health',
    color: '#EC4899',
    description: 'Clinical literature review, medical research synthesis, and pharmacology reference.',
    defaultName: 'Dr. Pulse AI',
    defaultRole: 'Clinical AI Consultant & Medical Literature Analyst',
    welcomeGreeting: 'Welcome! I am your Clinical AI Assistant. How can I assist with medical literature or study today?',
    discoveryQuestions: [
      'Are you researching clinical symptoms, drug interactions, or trial data?',
      'What medical specialty or disease condition are we focusing on?',
      'Would you like evidence-based literature citations included?'
    ],
    samplePrompts: [
      'Explain mechanism of action of ACE inhibitors',
      'Analyze differential diagnoses for acute chest pain',
      'Summarize latest cardiology guidelines'
    ]
  },
  {
    id: 'research',
    name: 'Research & Academia',
    icon: 'BookOpenCheck',
    tag: 'Papers / Science',
    color: '#F59E0B',
    description: 'ArXiv paper synthesis, literature review, citation extraction, and LaTeX derivations.',
    defaultName: 'PaperSage Scholar',
    defaultRole: 'Principal Academic Fellow & Literature Synthesizer',
    welcomeGreeting: 'Hello scholar! I am your Research Assistant. Let us synthesize papers and scientific data.',
    discoveryQuestions: [
      'Which research field or paper topic are we analyzing?',
      'Do you need an abstract summary, methodology breakdown, or citation extract?',
      'Should I format formulas in standard LaTeX?'
    ],
    samplePrompts: [
      'Compare Attention mechanisms in modern Transformers',
      'Synthesize key findings on solid-state battery tech',
      'Derive gradient descent optimization formulas'
    ]
  },
  {
    id: 'finance',
    name: 'Finance & Markets',
    icon: 'TrendingUp',
    tag: 'Financial Analysis',
    color: '#10B981',
    description: 'Market analysis, portfolio valuation models, macroeconomic trends, and budgeting.',
    defaultName: 'FinPulse Advisor',
    defaultRole: 'Chartered Financial Analyst & Market Strategist',
    welcomeGreeting: 'Hello! I am your Financial Analysis Agent. Let us review market indicators, valuation models, or budgets.',
    discoveryQuestions: [
      'Are we analyzing equities, crypto, balance sheets, or macro trends?',
      'Would you like a DCF valuation model or qualitative report?',
      'What is your target time horizon or risk tolerance?'
    ],
    samplePrompts: [
      'Perform a discounted cash flow (DCF) valuation breakdown',
      'Analyze the impact of interest rates on tech stocks',
      'Create a balanced asset allocation strategy'
    ]
  },
  {
    id: 'custom',
    name: 'Custom / Multi-Agent',
    icon: 'Cpu',
    tag: 'Bespoke AI',
    color: '#6366F1',
    description: 'Design a bespoke AI agent with tailored instructions for your custom requirements.',
    defaultName: 'Apex AI Assistant',
    defaultRole: 'Autonomous Multi-Domain Intelligent Assistant',
    welcomeGreeting: 'Hello! I am your custom configured AI Assistant. I am ready to help you with your tasks.',
    discoveryQuestions: [
      'What specific task or objective shall we tackle?',
      'Do you have guidelines or preferences I should follow?',
      'What format would you like my responses in?'
    ],
    samplePrompts: [
      'Brainstorm creative project ideas',
      'Help organize and summarize my notes',
      'Analyze data and provide structured insights'
    ]
  }
];

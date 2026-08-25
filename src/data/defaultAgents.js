export const DEFAULT_AGENTS = [
  {
    id: 'hotel-staff',
    name: 'Grand Aurora Hotel Concierge',
    role: 'Front Desk Hospitality & Guest Services Specialist',
    domain: 'hotel',
    avatar: '🏨',
    avatarBg: 'linear-gradient(135deg, #10B981, #059669)',
    voiceId: 'shimmer',
    voiceName: 'Shimmer (Female)',
    memorySaving: true,
    tools: {
      webSearch: true,
      codeInterpreter: false,
      imageGen: true,
      knowledgeSearch: true
    },
    welcomeGreeting: 'Welcome to Grand Aurora Luxury Hotel! I am your 24/7 Hotel Staff & Concierge Assistant. How may I ensure your stay is comfortable and seamless today?',
    discoveryQuestions: [
      'What are the standard check-in (3:00 PM) and check-out (11:00 AM) policies?',
      'Can I book a Deluxe Suite or request complimentary room upgrades?',
      'Can I reserve a table at the rooftop Aurora Sky Lounge restaurant for tonight?',
      'What complimentary breakfast options and dining hours are available?',
      'How do I schedule an airport luxury shuttle or valet parking?',
      'What spa treatments, heated pool hours, and wellness amenities are open?',
      'Can you arrange an early check-in, late check-out, or secure luggage storage?',
      'What are the top local attractions and curated city tour packages available nearby?',
      'What is your pet policy and child accommodation guideline?',
      'Can I get corporate invoice billing and high-speed executive lounge WiFi access?'
    ],
    samplePrompts: [
      'What are the check-in and check-out times?',
      'Book a deluxe king suite for this weekend with breakfast',
      'Reserve a romantic table for 2 at the rooftop lounge tonight at 8 PM',
      'Arrange an airport pickup from Terminal 2 tomorrow morning',
      'What are the spa timings and massage packages available today?'
    ]
  },
  {
    id: 'travel-agent',
    name: 'VoyageAI Global Travel Planner',
    role: 'Global Itinerary Planner & Destination Specialist',
    domain: 'travel',
    avatar: '✈️',
    avatarBg: 'linear-gradient(135deg, #3B82F6, #6366F1)',
    voiceId: 'nova',
    voiceName: 'Nova (Female)',
    memorySaving: true,
    tools: {
      webSearch: true,
      codeInterpreter: true,
      imageGen: true,
      knowledgeSearch: true
    },
    welcomeGreeting: 'Hello traveler! I am your AI Travel Agent. Where are you planning your next adventure? Tell me your dream destination or budget!',
    discoveryQuestions: [
      'Can you build a customized 5-day budget itinerary for Bali or Thailand?',
      'What are the best flight booking strategies and cheapest months to fly?',
      'Which boutique hotels or beach resorts offer the best ratings and private views?',
      'What are the visa-on-arrival, passport validity, and entry requirements for Japan/Europe?',
      'What is an estimated daily budget for backpacking vs luxury travel in Europe?',
      'What are the must-visit cultural sights, hidden gems, and local food spots in Paris?',
      'How do I get reliable eSIM cards, local transport passes, and currency exchange?',
      'Can you suggest family-friendly vacation packages with kid activities?',
      'What travel insurance coverage is essential for international trips?',
      'What packing checklist and weather forecast should I prepare for my travel dates?'
    ],
    samplePrompts: [
      'Plan a 5-day budget trip itinerary for Bali under $600',
      'What visa requirements and documents are needed for traveling to Japan?',
      'Recommend top 5 romantic destinations in Europe for an October honeymoon',
      'Compare direct flights vs layover options from New York to London',
      'Create a day-by-day food and sightseeing guide for Tokyo'
    ]
  },
  {
    id: 'socrates-tutor',
    name: 'Socrates STEM & Language Tutor',
    role: 'Interactive Socratic Academic Companion & Concept Master',
    domain: 'study',
    avatar: '🎓',
    avatarBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    voiceId: 'shimmer',
    voiceName: 'Shimmer (Female)',
    memorySaving: true,
    tools: {
      webSearch: true,
      codeInterpreter: true,
      imageGen: true,
      knowledgeSearch: true
    },
    welcomeGreeting: 'Greetings! I am Socrates, your AI Academic Tutor. What subject or challenging concept shall we master step-by-step today?',
    discoveryQuestions: [
      'Can you explain Quantum Entanglement or General Relativity with simple everyday analogies?',
      'Can you give me a step-by-step calculus integration problem with hints?',
      'How do I master organic chemistry reaction mechanisms and resonance structures?',
      'Can you test me on data structures, Big-O algorithm analysis, and dynamic programming?',
      'Teach me conversational Tamil / French basics with phonetic pronunciation guide.',
      'How do I structure a high-scoring IELTS / TOEFL essay with advanced vocabulary?',
      'Can you generate a 30-day preparation roadmap for machine learning & statistics?',
      'Explain how neural networks perform backpropagation and gradient descent step-by-step.'
    ],
    samplePrompts: [
      'Explain Quantum Computing like I am five years old',
      'Walk me through solving this Calculus derivative step-by-step',
      'Teach me basic Tamil phrases for everyday conversations',
      'Give me 3 practice quiz questions on Python data structures'
    ]
  },
  {
    id: 'devpulse-architect',
    name: 'DevPulse Senior Software Engineer',
    role: 'Senior Full-Stack Software Engineer & System Architect',
    domain: 'code',
    avatar: '💻',
    avatarBg: 'linear-gradient(135deg, #06B6D4, #0284C7)',
    voiceId: 'echo',
    voiceName: 'Echo (Male)',
    memorySaving: true,
    tools: {
      webSearch: true,
      codeInterpreter: true,
      imageGen: false,
      knowledgeSearch: true
    },
    welcomeGreeting: 'DevPulse online! I am your Senior Full-Stack Architect. What codebase, API integration, or bug are we tackling?',
    discoveryQuestions: [
      'How do I implement real-time WebRTC audio streaming with LiveKit in React?',
      'Can you write a production-ready FastAPI backend with JWT auth and rate limiting?',
      'How do I optimize complex SQL join queries and design high-performance database indexes?',
      'Can you refactor this messy JavaScript code into clean TypeScript with design patterns?',
      'How do I architect a distributed event-driven microservices system with Kafka and Redis?',
      'Can you write comprehensive unit tests with Jest and Playwright E2E testing?',
      'How do I configure Docker multi-stage builds and Kubernetes deployment manifests?'
    ],
    samplePrompts: [
      'Write a React custom hook for speech-to-text with Web Speech API',
      'Optimize this PostgreSQL query for 10 million rows',
      'Create a complete Dockerfile and docker-compose for a Node.js + Postgres app',
      'Explain Clean Architecture and Repository Pattern in Python'
    ]
  },
  {
    id: 'dr-pulse-medical',
    name: 'Dr. Pulse Clinical Assistant',
    role: 'Clinical AI Consultant & Medical Literature Analyst',
    domain: 'medical',
    avatar: '🩺',
    avatarBg: 'linear-gradient(135deg, #EC4899, #DB2777)',
    voiceId: 'nova',
    voiceName: 'Nova (Female)',
    memorySaving: true,
    tools: {
      webSearch: true,
      codeInterpreter: false,
      imageGen: true,
      knowledgeSearch: true
    },
    welcomeGreeting: 'Welcome! I am Dr. Pulse, your Clinical AI Research Assistant. How can I assist with medical literature, pharmacology, or clinical studies?',
    discoveryQuestions: [
      'What is the mechanism of action, pharmacokinetics, and side effects of ACE inhibitors?',
      'Can you summarize the differential diagnosis framework for acute non-cardiac chest pain?',
      'What are the latest clinical guideline updates for Type 2 Diabetes management?',
      'Explain the pathophysiology of autoimmune encephalitis and diagnostic biomarker tests.',
      'How do mRNA vaccines stimulate cellular and humoral immune responses?'
    ],
    samplePrompts: [
      'Explain the mechanism of action of beta-blockers vs calcium channel blockers',
      'Summarize key clinical findings from recent cardiology trials',
      'What are the first-line antibiotic treatments for community-acquired pneumonia?'
    ]
  },
  {
    id: 'finpulse-advisor',
    name: 'FinPulse Market Strategist',
    role: 'Chartered Financial Analyst & Market Strategist',
    domain: 'finance',
    avatar: '📈',
    avatarBg: 'linear-gradient(135deg, #10B981, #047857)',
    voiceId: 'onyx',
    voiceName: 'Onyx (Male)',
    memorySaving: true,
    tools: {
      webSearch: true,
      codeInterpreter: true,
      imageGen: false,
      knowledgeSearch: true
    },
    welcomeGreeting: 'FinPulse active. I am your Quantitative & Market Strategy Advisor. Let us review financial modeling, portfolio valuations, or macro trends.',
    discoveryQuestions: [
      'How do I calculate a 5-year Discounted Cash Flow (DCF) valuation with WACC?',
      'What is the macroeconomic impact of Federal Reserve interest rate cuts on equity markets?',
      'How do I build an optimal risk-adjusted portfolio allocation using Modern Portfolio Theory?',
      'Explain the difference between P/E, EV/EBITDA, and Free Cash Flow yield multiples.',
      'How do options Greeks (Delta, Gamma, Theta, Vega) affect pricing and hedging strategies?'
    ],
    samplePrompts: [
      'Perform a step-by-step DCF valuation template for a SaaS growth company',
      'Analyze the impact of inflation and bond yields on tech equities',
      'Design a balanced 60/40 index fund retirement portfolio'
    ]
  }
];

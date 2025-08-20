import { Message, MessageAuthor, ModalType, Action } from '../types';

let messageIdCounter = 0;
let activeFlow: 'signup' | 'loggedin' | 'recruiter_job_post' | 'recruiter_loggedin' | null = null;
let currentStep = -1;

const createBotMessage = (text: string, actions: Action[] = []): Message => ({
  id: `bot-${++messageIdCounter}`,
  author: MessageAuthor.BOT,
  text,
  actions,
});

const signUpFlow: Record<number, () => Message> = {
  0: () => createBotMessage(
    "Welcome to ThatsMyRecruiter! I'm your personal AI recruiter. My goal is to streamline your job search and give you full control. To start, let's build your professional profile."
  ),
  1: () => createBotMessage(
    "Great! Let's get your profile set up properly. This will include your name, title, and a profile photo.",
    [{ label: "Setup Profile", type: 'open_modal', payload: { modalType: ModalType.ONBOARDING_PROFILE } }]
  ),
  2: () => createBotMessage(
    "Excellent, your basic profile is saved! Now, let's define your job preferences so I can find the perfect roles for you.",
    [{ label: "Set Job Preferences", type: 'open_modal', payload: { modalType: ModalType.JOB_PREFERENCES } }]
  ),
  3: () => createBotMessage(
    "Perfect. Now let's highlight your skills. This will help me match you with roles that require your expertise.",
    [{ label: "Add Your Skills", type: 'open_modal', payload: { modalType: ModalType.SKILLS_ASSESSMENT } }]
  ),
  4: () => createBotMessage(
    "Great work. Now, let's set your availability so recruiters know when and how to contact you.",
    [{ label: "Set Availability", type: 'open_modal', payload: { modalType: ModalType.AVAILABILITY } }]
  ),
  5: () => createBotMessage(
    "Almost there! Finally, you can upload any relevant documents like your resume, licenses, or certifications.",
    [{ label: "Upload Documents", type: 'open_modal', payload: { modalType: ModalType.DOCUMENTS_UPLOAD } }]
  ),
};

const loggedInFlow: Record<number, () => Message> = {
  0: () => createBotMessage(
    "Welcome back! It's great to see you again. What would you like to do today?"
  )
};

const recruiterLoggedInFlow: Record<number, () => Message> = {
  0: () => createBotMessage(
    "Welcome back to your Recruiter Dashboard. How can I help you today?"
  )
};

const recruiterJobPostFlow: Record<number, () => Message> = {
    0: () => createBotMessage("I can help with that. Let's create a job profile to find the best candidates for you. First, what is the job title or primary role you're hiring for?"),
    1: () => createBotMessage("Got it. Now, what are the most important skills for this role? Please list them, separated by commas."),
    2: () => createBotMessage("Perfect. Lastly, what is the work location for this position? (e.g., 'New York, NY', 'Chicago, IL', 'Remote')"),
    3: () => createBotMessage("Great! I'm now searching for candidates that match your criteria."),
};


// This is a mock service. In a real app, this would use @google/genai.
export const geminiService = {
  startSignUpConversation: async function* (): AsyncGenerator<Message> {
    activeFlow = 'signup';
    currentStep = 0;
    yield signUpFlow[currentStep]();
  },

  startLoggedInConversation: async function* (): AsyncGenerator<Message> {
    activeFlow = 'loggedin';
    currentStep = 0;
    yield loggedInFlow[currentStep]();
  },
  
  startRecruiterConversation: async function* (): AsyncGenerator<Message> {
    activeFlow = 'recruiter_loggedin';
    currentStep = 0;
    yield recruiterLoggedInFlow[currentStep]();
  },

  startFindCandidatesConversation: async function* (): AsyncGenerator<Message> {
    activeFlow = 'recruiter_job_post';
    currentStep = 0;
    yield recruiterJobPostFlow[currentStep]();
  },

  getCurrentFlowState: () => ({ flow: activeFlow, step: currentStep }),

  sendMessage: async function* (message: string): AsyncGenerator<Message> {
    await new Promise(res => setTimeout(res, 500));
    
    if (activeFlow === 'signup') {
      currentStep++;
      const nextMessage = signUpFlow[currentStep];
      if (nextMessage) {
          yield nextMessage();
      } else {
          yield createBotMessage("I'm sorry, I'm not sure how to respond to that right now. Let's continue focusing on your profile.");
      }
    } else if (activeFlow === 'recruiter_job_post') {
        currentStep++;
        const nextMessage = recruiterJobPostFlow[currentStep];
        if (nextMessage) {
            yield nextMessage();
        }
        if (currentStep >= Object.keys(recruiterJobPostFlow).length - 1) {
            activeFlow = 'recruiter_loggedin';
            currentStep = -1;
        }
    } else if (activeFlow === 'recruiter_loggedin') {
        yield createBotMessage("You can use the quick actions, or describe what you need. For example: 'Find me a senior nurse in New York'.");
    }
    else {
       yield createBotMessage("You can use the buttons to navigate or tell me what you need, for example: 'I want to upload a new resume.'");
    }
  },
  
  postModalAction: async function* (): AsyncGenerator<Message> {
    if (activeFlow === 'signup') {
      await new Promise(res => setTimeout(res, 300));
      
      currentStep++;
      const nextMessage = signUpFlow[currentStep];

      if (nextMessage) {
          yield nextMessage();
      } else {
        // This means we've completed all sign-up steps
        activeFlow = 'loggedin';
        currentStep = 0; // Reset for the logged-in flow.
        yield createBotMessage(
          "You're all set! Your profile is complete. You can now use the quick actions below to manage your profile or explore opportunities.",
        );
      }
    }
    // For logged in users, closing a modal doesn't trigger a new message.
    // The user is free to choose the next action.
  }
};
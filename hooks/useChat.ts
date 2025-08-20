import { useState, useCallback } from 'react';
import { Message, MessageAuthor, ModalType, UserProfile, JobPreferences, Skill, Availability, UploadedFile, UserType, CandidateProfile, JobPostDetails, Conversation, Action } from '../types';
import { geminiService } from '../services/geminiService';
import { mockCandidates } from '../data/mockCandidates';
import { mockConversations } from '../data/mockConversations';

const candidateQuickActions: Action[] = [
    { label: "View Public Profile", type: 'open_modal', payload: { modalType: ModalType.PUBLIC_PROFILE } },
    { label: "Messages", type: 'open_modal', payload: { modalType: ModalType.CANDIDATE_MESSAGES } },
    { label: "Recruiter Requests", type: 'open_modal', payload: { modalType: ModalType.RECRUITER_REQUESTS } },
    { label: "Jobs", type: 'open_modal', payload: { modalType: ModalType.SUGGESTED_JOBS } },
    { label: "Documents", type: 'open_modal', payload: { modalType: ModalType.DOCUMENTS_UPLOAD } },
    { label: "Skills", type: 'open_modal', payload: { modalType: ModalType.SKILLS_ASSESSMENT } },
    { label: "Set Availability", type: 'open_modal', payload: { modalType: ModalType.AVAILABILITY } },
    { label: "Job Preferences", type: 'open_modal', payload: { modalType: ModalType.JOB_PREFERENCES } },
    { label: "Logout", type: 'logout' },
];

const recruiterQuickActions: Action[] = [
    { label: "Search for Candidates", type: 'start_flow', payload: { flowName: 'find_candidates' } },
    { label: "View Messages", type: 'open_modal', payload: { modalType: ModalType.RECRUITER_MESSAGES } },
    { label: "Logout", type: 'logout' },
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.AUTH);
  const [userType, setUserType] = useState<UserType>(UserType.GUEST);
  const [quickActions, setQuickActions] = useState<Action[]>([]);

  // For Candidate user
  const [currentUser, setCurrentUser] = useState<CandidateProfile | null>(null);

  // For Recruiter user
  const [recruiterMessages, setRecruiterMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [foundCandidates, setFoundCandidates] = useState<CandidateProfile[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);
  const [candidateToConnect, setCandidateToConnect] = useState<CandidateProfile | null>(null);
  const [jobPostDetails, setJobPostDetails] = useState<Partial<JobPostDetails>>({});


  const handleStream = useCallback(async (stream: AsyncGenerator<Message>, target: 'candidate' | 'recruiter' = 'candidate') => {
    return new Promise<void>(async (resolve) => {
        setIsLoading(true);
        let lastMessage: Message | null = null;
        const setTargetMessages = target === 'recruiter' ? setRecruiterMessages : setMessages;

        for await (const chunk of stream) {
        if (lastMessage && lastMessage.id === chunk.id) {
            setTargetMessages(prev =>
            prev.map(msg => (msg.id === chunk.id ? { ...msg, text: msg.text + chunk.text } : msg))
            );
        } else {
            setTargetMessages(prev => [...prev, chunk]);
        }
        lastMessage = chunk;
        }
        setIsLoading(false);
        resolve();
    });
  }, []);

  const startRecruiterConversation = useCallback(() => {
    const stream = geminiService.startRecruiterConversation();
    handleStream(stream, 'recruiter');
  }, [handleStream]);

  const handleSignUp = useCallback((userType: UserType) => {
      setActiveModal(ModalType.NONE);
      if (userType === UserType.CANDIDATE) {
        setUserType(UserType.CANDIDATE);
        setQuickActions([]);
        // In a real app, we'd create a new user. Here we'll just use a blank profile.
        setCurrentUser({
            userProfile: { id: 'newUser', name: '', title: '', profilePhoto: null },
            jobPreferences: { roles: [], shift: '', location: '', payExpectations: '' },
            skills: [],
            availability: { contactMethods: [], timeZone: '', workingHours: '', callAvailableHours: '' },
            documents: [],
        });
        const stream = geminiService.startSignUpConversation();
        handleStream(stream, 'candidate');
      } else {
        setUserType(UserType.RECRUITER);
        setRecruiterMessages([]);
        setQuickActions(recruiterQuickActions);
        startRecruiterConversation();
      }
  }, [handleStream, startRecruiterConversation]);

  const handleLogin = useCallback((email: string) => {
      setActiveModal(ModalType.NONE);
      // Mock logic: check if user is a recruiter based on email
      if (email.toLowerCase().includes('recruiter')) {
        setUserType(UserType.RECRUITER);
        setRecruiterMessages([]);
        setQuickActions(recruiterQuickActions);
        startRecruiterConversation();
      } else {
        setUserType(UserType.CANDIDATE);
        // In a real app, user data would be fetched here. We use the first mock candidate.
        setCurrentUser(mockCandidates[0]);
        setQuickActions(candidateQuickActions);
        const stream = geminiService.startLoggedInConversation();
        handleStream(stream, 'candidate');
      }
  }, [handleStream, startRecruiterConversation]);

  const findCandidates = useCallback((details: JobPostDetails) => {
    setIsLoading(true);

    // Simulate a quick search and show mock candidates
    setTimeout(() => {
        setFoundCandidates(mockCandidates);

        const botMessage: Message = {
            id: `bot-${Date.now()}`,
            author: MessageAuthor.BOT,
            text: `Great! Based on your criteria for the "${details.title}" role, I've found ${mockCandidates.length} strong candidates for you to review.`,
            actions: [{ label: "View Candidates", type: 'open_modal', payload: { modalType: ModalType.FOUND_CANDIDATES } }]
        };
        setRecruiterMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    }, 1000); // Simulate a network request
  }, []);


  const sendMessage = useCallback(
    (text: string) => {
      const target = userType === UserType.CANDIDATE ? 'candidate' : 'recruiter';
      const setTargetMessages = target === 'recruiter' ? setRecruiterMessages : setMessages;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        author: MessageAuthor.USER,
        text,
      };
      setTargetMessages(prev => [...prev, userMessage]);

      if (userType === UserType.RECRUITER) {
        const { flow, step } = geminiService.getCurrentFlowState();
        if (flow === 'recruiter_job_post') {
            const currentStep = step;
            const newDetails = { ...jobPostDetails };

            if (currentStep === 0) newDetails.title = text.trim();
            if (currentStep === 1) newDetails.skills = text.trim().split(',').map(s => s.trim());
            if (currentStep === 2) {
                newDetails.location = text.trim();
                findCandidates(newDetails as JobPostDetails);
            }
            setJobPostDetails(newDetails);
        }
      }

      const responseStream = geminiService.sendMessage(text);
      handleStream(responseStream, target);
    },
    [handleStream, userType, findCandidates, jobPostDetails]
  );

  const sendChatMessage = useCallback((candidateId: string, text: string) => {
    const userMessage: Message = {
      id: `chat-user-${Date.now()}`,
      author: MessageAuthor.BOT, // Note: In recruiter-candidate chat, recruiter is the "bot" from UI perspective
      text,
    };
    setConversations(prev => prev.map(convo => {
        if (convo.candidateId === candidateId) {
            return { ...convo, messages: [...convo.messages, userMessage] };
        }
        return convo;
    }));
    
    // Mock candidate response
    setTimeout(() => {
        const candidate = mockCandidates.find(c => c.userProfile.id === candidateId);
        if (!candidate) return;

        const candidateResponse: Message = {
            id: `chat-candidate-${Date.now()}`,
            author: MessageAuthor.USER, // Candidate is the "user"
            text: `This is a canned response from ${candidate.userProfile.name}. They will get back to you shortly.`
        };
        
        setConversations(prev => prev.map(convo => {
            if (convo.candidateId === candidateId && convo.messages[convo.messages.length - 1]?.author === MessageAuthor.BOT) {
                return { ...convo, messages: [...convo.messages, candidateResponse] };
            }
            return convo;
        }));
    }, 1500);
  }, []);

  const sendCandidateMessage = useCallback((conversationId: string, text: string) => {
    const userMessage: Message = {
      id: `chat-candidate-${Date.now()}`,
      author: MessageAuthor.USER,
      text,
    };
    setConversations(prev => prev.map(convo => {
        if (convo.candidateId === conversationId) {
            return { ...convo, messages: [...convo.messages, userMessage] };
        }
        return convo;
    }));

    // Mock recruiter response
    setTimeout(() => {
        const recruiterResponse: Message = {
            id: `chat-recruiter-${Date.now()}`,
            author: MessageAuthor.BOT,
            text: `Thanks for your message. We'll get back to you shortly.`
        };

        setConversations(prev => prev.map(convo => {
            if (convo.candidateId === conversationId) {
                 // Check if the last message was from the user to avoid double responses
                if (convo.messages[convo.messages.length-1].author === MessageAuthor.USER) {
                    return { ...convo, messages: [...convo.messages, recruiterResponse] };
                }
            }
            return convo;
        }));
    }, 1500);
  }, []);

  const openModal = useCallback((modalType: ModalType) => setActiveModal(modalType), []);

  const closeModal = useCallback(() => {
    setActiveModal(ModalType.NONE);
    const { flow } = geminiService.getCurrentFlowState();
    
    if (userType === UserType.CANDIDATE && flow === 'signup') {
        const responseStream = geminiService.postModalAction();
        handleStream(responseStream, 'candidate').then(() => {
            const { flow: newFlow } = geminiService.getCurrentFlowState();
            if (newFlow === 'loggedin') {
                setQuickActions(candidateQuickActions);
            }
        });
    }
  }, [userType, handleStream]);
  
  const handleAction = useCallback((action: Action) => {
      if (action.type === 'start_flow' && action.payload?.flowName === 'find_candidates') {
          setJobPostDetails({});
          const stream = geminiService.startFindCandidatesConversation();
          handleStream(stream, 'recruiter');
      } else if (action.type === 'open_modal' && action.payload?.modalType) {
          openModal(action.payload.modalType);
      } else if (action.type === 'logout') {
          setMessages([]);
          setRecruiterMessages([]);
          setIsLoading(false);
          setActiveModal(ModalType.AUTH);
          setUserType(UserType.GUEST);
          setQuickActions([]);
          setCurrentUser(null);
          setConversations(mockConversations);
          setFoundCandidates([]);
          setSelectedCandidate(null);
          setCandidateToConnect(null);
          setJobPostDetails({});
      }
  }, [handleStream, openModal]);

  const viewCandidateProfile = useCallback((candidate: CandidateProfile) => {
      setSelectedCandidate(candidate);
      openModal(ModalType.PUBLIC_PROFILE);
  }, [openModal]);
  
  const closeCandidateProfile = useCallback(() => {
    setSelectedCandidate(null);
    closeModal();
  }, [closeModal]);

  const openConnectModal = useCallback((candidate: CandidateProfile) => {
    setCandidateToConnect(candidate);
    setActiveModal(ModalType.CONNECT_REQUEST);
  }, []);

  const closeConnectModal = useCallback(() => {
    setCandidateToConnect(null);
    setActiveModal(ModalType.NONE);
  }, []);

  const sendConnectionRequest = useCallback((candidateId: string, message: string) => {
    const candidate = mockCandidates.find(c => c.userProfile.id === candidateId);
    if (!candidate) return;

    const existingConversation = conversations.find(c => c.candidateId === candidateId);
    if (existingConversation) {
        // In a real app, you might want to just open the existing conversation.
        // For this demo, we'll assume we can't send a new request if one exists.
        console.log("Conversation already exists.");
    } else {
        const newConversation: Conversation = {
            candidateId: candidate.userProfile.id,
            candidateName: candidate.userProfile.name,
            candidateProfilePhoto: candidate.userProfile.profilePhoto,
            messages: [{
                id: `req-${Date.now()}`,
                author: MessageAuthor.BOT,
                text: message,
            }],
            lastMessageAt: 'Just now',
            status: 'pending',
        };
        setConversations(prev => [newConversation, ...prev]);
    }
    
    closeConnectModal();
    // Optionally open the messages modal to show the new pending request
    openModal(ModalType.RECRUITER_MESSAGES);
  }, [conversations, closeConnectModal, openModal]);
  
  const setUserProfile = useCallback((profile: UserProfile) => {
      setCurrentUser(curr => curr ? {...curr, userProfile: profile} : null);
  }, []);
  const setJobPreferences = useCallback((prefs: JobPreferences) => {
      setCurrentUser(curr => curr ? {...curr, jobPreferences: prefs} : null);
  }, []);
  const setSkills = useCallback((skills: Skill[]) => {
      setCurrentUser(curr => curr ? {...curr, skills} : null);
  }, []);
  const setAvailability = useCallback((availability: Availability) => {
      setCurrentUser(curr => curr ? {...curr, availability} : null);
  }, []);
  const setDocuments = useCallback((docs: UploadedFile[]) => {
      setCurrentUser(curr => curr ? {...curr, documents: docs} : null);
  }, []);

  return {
    messages,
    recruiterMessages,
    isLoading,
    activeModal,
    userType,
    currentUser,
    foundCandidates,
    selectedCandidate,
    candidateToConnect,
    conversations,
    quickActions,
    sendMessage,
    openModal,
    closeModal,
    handleSignUp,
    handleLogin,
    handleAction,
    setUserProfile,
    setJobPreferences,
    setSkills,
    setAvailability,
    setDocuments,
    findCandidates,
    viewCandidateProfile,
    closeCandidateProfile,
    sendChatMessage,
    sendCandidateMessage,
    openConnectModal,
    closeConnectModal,
    sendConnectionRequest,
  };
};
import { Conversation, MessageAuthor } from "../types";

export const mockConversations: Conversation[] = [
  {
    candidateId: 'candidate1',
    candidateName: 'Jane Doe',
    candidateProfilePhoto: 'https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    messages: [
      { id: 'c1-m1', author: MessageAuthor.BOT, text: 'Hi Jane, I was impressed with your experience in ICU. Would you be open to discussing a role at Tech Solutions Inc.?' },
      { id: 'c1-m2', author: MessageAuthor.USER, text: 'Hi! Thanks for reaching out. I\'m definitely open to learning more about it.' },
    ],
    lastMessageAt: '10:45 AM',
    status: 'accepted',
  },
  {
    candidateId: 'candidate2',
    candidateName: 'John Smith',
    candidateProfilePhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=387&auto=format&fit=crop',
    messages: [
      { id: 'c2-m1', author: MessageAuthor.BOT, text: 'Hello John, we have an opening for a Pediatric Nurse that seems like a great fit for you.' },
    ],
    lastMessageAt: 'Yesterday',
    status: 'pending',
  },
  {
    candidateId: 'candidate3',
    candidateName: 'Maria Garcia',
    candidateProfilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=387&auto=format&fit=crop',
    messages: [
       { id: 'c3-m1', author: MessageAuthor.BOT, text: 'Hi Maria, I saw you\'re interested in travel nursing. We have a high-paying ER contract in California.' },
       { id: 'c3-m2', author: MessageAuthor.USER, text: 'That sounds interesting. Could you send over the details?' },
       { id: 'c3-m3', author: MessageAuthor.BOT, text: 'Absolutely! I\'ve just sent the job description to your email.' },
    ],
    lastMessageAt: '2 days ago',
    status: 'accepted',
  }
];
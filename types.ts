export enum MessageAuthor {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  author: MessageAuthor;
  text: string;
  actions?: Action[];
}

export interface Action {
  label:string;
  type: 'open_modal' | 'start_flow' | 'logout';
  payload?: {
    modalType?: ModalType;
    flowName?: 'find_candidates';
  };
}

export enum UserType {
  GUEST,
  CANDIDATE,
  RECRUITER,
}

export enum ModalType {
  AUTH,
  NONE,
  ONBOARDING_PROFILE,
  DOCUMENTS_UPLOAD,
  JOB_PREFERENCES,
  SKILLS_ASSESSMENT,
  AVAILABILITY,
  RECRUITER_REQUESTS,
  SUGGESTED_JOBS,
  PUBLIC_PROFILE,
  RECRUITER_MESSAGES,
  FOUND_CANDIDATES,
  CONNECT_REQUEST,
  CANDIDATE_MESSAGES,
}

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  profilePhoto: string | null;
}

export interface JobPreferences {
    roles: string[];
    shift: string;
    location: string;
    payExpectations: string;
}

export interface Skill {
    name: string;
    level: 1 | 2 | 3 | 4;
}

export interface Availability {
    contactMethods: Array<'call' | 'text'>;
    timeZone: string;
    workingHours: string;
    callAvailableHours: string;
}

export type DocumentVisibility = 'public' | 'gated' | 'private';

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    visibility: DocumentVisibility;
    url: string; // For local preview/download
}

export interface CandidateProfile {
    userProfile: UserProfile;
    jobPreferences: JobPreferences;
    skills: Skill[];
    availability: Availability;
    documents: UploadedFile[];
}

export interface JobPostDetails {
    title: string;
    skills: string[];
    location: string;
}

export interface Conversation {
  candidateId: string;
  candidateName: string;
  candidateProfilePhoto: string | null;
  messages: Message[];
  lastMessageAt: string;
  status: 'pending' | 'accepted' | 'denied';
}
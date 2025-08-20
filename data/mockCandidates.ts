import { CandidateProfile } from "../types";

export const mockCandidates: CandidateProfile[] = [
  {
    userProfile: {
      id: 'candidate1',
      name: 'Jane Doe',
      title: 'Senior Registered Nurse, ICU',
      profilePhoto: 'https://images.unsplash.com/photo-1580894908361-967195033215?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    jobPreferences: {
      roles: ['ICU Nurse', 'Travel Nurse', 'Clinical Nurse Specialist'],
      shift: 'Day Shift',
      location: 'New York, NY',
      payExpectations: '$100 - $125 / hour',
    },
    skills: [
      { name: 'Advanced Cardiac Life Support (ACLS)', level: 4 },
      { name: 'IV Insertion & Management', level: 4 },
      { name: 'Ventilator Management', level: 3 },
      { name: 'Patient Assessment', level: 4 },
      { name: 'Electronic Health Records (EHR)', level: 3 },
      { name: 'Pediatric Advanced Life Support (PALS)', level: 2 },
    ],
    availability: {
      contactMethods: ['call', 'text'],
      timeZone: 'America/New_York',
      workingHours: '9:00 AM - 5:00 PM (Mon-Fri)',
      callAvailableHours: 'After Work (5pm - 7pm)',
    },
    documents: [
      { id: 'doc1', name: 'Resume_JaneDoe_2024.pdf', size: 128000, type: 'pdf', visibility: 'gated', url: '#' },
      { id: 'doc2', name: 'RN_License_NY.jpg', size: 890000, type: 'jpg', visibility: 'public', url: '#' },
      { id: 'doc3', name: 'BLS_Certification.pdf', size: 256000, type: 'pdf', visibility: 'gated', url: '#' },
      { id: 'doc4', name: 'ACLS_Certification.pdf', size: 312000, type: 'pdf', visibility: 'public', url: '#' },
    ]
  },
  {
    userProfile: {
      id: 'candidate2',
      name: 'John Smith',
      title: 'Pediatric Nurse',
      profilePhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=387&auto=format&fit=crop',
    },
    jobPreferences: {
      roles: ['Pediatric Nurse', 'School Nurse'],
      shift: 'Flexible Schedule',
      location: 'Chicago, IL',
      payExpectations: '$80 - $100 / hour',
    },
    skills: [
      { name: 'Pediatric Advanced Life Support (PALS)', level: 4 },
      { name: 'Patient Assessment', level: 4 },
      { name: 'Medication Administration', level: 4 },
      { name: 'Electronic Health Records (EHR)', level: 3 },
    ],
    availability: {
      contactMethods: ['text'],
      timeZone: 'America/Chicago',
      workingHours: 'Flexible Schedule',
      callAvailableHours: 'By Appointment Only',
    },
    documents: [
      { id: 'doc5', name: 'Resume_JohnSmith.pdf', size: 150000, type: 'pdf', visibility: 'gated', url: '#' },
      { id: 'doc6', name: 'RN_License_IL.pdf', size: 450000, type: 'pdf', visibility: 'public', url: '#' },
    ]
  },
  {
    userProfile: {
      id: 'candidate3',
      name: 'Maria Garcia',
      title: 'Emergency Room Nurse',
      profilePhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=387&auto=format&fit=crop',
    },
    jobPreferences: {
      roles: ['ER Nurse', 'Trauma Nurse', 'Travel Nurse'],
      shift: 'Night Shift',
      location: 'Remote',
      payExpectations: '$125+ / hour',
    },
    skills: [
      { name: 'Trauma Care', level: 4 },
      { name: 'Advanced Cardiac Life Support (ACLS)', level: 4 },
      { name: 'Triage', level: 4 },
      { name: 'IV Insertion & Management', level: 4 },
    ],
    availability: {
      contactMethods: ['call', 'text'],
      timeZone: 'America/Los_Angeles',
      workingHours: '7:00 PM - 7:00 AM (3 nights/week)',
      callAvailableHours: 'Anytime during working hours',
    },
    documents: [
      { id: 'doc7', name: 'Maria_Garcia_CV.pdf', size: 210000, type: 'pdf', visibility: 'gated', url: '#' },
      { id: 'doc8', name: 'CA_Compact_License.pdf', size: 300000, type: 'pdf', visibility: 'public', url: '#' },
      { id: 'doc9', name: 'TNCC_Certification.pdf', size: 180000, type: 'pdf', visibility: 'gated', url: '#' },
    ]
  }
];

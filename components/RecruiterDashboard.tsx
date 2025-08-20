import React from 'react';
import { BotIcon, BuildingOfficeIcon } from './icons/Icons';
import { Message, Action, CandidateProfile } from '../types';
import ChatWindow from './ChatWindow';
import CandidateCard from './CandidateCard';

interface RecruiterDashboardProps {
    messages: Message[];
    isLoading: boolean;
    sendMessage: (text: string) => void;
    onActionClick: (action: Action) => void;
    onViewProfile: (candidate: CandidateProfile) => void;
    quickActions: Action[];
    foundCandidates: CandidateProfile[];
}

const RecruiterHeader: React.FC = () => (
    <div className="flex items-center space-x-3">
        <BotIcon className="w-8 h-8 text-primary" />
        <div>
            <h1 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">
            ThatsMyRecruiter
            </h1>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary flex items-center gap-1.5">
                <BuildingOfficeIcon className="w-3.5 h-3.5"/> Recruiter Dashboard
            </p>
        </div>
    </div>
);

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ messages, isLoading, sendMessage, onActionClick, onViewProfile, quickActions, foundCandidates }) => {
    return (
        <div className="flex h-full w-full bg-background dark:bg-dark-background">
            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col h-full border-r border-border dark:border-dark-border">
                 <ChatWindow
                    messages={messages}
                    isLoading={isLoading}
                    sendMessage={sendMessage}
                    onActionClick={onActionClick}
                    headerContent={<RecruiterHeader />}
                    quickActions={quickActions}
                />
            </main>

            {/* Candidates Sidebar */}
            <aside className="w-full md:w-1/3 max-w-sm h-full flex-shrink-0 bg-slate-50 dark:bg-dark-surface/50 hidden lg:flex flex-col">
                <div className="p-4 border-b border-border dark:border-dark-border flex-shrink-0">
                    <h2 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">
                        {foundCandidates.length > 0 ? `Found Candidates (${foundCandidates.length})` : 'Candidate Search'}
                    </h2>
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                        {foundCandidates.length > 0 ? 'Review the profiles below' : 'Find profiles matching your criteria.'}
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {foundCandidates.length > 0 ? (
                        <div className="space-y-4">
                            {foundCandidates.map(candidate => (
                                <CandidateCard
                                    key={candidate.userProfile.id}
                                    candidate={candidate}
                                    onViewProfile={onViewProfile}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-background dark:bg-dark-surface rounded-xl border border-dashed border-border dark:border-dark-border">
                            <BotIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Find Your Next Hire</h3>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">
                                Use the chat to start a new search. Found candidates will be displayed here for you to review.
                            </p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default RecruiterDashboard;
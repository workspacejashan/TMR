import React, { useState } from 'react';
import Modal from '../Modal';

// Mock data
const mockRequests = [
  { id: 1, recruiter: 'John Smith', company: 'Tech Solutions Inc.', reason: 'Urgent need for a Senior RN for a 3-month contract.', status: 'pending' },
  { id: 2, recruiter: 'Emily White', company: 'Healthcare Heroes', reason: 'Potential full-time role matching your skills in ICU.', status: 'approved' },
  { id: 3, recruiter: 'David Green', company: 'MediConnect', reason: 'Following up on a previous application.', status: 'denied' },
];

interface RecruiterRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RecruiterRequestsModal: React.FC<RecruiterRequestsModalProps> = ({ isOpen, onClose }) => {
    const [requests, setRequests] = useState(mockRequests);

    const handleAction = (id: number, newStatus: 'approved' | 'denied') => {
        setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Recruiter Requests">
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 -mr-3">
                {requests.length > 0 ? requests.map(req => (
                    <div key={req.id} className="bg-background dark:bg-dark-surface p-4 rounded-lg border border-border dark:border-dark-border animate-fade-in-up">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-text-primary dark:text-dark-text-primary">{req.recruiter}</h3>
                                <p className="text-sm text-primary dark:text-primary-light">{req.company}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                                req.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300' :
                                req.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' :
                                'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'
                            }`}>
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                            </span>
                        </div>
                        <p className="mt-3 text-sm text-text-secondary dark:text-dark-text-secondary">{req.reason}</p>
                        {req.status === 'pending' && (
                            <div className="mt-4 flex gap-3">
                                <button onClick={() => handleAction(req.id, 'approved')} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors transform hover:scale-105">Approve</button>
                                <button onClick={() => handleAction(req.id, 'denied')} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors transform hover:scale-105">Deny</button>
                            </div>
                        )}
                    </div>
                )) : (
                    <p className="text-center text-text-secondary dark:text-dark-text-secondary">You have no pending recruiter requests.</p>
                )}
            </div>
             <div className="pt-6">
                <button
                    onClick={onClose}
                    className="w-full bg-primary-gradient text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
};

export default RecruiterRequestsModal;
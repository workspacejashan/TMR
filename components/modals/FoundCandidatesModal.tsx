import React from 'react';
import Modal from '../Modal';
import { CandidateProfile } from '../../types';
import CandidateCard from '../CandidateCard';

interface FoundCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidates: CandidateProfile[];
  onViewProfile: (candidate: CandidateProfile) => void;
}

const FoundCandidatesModal: React.FC<FoundCandidatesModalProps> = ({ isOpen, onClose, candidates, onViewProfile }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Found ${candidates.length} Candidate${candidates.length === 1 ? '' : 's'}`}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1 -m-2">
        {candidates.length > 0 ? candidates.map(candidate => (
          <CandidateCard key={candidate.userProfile.id} candidate={candidate} onViewProfile={onViewProfile} />
        )) : (
          <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">No candidates matched your criteria.</p>
        )}
      </div>
      <div className="pt-6">
        <button
            onClick={onClose}
            className="w-full bg-slate-100 dark:bg-dark-border hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-slate-500/30 transition-all duration-300"
        >
            Close
        </button>
      </div>
    </Modal>
  );
};

export default FoundCandidatesModal;
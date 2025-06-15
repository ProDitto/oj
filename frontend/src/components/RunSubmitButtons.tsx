import React from 'react';
import { Loader } from 'lucide-react';

const RunSubmitButtons: React.FC<any> = ({ handleRun, handleSubmit, running, submitting }) => (
    <div className="flex gap-4 mt-4">
        <button
            onClick={handleRun}
            disabled={running || submitting}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
            {running && <Loader className="animate-spin w-4 h-4" />}
            {running ? 'Running...' : 'Run Code'}
        </button>

        <button
            onClick={handleSubmit}
            disabled={submitting || running}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
            {submitting && <Loader className="animate-spin w-4 h-4" />}
            {submitting ? 'Submitting...' : 'Submit'}
        </button>
    </div>
);

export default RunSubmitButtons;

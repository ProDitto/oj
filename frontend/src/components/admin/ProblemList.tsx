import React from 'react';
import type { ProblemInfo } from '../../types';
import { Link } from 'react-router-dom';

interface ProblemListProps {
    problems: ProblemInfo[];
    onDelete: (id: number) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">Title</th>
                        <th className="px-4 py-2">Difficulty</th>
                        <th className="px-4 py-2">Tags</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {problems.map(problem => (
                        <tr key={problem.ID}>
                            <td className="px-4 py-2">{problem.Title}</td>
                            <td className="px-4 py-2">{problem.Difficulty}</td>
                            <td className="px-4 py-2">{problem.Tags.join(', ')}</td>
                            <td className="px-4 py-2">
                                <Link to={`/admin/problems/edit/${problem.ID}`} className="btn btn-secondary mr-2">Edit</Link>
                                <button onClick={() => onDelete(problem.ID)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProblemList;

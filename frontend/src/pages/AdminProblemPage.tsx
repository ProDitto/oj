import React, { useState, useEffect } from 'react';
import { adminGetProblems, deleteProblem } from '../api/endpoints';
import type { ProblemInfo } from '../types';
import { Link } from 'react-router-dom';
import { Plus as FaPlus, Edit as FaEdit, Trash as FaTrash, Search as FaSearch, Award as FaTimes, Ham as FaSort, Award as FaSortUp, Apple as FaSortDown } from 'lucide-react';
import ProblemList from '../components/admin/ProblemList';

const AdminProblemPage: React.FC = () => {
    const [problems, setProblems] = useState<ProblemInfo[]>([]);
    const [filteredProblems, setFilteredProblems] = useState<ProblemInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<keyof ProblemInfo>('Title');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Available tags for filtering (would typically come from API)
    const allTags = [
        'array', 'string', 'hash table', 'sorting', 'recursion',
        'binary search', 'tree', 'graph', 'dynamic programming', 'greedy'
    ];
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Status for problem filtering
    const statusOptions = ['active', 'inactive'];
    const [selectedStatus, setSelectedStatus] = useState<string>('');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const response = await adminGetProblems();
                setProblems(response.data);
                setFilteredProblems(response.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching problems", error);
                setError("Failed to fetch problems. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    // Apply filtering and sorting
    useEffect(() => {
        let result = [...problems];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p =>
                p.Title.toLowerCase().includes(term) ||
                p.Description.toLowerCase().includes(term) ||
                p.Slug.toLowerCase().includes(term)
            );
        }

        // Apply tag filter
        if (selectedTags.length > 0) {
            result = result.filter(p =>
                selectedTags.every(tag => p.Tags.includes(tag))
            );
        }

        // Apply status filter
        if (selectedStatus) {
            result = result.filter(p =>
                p.Status?.toLowerCase() === selectedStatus.toLowerCase()
            );
        }

        // Apply sorting
        result.sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];

            if (aVal === undefined || bVal === undefined) return 0;

            if (typeof aVal === 'string' && typeof bVal === 'string') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
            return 0;
        });

        setFilteredProblems(result);
    }, [problems, searchTerm, selectedTags, selectedStatus, sortField, sortDirection]);

    const handleDeleteClick = (id: number) => {
        setDeleteConfirmId(id);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirmId === null) return;

        try {
            await deleteProblem(deleteConfirmId);
            setProblems(problems.filter(problem => problem.ID !== deleteConfirmId));
            setDeleteConfirmId(null);
        } catch (error) {
            console.error("Error deleting problem", error);
            setError("Failed to delete problem. Please try again.");
        }
    };

    const handleSort = (field: keyof ProblemInfo) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const getSortIcon = (field: keyof ProblemInfo) => {
        if (sortField !== field) return <FaSort className="ml-1 opacity-30" />;
        return sortDirection === 'asc'
            ? <FaSortUp className="ml-1" />
            : <FaSortDown className="ml-1" />;
    };

    const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${difficulty === 'easy'
                ? 'bg-green-100 text-green-800'
                : difficulty === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
            }`}>
            {difficulty}
        </span>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Problem Management</h1>
                    <p className="text-gray-600 mt-1">
                        Manage all programming problems and their settings
                    </p>
                </div>

                <Link
                    to="/admin/problems/new"
                    className="btn btn-primary flex items-center"
                >
                    <FaPlus className="mr-2" />
                    Create New Problem
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex">
                        <div className="text-red-700">
                            <p>{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by title, description, or slug..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                {searchTerm && (
                                    <button
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <div className="relative" onClick={(e) => e.stopPropagation()}>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value=""
                                    onChange={(e) => selectedTags.includes(e.target.value)
                                        ? setSelectedTags(selectedTags.filter(t => t !== e.target.value))
                                        : setSelectedTags([...selectedTags, e.target.value])}
                                >
                                    <option value="">Filter by Tags</option>
                                    {allTags.map(tag => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {selectedTags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {selectedTags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center"
                                >
                                    {tag}
                                    <button
                                        onClick={() => toggleTag(tag)}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </span>
                            ))}
                            <button
                                className="text-xs text-blue-600 hover:text-blue-800 font-medium ml-1"
                                onClick={() => setSelectedTags([])}
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('ID')}
                                    >
                                        <div className="flex items-center">
                                            ID
                                            {getSortIcon('ID')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('Title')}
                                    >
                                        <div className="flex items-center">
                                            Title
                                            {getSortIcon('Title')}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleSort('Difficulty')}
                                    >
                                        <div className="flex items-center">
                                            Difficulty
                                            {getSortIcon('Difficulty')}
                                        </div>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tags
                                    </th>
                                    {selectedStatus === '' && (
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort('Status')}
                                        >
                                            <div className="flex items-center">
                                                Status
                                                {getSortIcon('Status')}
                                            </div>
                                        </th>
                                    )}
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProblems.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={selectedStatus ? 5 : 6}
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            No problems found matching your criteria
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProblems.map(problem => (
                                        <tr key={problem.ID} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {problem.ID}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{problem.Title}</div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">{problem.Description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <DifficultyBadge difficulty={problem.Difficulty} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {problem.Tags?.slice(0, 3).map((tag, index) => (
                                                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {problem.Tags?.length > 3 && (
                                                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                            +{problem.Tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            {selectedStatus === '' && (
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${problem.Status === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {problem.Status}
                                                    </span>
                                                </td>
                                            )}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link
                                                        to={`/admin/problems/edit/${problem.Slug}`}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(problem.ID)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {filteredProblems.length > 0 && !loading && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{filteredProblems.length}</span> of{' '}
                            <span className="font-medium">{problems.length}</span> problems
                        </div>

                        {problems.length !== filteredProblems.length && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedTags([]);
                                    setSelectedStatus('');
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmId !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to delete this problem? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="btn btn-danger flex items-center"
                                >
                                    <FaTrash className="mr-2" />
                                    Delete Problem
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProblemPage;

// src/pages/add.tsx

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { ProblemDetail } from '../types';
import { createProblem } from '../api/endpoints';
import { useNavigate } from 'react-router-dom';

const AddProblemPage: React.FC = () => {
    const navigate = useNavigate();

    const {
        register,
        control,
        handleSubmit,
        // reset,
        formState: {
            // errors, 
            isSubmitting },
    } = useForm<ProblemDetail>({
        defaultValues: {
            Title: '',
            Description: '',
            Constraints: [],
            Slug: '',
            Tags: [],
            Difficulty: 'easy',
            AuthorID: 0,
            Status: 'active',
            SolutionLanguage: 'python',
            SolutionCode: '',
            TestCases: [],
            Limits: [],
            FailureReason: '',
        },
    });

    const { fields: constraintFields, append: addConstraint } = useFieldArray({
        control,
        name: 'Constraints',
    });

    const { fields: tagFields, append: addTag } = useFieldArray({
        control,
        name: 'Tags',
    });

    const { fields: testCases, append: addTestCase } = useFieldArray({
        control,
        name: 'TestCases',
    });

    const { fields: limits, append: addLimit } = useFieldArray({
        control,
        name: 'Limits',
    });

    const onSubmit = async (data: ProblemDetail) => {
        try {
            const response = await createProblem(data);
            navigate(`/problem/${data.Slug}`);
        } catch (error) {
            console.error('Error creating problem:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Create New Problem</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input
                    type="text"
                    placeholder="Title"
                    {...register('Title', { required: true })}
                    className="w-full border p-2 rounded"
                />
                <textarea
                    placeholder="Description"
                    {...register('Description')}
                    className="w-full border p-2 rounded h-32"
                />

                <div>
                    <label className="block font-medium">Constraints</label>
                    {constraintFields.map((field, index) => (
                        <input
                            key={field.id}
                            {...register(`Constraints.${index}` as const)}
                            className="w-full border p-1 rounded mb-1"
                        />
                    ))}
                    <button type="button" onClick={() => addConstraint('')} className="text-blue-600 text-sm">
                        + Add Constraint
                    </button>
                </div>

                <div>
                    <label className="block font-medium">Tags</label>
                    {tagFields.map((field, index) => (
                        <input
                            key={field.id}
                            {...register(`Tags.${index}` as const)}
                            className="w-full border p-1 rounded mb-1"
                        />
                    ))}
                    <button type="button" onClick={() => addTag('')} className="text-blue-600 text-sm">
                        + Add Tag
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Slug (e.g., two-sum)"
                    {...register('Slug', { required: true })}
                    className="w-full border p-2 rounded"
                />

                <div className="flex gap-4">
                    <select {...register('Difficulty')}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select {...register('Status')}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    <select {...register('SolutionLanguage')}>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                        <option value="javascript">JavaScript</option>
                    </select>
                </div>

                <textarea
                    placeholder="Solution code"
                    {...register('SolutionCode')}
                    className="w-full border p-2 rounded h-40"
                />

                <div>
                    <label className="block font-medium">Test Cases</label>
                    {testCases.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-2 gap-2 mb-2">
                            <input
                                placeholder="Input"
                                {...register(`TestCases.${index}.Input`)}
                                className="border p-1 rounded"
                            />
                            <input
                                placeholder="Expected Output"
                                {...register(`TestCases.${index}.ExpectedOutput`)}
                                className="border p-1 rounded"
                            />
                        </div>
                    ))}
                    <button type="button" onClick={() => addTestCase({ ID: 0, Input: '', ExpectedOutput: '' })} className="text-blue-600 text-sm">
                        + Add Test Case
                    </button>
                </div>

                <div>
                    <label className="block font-medium">Limits</label>
                    {limits.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-3 gap-2 mb-2">
                            <select {...register(`Limits.${index}.Language`)} className="border p-1 rounded">
                                <option value="python">Python</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                                <option value="javascript">JavaScript</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Time (ms)"
                                {...register(`Limits.${index}.TimeLimitMS`)}
                                className="border p-1 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Memory (KB)"
                                {...register(`Limits.${index}.MemoryLimitKB`)}
                                className="border p-1 rounded"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addLimit({ ProblemID: 0, Language: 'python', TimeLimitMS: 1000, MemoryLimitKB: 65536 })}
                        className="text-blue-600 text-sm"
                    >
                        + Add Limit
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    {isSubmitting ? 'Submitting...' : 'Create Problem'}
                </button>
            </form>
        </div>
    );
};

export default AddProblemPage;

import React, { useState } from 'react';
import type { Discussion, DiscussionComment, Vote, AddCommentPayload } from '../types';
import { voteDiscussion, commentDiscussion } from '../api/endpoints';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

interface DiscussionsTabProps {
  discussions: Discussion[];
  onCreateDiscussion: (discussion: Discussion) => void;
  onUpdateDiscussion: (updated: Discussion) => void;
}

const DiscussionsTab: React.FC<DiscussionsTabProps> = ({
  discussions,
  onCreateDiscussion,
  onUpdateDiscussion,
}) => {
  const { user } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState<Omit<Discussion, 'ID' | 'Votes' | 'Comments'>>({
    Title: '',
    Content: '',
    Tags: [],
    AuthorID: user?.ID || 0,
    AuthorUsername: user?.Username || "user",
  });

  const [commentInput, setCommentInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [votingState, setVotingState] = useState<Record<number, boolean>>({});
  const [activeDiscussionID, setActiveDiscussionID] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeof newDiscussion
  ) => {
    setNewDiscussion(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setNewDiscussion({ Title: '', Content: '', Tags: [], AuthorID: 0, AuthorUsername: "user" });
    setErrorMessage('');
  };

  const handleCreateDiscussion = () => {
    if (!newDiscussion.Title || !newDiscussion.Content) {
      setErrorMessage('Title and content are required.');
      return;
    }

    const newDiscussionData: Discussion = {
      ...newDiscussion,
      ID: Date.now(),
      Votes: 0,
      Comments: [],
    };

    onCreateDiscussion(newDiscussionData);
    handleCloseModal();
  };

  const handleAddComment = async (discussionID: number) => {
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    const target = discussions.find(d => d.ID === discussionID);
    if (!target || !user) return;

    try {
      const payload: AddCommentPayload = {
        DiscussionID: discussionID,
        Content: trimmed,
      }

      const response = await commentDiscussion(payload);

      const newComment: DiscussionComment = {
        ID: response?.data?.id || Date.now(),
        Content: trimmed,
        AuthorID: user.ID,
        AuthorUsername: user.Username
      };

      const updatedDiscussion: Discussion = {
        ...target,
        Comments: [...target.Comments, newComment],
      };

      onUpdateDiscussion(updatedDiscussion);
      setCommentInput('');
    } catch (err) {
      console.log("Error adding a comment: ", err)
    }
  };

  const handleVote = async (discussionID: number, vote: Vote) => {
    setVotingState(prev => ({ ...prev, [discussionID]: true }));

    const target = discussions.find(d => d.ID === discussionID);
    if (!target) return;

    try {
      const { id } = (await voteDiscussion({ DiscussionID: discussionID, Vote: vote })).data;
      const updatedDiscussion: Discussion = {
        ...target,
        Votes: id,
      };

      onUpdateDiscussion(updatedDiscussion);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data || "unknown error", {
          type: 'error',
          autoClose: 2000,
          position: 'bottom-right',
        })
      }

      console.error(`Failed to vote:`, error);
    } finally {
      setVotingState(prev => ({ ...prev, [discussionID]: false }));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Discussions</h2>

      {
        user &&
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Discussion
        </button>
      }

      {discussions?.length === 0 ? (
        <p>No discussions yet. Be the first to start one!</p>
      ) : (
        <div>
          {discussions?.map((discussion) => {
            const isActive = activeDiscussionID === discussion.ID;

            return (
              <div
                key={discussion.ID}
                className={`border border-gray-200 shadow-sm rounded-lg mb-4 transition-all duration-300 overflow-hidden ${isActive ? 'bg-gray-50 shadow-md' : 'bg-white hover:shadow'
                  }`}
              >
                {/* Clickable Summary Area */}
                <div
                  onClick={() =>
                    setActiveDiscussionID(isActive ? null : discussion.ID)
                  }
                  className="p-5 cursor-pointer"
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {discussion.Title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {discussion.Content}
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      title={discussion.AuthorUsername}
                      className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold hover:bg-blue-600"
                    >
                      {discussion.AuthorUsername.charAt(0).toUpperCase()}
                    </button>
                    <span className="text-sm text-gray-700">{discussion.AuthorUsername}</span>
                  </div>

                  {discussion?.Tags?.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {discussion?.Tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-0.5 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Voting */}
                  <div className="mt-4 flex items-center gap-3 text-sm text-gray-700">
                    <span className="font-medium">Votes: {discussion.Votes}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(discussion.ID, 1);
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      disabled={votingState[discussion.ID]}
                    >
                      👍
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(discussion.ID, -1);
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
                      disabled={votingState[discussion.ID]}
                    >
                      👎
                    </button>
                  </div>
                </div>

                {/* Expanded Section */}
                {isActive && (
                  <div className="border-t border-gray-200 px-5 pb-5 pt-3">
                    <h4 className="font-semibold text-sm text-gray-800 mb-1">Comments:</h4>
                    {discussion?.Comments?.length === 0 ? (
                      <p className="text-sm text-gray-500 italic">No comments yet.</p>
                    ) : (
                      <ul className="mt-2 space-y-3 text-sm text-gray-700">
                        {discussion?.Comments?.map((comment) => (
                          <li key={comment.ID} className="flex items-start gap-3">
                            <div
                              title={comment.AuthorUsername}
                              className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center text-sm font-bold"
                            >
                              {comment.AuthorUsername.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">{comment.AuthorUsername}</p>
                              <p className="text-sm text-gray-700">{comment.Content}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {
                      user ? (
                        <div className="mt-4 flex items-start gap-3">
                          <div
                            title={user.Username}
                            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold"
                          >
                            {user.Username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={commentInput}
                              onChange={(e) => setCommentInput(e.target.value)}
                              placeholder="Write your comment..."
                              className="border border-gray-300 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                            <button
                              onClick={() => handleAddComment(discussion.ID)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4">
                          <p className="text-gray-700">
                            <span className="font-medium">Login</span> to add a comment.
                            <button
                              onClick={handleLoginRedirect}
                              className="ml-2 text-blue-600 hover:underline font-semibold"
                            >
                              Click here to login.
                            </button>
                          </p>
                        </div>
                      )
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Discussion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Create Discussion</h3>
            <input
              type="text"
              className="border border-gray-300 p-2 rounded mb-4 w-full"
              placeholder="Discussion Title"
              value={newDiscussion.Title}
              onChange={e => handleInputChange(e, 'Title')}
            />
            <textarea
              className="border border-gray-300 p-2 rounded mb-4 w-full"
              placeholder="Discussion Content"
              value={newDiscussion.Content}
              onChange={e => handleInputChange(e, 'Content')}
            />
            {errorMessage && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
            <div className="flex justify-between">
              <button
                onClick={handleCreateDiscussion}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionsTab;

import React, { useState } from 'react';
import type {Discussion, DiscussionComment} from "../types"


const DiscussionsTab: React.FC<{ discussions: Discussion[]; onCreateDiscussion: (discussion: Discussion) => void; }> = ({ discussions, onCreateDiscussion }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState<Discussion>({
    ID: 0,
    Title: '',
    Content: '',
    Tags: [],
    AuthorID: 0,
    Votes: 0,
    Comments: []
  });
 
  const [newComment, setNewComment] = useState<string>('');

  // Handle modal open/close
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Handle input change for discussion creation
  const handleDiscussionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewDiscussion({ ...newDiscussion, [field]: e.target.value });
  };

  // Handle comment input change
  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  // Handle creating a discussion
  const handleCreateDiscussion = () => {
    if (newDiscussion.Title && newDiscussion.Content) {
      onCreateDiscussion(newDiscussion);
      handleCloseModal(); // Close modal after submitting
      setNewDiscussion({ ...newDiscussion, Title: '', Content: '' }); // Clear fields
    }
  };

  // Handle adding a comment to a discussion
  const handleAddComment = (discussionID: number) => {
    if (newComment.trim()) {
      // Add the new comment to the relevant discussion
      const updatedDiscussions = discussions.map(d => {
        if (d.ID === discussionID) {
          return { ...d, Comments: [...d.Comments, { ID: Date.now(), Content: newComment, AuthorID: 1 }] }; // Add comment
        }
        return d;
      });
      onCreateDiscussion(updatedDiscussions);
      setNewComment(''); // Clear comment input
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Discussions</h2>

      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Create Discussion
      </button>

      {!discussions || discussions.length === 0 ? (
        <p>No discussions yet. Be the first to start one!</p>
      ) : (
        <div>
          {discussions?.map((discussion) => (
            <div key={discussion.ID} className="border border-gray-300 p-4 rounded mb-4">
              <h3 className="font-bold text-lg">{discussion.Title}</h3>
              <p className="text-sm text-gray-600 mt-1">{discussion.Content}</p>
              <div className="mt-2">
                <span className="text-sm text-gray-500">Tags: </span>
                {discussion.Tags?.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs mr-2">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <h4 className="font-semibold text-sm">Comments:</h4>
                {!discussion.Comments || discussion.Comments.length === 0 ? (
                  <p>No comments yet.</p>
                ) : (
                  <ul className="list-disc list-inside">
                    {discussion.Comments?.map((comment) => (
                      <li key={comment.ID} className="text-sm mt-2">
                        <strong>Comment by User {comment.AuthorID}:</strong> {comment.Content}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Add comment form */}
              <div className="mt-4 flex">
                <input
                  type="text"
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  className="border border-gray-300 px-2 py-1 rounded w-full"
                />
                <button
                  onClick={() => handleAddComment(discussion.ID)}
                  className="bg-green-500 text-white px-4 py-2 rounded ml-2"
                >
                  Add Comment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Discussion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Create Discussion</h3>
            <div>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded mb-4 w-full"
                placeholder="Discussion Title"
                value={newDiscussion.Title}
                onChange={(e) => handleDiscussionInputChange(e, 'Title')}
              />
              <textarea
                className="border border-gray-300 p-2 rounded mb-4 w-full"
                placeholder="Discussion Content"
                value={newDiscussion.Content}
                onChange={(e) => handleDiscussionInputChange(e, 'Content')}
              />
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
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionsTab;

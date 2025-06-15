import React, { useEffect, useState } from 'react';
import {
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  voteDiscussion,
  getDiscussions,
} from '../api/endpoints';
import type { Discussion, AddVotePayload, Vote } from '../types';

interface Props {
  problemID: number;
  isOpen: boolean;
  onClose: () => void;
}

// Modes for modal
type Mode = 'list' | 'detail' | 'edit';

const DiscussionModal: React.FC<Props> = ({ problemID, isOpen, onClose }) => {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [selected, setSelected] = useState<Discussion | null>(null);
  const [mode, setMode] = useState<Mode>('list');

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  //   const [loading, setLoading] = useState(false);

  // Fetch all discussions (mock: fetch single or multiple if supported)
  const loadDiscussions = async () => {
    try {
      const { data } = await getDiscussions(problemID); // assumes this returns an array
      setDiscussions(Array.isArray(data) ? data : [data]); // support single discussion fallback
    } catch {
      setDiscussions([]);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadDiscussions();
    setMode('list');
    setSelected(null);
  }, [isOpen]);

  const openDetail = (disc: Discussion) => {
    setSelected(disc);
    setMode('detail');
  };

  const openEdit = (disc?: Discussion) => {
    setSelected(disc || null);
    setTitle(disc?.Title || '');
    setContent(disc?.Content || '');
    setTags(disc?.Tags?.join(', ') || '');
    setMode('edit');
  };

  const handleSave = async () => {
    const payload: Discussion = {
      ID: selected?.ID || problemID,
      Title: title.trim(),
      Content: content.trim(),
      Tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      AuthorID: 1, // replace with actual user ID
      Votes: selected?.Votes || 0,
      Comments: selected?.Comments || [],
    };

    try {
      if (selected) {
        await updateDiscussion(payload);
      } else {
        await createDiscussion(payload);
      }
      await loadDiscussions();
      setMode('list');
    } catch {
      alert('Failed to save discussion.');
    }
  };

  const handleVote = async (vote: Vote) => {
    if (!selected) return;
    const payload: AddVotePayload = {
      DiscussionID: selected.ID,
      Vote: vote,
    };

    try {
      await voteDiscussion(payload);
      const updated = await getDiscussion(problemID);
      setSelected(updated.data);
      loadDiscussions(); // update list view too
    } catch {
      alert('Voting failed.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative shadow-lg max-h-[90vh] overflow-y-auto space-y-4">
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl text-gray-700 hover:text-black">
          &times;
        </button>

        {/* LIST VIEW */}
        {mode === 'list' && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Discussions</h2>
              <button
                onClick={() => openEdit()}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                + New
              </button>
            </div>
            {discussions.length === 0 && (
              <p className="text-gray-500 text-sm">No discussions yet.</p>
            )}
            <ul className="space-y-3">
              {discussions.map((d) => (
                <li key={d.ID} className="border p-3 rounded bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{d.Title}</h3>
                      <div className="text-xs text-gray-600 flex flex-wrap gap-2 mt-1">
                        {d.Tags?.map((tag) => (
                          <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm">👍 {d.Votes}</span>
                      <button onClick={() => openDetail(d)} className="text-blue-600 text-sm hover:underline">
                        View
                      </button>
                      <button onClick={() => openEdit(d)} className="text-yellow-600 text-sm hover:underline">
                        Edit
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* DETAIL VIEW */}
        {mode === 'detail' && selected && (
          <>
            <h2 className="text-xl font-bold">{selected.Title}</h2>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">{selected.Content}</div>
            <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-2">
              {selected.Tags?.map((tag) => (
                <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button onClick={() => handleVote(+1)} className="text-green-600 hover:text-green-800">👍 Upvote</button>
              <span>{selected.Votes}</span>
              <button onClick={() => handleVote(-1)} className="text-red-600 hover:text-red-800">👎 Downvote</button>
            </div>
            <hr className="my-4" />
            <h4 className="font-medium">Comments</h4>
            {selected.Comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}
            <ul className="space-y-2 mt-2">
              {selected.Comments.map((c) => (
                <li key={c.ID} className="bg-gray-100 p-2 rounded text-sm text-gray-800">
                  {c.Content}
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setMode('list')}
                className="text-gray-600 text-sm hover:underline"
              >
                ← Back
              </button>
            </div>
          </>
        )}

        {/* EDIT / CREATE VIEW */}
        {mode === 'edit' && (
          <>
            <h2 className="text-xl font-bold">{selected ? 'Edit Discussion' : 'New Discussion'}</h2>
            <div className="space-y-3">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                rows={5}
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
                className="w-full border px-3 py-2 rounded text-sm"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setMode('list')} className="text-sm text-gray-600 hover:underline">Cancel</button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DiscussionModal;

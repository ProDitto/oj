import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProfile } from '../api/endpoints';
import type { User } from '../types';

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    getProfile(username)
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!user) return <div className="p-6 text-red-600">User not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
      <div className="bg-white shadow rounded p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-semibold">
            {user.Username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.Username}</h2>
            <p className="text-sm text-gray-500">{user.Email}</p>
            <p className="text-sm text-gray-700 mt-1">Role: {user.Role}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 text-sm">Rating: <span className="font-semibold">{user.Rating}</span></p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h3 className="text-xl font-semibold mb-4">Solved Problems</h3>
        {user.SolvedProblems?.length === 0 ? (
          <p className="text-sm text-gray-500">No problems solved yet.</p>
        ) : (
          <ul className="space-y-2">
            {user.SolvedProblems?.map((problem) => (
              <li key={problem.ID} className="flex items-center justify-between text-sm">
                <span>{problem.Title}</span>
                <span className="text-gray-500 text-xs capitalize">{problem.Difficulty}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

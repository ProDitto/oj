import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { logout } from "../api/endpoints"
import type { User } from '../types';

type NavbarProps = {
    user: User | undefined;
    getUserProfile: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ user, getUserProfile }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        ; (
            async () => {

                console.log('Logging out...');
                try {
                    await logout();
                    getUserProfile();
                    navigate('/problems');
                } catch (err) {
                    console.log("Error: ", err)
                }
            }
        )()
    };

    const handleProfileClick = () => {
        navigate(`/profile/${user?.Username}`);
    };

    return (
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <NavLink to="/" className="text-xl font-bold text-blue-600">
                        CodeArena
                    </NavLink>

                    <NavLink
                        to="/problems"
                        className={({ isActive }) =>
                            `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`
                        }
                    >
                        Problems
                    </NavLink>

                    <NavLink
                        to="/contests"
                        className={({ isActive }) =>
                            `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`
                        }
                    >
                        Contests
                    </NavLink>
                    {
                        user?.Role == "admin" &&
                        <NavLink
                            to="/admin/problems"
                            className={({ isActive }) =>
                                `text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`
                            }
                        >
                            Admin
                        </NavLink>
                    }
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Logout
                            </button>
                            <button
                                onClick={handleProfileClick}
                                className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold hover:bg-blue-600"
                                title="Profile"
                            >
                                {user.Username?.charAt(0).toUpperCase()}
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink
                                to="/auth"
                                className="text-sm text-gray-700 hover:text-blue-600"
                            >
                                Auth
                            </NavLink>
                            {/* <NavLink
                                to="/auth"
                                className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-700"
                            >
                                Sign Up
                            </NavLink> */}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

// src/components/ProfilePage.jsx (or your preferred path)
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Axios will use the global configuration you've set up

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            setLoading(true);
            try {
                // Replace '/api/profile' with your actual backend endpoint for fetching user profile.
                // Your axiosConfig will automatically add the baseURL (http://localhost:3000)
                // and the Authorization header if a token exists in localStorage.
                const response = await axios.get('/api/profile');
                setProfileData(response.data);
                setError(null); // Clear any previous errors
            } catch (err) {
                console.error("Error fetching profile data:", err);
                if (err.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    setError(`Failed to load profile: ${err.response.status} - ${err.response.data.message || err.message}`);
                } else if (err.request) {
                    // The request was made but no response was received
                    setError("Failed to load profile: No response from server.");
                } else {
                    // Something happened in setting up the request that triggered an Error
                    setError(`Failed to load profile: ${err.message}`);
                }
                setProfileData(null); // Clear any previous data
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []); // The empty dependency array ensures this effect runs only once when the component mounts

    if (loading) {
        return <div className="profile-page-loading">Loading profile...</div>;
    }

    if (error) {
        return <div className="profile-page-error">Error: {error}</div>;
    }

    if (!profileData) {
        // This case might occur if the API call succeeds but returns no data,
        // or if an error occurred and was handled.
        return <div className="profile-page-no-data">No profile data available.</div>;
    }

    // --- Render Profile Data ---
    // Adjust the fields below based on the actual structure of your user profile data
    // e.g., response.data might look like: { id: 1, name: "John Doe", email: "john@example.com", bio: "..." }
    return (
        <div className="profile-page">
            <h1>User Profile</h1>
            <div className="profile-details">
                <p><strong>ID:</strong> {profileData.id || 'N/A'}</p>
                <p><strong>Name:</strong> {profileData.name || 'N/A'}</p>
                <p><strong>Email:</strong> {profileData.email || 'N/A'}</p>
                {/* Add more fields as they exist in your profileData object */}
                {profileData.username && <p><strong>Username:</strong> {profileData.username}</p>}
                {profileData.bio && <p><strong>Bio:</strong> {profileData.bio}</p>}
                {/* Example for an image:
                {profileData.avatarUrl && (
                    <img src={profileData.avatarUrl} alt={`${profileData.name}'s avatar`} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                )}
                */}
            </div>
        </div>
    );
}

export default ProfilePage;
import { useState } from 'react';

// Define the props that this component receives from App.tsx
interface MainProps {
    setShowOptions: (show: boolean) => void;
    theme: "light" | "dark";
}

// Define a type for the user info object we expect from the API
interface UserInfo {
    handle: string;
    rating?: number;
    rank?: string;
    titlePhoto: string;
    // Add any other fields you need from the API response
}

const Main = ({ setShowOptions, theme }: MainProps) => {
    // --- START: State variables for handling data, loading, and errors ---
    const [handle, setHandle] = useState('');
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // --- END: State variables ---

    // Function to fetch data from Codeforces API
    const fetchUserData = async () => {
        if (!handle) {
            setError('Please enter a Codeforces handle.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setUserInfo(null);

        try {
            const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);

            if (!response.ok) {
                // This catches network errors (e.g., 500 server error)
                throw new Error('Network error. Codeforces might be down or your connection is lost.');
            }

            const data = await response.json();

            if (data.status === 'OK') {
                setUserInfo(data.result[0]);
            } else {
                // This catches API errors (e.g., user not found)
                throw new Error(data.comment || `User with handle '${handle}' not found.`);
            }
        } catch (err: any) {
            // This catches any error from the try block and displays it
            setError(err.message || 'An unexpected error occurred. Please try again.');
            console.error("Failed to fetch data:", err);
        } finally {
            setIsLoading(false); // Stop loading, regardless of outcome
        }
    };

    // Handler for form submission
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault(); // Prevents page reload on form submission
        fetchUserData();
    };

    return (
        // Added dark theme class for text color
        <div className={`p-4 md:p-8 h-full flex flex-col items-center justify-center ${theme === 'dark' ? 'dark text-white' : ''}`}>
            {/* Header section with options button */}
            <div className="absolute top-4 right-4">
                <button onClick={() => setShowOptions(true)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
            </div>

            <div className="w-full max-w-md text-center">
                <h1 className="text-4xl font-bold mb-4">Codeforces Quest</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Enter a handle to fetch user data.</p>
                
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="e.g., tourist"
                        className="flex-grow p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </form>

                {/* --- Display error, loading, or user info --- */}
                <div className="mt-6">
                    {error && <div className="error-message">{error}</div>}
                    {isLoading && <p>Loading user data...</p>}
                    {userInfo && (
                        <div className="user-info-card dark:bg-gray-800">
                            <img src={userInfo.titlePhoto} alt={`${userInfo.handle}'s avatar`} className="avatar" />
                            <h2 className="text-2xl font-bold">{userInfo.handle}</h2>
                            <p className="text-lg">Rating: {userInfo.rating || 'Unrated'}</p>
                            <p className="text-md capitalize">{userInfo.rank || 'No Rank'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Main;
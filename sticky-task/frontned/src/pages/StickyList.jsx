import React, { useEffect, useState } from 'react';
import { useFetchStickies, useCreateSticky, useDeleteSticky } from '../application-wide/api-gateways-hook/api-sticky-hooks';
import './StickyList.css';

const StickyList = () => {
    const [newSticky, setNewSticky] = useState('');
    const [page, setPage] = useState(1);
    const limit = 10;

    const { loading: loadingFetch, error: errorFetch, fetchStickies, stickies } = useFetchStickies(page, limit);
    const { loading: loadingCreate, error: errorCreate, onCreateSticky } = useCreateSticky();
    const { loading: loadingDelete, error: errorDelete, onDeleteSticky } = useDeleteSticky();

    const handleAddSticky = async () => {
        if (!newSticky) return;

        try {
            await onCreateSticky(newSticky);
            setNewSticky('');
            await fetchStickies(); // Refresh the stickies after adding a new one
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleDeleteSticky = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this sticky note?');
        if (!confirmDelete) return;

        try {
            await onDeleteSticky(id);
            await fetchStickies(); // Refresh the stickies after deletion
        } catch (err) {
            console.error(err.message);
        }
    };

    const loadMoreStickies = async () => {
        setPage((prev) => prev + 1); // Increment the page number
        await fetchStickies(); // Fetch stickies for the new page
    };

    useEffect(() => {
        fetchStickies(); // Initial fetch
    }, [fetchStickies]);

    return (
        <div className="sticky-list">
            <header className="sticky-header">
                <h1>My Sticky Notes</h1>
            </header>

            <div className="sticky-input">
                <input
                    type="text"
                    value={newSticky}
                    onChange={(e) => setNewSticky(e.target.value)}
                    placeholder="Add a new sticky note..."
                />
                <button onClick={handleAddSticky} disabled={loadingCreate}>
                    {loadingCreate ? 'Adding...' : 'Add'}
                </button>
            </div>

            {loadingFetch && <div className="loader">Loading...</div>}
            {errorFetch && <div className="error">{errorFetch}</div>}
            {errorCreate && <div className="error">{errorCreate}</div>}
            {errorDelete && <div className="error">{errorDelete}</div>}

            <ul className="sticky-items">
                {Array.isArray(stickies) && stickies.map((sticky) => ( 
                    <li key={sticky.id} className="sticky-item">
                        {sticky.content}
                        <button onClick={() => handleDeleteSticky(sticky.id)} disabled={loadingDelete}>
                            {loadingDelete ? 'Deleting...' : 'Delete'}
                        </button>
                    </li>
                ))}
            </ul>

            <footer className="footer-loader">
                {!loadingFetch && !errorFetch && (
                    <button onClick={loadMoreStickies} disabled={loadingFetch}>
                        Load More
                    </button>
                )}
            </footer>
        </div>
    );
};

export default StickyList;

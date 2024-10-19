import { useCallback } from 'react';
import useAxios from '../axios';

const STICKY_API_URL = 'api/sticky';

export const useFetchStickies = (page, limit) => {
    const { loading, error, value = [], fetch } = useAxios(); 

    const fetchStickies = useCallback(async () => {
        const response = await fetch('GET', `${STICKY_API_URL}?page=${page}&limit=${limit}`);
        return response.data; 
    }, [fetch, page, limit]);

    return { loading, error, stickies: value.data, fetchStickies };
};



export const useCreateSticky = () => {
    const { loading, error, value, fetch } = useAxios();

    const onCreateSticky = useCallback(
        async (content) => {
            return await fetch('POST', STICKY_API_URL, { content });
        },
        [fetch]
    );

    return { loading, error, value, onCreateSticky };
};

export const useDeleteSticky = () => {
    const { loading, error, value, fetch } = useAxios();

    const onDeleteSticky = useCallback(
        async (id) => {
            return await fetch('DELETE', `${STICKY_API_URL}/${id}`);
        },
        [fetch]
    );

    return { loading, error, value, onDeleteSticky };
};

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

interface FavoritesContextType {
    favorites: number[];
    toggleFavorite: (deskrlId: number) => Promise<void>;
    isFavorited: (deskrlId: number) => boolean;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    toggleFavorite: async () => {},
    isFavorited: () => false,
    clearFavorites: () => {},
});

interface FavoritesProviderProps {
    children: ReactNode;
    isLoggedIn: boolean;
}

export function FavoritesProvider({ children, isLoggedIn }: FavoritesProviderProps) {
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        // Logged-in users load favorite Deskrl IDs from the database.
        if (isLoggedIn) {
            axios.get('/favorites/ids')
                .then((response) => {
                    setFavorites(response.data ?? []);
                })
                .catch(() => {
                    setFavorites([]);
                });

            return;
        }

        // Guests store favorite Deskrl IDs locally in the browser.
        try {
            const stored = localStorage.getItem('deskrl_favorites');
            setFavorites(stored ? JSON.parse(stored) : []);
        } catch {
            setFavorites([]);
        }
    }, [isLoggedIn]);

    useEffect(() => {
        // Guest favorites are persisted in localStorage.
        if (!isLoggedIn) {
            localStorage.setItem('deskrl_favorites', JSON.stringify(favorites));
        }
    }, [favorites, isLoggedIn]);

    const toggleFavorite = async (deskrlId: number) => {
        // Guests can favorite Deskrls locally without an account.
        if (!isLoggedIn) {
            setFavorites((previousFavorites) =>
                previousFavorites.includes(deskrlId)
                    ? previousFavorites.filter((id) => id !== deskrlId)
                    : [...previousFavorites, deskrlId]
            );

            return;
        }

        // Logged-in users remove existing favorites from the database.
        if (favorites.includes(deskrlId)) {
            await axios.delete(`/deskrls/${deskrlId}/favorite`);

            setFavorites((previousFavorites) =>
                previousFavorites.filter((id) => id !== deskrlId)
            );

            return;
        }

        // Logged-in users save new favorites in the database.
        await axios.post(`/deskrls/${deskrlId}/favorite`);

        setFavorites((previousFavorites) => [...previousFavorites, deskrlId]);
    };

    const isFavorited = (deskrlId: number) => {
        return favorites.includes(deskrlId);
    };

    const clearFavorites = () => {
        setFavorites([]);
        localStorage.removeItem('deskrl_favorites');
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                toggleFavorite,
                isFavorited,
                clearFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);

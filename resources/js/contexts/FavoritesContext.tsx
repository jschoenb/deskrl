import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

interface FavoritesContextType {
    favorites: number[];
    toggleFavorite: (id: number) => void;
    isFavorited: (id: number) => boolean;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favorites: [],
    toggleFavorite: () => {},
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
        if (isLoggedIn) {
            axios.get('/favourites')
                .then(res => {
                    const ids = res.data.map((listing: any) => listing.id);
                    setFavorites(ids);
                })
                .catch(() => {});
        } else {
            try {
                const stored = localStorage.getItem('deskrl_favorites');
                setFavorites(stored ? JSON.parse(stored) : []);
            } catch {
                setFavorites([]);
            }
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem('deskrl_favorites', JSON.stringify(favorites));
        }
    }, [favorites, isLoggedIn]);

    const toggleFavorite = async (id: number) => {
        if (isLoggedIn) {
            // CSRF Token holen
            const csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken ?? '');

            if (favorites.includes(id)) {
                await axios.delete(`/favourites/${id}`);
                setFavorites(prev => prev.filter(f => f !== id));
            } else {
                await axios.post(`/favourites/${id}`);
                setFavorites(prev => [...prev, id]);
            }
        } else {
            setFavorites(prev =>
                prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
            );
        }
    };

    const isFavorited = (id: number) => favorites.includes(id);

    const clearFavorites = () => {
        setFavorites([]);
        localStorage.removeItem('deskrl_favorites');
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorited, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => useContext(FavoritesContext);

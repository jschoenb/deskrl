import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Favorites: InertiaPage = () => {
    return <h1>Favorites</h1>;
};
Favorites.layout = page => <AppLayout>{page}</AppLayout>;
export default Favorites;

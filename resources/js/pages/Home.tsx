import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Home: InertiaPage = () => {
    return <h1>Home</h1>;
};
Home.layout = page => <AppLayout>{page}</AppLayout>;
export default Home;

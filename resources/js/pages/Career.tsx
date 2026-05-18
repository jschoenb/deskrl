import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Career: InertiaPage = () => {
    return <h1>Career</h1>;
};
Career.layout = page => <AppLayout>{page}</AppLayout>;
export default Career;

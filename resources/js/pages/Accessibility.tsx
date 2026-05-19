import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Accessibility: InertiaPage = () => {
    return <h1>Accessibility</h1>;
};
Accessibility.layout = page => <AppLayout>{page}</AppLayout>;
export default Accessibility;

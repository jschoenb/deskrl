import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const SupportProvider: InertiaPage = () => {
    return <h1>SupportProvider</h1>;
};
SupportProvider.layout = page => <AppLayout>{page}</AppLayout>;
export default SupportProvider;

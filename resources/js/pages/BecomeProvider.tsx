import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const BecomeProvider: InertiaPage = () => {
    return <h1>BecomeProvider</h1>;
};
BecomeProvider.layout = page => <AppLayout>{page}</AppLayout>;
export default BecomeProvider;

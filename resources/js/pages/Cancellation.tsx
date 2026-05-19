import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Cancellation: InertiaPage = () => {
    return <h1>Cancellation</h1>;
};
Cancellation.layout = page => <AppLayout>{page}</AppLayout>;
export default Cancellation;

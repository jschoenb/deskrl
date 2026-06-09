import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Revocation: InertiaPage = () => {
    return <h1>Revocation</h1>;
};
Revocation.layout = page => <AppLayout>{page}</AppLayout>;
export default Revocation;

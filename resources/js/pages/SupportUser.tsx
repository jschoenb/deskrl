import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const SupportUser: InertiaPage = () => {
    return <h1>SupportUser</h1>;
};
SupportUser.layout = page => <AppLayout>{page}</AppLayout>;
export default SupportUser;

import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const FaqUser: InertiaPage = () => {
    return <h1>FaqUser</h1>;
};
FaqUser.layout = page => <AppLayout>{page}</AppLayout>;
export default FaqUser;

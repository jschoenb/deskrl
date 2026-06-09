import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Terms: InertiaPage = () => {
    return <h1>Terms</h1>;
};
Terms.layout = page => <AppLayout>{page}</AppLayout>;
export default Terms;

import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const PrivacyPolicy: InertiaPage = () => {
    return <h1>PrivacyPolicy</h1>;
};
PrivacyPolicy.layout = page => <AppLayout>{page}</AppLayout>;
export default PrivacyPolicy;

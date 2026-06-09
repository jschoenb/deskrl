import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const LegalNotice: InertiaPage = () => {
    return <h1>LegalNotice</h1>;
};
LegalNotice.layout = page => <AppLayout>{page}</AppLayout>;
export default LegalNotice;

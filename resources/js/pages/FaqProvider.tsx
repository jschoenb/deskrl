import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const FaqProvider: InertiaPage = () => {
    return <h1>FaqProvider</h1>;
};
FaqProvider.layout = page => <AppLayout>{page}</AppLayout>;
export default FaqProvider;

import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Bookings: InertiaPage = () => {
    return <h1>Bookings</h1>;
};
Bookings.layout = page => <AppLayout>{page}</AppLayout>;
export default Bookings;

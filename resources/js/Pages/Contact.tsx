import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const Contact: InertiaPage = () => {
    return <h1>Contact</h1>;
};
Contact.layout = page => <AppLayout>{page}</AppLayout>;
export default Contact;

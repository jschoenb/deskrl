import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const About: InertiaPage = () => {
    return <h1>About</h1>;
};
About.layout = page => <AppLayout>{page}</AppLayout>;
export default About;

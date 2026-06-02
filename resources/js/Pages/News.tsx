import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';
const News: InertiaPage = () => {
    return <h1>News</h1>;
};
News.layout = page => <AppLayout>{page}</AppLayout>;
export default News;

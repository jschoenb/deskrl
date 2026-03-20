import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Hello World</h1>

            <Link href="/users">Go to Users</Link>
        </div>
    );
}

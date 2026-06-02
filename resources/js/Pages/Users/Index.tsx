// resources/js/Pages/Users_old/Index.tsx

import AppLayout from '@/Layouts/AppLayout';
import { InertiaPage } from '@/types/inertia';

type Props = {
    users: { id: number; name: string }[];
};

const Users: InertiaPage<Props> = ({ users }) => {
    return (
        <div>
            <h1>User List -- index-file</h1>
            {users.map(u => (
                <div key={u.id}>{u.name}</div>
            ))}
        </div>
    );
};

// 👇 Layout zuweisen
Users.layout = page => <AppLayout>{page}</AppLayout>;

export default Users;

type User = {
    id: number;
    name: string;
    email: string;
};

export default function Users({ users }: { users: User[] }) {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>User List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </div>
    );
}

import { ArrowUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type User = {
    id: number;
    name: string;
    email: string;
};

export default function Users_old({ users }: { users: User[] }) {
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


            <div className="flex flex-wrap items-center gap-2 md:flex-row">
            <Button variant="outline">Button</Button>
            <Button variant="outline" size="icon" aria-label="Submit">
            <ArrowUpIcon />
            </Button>
            </div>

            <h1>hallo</h1>

        </div>
    );
}

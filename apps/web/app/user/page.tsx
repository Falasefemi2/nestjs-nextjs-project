"use client";

import ProtectedRoute from "@/components/protectedroutes";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/zutsand/store";


export default function UserPage() {
    const { logout } = useAuthStore();

    return (
        <ProtectedRoute role={['user']}>
            <div>
                <h1>User Dashboard</h1>
                <Button onClick={logout}>Log out</Button>

                {/* Your user content */}
            </div>
        </ProtectedRoute>
    );
}

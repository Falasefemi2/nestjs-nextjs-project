
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/zutsand/store";
import NotFound from "@/app/not-found";

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: string[];
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
    const router = useRouter();
    const { isAuthenticated, user, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (_hasHydrated && (!isAuthenticated || !user)) {
            router.push("/");
        }
    }, [_hasHydrated, isAuthenticated, user, router]);

    if (!_hasHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    if (role && role.length > 0) {
        const userRoles = user.role
            .split(",")
            .map((r) => r.trim().toLowerCase());

        const hasAccess = role.some((allowedRole) =>
            userRoles.includes(allowedRole.toLowerCase())
        );

        if (!hasAccess) {
            return <NotFound />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;

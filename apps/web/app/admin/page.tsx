"use client";

import ProtectedRoute from "@/components/protectedroutes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, User, Mail, Calendar, Users } from "lucide-react";
import { useAuthStore } from "@/zutsand/store";
import { useUsersStore } from "@/zutsand/users";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Assuming you're using sonner for toasts

const AdminDashboard = () => {
    const {
        users,
        isLoading,
        error,
        getAllUsers,
        deleteUser,
        clearError
    } = useUsersStore();
    const { logout, token, user: currentUser } = useAuthStore();
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

    console.log({ currentUser })
    console.log({ users })
    console.log({ token })

    useEffect(() => {
        if (token) {
            getAllUsers(token);
        }
    }, [token, getAllUsers]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            clearError();
        }
    }, [error, clearError]);

    const handleDeleteUser = async (userId: number) => {
        if (!token) return;

        // Prevent admin from deleting themselves
        if (currentUser?.id === userId) {
            toast.error("You cannot delete your own account");
            return;
        }

        if (window.confirm("Are you sure you want to delete this user?")) {
            setDeletingUserId(userId);
            try {
                await deleteUser(userId, token);
                toast.success("User deleted successfully");
            } catch (error) {
                toast.error("Failed to delete user");
            } finally {
                setDeletingUserId(null);
            }
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'admin':
                return 'bg-red-500 hover:bg-red-600';
            case 'user':
                return 'bg-blue-500 hover:bg-blue-600';
            case 'moderator':
                return 'bg-yellow-500 hover:bg-yellow-600';
            default:
                return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <ProtectedRoute role={['admin']}>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-1">Manage users and system settings</p>
                    </div>
                    <Button onClick={logout} variant="outline">
                        Log out
                    </Button>
                </div>

                {/* Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            User Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">{users.length}</Badge>
                                <span className="text-sm text-gray-600">Total Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    {users.filter(user => user.role === 'admin').length}
                                </Badge>
                                <span className="text-sm text-gray-600">Admins</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary">
                                    {users.filter(user => user.role === 'user').length}
                                </Badge>
                                <span className="text-sm text-gray-600">Regular Users</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Users</CardTitle>
                        <CardDescription>
                            Manage all registered users in the system
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <span className="ml-2">Loading users...</span>
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No users found</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {users.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium text-gray-900">
                                                        {user.name}
                                                    </h3>
                                                    <Badge
                                                        className={`text-white ${getRoleBadgeColor(user.role)}`}
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                    {currentUser?.id === user.id && (
                                                        <Badge variant="outline">You</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                    {user.createdAt && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Joined {formatDate(user.createdAt)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    // Handle edit user - you can implement this later
                                                    toast.info("Edit functionality coming soon!");
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={deletingUserId === user.id || currentUser?.id === user.id}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                {deletingUserId === user.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                ) : (
                                                    <Trash2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
};

export default AdminDashboard;
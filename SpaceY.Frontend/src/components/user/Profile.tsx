'use client'
import React, { useEffect, useState } from "react";
import { Avatar, Input, Typography, Button, Card, CardBody } from "@/components/ui/MaterialTailwind";
// import { User } from "@/types/user";
import { AddressDto, CreateAddressDto } from "@/types/address";
// import AuthServices from "@/services/AuthServices";
import addressService from "@/services/AddressServices";
import UserServices from "@/services/UserServices";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
// import AuthServices from "@//auth";
// import addressService from "@/services/address";


type TabType = 'profile' | 'address' | 'changepassword';

function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState<AddressDto[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [loading, setLoading] = useState(false);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        username: user?.username || '',
        email: user?.email || '',
        avatarUrl: user?.avatarUrl || ''
    });


    // Address form state
    const [addressForm, setAddressForm] = useState<CreateAddressDto>({
        firstName: '',
        lastName: '',
        street: '',
        city: '',
        state: '',
        phoneNumber: ''
    });

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });



    // useEffect(() => {
    //     fetchUserData();
    // }, []);

    useEffect(() => {
        if (activeTab === 'address') {
            fetchAddresses();
        }
    }, [activeTab]);

    // const fetchUserData = async () => {
    //     try {
    //         setLoading(true);
    //         const userData = await AuthServices.GetCurrentUser();
    //         setUser(userData);
    //         setProfileForm({
    //             username: userData.username,
    //             email: userData.email,
    //             avatarUrl: userData.avatarUrl
    //         });
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        setProfileForm({
            username: user.username,
            email: user.email,
            avatarUrl: user.avatarUrl
        });
    }, [user, router]);
    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const addressData = await addressService.getAll();
            setAddresses(addressData);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            setLoading(true);
            const updatedUser = await UserServices.updateUser(user.email, {
                username: profileForm.username,
                email: profileForm.email,
                avatarUrl: profileForm.avatarUrl,
                // role: user.role
            });

            // Update local form state with new data
            setProfileForm({
                username: updatedUser.username,
                email: updatedUser.email,
                avatarUrl: updatedUser.avatarUrl || ''
            });

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            await addressService.create(addressForm);
            await fetchAddresses();
            setAddressForm({
                firstName: '',
                lastName: '',
                street: '',
                city: '',
                state: '',
                phoneNumber: ''
            });
            setShowAddAddressForm(false);
            alert('Address added successfully!');
        } catch (error) {
            console.error('Error adding address:', error);
            alert('Failed to add address');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAddress = async (id: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            try {
                setLoading(true);
                await addressService.delete(id);
                await fetchAddresses();
                alert('Address deleted successfully!');
            } catch (error) {
                console.error('Error deleting address:', error);
                alert('Failed to delete address');
            } finally {
                setLoading(false);
            }
        }
    };

    const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === tab
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
        >
            {label}
        </button>
    );

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div>
                <Typography variant="h5" color="blue-gray">
                    Profile Information
                </Typography>
                <Typography variant="small" className="text-gray-600 font-normal mt-1">
                    Update your profile information below.
                </Typography>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Username
                        </Typography>
                        <Input
                            size="lg"
                            value={profileForm.username}
                            onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                            className="w-full"
                        />
                    </div>
                    <div>
                        <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                            Email
                        </Typography>
                        <Input
                            size="lg"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full"
                        />
                    </div>
                </div>

                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Avatar URL
                    </Typography>
                    <Input
                        size="lg"
                        value={profileForm.avatarUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                        className="w-full"
                    />
                </div>

                <Button type="submit" disabled={loading} className="bg-blue-500">
                    {loading ? 'Updating...' : 'Update Profile'}
                </Button>
            </form>
        </div>
    );

    const renderAddressTab = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Your Addresses
                    </Typography>
                    <Typography variant="small" className="text-gray-600 font-normal mt-1">
                        Manage your delivery addresses.
                    </Typography>
                </div>
                <Button
                    onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                    className="bg-blue-500"
                >
                    {showAddAddressForm ? 'Cancel' : 'Add New Address'}
                </Button>
            </div>

            {showAddAddressForm && (
                <Card>
                    <CardBody>
                        <Typography variant="h6" color="blue-gray" className="mb-4">
                            Add New Address
                        </Typography>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                        First Name
                                    </Typography>
                                    <Input
                                        size="lg"
                                        value={addressForm.firstName}
                                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                        Last Name
                                    </Typography>
                                    <Input
                                        size="lg"
                                        value={addressForm.lastName}
                                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                    Street Address
                                </Typography>
                                <Input
                                    size="lg"
                                    value={addressForm.street}
                                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                        City
                                    </Typography>
                                    <Input
                                        size="lg"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                        State
                                    </Typography>
                                    <Input
                                        size="lg"
                                        value={addressForm.state}
                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                                    Phone Number
                                </Typography>
                                <Input
                                    size="lg"
                                    value={addressForm.phoneNumber}
                                    onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={loading} className="bg-blue-500">
                                    {loading ? 'Adding...' : 'Add Address'}
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setShowAddAddressForm(false)}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            )}

            <div className="grid gap-4">
                {addresses.map((address) => (
                    <Card key={address.id}>
                        <CardBody>
                            <div className="flex justify-between items-start">
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        {address.firstName} {address.lastName}
                                    </Typography>
                                    <Typography variant="small" className="text-gray-600">
                                        {address.street}
                                    </Typography>
                                    <Typography variant="small" className="text-gray-600">
                                        {address.city}, {address.state}
                                    </Typography>
                                    <Typography variant="small" className="text-gray-600">
                                        {address.phoneNumber}
                                    </Typography>
                                </div>
                                <Button
                                    size="sm"
                                    color="red"
                                    onClick={() => handleDeleteAddress(address.id)}
                                    disabled={loading}
                                >
                                    Delete
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await UserServices.changePassword(user.email, {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword
            });

            // Reset form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            alert('Password changed successfully!');
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const renderChangePasswordTab = () => (
        <div className="space-y-6">
            <div>
                <Typography variant="h5" color="blue-gray">
                    Change Password
                </Typography>
                <Typography variant="small" className="text-gray-600 font-normal mt-1">
                    Update your account password.
                </Typography>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Current Password
                    </Typography>
                    <Input
                        size="lg"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full"
                        required
                    />
                </div>

                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        New Password
                    </Typography>
                    <Input
                        size="lg"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full"
                        required
                        minLength={6}
                    />
                </div>

                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2 font-medium">
                        Confirm New Password
                    </Typography>
                    <Input
                        size="lg"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full"
                        required
                    />
                </div>

                <Button type="submit" disabled={loading} className="bg-blue-500">
                    {loading ? 'Updating...' : 'Change Password'}
                </Button>
            </form>
        </div>
    );

    if (loading && !user) {
        return (
            <div className="mx-auto max-w-4xl p-4 flex justify-center items-center min-h-screen">
                <Typography>Loading...</Typography>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl p-4">
            {/* Header */}
            <div className="flex mt-20 gap-x-5 items-center mb-8">
                <div className="flex justify-center">
                    <Avatar
                        src={user?.avatarUrl || "https://i.pravatar.cc/150?img=3"}
                        alt="User Avatar"
                        size="md"
                        className="border-2 border-blue-500"
                    />
                </div>
                <div>
                    <div className="flex gap-x-3">
                        <Typography variant="h4" className="text-center">
                            {user?.username || 'User'}
                        </Typography>
                        <Typography variant="h4" className="text-center text-gray-600">/</Typography>
                        <Typography variant="h4" className="text-center">
                            Profile Settings
                        </Typography>
                    </div>
                    <Typography variant="small" className="text-center text-gray-600 mt-2">
                        Manage your profile information, addresses, and account settings.
                    </Typography>
                </div>
            </div>

            {/* Content with Tabs */}
            <div className="flex gap-8">
                {/* Sidebar */}
                <div className="w-64 flex-shrink-0">
                    <div className="space-y-2">
                        <TabButton tab="profile" label="Profile Information" />
                        <TabButton tab="address" label="Address Management" />
                        <TabButton tab="changepassword" label="Change Password" />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    <Card>
                        <CardBody className="p-8">
                            {activeTab === 'profile' && renderProfileTab()}
                            {activeTab === 'address' && renderAddressTab()}
                            {activeTab === 'changepassword' && renderChangePasswordTab()}
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
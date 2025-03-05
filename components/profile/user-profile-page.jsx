'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { UserTemplatesTable } from './user-templates-table';
import { UserResponsesTable } from './user-responses-table';
import { CalendarDays, Mail, User, Cloud, Building } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SalesforceConnectForm } from './salesforce-connect-form';
import { useSession } from 'next-auth/react';
import { SalesforceTestButton } from './salesforce-test-button';

export function UserProfilePage({ user, isAdminView = false }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const { data: session } = useSession();
  const [showSalesforceForm, setShowSalesforceForm] = useState(false);

  const [activeTab, setActiveTab] = useState(() => {
    return tabParam === 'templates' || tabParam === 'responses'
      ? tabParam
      : 'profile';
  });

  const handleTabChange = (value) => {
    setActiveTab(value);

    const params = new URLSearchParams(searchParams);
    if (value === 'profile') {
      params.delete('tab');
    } else {
      params.set('tab', value);
    }
    const queryString = params.toString();
    router.push(`/profile${queryString ? `?${queryString}` : ''}`, {
      scroll: false,
    });
  };

  // Check if current user can access Salesforce integration
  // (only the user themselves or admins)
  const canAccessSalesforce =
    session?.user?.id === user.id || session?.user?.role === 'ADMIN';

  // Add a back button for admin view
  const backToUsersManagement = () => {
    router.push('/admin/users');
  };

  return (
    <div className="py-6 space-y-6">
      {isAdminView && (
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={backToUsersManagement}
            className="mb-4"
          >
            ← Back to Users Management
          </Button>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          {/* Use optional chaining since image might not exist */}
          <AvatarImage src={user?.image} alt={user.name || 'User'} />
          <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {isAdminView && user.role === 'ADMIN' && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1 inline-block">
              Admin
            </span>
          )}
          {isAdminView && !user.isActive && (
            <span className="text-xs bg-destructive/10 text-destructive px-1.5 py-0.5 rounded mt-1 ml-2 inline-block">
              Blocked
            </span>
          )}
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="templates">My Templates</TabsTrigger>
          <TabsTrigger value="responses">My Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <User className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.createdAt && (
                  <div className="flex items-center space-x-4">
                    <CalendarDays className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">Member Since</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            {canAccessSalesforce && (
              <CardFooter className="border-t pt-6">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                        Salesforce Integration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Connect your profile to Salesforce CRM
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <SalesforceTestButton /> {/* Add the test button here */}
                      <Button
                        onClick={() => setShowSalesforceForm(true)}
                        variant="outline"
                        size="sm"
                        className="flex items-center"
                      >
                        <Cloud className="h-4 w-4 mr-2" />
                        Connect to Salesforce
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <UserTemplatesTable />
        </TabsContent>

        <TabsContent value="responses" className="mt-4">
          <UserResponsesTable />
        </TabsContent>
      </Tabs>

      {showSalesforceForm && (
        <SalesforceConnectForm
          user={user}
          onClose={() => setShowSalesforceForm(false)}
        />
      )}
    </div>
  );
}

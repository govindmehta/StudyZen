
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your study experience.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Start page</Label>
                  <p className="text-sm text-muted-foreground">
                    Select which page to show when the app opens
                  </p>
                </div>
                <Select defaultValue="dashboard">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Dashboard</SelectItem>
                    <SelectItem value="flashcards">Flashcards</SelectItem>
                    <SelectItem value="quizzes">Quizzes</SelectItem>
                    <SelectItem value="timer">Study Timer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-continue flashcards</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically move to the next flashcard after flipping
                  </p>
                </div>
                <Switch />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show keyboard shortcuts</Label>
                  <p className="text-sm text-muted-foreground">
                    Display available keyboard shortcuts in the interface
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Study Sessions</CardTitle>
              <CardDescription>
                Configure your study session preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Track study time</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep a record of your daily study time
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily study goal</Label>
                  <p className="text-sm text-muted-foreground">
                    Set a daily target for study time
                  </p>
                </div>
                <Select defaultValue="2">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="5">5+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Timer notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a timer ends
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Study reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders to study if you haven't in a while
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Upcoming deadlines</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about approaching deadlines
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sound effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for notifications and app events
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize the look and feel of the application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start border-2 border-primary">
                    <div className="h-4 w-4 rounded-full bg-primary mr-2"></div>
                    Light
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <div className="h-4 w-4 rounded-full bg-slate-800 mr-2"></div>
                    Dark
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <div className="h-4 w-4 rounded-full bg-slate-400 mr-2"></div>
                    System
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="grid grid-cols-5 gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary border-2 border-black cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-blue-500 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-green-500 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-purple-500 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-orange-500 cursor-pointer"></div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable animations throughout the interface
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Compact mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use a more condensed layout to fit more content
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Student User" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="student@college.edu" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Change Password</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button>Update Password</Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all your data.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

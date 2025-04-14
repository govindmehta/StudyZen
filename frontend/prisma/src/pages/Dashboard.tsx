
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookText, Calendar, Clock, SquarePen } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your study progress.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5h</div>
            <p className="text-xs text-muted-foreground">
              +2.3h from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">
              42 reviewed today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quizzes</CardTitle>
            <SquarePen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 completed this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>My Study Progress</CardTitle>
            <CardDescription>
              Your progress across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-primary"></div>
                  <span className="text-sm">Computer Science</span>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Mathematics</span>
                </div>
                <span className="text-sm font-medium">62%</span>
              </div>
              <Progress value={62} className="bg-muted [&>div]:bg-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Physics</span>
                </div>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="bg-muted [&>div]:bg-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">History</span>
                </div>
                <span className="text-sm font-medium">35%</span>
              </div>
              <Progress value={35} className="bg-muted [&>div]:bg-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Tasks to focus on</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="today">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="space-y-4 mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Physics Quiz</h3>
                    <p className="text-sm text-muted-foreground">Due in 3 hours</p>
                  </div>
                  <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Urgent
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Math Homework</h3>
                    <p className="text-sm text-muted-foreground">Due in 6 hours</p>
                  </div>
                  <div className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                    Important
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="week" className="space-y-4 mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">CS Project</h3>
                    <p className="text-sm text-muted-foreground">Due in 2 days</p>
                  </div>
                  <div className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    Urgent
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">History Essay</h3>
                    <p className="text-sm text-muted-foreground">Due in 4 days</p>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Normal
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="month" className="space-y-4 mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Final Exams</h3>
                    <p className="text-sm text-muted-foreground">Due in 3 weeks</p>
                  </div>
                  <div className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
                    Important
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Research Paper</h3>
                    <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    Normal
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

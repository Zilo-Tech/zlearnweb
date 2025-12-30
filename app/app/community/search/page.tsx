'use client';

import { useState } from 'react';
import { Search, BookOpen, MessageSquare, Users, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Mock results
const RESULTS = {
    all: [
        { id: '1', type: 'course', title: 'Calculus I: Limits and Derivatives', subtitle: 'Mathematics • 12 Lessons' },
        { id: '2', type: 'discussion', title: 'Help with Calculus Limits problem', subtitle: 'Posted by Sarah M. • 12 replies' },
        { id: '3', type: 'group', title: 'Advanced Math Enthusiasts', subtitle: '128 members' },
        { id: '4', type: 'resource', title: 'Calculus Cheat Sheet.pdf', subtitle: 'Resource • 2.4 MB' },
    ],
    courses: [
        { id: '1', type: 'course', title: 'Calculus I: Limits and Derivatives', subtitle: 'Mathematics • 12 Lessons' },
        { id: '5', type: 'course', title: 'Physics: Mechanics', subtitle: 'Physics • 15 Lessons' },
    ],
    discussions: [
        { id: '2', type: 'discussion', title: 'Help with Calculus Limits problem', subtitle: 'Posted by Sarah M. • 12 replies' },
    ],
    groups: [
        { id: '3', type: 'group', title: 'Advanced Math Enthusiasts', subtitle: '128 members' },
    ],
};

export default function SearchPage() {
    const [query, setQuery] = useState('');

    const getIcon = (type: string) => {
        switch (type) {
            case 'course': return <BookOpen className="h-5 w-5 text-blue-500" />;
            case 'discussion': return <MessageSquare className="h-5 w-5 text-green-500" />;
            case 'group': return <Users className="h-5 w-5 text-purple-500" />;
            case 'resource': return <FileText className="h-5 w-5 text-orange-500" />;
            default: return <Search className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">Search</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search for courses, discussions, people..."
                        className="pl-10 h-12 text-lg"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    <TabsTrigger value="all">All Results</TabsTrigger>
                    <TabsTrigger value="courses">Courses</TabsTrigger>
                    <TabsTrigger value="discussions">Discussions</TabsTrigger>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6 space-y-4">
                    {RESULTS.all.map((result) => (
                        <div key={result.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-[#446D6D]/30 hover:shadow-sm cursor-pointer">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50">
                                {getIcon(result.type)}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{result.title}</h3>
                                <p className="text-sm text-gray-500">{result.subtitle}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto capitalize text-gray-500">
                                {result.type}
                            </Badge>
                        </div>
                    ))}
                </TabsContent>

                {/* Other tabs would filter similarly */}
                <TabsContent value="courses" className="mt-6 space-y-4">
                    {RESULTS.courses.map((result) => (
                        <div key={result.id} className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 transition-all hover:border-[#446D6D]/30 hover:shadow-sm cursor-pointer">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-50">
                                {getIcon(result.type)}
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">{result.title}</h3>
                                <p className="text-sm text-gray-500">{result.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

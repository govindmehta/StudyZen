import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Loader from '@/components/Loader';

type ScheduleData = {
  title: string;
  subtopics: string[];
  time_allocation: string[];
  resources: string[];
};

const Table: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [data, setData] = useState<ScheduleData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSchedule = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/generate-schedule', {
        topic,
      });

      setData(response.data);
    } catch (requestError) {
      setError('Failed to generate timetable. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const rows = data
    ? data.subtopics.map((subtopic, index) => ({
        subtopic,
        time: data.time_allocation[index] || '',
        resource: data.resources[index] || '',
      }))
    : [];

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Generate Study Timetable</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Enter a topic, e.g. Machine Learning"
            />
            <Button onClick={generateSchedule} disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      )}

      {data && !loading && (
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b">
            <CardTitle className="text-xl text-blue-900">{data.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full min-w-[700px] text-left border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-900">
                  <th className="px-6 py-4 font-semibold border-b border-blue-200">Subtopic</th>
                  <th className="px-6 py-4 font-semibold border-b border-blue-200">Time Allocation</th>
                  <th className="px-6 py-4 font-semibold border-b border-blue-200">Resources</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/60 transition-colors">
                    <td className="px-6 py-4 border-b border-blue-100 align-top">{row.subtopic}</td>
                    <td className="px-6 py-4 border-b border-blue-100 align-top text-gray-600">{row.time}</td>
                    <td className="px-6 py-4 border-b border-blue-100 align-top text-gray-600">{row.resource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Table;

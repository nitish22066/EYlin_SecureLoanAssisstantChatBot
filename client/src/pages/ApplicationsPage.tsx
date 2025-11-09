import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, FileText, User, ExternalLink } from 'lucide-react';

interface LoanApplication {
  id: string;
  conversationId: string;
  applicantId: string;
  applicantName: string;
  loanType: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  messages: Array<{
    content: string;
    isUser: boolean;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  applicationData?: Record<string, any>;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // For now, using a dummy applicant ID since we don't have authentication
      const response = await fetch('/api/applications?applicantId=user-123');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewApplication = (conversationId: string) => {
    window.location.href = `/chat/${conversationId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchApplications}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Applications</h1>
          <p className="text-gray-600">View and manage your saved loan applications</p>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-600 mb-4">Start a conversation and save it as a loan application</p>
              <Button onClick={() => window.location.href = '/'}>
                Start New Application
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {applications.map((application) => (
              <Card key={application.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{application.loanType}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <User className="h-4 w-4" />
                        {application.applicantName}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Created {formatDate(application.createdAt)}</span>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Messages:</span> {application.messages.length}
                    </div>

                    {application.applicationData && Object.keys(application.applicationData).length > 0 && (
                      <div>
                        <Separator className="my-3" />
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Application Details:</span>
                          <div className="mt-1 space-y-1">
                            {Object.entries(application.applicationData).slice(0, 3).map(([key, value]) => (
                              <div key={key} className="text-gray-600">
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                                {String(value).length > 30 ? String(value).substring(0, 30) + '...' : String(value)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-3">
                      <Button 
                        onClick={() => viewApplication(application.conversationId)}
                        className="flex-1"
                        variant="outline"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Start New Application
          </Button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

interface Application {
  _id: string;
  applicationNumber?: string;
  status: string;
  createdAt: string;
  experience?: {
    hasMotorcycleLicense: boolean;
    licenseNumber?: string;
    yearsOfRidingExperience?: number;
  };
  personalInfo?: {
    maritalStatus?: string;
    numberOfDependents?: number;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };
}

export default function ApplicantDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    hasMotorcycleLicense: false,
    licenseNumber: '',
    yearsOfRidingExperience: 0,
    maritalStatus: 'single',
    numberOfDependents: 0,
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  useEffect(() => {
    const loadData = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (!storedUser || !token) {
        router.push('/login');
        return;
      }

      setUser(JSON.parse(storedUser));
      api.setToken(token);

      try {
        const response = await api.get('/api/v1/applications/my-application');
        if (response.success && response.data) {
          setApplication(response.data.application);

          // Pre-fill form if data exists
          if (response.data.application.experience) {
            setFormData((prev) => ({
              ...prev,
              hasMotorcycleLicense: response.data.application.experience?.hasMotorcycleLicense || false,
              licenseNumber: response.data.application.experience?.licenseNumber || '',
              yearsOfRidingExperience: response.data.application.experience?.yearsOfRidingExperience || 0,
            }));
          }

          if (response.data.application.personalInfo) {
            setFormData((prev) => ({
              ...prev,
              maritalStatus: response.data.application.personalInfo?.maritalStatus || 'single',
              numberOfDependents: response.data.application.personalInfo?.numberOfDependents || 0,
              emergencyContactName: response.data.application.personalInfo?.emergencyContactName || '',
              emergencyContactPhone: response.data.application.personalInfo?.emergencyContactPhone || '',
            }));
          }
        }
      } catch (error) {
        console.error('Error loading application:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    api.clearToken();
    router.push('/login');
  };

  const handleUpdateApplication = async () => {
    setSubmitting(true);
    try {
      const response = await api.put('/api/v1/applications/my-application', {
        experience: {
          hasMotorcycleLicense: formData.hasMotorcycleLicense,
          licenseNumber: formData.licenseNumber,
          yearsOfRidingExperience: Number(formData.yearsOfRidingExperience),
        },
        personalInfo: {
          maritalStatus: formData.maritalStatus,
          numberOfDependents: Number(formData.numberOfDependents),
          emergencyContactName: formData.emergencyContactName,
          emergencyContactPhone: formData.emergencyContactPhone,
        },
      });

      if (response.success) {
        alert('Application updated successfully!');
        setApplication(response.data.application);
      } else {
        alert(response.error?.message || 'Failed to update application');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!confirm('Are you sure you want to submit your application? You will not be able to edit it after submission.')) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/api/v1/applications/my-application/submit', {});

      if (response.success) {
        alert('Application submitted successfully!');
        setApplication(response.data.application);
      } else {
        alert(response.error?.message || 'Failed to submit application');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Fawri Recruitment Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Status Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Application Status</h2>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application?.status || 'draft')}`}>
              {getStatusText(application?.status || 'draft')}
            </span>
            {application?.applicationNumber && (
              <span className="text-sm text-gray-600">Application Number: {application.applicationNumber}</span>
            )}
          </div>
        </div>

        {/* Application Form */}
        {application?.status === 'draft' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Complete Your Application</h2>

            <div className="space-y-6">
              {/* Experience Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Riding Experience</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasMotorcycleLicense"
                      checked={formData.hasMotorcycleLicense}
                      onChange={(e) => setFormData({ ...formData, hasMotorcycleLicense: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="hasMotorcycleLicense" className="ml-2 text-sm text-gray-700">
                      I have a motorcycle license
                    </label>
                  </div>

                  {formData.hasMotorcycleLicense && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">License Number *</label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Years of Riding Experience *</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsOfRidingExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfRidingExperience: parseInt(e.target.value) })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Dependents</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData.numberOfDependents}
                      onChange={(e) => setFormData({ ...formData, numberOfDependents: parseInt(e.target.value) })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                    <input
                      type="text"
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleUpdateApplication}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Draft'}
                </button>

                <button
                  onClick={handleSubmitApplication}
                  disabled={submitting || !formData.hasMotorcycleLicense}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Submitted Application View */}
        {application?.status !== 'draft' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Application Details</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your application has been submitted and is currently being reviewed by our team. We will notify you of any updates.
              </p>
              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Submitted Information:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>Motorcycle License: {application?.experience?.hasMotorcycleLicense ? 'Yes' : 'No'}</li>
                  {application?.experience?.licenseNumber && (
                    <li>License Number: {application.experience.licenseNumber}</li>
                  )}
                  <li>Years of Experience: {application?.experience?.yearsOfRidingExperience || 0}</li>
                  <li>Marital Status: {application?.personalInfo?.maritalStatus || 'N/A'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, Server, Database, Code } from 'lucide-react';

const SetupInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <CardTitle className="text-orange-800">Backend API Setup Required</CardTitle>
          </div>
          <CardDescription className="text-orange-700">
            The frontend is now ready to connect to your backend API. Follow these steps to complete the integration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <Server className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">1. Set Your ngrok URL</h3>
                <p className="text-gray-600 text-sm">
                  Update the API URL in <code className="bg-gray-100 px-1 rounded">client/src/services/api.js</code>
                </p>
                <code className="block bg-gray-100 p-2 rounded mt-2 text-sm">
                  const API_BASE_URL = 'https://hollydemon.vercel.app';
                </code>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">2. Backend API Endpoints</h3>
                <p className="text-gray-600 text-sm">Ensure your backend supports these endpoints:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                  <li><code>POST /auth/login</code> - Login with HTTP-only cookie</li>
                  <li><code>POST /auth/register</code> - Register with HTTP-only cookie</li>
                  <li><code>POST /auth/logout</code> - Clear HTTP-only cookie</li>
                  <li><code>GET /user/profile</code> - Get user profile</li>
                  <li><code>POST /marathons</code> - Create marathon</li>
                  <li><code>GET /marathons</code> - Get all marathons</li>
                  <li><code>GET /marathons/user</code> - Get user's marathons</li>
                  <li><code>DELETE /marathons/:id</code> - Delete marathon</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Code className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">3. Frontend Features Ready</h3>
                <p className="text-gray-600 text-sm">The frontend now includes:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 space-y-1">
                  <li>JWT authentication with HTTP-only cookies</li>
                  <li>Marathon creation with user email tracking</li>
                  <li>User-specific marathon management</li>
                  <li>Marathon count tracking</li>
                  <li>API error handling and user feedback</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Data Structure</h4>
            <p className="text-blue-800 text-sm mb-2">
              When creating marathons, the frontend sends:
            </p>
            <code className="block bg-blue-100 p-2 rounded text-sm text-blue-900">
              {`{
  ...formData,
  createdBy: currentUser.email,
  userId: currentUser.id
}`}
            </code>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-1">Next Steps</h4>
            <p className="text-green-800 text-sm">
              Update your API URL and test the connection. The app will automatically handle authentication 
              and marathon management once connected to your backend.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupInstructions;
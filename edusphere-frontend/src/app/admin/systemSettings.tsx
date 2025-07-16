import React, { useState, useEffect } from 'react';
import type { JSX } from 'react';
// import { useAuth } from '../../contexts/AuthContext';

/**
 * Interface for system settings configuration
 */
interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSymbols: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorEnabled: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    systemAlerts: boolean;
    userRegistrationNotify: boolean;
    roomCreationNotify: boolean;
    assignmentNotify: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpEncryption: 'none' | 'ssl' | 'tls';
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
    storageQuota: number;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    backupRetention: number;
    cloudStorageEnabled: boolean;
    cloudStorageProvider: 'aws' | 'gcp' | 'azure';
  };
  performance: {
    cacheEnabled: boolean;
    cacheTtl: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    maxConcurrentUsers: number;
    rateLimitEnabled: boolean;
    rateLimitRequests: number;
    rateLimitWindow: number;
  };
}

/**
 * System settings management component for platform administrators
 * Provides comprehensive system configuration capabilities
 * Time Complexity: O(1) for most operations, O(n) for array operations
 */
const SystemSettings: React.FC = () => {
  // const { user } = useAuth(); // Future use for role-based settings
  
  // State management for settings
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<keyof SystemSettings>('general');
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  /**
   * Initialize settings data on component mount
   * Simulates API call - replace with actual service call
   * Time Complexity: O(1) - constant time operation
   */
  useEffect(() => {
    const fetchSettings = async (): Promise<void> => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock settings data
        const mockSettings: SystemSettings = {
          general: {
            siteName: 'EduSphere',
            siteDescription: 'Advanced Learning Management System',
            siteUrl: 'https://edusphere.com',
            adminEmail: 'admin@edusphere.com',
            timezone: 'UTC',
            language: 'en',
            maintenanceMode: false,
            registrationEnabled: true,
            emailVerificationRequired: true
          },
          security: {
            passwordMinLength: 8,
            passwordRequireUppercase: true,
            passwordRequireNumbers: true,
            passwordRequireSymbols: true,
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            lockoutDuration: 15,
            twoFactorEnabled: false
          },
          notifications: {
            emailNotifications: true,
            systemAlerts: true,
            userRegistrationNotify: true,
            roomCreationNotify: true,
            assignmentNotify: true,
            smtpHost: 'smtp.gmail.com',
            smtpPort: 587,
            smtpUsername: 'noreply@edusphere.com',
            smtpPassword: '',
            smtpEncryption: 'tls'
          },
          storage: {
            maxFileSize: 10,
            allowedFileTypes: ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'jpg', 'png', 'gif'],
            storageQuota: 100,
            backupFrequency: 'daily',
            backupRetention: 30,
            cloudStorageEnabled: false,
            cloudStorageProvider: 'aws'
          },
          performance: {
            cacheEnabled: true,
            cacheTtl: 3600,
            compressionEnabled: true,
            cdnEnabled: false,
            maxConcurrentUsers: 1000,
            rateLimitEnabled: true,
            rateLimitRequests: 100,
            rateLimitWindow: 60
          }
        };
        
        setSettings(mockSettings);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  /**
   * Handle input changes for settings
   * Time Complexity: O(1)
   */
  const handleInputChange = (
    category: keyof SystemSettings,
    field: string,
    value: string | number | boolean
  ): void => {
    if (!settings) return;

    setSettings(prev => ({
      ...prev!,
      [category]: {
        ...prev![category],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  /**
   * Handle array input changes (for allowed file types)
   * Time Complexity: O(n) where n is array length
   */
  // Future feature for array-based settings
  /*
  const handleArrayInputChange = (
    category: keyof SystemSettings,
    field: string,
    value: string
  ): void => {
    if (!settings) return;

    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    
    setSettings(prev => ({
      ...prev!,
      [category]: {
        ...prev![category],
        [field]: arrayValue
      }
    }));
    setHasChanges(true);
  };
  */

  /**
   * Save settings to server
   * Time Complexity: O(1)
   */
  const saveSettings = async (): Promise<void> => {
    if (!settings) return;

    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In real implementation, this would send settings to server
      console.log('Settings saved:', settings);
      
      setHasChanges(false);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Reset settings to defaults
   * Time Complexity: O(1)
   */
  const resetSettings = (): void => {
    if (window.confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      // Reload settings from server
      window.location.reload();
    }
  };

  /**
   * Test email configuration
   * Time Complexity: O(1)
   */
  // Future feature for testing email configuration
  /*
  const testEmailConfig = async (): Promise<void> => {
    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Test email sent successfully!');
    } catch (error) {
      console.error('Failed to send test email:', error);
      alert('Failed to send test email. Please check your configuration.');
    }
  };
  */

  /**
   * Render tab navigation
   * Time Complexity: O(1)
   */
  const renderTabNavigation = (): JSX.Element => {
    const tabs = [
      { key: 'general', label: 'General', icon: '⚙️' },
      { key: 'security', label: 'Security', icon: '🔒' },
      { key: 'notifications', label: 'Notifications', icon: '📧' },
      { key: 'storage', label: 'Storage', icon: '💾' },
      { key: 'performance', label: 'Performance', icon: '⚡' }
    ];

    return (
      <nav className="flex space-x-8 border-b border-gray-200 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as keyof SystemSettings)}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === tab.key
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    );
  };

  /**
   * Render general settings tab
   * Time Complexity: O(1)
   */
  const renderGeneralSettings = (): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Name
        </label>
        <input
          type="text"
          value={settings?.general.siteName || ''}
          onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin Email
        </label>
        <input
          type="email"
          value={settings?.general.adminEmail || ''}
          onChange={(e) => handleInputChange('general', 'adminEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings?.general.siteDescription || ''}
          onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site URL
        </label>
        <input
          type="url"
          value={settings?.general.siteUrl || ''}
          onChange={(e) => handleInputChange('general', 'siteUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={settings?.general.timezone || ''}
          onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="UTC">UTC</option>
          <option value="America/New_York">Eastern Time</option>
          <option value="America/Chicago">Central Time</option>
          <option value="America/Denver">Mountain Time</option>
          <option value="America/Los_Angeles">Pacific Time</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              checked={settings?.general.maintenanceMode || false}
              onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
              Enable Maintenance Mode
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="registrationEnabled"
              checked={settings?.general.registrationEnabled || false}
              onChange={(e) => handleInputChange('general', 'registrationEnabled', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="registrationEnabled" className="ml-2 block text-sm text-gray-900">
              Allow User Registration
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailVerificationRequired"
              checked={settings?.general.emailVerificationRequired || false}
              onChange={(e) => handleInputChange('general', 'emailVerificationRequired', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="emailVerificationRequired" className="ml-2 block text-sm text-gray-900">
              Require Email Verification
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render security settings tab
   * Time Complexity: O(1)
   */
  const renderSecuritySettings = (): JSX.Element => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Password Length
        </label>
        <input
          type="number"
          min="6"
          max="32"
          value={settings?.security.passwordMinLength || 8}
          onChange={(e) => handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          min="5"
          max="480"
          value={settings?.security.sessionTimeout || 30}
          onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Login Attempts
        </label>
        <input
          type="number"
          min="3"
          max="10"
          value={settings?.security.maxLoginAttempts || 5}
          onChange={(e) => handleInputChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lockout Duration (minutes)
        </label>
        <input
          type="number"
          min="5"
          max="120"
          value={settings?.security.lockoutDuration || 15}
          onChange={(e) => handleInputChange('security', 'lockoutDuration', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="md:col-span-2">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Password Requirements</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="passwordRequireUppercase"
              checked={settings?.security.passwordRequireUppercase || false}
              onChange={(e) => handleInputChange('security', 'passwordRequireUppercase', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="passwordRequireUppercase" className="ml-2 block text-sm text-gray-900">
              Require Uppercase Letters
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="passwordRequireNumbers"
              checked={settings?.security.passwordRequireNumbers || false}
              onChange={(e) => handleInputChange('security', 'passwordRequireNumbers', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="passwordRequireNumbers" className="ml-2 block text-sm text-gray-900">
              Require Numbers
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="passwordRequireSymbols"
              checked={settings?.security.passwordRequireSymbols || false}
              onChange={(e) => handleInputChange('security', 'passwordRequireSymbols', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="passwordRequireSymbols" className="ml-2 block text-sm text-gray-900">
              Require Special Characters
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="twoFactorEnabled"
              checked={settings?.security.twoFactorEnabled || false}
              onChange={(e) => handleInputChange('security', 'twoFactorEnabled', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="twoFactorEnabled" className="ml-2 block text-sm text-gray-900">
              Enable Two-Factor Authentication
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Render current tab content
   * Time Complexity: O(1)
   */
  const renderTabContent = (): JSX.Element => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'notifications':
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Notifications settings panel coming soon...</p>
          </div>
        );
      case 'storage':
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Storage settings panel coming soon...</p>
          </div>
        );
      case 'performance':
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Performance settings panel coming soon...</p>
          </div>
        );
      default:
        return <div>Settings not found</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={resetSettings}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Reset to Defaults
          </button>
          <button
            onClick={saveSettings}
            disabled={!hasChanges || isSaving}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              hasChanges && !isSaving
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          {renderTabNavigation()}
          {renderTabContent()}
        </div>
      </div>

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="text-sm">You have unsaved changes</span>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="text-xs bg-white text-primary-600 px-2 py-1 rounded"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;

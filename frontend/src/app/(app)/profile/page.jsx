'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Shield, Bell, LogOut, Camera, Trash2 } from 'lucide-react';
import { Mascot } from '@/components/mascots/Mascot';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, logout, updateProfile, deleteAccount } = useAuthStore();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile State
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    bio: ''
  });

  // Security State
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification State
  const [notificationPrefs, setNotificationPrefs] = useState({
    quiz_reminders: true,
    leaderboard_updates: true,
    new_features: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/auth/me/');
        setProfileData({
          username: res.data.username || '',
          bio: res.data.bio || ''
        });
        setNotificationPrefs({
          quiz_reminders: res.data.quiz_reminders,
          leaderboard_updates: res.data.leaderboard_updates,
          new_features: res.data.new_features
        });
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  const handleToggle = (id) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handlePreferencesUpdate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await updateProfile(notificationPrefs);
    if (res.success) {
      setSuccess('Notification preferences updated!');
    } else {
      setError('Failed to update preferences');
    }
    setLoading(false);
  };


  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await updateProfile(profileData);
    if (res.success) {
      setSuccess('Profile updated successfully!');
    } else {
      setError(res.error?.detail || 'Failed to update profile');
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    const res = await updateProfile({ password: securityData.newPassword });
    if (res.success) {
      setSuccess('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        logout();
        router.push('/login');
      }, 2000);
    } else {
      setError(res.error?.detail || 'Failed to update password');
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('⚠️ Are you absolutely sure? This will permanently delete your account and all your quiz data. This action cannot be undone.')) {
      setLoading(true);
      const res = await deleteAccount();
      if (res.success) {
        router.push('/login');
      } else {
        setError(res.error || 'Failed to delete account');
        setLoading(false);
      }
    }
  };

  const renderTabContent = () => {
    return (
      <div className="space-y-4">
        {error && <div className="p-4 bg-red-50 text-error-red rounded-xl text-sm font-medium border border-red-100">{error}</div>}
        {success && <div className="p-4 bg-green-50 text-success-green rounded-xl text-sm font-medium border border-green-100">{success}</div>}
        
        {activeTab === 'notifications' && (
          <Card className="p-8 border-none shadow-lg">
            <h2 className="text-xl font-bold text-text-primary mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              {[
                { id: 'quiz_reminders', label: 'Quiz Reminders', desc: 'Get notified about upcoming quizzes.' },
                { id: 'leaderboard_updates', label: 'Leaderboard Updates', desc: 'Alert when someone passes your rank.' },
                { id: 'new_features', label: 'New AI Features', desc: 'Stay updated with new AI improvements.' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-purple-pale/30 border border-purple-light/20 shadow-sm">
                  <div>
                    <p className="font-semibold text-text-primary uppercase tracking-tight text-xs mb-1 opacity-70">Preference</p>
                    <p className="font-bold text-text-primary text-lg">{item.label}</p>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div 
                      onClick={() => handleToggle(item.id)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
                        notificationPrefs[item.id] ? "bg-primary-purple" : "bg-gray-200"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm",
                        notificationPrefs[item.id] ? "translate-x-6" : "translate-x-1"
                      )} />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button 
                  className="px-8 shadow-md" 
                  onClick={handlePreferencesUpdate}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'security' && (
          <Card className="p-8 border-none shadow-lg">
            <h2 className="text-xl font-bold text-text-primary mb-6">Security Settings</h2>
            <form className="space-y-6" onSubmit={handlePasswordUpdate}>
              <Input 
                label="New Password" 
                type="password" 
                placeholder="••••••••" 
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
              />
              <Input 
                label="Confirm New Password" 
                type="password" 
                placeholder="••••••••" 
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
              />
              <div className="pt-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                <p className="text-sm text-orange-800 font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Two-Factor Authentication
                </p>
                <p className="text-xs text-orange-700 mt-1">Enhance your account security by enabling 2FA (Coming Soon).</p>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="px-8 shadow-md" type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'personal' && (
          <Card className="p-8 border-none shadow-lg">
            <h2 className="text-xl font-bold text-text-primary mb-6">Account Settings</h2>
            <form className="space-y-6" onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Username" 
                  value={profileData.username}
                  onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                  placeholder="Your username"
                />
                <Input 
                  label="Display Name" 
                  placeholder="How others see you"
                  defaultValue={user?.username}
                />
              </div>
              <Input 
                label="Email Address" 
                defaultValue={user?.email}
                disabled
                className="bg-gray-50 color-text-muted cursor-not-allowed"
                description="Email cannot be changed after verification."
              />
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-primary">Bio</label>
                <textarea 
                  className="w-full h-32 p-4 rounded-xl border border-border-gray focus:outline-none focus:ring-2 focus:ring-primary-purple transition-all"
                  placeholder="Tell us about your learning goals..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end pt-4">
                <Button className="px-8 shadow-md" type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-4">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-purple-light flex items-center justify-center text-primary-purple text-4xl font-bold border-4 border-white shadow-xl">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <button className="absolute bottom-1 right-1 p-2 bg-primary-purple text-white rounded-full shadow-lg hover:bg-purple-dark transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-bold text-text-primary">{user?.username || 'User'}</h1>
          <p className="text-text-muted">{user?.email || 'user@example.com'}</p>
          <div className="flex gap-2 mt-4">
            <span className="px-3 py-1 bg-purple-pale text-primary-purple text-xs font-bold rounded-full uppercase tracking-wider">
              Student Explorer
            </span>
            <span className="px-3 py-1 bg-green-50 text-success-green text-xs font-bold rounded-full uppercase tracking-wider">
              Email Verified
            </span>
          </div>
        </div>
        <div className="hidden md:flex ml-auto items-start pt-2">
          <Mascot pose="study" size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <button 
            onClick={() => setActiveTab('personal')}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all shadow-sm",
              activeTab === 'personal' 
                ? "bg-primary-purple text-white shadow-purple-200" 
                : "hover:bg-white text-text-muted hover:text-primary-purple"
            )}
          >
            <User className="w-5 h-5" />
            Personal Info
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all",
              activeTab === 'notifications' 
                ? "bg-primary-purple text-white shadow-purple-200" 
                : "hover:bg-white text-text-muted hover:text-primary-purple"
            )}
          >
            <Bell className="w-5 h-5" />
            Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={cn(
              "w-full flex items-center gap-3 p-4 rounded-xl font-medium transition-all",
              activeTab === 'security' 
                ? "bg-primary-purple text-white shadow-purple-200" 
                : "hover:bg-white text-text-muted hover:text-primary-purple"
            )}
          >
            <Shield className="w-5 h-5" />
            Security
          </button>
          <div className="pt-4">
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-text-muted hover:text-error-red hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          </div>
          <div className="pt-2">
            <Button 
              variant="ghost" 
              onClick={handleDeleteAccount}
              disabled={loading}
              className="w-full justify-start gap-3 text-text-muted hover:text-error-red hover:bg-red-50 group"
            >
              <Trash2 className="w-5 h-5 group-hover:animate-pulse" />
              <span className="font-bold">Delete Account</span>
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

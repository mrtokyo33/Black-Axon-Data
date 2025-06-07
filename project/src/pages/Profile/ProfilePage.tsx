import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, BookOpen, GraduationCap, Key, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NeuralNetwork from '../../components/ui/NeuralNetwork';

const ProfilePage: React.FC = () => {
  const { translations } = useLanguage();
  const { user, profile, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    purpose: '',
    education_level: ''
  });

  // Initialize form data when profile is loaded
  React.useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        purpose: profile.purpose,
        education_level: profile.education_level
      });
    }
  }, [profile]);

  const purposes = [
    { id: 'start', label: translations.auth.purpose.start },
    { id: 'explore', label: translations.auth.purpose.explore },
    { id: 'improve', label: translations.auth.purpose.improve }
  ];

  const educationLevels = [
    { id: 'school', label: translations.auth.education.school },
    { id: 'college', label: translations.auth.education.college },
    { id: 'hobby', label: translations.auth.education.hobby }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!formData.username || !formData.purpose || !formData.education_level) {
        setError('All fields are required');
        return;
      }

      const { error: updateError } = await updateProfile({
        username: formData.username,
        purpose: formData.purpose,
        education_level: formData.education_level
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setIsEditing(false);
    } catch (err) {
      setError('An error occurred while updating your profile');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        username: profile.username,
        purpose: profile.purpose,
        education_level: profile.education_level
      });
    }
    setError(null);
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      await signOut();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: user.id }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete account');
      }

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <NeuralNetwork />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-darkgray/50 border border-yellow/30 rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-orbitron text-yellow neon-glow">
                {translations.profile.title}
              </h1>
              <div className="space-x-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-white/80 hover:text-white"
                    >
                      {translations.profile.cancel}
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 bg-yellow text-black rounded hover:bg-yellow-light"
                    >
                      {translations.profile.save}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-yellow/30 text-yellow rounded hover:bg-yellow/10"
                  >
                    {translations.profile.edit}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg">
                <User className="text-yellow" size={24} />
                <div>
                  <p className="text-sm text-white/60">{translations.profile.fields.username}</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="bg-black border border-yellow/30 rounded px-3 py-1 text-white"
                    />
                  ) : (
                    <p className="text-lg text-white">{profile.username}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg">
                <Mail className="text-yellow" size={24} />
                <div>
                  <p className="text-sm text-white/60">{translations.profile.fields.email}</p>
                  <p className="text-lg text-white">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg">
                <BookOpen className="text-yellow" size={24} />
                <div>
                  <p className="text-sm text-white/60">{translations.profile.fields.purpose}</p>
                  {isEditing ? (
                    <select
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="bg-black border border-yellow/30 rounded px-3 py-1 text-white"
                    >
                      {purposes.map(purpose => (
                        <option key={purpose.id} value={purpose.id}>
                          {purpose.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-lg text-white">
                      {purposes.find(p => p.id === profile.purpose)?.label}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-black/30 rounded-lg">
                <GraduationCap className="text-yellow" size={24} />
                <div>
                  <p className="text-sm text-white/60">{translations.profile.fields.education}</p>
                  {isEditing ? (
                    <select
                      value={formData.education_level}
                      onChange={(e) => setFormData({ ...formData, education_level: e.target.value })}
                      className="bg-black border border-yellow/30 rounded px-3 py-1 text-white"
                    >
                      {educationLevels.map(level => (
                        <option key={level.id} value={level.id}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-lg text-white">
                      {educationLevels.find(l => l.id === profile.education_level)?.label}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full flex items-center justify-center space-x-2 p-4 bg-yellow/10 text-yellow border border-yellow/30 rounded-lg hover:bg-yellow/20">
                  <Key size={20} />
                  <span>{translations.profile.changePassword}</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center space-x-2 p-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20"
                >
                  <Trash2 size={20} />
                  <span>Delete Account</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => signOut()}
                  className="w-full p-4 text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg"
                >
                  {translations.profile.signOut}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-darkgray border border-red-500/30 rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-xl font-orbitron text-red-500 mb-4">Delete Account</h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-white/80 hover:text-white"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
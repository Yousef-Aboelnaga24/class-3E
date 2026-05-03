import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiShield, FiTrash2 } from 'react-icons/fi';

import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../auth/AuthContext';
import { useDeleteUser, useUsers, useUpdateUserRole } from '../hooks/useUsers';
import { useClassCodes, useCreateClassCode, useDeleteClassCode } from '../hooks/useClassCodes';

const roles = ['student', 'admin', 'user'];

function normalizeRole(role) {
  return String(role || 'user').toLowerCase();
}

export default function Admin() {
  const { user } = useAuth();
  const isAdmin = normalizeRole(user?.role) === 'admin';

  const [userSearch, setUserSearch] = useState('');
  const [code, setCode] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const { data: usersData, isLoading } = useUsers();
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const { data: classCodesData, isLoading: isLoadingCodes } = useClassCodes(isAdmin);
  const createClassCode = useCreateClassCode();
  const deleteClassCode = useDeleteClassCode();

  const filteredUsers = useMemo(() => {
    const users = usersData?.data || usersData || [];
    const search = userSearch.toLowerCase();
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search)
    );
  }, [usersData, userSearch]);

  const classCodes = useMemo(() => {
    const payload = classCodesData?.data || classCodesData;
    return payload?.data || payload || [];
  }, [classCodesData]);

  if (!isAdmin) return <Navigate to="/" replace />;

  // ✅ SAFE ROLE CHANGE
  const handleRoleChange = (member, role) => {
    if (!member?.id) return;
    if (member.id === user?.id) return;

    updateUserRole.mutate({
      id: member.id,
      role,
    });
  };

  const handleCreateCode = (event) => {
    event.preventDefault();
    const trimmedCode = code.trim();
    if (!trimmedCode) return;

    createClassCode.mutate(
      {
        code: trimmedCode,
        is_active: true,
        expires_at: expiresAt || null,
      },
      {
        onSuccess: () => {
          setCode('');
          setExpiresAt('');
        },
      }
    );
  };

  const handleDeleteUser = (member) => {
    if (!member?.id || member.id === user?.id) return;
    if (!window.confirm(`Remove ${member.name || 'this user'}?`)) return;

    deleteUser.mutate(member.id);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="hero-shell rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-card backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="chromatic-ring flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-gradient text-white">
              <FiShield />
            </div>
            <div>
              <h1 className="text-3xl font-black text-memory-text">Admin Control Room</h1>
              <p className="text-memory-muted">Manage classmates, roles, removals, and invite codes.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="rounded-[1.5rem] border border-white/70 bg-white/76 p-5 shadow-card backdrop-blur-xl">
            <h2 className="text-xl font-black text-memory-text">Create class code</h2>
            <form onSubmit={handleCreateCode} className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-memory-muted">Code</label>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value.toUpperCase())}
                  className="input-field font-bold tracking-[0.24em]"
                  placeholder="3E-NEON"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-memory-muted">Expires at</label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(event) => setExpiresAt(event.target.value)}
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={createClassCode.isPending}
                className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl"
              >
                <FiPlus />
                Add class code
              </button>
            </form>
          </div>

          <div className="rounded-[1.5rem] border border-white/70 bg-white/76 p-5 shadow-card backdrop-blur-xl">
            <h2 className="text-xl font-black text-memory-text">Active invite codes</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {isLoadingCodes ? (
                <p className="text-memory-muted">Loading codes...</p>
              ) : classCodes.length ? (
                classCodes.map((item) => (
                  <div key={item.id} className="holo-card rounded-2xl border border-memory-border bg-cream-50/80 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black tracking-[0.18em] text-memory-text">{item.code}</p>
                        <p className="mt-1 text-xs text-memory-muted">
                          {item.expires_at ? `Expires ${new Date(item.expires_at).toLocaleString()}` : 'No expiry'}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteClassCode.mutate(item.id)}
                        disabled={deleteClassCode.isPending}
                        className="rounded-xl p-2 text-memory-danger transition-colors hover:bg-memory-danger/10"
                        aria-label="Delete class code"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-memory-muted">No class codes yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="rounded-[1.5rem] border border-white/70 bg-white/76 p-4 shadow-card backdrop-blur-xl">

          <div className="relative mb-4">
            <FiSearch className="absolute text-gray-400 top-3 left-3" />
            <input
              className="input-field pl-10"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((member) => (
                <motion.div
                  key={member.id}
                  className="flex items-center justify-between rounded-xl border border-memory-border bg-white/70 p-3"
                  whileHover={{ scale: 1.01 }}
                >
                  {/* User Info */}
                  <div>
                    <p className="font-bold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Role Select */}
                    <select
                      value={normalizeRole(member.role)}
                      onChange={(e) =>
                        handleRoleChange(member, e.target.value)
                      }
                      disabled={
                        updateUserRole.isPending ||
                        member.id === user?.id
                      }
                      className="rounded-lg border border-memory-border px-3 py-2"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteUser(member)}
                      disabled={deleteUser.isPending || member.id === user?.id}
                      className="grid rounded-lg border border-memory-border bg-white px-3 py-2 text-memory-danger transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-45"
                      aria-label={`Remove ${member.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

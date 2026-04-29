import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiShield } from 'react-icons/fi';

import { PageTransition } from '../components/layout/PageTransition';
import { useAuth } from '../auth/AuthContext';
import { useUsers, useUpdateUserRole } from '../hooks/useUsers';

const roles = ['student', 'admin', 'user'];

function normalizeRole(role) {
  return String(role || 'user').toLowerCase();
}

export default function Admin() {
  const { user } = useAuth();
  const isAdmin = normalizeRole(user?.role) === 'admin';

  const [userSearch, setUserSearch] = useState('');

  const { data: usersData, isLoading } = useUsers();
  const updateUserRole = useUpdateUserRole();

  const users = usersData?.data || usersData || [];

  const filteredUsers = useMemo(() => {
    const search = userSearch.toLowerCase();
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(search)
    );
  }, [users, userSearch]);

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

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <FiShield className="text-red-500" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        {/* Users List */}
        <div className="p-4 bg-white shadow rounded-2xl">

          <div className="relative mb-4">
            <FiSearch className="absolute text-gray-400 top-3 left-3" />
            <input
              className="w-full p-2 pl-10 border rounded-lg"
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
                  className="flex items-center justify-between p-3 border rounded-xl"
                  whileHover={{ scale: 1.01 }}
                >
                  {/* User Info */}
                  <div>
                    <p className="font-bold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>

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
                    className="px-3 py-2 border rounded-lg"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
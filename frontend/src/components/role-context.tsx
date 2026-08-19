'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, ApiClient, apiStorage } from '@/services/api';

export type { UserRole, User };

interface RoleContextType {
  role: UserRole;
  user: User | null;
  token: string | null;
  isVerified: boolean;
  setRole: (role: UserRole) => void;
  login: (role: UserRole, email?: string) => Promise<User>;
  register: (role: UserRole, email: string, name: string) => Promise<{ user: User; status: 'pending' | 'approved' }>;
  logout: () => void;
  ecologicalModalOpen: boolean;
  setEcologicalModalOpen: (open: boolean) => void;
  selectedFullDestinationId: string | null;
  triggerEcologicalRedirection: (destinationId: string) => void;
  refreshUser: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('tourist');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ecologicalModalOpen, setEcologicalModalOpen] = useState(false);
  const [selectedFullDestinationId, setSelectedFullDestinationId] = useState<string | null>(null);

  const refreshUser = () => {
    const savedUser = apiStorage.getCurrentUser();
    const savedToken = apiStorage.getToken();
    if (savedUser) {
      setUser(savedUser);
      setRoleState(savedUser.role);
    }
    if (savedToken) {
      setToken(savedToken);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    ApiClient.testLogin(newRole).then((res) => {
      if (res.success && res.user && res.token) {
        setUser(res.user);
        setToken(res.token);
      }
    });
  };

  const login = async (loginRole: UserRole, email?: string): Promise<User> => {
    const res = await ApiClient.testLogin(loginRole, email);
    if (!res.success || !res.user) {
      const errObj: any = new Error(res.error || 'Login failed');
      errObj.code = res.error;
      errObj.reason = res.reason;
      errObj.user = res.user;
      throw errObj;
    }
    setUser(res.user);
    setRoleState(res.user.role);
    if (res.token) setToken(res.token);
    return res.user;
  };

  const register = async (regRole: UserRole, email: string, name: string): Promise<{ user: User; status: 'pending' | 'approved' }> => {
    const res = await ApiClient.register(regRole, email, name);
    if (regRole === 'host' || res.status === 'pending') {
      // DO NOT set active user session for pending host registration
      return { user: res.user, status: 'pending' };
    }
    setUser(res.user);
    setRoleState(res.user.role);
    if (res.token) setToken(res.token);
    return { user: res.user, status: 'approved' };
  };

  const logout = () => {
    apiStorage.clearToken();
    setUser(null);
    setToken(null);
    setRoleState('tourist');
  };

  const triggerEcologicalRedirection = (destinationId: string) => {
    setSelectedFullDestinationId(destinationId);
    setEcologicalModalOpen(true);
  };

  const isVerified = user ? (user.approval_status === 'approved' || user.is_verified) : role !== 'host';

  return (
    <RoleContext.Provider
      value={{
        role,
        user,
        token,
        isVerified,
        setRole,
        login,
        register,
        logout,
        ecologicalModalOpen,
        setEcologicalModalOpen,
        selectedFullDestinationId,
        triggerEcologicalRedirection,
        refreshUser,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

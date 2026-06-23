import React, { useState, useEffect } from 'react';
import { UserForm } from '../components/UserForm';
import CsvImport from '../components/CsvImport';
import UserList from '../components/UserList';
import { usersApi } from '../services/api';
import type { User } from '../types';

export const Home: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [refreshKey]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const fetchedUsers = await usersApi.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = (user: User) => {
    setUsers((prevUsers) => [user, ...prevUsers]);
  };

  const handleImportComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>CSV User Management</h1>
        <p>Create users individually or import multiple users from a CSV file</p>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <UserForm onSuccess={handleUserCreated} />
        </section>

        <section style={styles.section}>
          <CsvImport onImportComplete={handleImportComplete} />
        </section>

        <section style={styles.section}>
          <UserList users={users} loading={loading} />
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  } as React.CSSProperties,
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    padding: '40px 20px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  main: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  } as React.CSSProperties,
  section: {
    marginBottom: '20px',
  } as React.CSSProperties,
};

export default Home;

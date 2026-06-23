import React from 'react';
import type { User } from '../types';

interface UserListProps {
  users: User[];
  loading: boolean;
}

export const UserList: React.FC<UserListProps> = ({ users, loading }) => {
  if (loading) {
    return <div style={styles.container}>Loading users...</div>;
  }

  if (users.length === 0) {
    return <div style={styles.container}>No users found. Create or import users to get started.</div>;
  }

  return (
    <div style={styles.container}>
      <h2>Users List</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
  } as React.CSSProperties,
  tableWrapper: {
    overflowX: 'auto',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,
};

export default UserList;

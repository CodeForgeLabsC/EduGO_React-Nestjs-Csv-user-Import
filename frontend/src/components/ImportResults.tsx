import React from 'react';
import type { CsvImportResult, CsvRowError } from '../types';

interface ImportResultsProps {
  result: CsvImportResult;
}

export const ImportResults: React.FC<ImportResultsProps> = ({ result }) => {
  return (
    <div style={styles.container}>
      <h3>Import Results</h3>

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.label}>Total Rows:</span>
          <span>{result.totalRows}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.label}>Success:</span>
          <span style={styles.success}>{result.successCount}</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.label}>Failed:</span>
          <span style={styles.failure}>{result.failureCount}</span>
        </div>
      </div>

      {result.createdUsers.length > 0 && (
        <div style={styles.section}>
          <h4>Successfully Created Users</h4>
          <div style={styles.usersList}>
            {result.createdUsers.map((user) => (
              <div key={user.id} style={styles.userItem}>
                <strong>{user.username}</strong> ({user.email})
              </div>
            ))}
          </div>
        </div>
      )}

      {result.errors.length > 0 && (
        <div style={styles.section}>
          <h4>Errors</h4>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Row</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {result.errors.map((error: CsvRowError, index: number) => (
                  <tr key={index} style={styles.errorRow}>
                    <td>{error.rowNumber}</td>
                    <td>{error.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    marginTop: '20px',
  } as React.CSSProperties,
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  } as React.CSSProperties,
  summaryItem: {
    padding: '12px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as React.CSSProperties,
  label: {
    fontWeight: '600',
  } as React.CSSProperties,
  success: {
    color: '#28a745',
    fontWeight: '600',
  } as React.CSSProperties,
  failure: {
    color: '#dc3545',
    fontWeight: '600',
  } as React.CSSProperties,
  section: {
    marginTop: '20px',
  } as React.CSSProperties,
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  } as React.CSSProperties,
  userItem: {
    padding: '8px 12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    fontSize: '14px',
  } as React.CSSProperties,
  tableWrapper: {
    overflowX: 'auto',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
  } as React.CSSProperties,
  errorRow: {
    backgroundColor: '#f8d7da',
  } as React.CSSProperties,
};

export default ImportResults;

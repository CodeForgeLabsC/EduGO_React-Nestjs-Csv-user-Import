import React, { useState } from 'react';
import { usersApi } from '../services/api';
import type { CsvImportResult } from '../types';
import ImportResults from './ImportResults';

interface CsvImportProps {
  onImportComplete: () => void;
}

export const CsvImport: React.FC<CsvImportProps> = ({ onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<CsvImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile || null);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const importResult = await usersApi.importCsv(file);
      setResult(importResult);
      onImportComplete();
      setFile(null);
    } catch (err) {
      setError(usersApi.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const downloadUsersFromDatabase = async () => {
    setExportLoading(true);
    try {
      await usersApi.exportUsersCsv();
    } catch (err) {
      setError(usersApi.getErrorMessage(err));
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Import Users from CSV</h2>

      <form onSubmit={handleImport} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="csvFile">Select CSV File:</label>
          <input
            id="csvFile"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading || exportLoading}
            style={styles.input}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          <button type="submit" disabled={!file || loading || exportLoading} style={styles.button}>
            {loading ? 'Importing...' : 'Import CSV'}
          </button>
          <button
            type="button"
            onClick={downloadUsersFromDatabase}
            disabled={exportLoading}
            style={styles.secondaryButton}
          >
            {exportLoading ? 'Exporting...' : 'Export Users CSV'}
          </button>
        </div>
      </form>

      {result && <ImportResults result={result} />}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '20px',
  } as React.CSSProperties,
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  } as React.CSSProperties,
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  } as React.CSSProperties,
  input: {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '14px',
  } as React.CSSProperties,
  button: {
    padding: '10px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  } as React.CSSProperties,
  secondaryButton: {
    padding: '10px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '8px',
  } as React.CSSProperties,
  error: {
    padding: '8px 12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    fontSize: '14px',
  } as React.CSSProperties,
};

export default CsvImport;

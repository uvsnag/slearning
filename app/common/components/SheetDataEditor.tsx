'use client';
import { useState, ChangeEvent } from 'react';
import { updateRange } from '@/app/common/api/sheetDataRepository';
import '@/slearning/multi-ai/style-ai.css';

export interface SheetDataEditorProps {
  sheet: string;
}

const SheetDataEditor: React.FC<SheetDataEditorProps> = (props) => {
  const [cellRange, setCellRange] = useState<string>('A1');
  const [dataInput, setDataInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = async (): Promise<void> => {
    if (!cellRange.trim()) {
      setMessage('❌ Please enter a cell range (e.g., A1 or A1:C1)');
      return;
    }

    setIsLoading(true);
    setMessage('Saving...');

    // try {
    updateRange(
      cellRange,
      dataInput,
      (response: any) => {
        setIsLoading(false);
        if (response && response.success) {
          setMessage(`✅ Data saved successfully to ${cellRange}`);
          setDataInput('');
          setTimeout(() => setMessage(''), 3000);
        } else {
          setMessage(`❌ Error: ${response?.error || 'Unknown error'}`);
        }
      },
      props.sheet,
    );
    // } catch (error) {
    //   setIsLoading(false);
    //   setMessage(`❌ Error: ${String(error)}`);
    // }
  };

  const handleClear = (): void => {
    setDataInput('');
    setCellRange('A1');
    setMessage('');
  };

  return (
    <div>
      <div className="width-100 inline" style={{ marginBottom: '10px' }}>
        <strong>📝 Sheet Data Editor</strong>
      </div>
      <div
        style={{
          marginBottom: '10px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Cell Range:
          </label>
          <input
            type="text"
            value={cellRange}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCellRange(e.target.value)}
            placeholder="e.g., A1 or A1:C1 or Sheet1!A1"
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          />
          <small style={{ color: '#666' }}>
            Format: A1 (single cell), A1:C1 (range), or Sheet1!A1 (with sheet name)
          </small>
        </div>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Data to Save:
          </label>
          <textarea
            value={dataInput}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDataInput(e.target.value)}
            placeholder="Enter data to save. Leave empty to delete."
            rows={4}
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}
          />
          <small style={{ color: '#666' }}>Leave empty to delete the cell content</small>
        </div>

        <div style={{ marginBottom: '8px', display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSave}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontWeight: 'bold',
            }}
          >
            {isLoading ? 'Saving...' : '💾 Save'}
          </button>
          <button
            onClick={handleClear}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              fontWeight: 'bold',
            }}
          >
            🗑️ Clear
          </button>
        </div>

        {message && (
          <div
            style={{
              padding: '10px',
              marginTop: '10px',
              backgroundColor: message.startsWith('✅') ? '#d4edda' : '#f8d7da',
              color: message.startsWith('✅') ? '#155724' : '#721c24',
              borderRadius: '4px',
              border: `1px solid ${message.startsWith('✅') ? '#c3e6cb' : '#f5c6cb'}`,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default SheetDataEditor;

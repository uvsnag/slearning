'use client';

import React, { useState } from 'react';
import { DbConnection, DbTable } from '../types';

interface TableViewerProps {
  connection: DbConnection;
  schemaName: string;
  table: DbTable;
}

/**
 * Table tab content: a DataGrip-style grid with a Data / Structure toggle
 * and a read-only "console" line showing the equivalent SQL.
 */
export default function TableViewer({ connection, schemaName, table }: TableViewerProps) {
  const [view, setView] = useState<'data' | 'structure'>('data');
  const isRedis = connection.engine === 'Redis';

  return (
    <div className="cs-table-viewer">
      <div className="cs-table-toolbar">
        <div className="cs-table-toggle" role="tablist">
          <button
            type="button"
            className={view === 'data' ? 'cs-toggle-active' : ''}
            onClick={() => setView('data')}
          >
            Data
          </button>
          <button
            type="button"
            className={view === 'structure' ? 'cs-toggle-active' : ''}
            onClick={() => setView('structure')}
          >
            Structure
          </button>
        </div>
        <code className="cs-table-sql" translate="no">
          {isRedis
            ? `SCAN 0 MATCH * COUNT ${Math.max(table.rows.length, 10)}`
            : `SELECT * FROM ${schemaName}.${table.name} LIMIT 500;`}
        </code>
      </div>

      {table.comment && <div className="cs-table-comment">— {table.comment}</div>}

      <div className="cs-editor-scroll">
        {view === 'data' ? (
          <table className="cs-grid" translate="no">
            <thead>
              <tr>
                <th className="cs-grid-rownum">#</th>
                {table.columns.map((col) => (
                  <th key={col.name} title={col.comment ?? col.type}>
                    <span className="cs-grid-colname">
                      {col.pk && (
                        <span className="cs-grid-pk" title="primary key">
                          🔑
                        </span>
                      )}
                      {col.name}
                    </span>
                    <span className="cs-grid-coltype">{col.type}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, r) => (
                <tr key={r}>
                  <td className="cs-grid-rownum">{r + 1}</td>
                  {table.columns.map((col, c) => {
                    const value = row[c];
                    return (
                      <td key={col.name} className={value === null ? 'cs-grid-null' : ''}>
                        {value === null ? 'NULL' : String(value)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="cs-grid" translate="no">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Key</th>
                <th>Nullable</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {table.columns.map((col) => (
                <tr key={col.name}>
                  <td>{col.name}</td>
                  <td>{col.type}</td>
                  <td>{col.pk ? 'PK' : ''}</td>
                  <td>{col.nullable ? 'YES' : 'NO'}</td>
                  <td className={col.comment ? '' : 'cs-grid-null'}>{col.comment ?? ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="cs-table-footer">
        {view === 'data'
          ? `${table.rows.length} rows fetched — read-only simulation`
          : `${table.columns.length} columns`}
      </div>
    </div>
  );
}

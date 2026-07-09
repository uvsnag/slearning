'use client';

import React from 'react';
import { DbConnection } from '../types';
import { ChevronIcon, EngineBadge, TableIcon } from './icons';

interface DatabaseExplorerProps {
  connections: DbConnection[];
  expanded: Set<string>;
  activeTableKey?: string;
  onToggle: (key: string) => void;
  onOpenTable: (connection: string, schema: string, table: string) => void;
}

export function tableKey(connection: string, schema: string, table: string) {
  return `${connection}▸${schema}▸${table}`;
}

/**
 * Database view sidebar: connection ▸ schema ▸ tables, like a stripped-down
 * DBeaver / DataGrip explorer. Clicking a table opens it as an editor tab.
 */
export default function DatabaseExplorer({
  connections,
  expanded,
  activeTableKey,
  onToggle,
  onOpenTable,
}: DatabaseExplorerProps) {
  if (connections.length === 0) {
    return <div className="cs-empty-note">This project has no database connections.</div>;
  }
  return (
    <div className="cs-tree" role="tree">
      {connections.map((conn) => {
        const connKey = `conn:${conn.name}`;
        const connOpen = expanded.has(connKey);
        return (
          <React.Fragment key={conn.name}>
            <button
              type="button"
              className="cs-tree-row cs-tree-folder"
              aria-expanded={connOpen}
              title={conn.description ?? conn.name}
              onClick={() => onToggle(connKey)}
            >
              <ChevronIcon open={connOpen} />
              <EngineBadge engine={conn.engine} />
              <span className="cs-tree-label">{conn.name}</span>
              <span className="cs-tree-hint">{conn.engine}</span>
            </button>
            {connOpen &&
              conn.schemas.map((schema) => {
                const schemaKey = `${connKey}/${schema.name}`;
                const schemaOpen = expanded.has(schemaKey);
                return (
                  <React.Fragment key={schemaKey}>
                    <button
                      type="button"
                      className="cs-tree-row cs-tree-folder"
                      style={{ paddingLeft: 22 }}
                      aria-expanded={schemaOpen}
                      onClick={() => onToggle(schemaKey)}
                    >
                      <ChevronIcon open={schemaOpen} />
                      <span className="cs-tree-label">{schema.name}</span>
                      <span className="cs-tree-hint">
                        {schema.tables.length} {schema.tables.length === 1 ? 'table' : 'tables'}
                      </span>
                    </button>
                    {schemaOpen &&
                      schema.tables.map((table) => {
                        const key = tableKey(conn.name, schema.name, table.name);
                        return (
                          <button
                            key={key}
                            type="button"
                            className={`cs-tree-row ${activeTableKey === key ? 'cs-tree-row-active' : ''}`}
                            style={{ paddingLeft: 40 }}
                            title={table.comment ?? table.name}
                            onClick={() => onOpenTable(conn.name, schema.name, table.name)}
                          >
                            <span className="cs-table-icon">
                              <TableIcon />
                            </span>
                            <span className="cs-tree-label">{table.name}</span>
                            <span className="cs-tree-hint">{table.rows.length}</span>
                          </button>
                        );
                      })}
                  </React.Fragment>
                );
              })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

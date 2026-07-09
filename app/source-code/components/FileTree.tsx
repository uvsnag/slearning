'use client';

import React from 'react';
import { CodeFolder, FsNode } from '../types';
import { ChevronIcon, FileBadge } from './icons';

interface FileTreeProps {
  nodes: FsNode[];
  expanded: Set<string>;
  activePath?: string;
  onToggleFolder: (path: string) => void;
  onOpenFile: (path: string) => void;
}

/**
 * Explorer tree. Chains of single-child folders are rendered compacted
 * ("com / demo / order") the way VS Code renders Java packages.
 */
export default function FileTree({
  nodes,
  expanded,
  activePath,
  onToggleFolder,
  onOpenFile,
}: FileTreeProps) {
  return (
    <div className="cs-tree" role="tree">
      <TreeLevel
        nodes={nodes}
        base=""
        depth={0}
        expanded={expanded}
        activePath={activePath}
        onToggleFolder={onToggleFolder}
        onOpenFile={onOpenFile}
      />
    </div>
  );
}

interface TreeLevelProps extends FileTreeProps {
  base: string;
  depth: number;
}

function TreeLevel({
  nodes,
  base,
  depth,
  expanded,
  activePath,
  onToggleFolder,
  onOpenFile,
}: TreeLevelProps) {
  return (
    <>
      {nodes.map((node) => {
        const path = base ? `${base}/${node.name}` : node.name;
        if (node.type === 'file') {
          return (
            <button
              key={path}
              type="button"
              role="treeitem"
              aria-selected={activePath === path}
              className={`cs-tree-row ${activePath === path ? 'cs-tree-row-active' : ''}`}
              style={{ paddingLeft: 10 + depth * 12 }}
              title={path}
              onClick={() => onOpenFile(path)}
            >
              <span className="cs-tree-indent" />
              <FileBadge language={node.language} />
              <span className="cs-tree-label">{node.name}</span>
            </button>
          );
        }

        // Compact single-child folder chains: a/b/c
        let label = node.name;
        let target: CodeFolder = node;
        let targetPath = path;
        while (target.children.length === 1 && target.children[0].type === 'folder') {
          target = target.children[0] as CodeFolder;
          targetPath = `${targetPath}/${target.name}`;
          label = `${label} / ${target.name}`;
        }
        const isOpen = expanded.has(targetPath);
        return (
          <React.Fragment key={path}>
            <button
              type="button"
              role="treeitem"
              aria-selected={false}
              aria-expanded={isOpen}
              className="cs-tree-row cs-tree-folder"
              style={{ paddingLeft: 10 + depth * 12 }}
              title={targetPath}
              onClick={() => onToggleFolder(targetPath)}
            >
              <ChevronIcon open={isOpen} />
              <span className="cs-tree-label">{label}</span>
            </button>
            {isOpen && (
              <TreeLevel
                nodes={target.children}
                base={targetPath}
                depth={depth + 1}
                expanded={expanded}
                activePath={activePath}
                onToggleFolder={onToggleFolder}
                onOpenFile={onOpenFile}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

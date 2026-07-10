'use client';

import React from 'react';
import { CodeFolder, FsNode, collectFolderPaths } from '../types';
import { ChevronIcon, ExpandAllIcon, FileBadge } from './icons';

interface FileTreeProps {
  nodes: FsNode[];
  expanded: Set<string>;
  activePath?: string;
  onToggleFolder: (path: string) => void;
  onOpenFile: (path: string) => void;
  /** Expand a folder and every folder nested inside it. */
  onExpandFolders: (paths: string[]) => void;
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
  onExpandFolders,
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
        onExpandFolders={onExpandFolders}
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
  onExpandFolders,
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
        const hasSubfolders = target.children.some((c) => c.type === 'folder');
        return (
          <React.Fragment key={path}>
            <div
              role="treeitem"
              aria-selected={false}
              aria-expanded={isOpen}
              tabIndex={0}
              className="cs-tree-row cs-tree-folder"
              style={{ paddingLeft: 10 + depth * 12 }}
              title={targetPath}
              onClick={() => onToggleFolder(targetPath)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onToggleFolder(targetPath);
                }
              }}
            >
              <ChevronIcon open={isOpen} />
              <span className="cs-tree-label">{label}</span>
              {hasSubfolders && (
                <button
                  type="button"
                  className="cs-tree-action"
                  title="Expand all folders inside"
                  aria-label={`Expand all folders inside ${label}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpandFolders([
                      targetPath,
                      ...collectFolderPaths(target.children, targetPath),
                    ]);
                  }}
                >
                  <ExpandAllIcon size={13} />
                </button>
              )}
            </div>
            {isOpen && (
              <TreeLevel
                nodes={target.children}
                base={targetPath}
                depth={depth + 1}
                expanded={expanded}
                activePath={activePath}
                onToggleFolder={onToggleFolder}
                onOpenFile={onOpenFile}
                onExpandFolders={onExpandFolders}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

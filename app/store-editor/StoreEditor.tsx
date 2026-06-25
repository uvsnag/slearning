'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { FaPlus, FaTrash, FaSync } from 'react-icons/fa';
import {
  getStoreList,
  addStore,
  removeStore,
  renameStore,
  getStoreItems,
  saveStoreItems,
  ggSheetUpdateTwoValues,
  type DataItem,
  type SheetItem,
} from '@/app/common/hooks/useSheetData';
import { SHEET_AUTO } from '@/app/common/components/SheetDataEditor';
import './style.css';

/** A store item plus a transient (not persisted) selection flag for the Check column. */
type EditRow = DataItem & { checked?: boolean };

/** Write one row (eng, vi) into the next free line of a sheet range, resolving when done. */
const saveRowToSheet = (range: string, eng: string, vi: string): Promise<any> =>
  new Promise((resolve) => {
    ggSheetUpdateTwoValues({ callback: resolve, range, value1: eng, value2: vi });
  });

const StoreEditor: React.FC = () => {
  const [storeList, setStoreList] = useState<SheetItem[]>(() => getStoreList());
  const [activeRange, setActiveRange] = useState<string>(
    () => getStoreList()[0]?.range ?? '',
  );
  const [items, setItems] = useState<EditRow[]>(() =>
    getStoreItems(getStoreList()[0]?.range ?? ''),
  );
  const [newStoreName, setNewStoreName] = useState<string>('');

  // ── Google Sheet save state ──────────────────────────
  const [saveRange, setSaveRange] = useState<string>(SHEET_AUTO[0]?.range ?? '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [sheetMsg, setSheetMsg] = useState<string>('');

  const activeStore = storeList.find((s) => s.range === activeRange);
  const checkedCount = items.filter((it) => it.checked).length;
  const allChecked = items.length > 0 && checkedCount === items.length;

  // ── Store selection ──────────────────────────────────
  const selectStore = (range: string) => {
    setActiveRange(range);
    setItems(getStoreItems(range));
    setSheetMsg('');
  };

  // ── Store management ─────────────────────────────────
  const handleAddStore = () => {
    const next = addStore(newStoreName);
    setStoreList(next);
    setNewStoreName('');
    const added = next[next.length - 1];
    if (added) selectStore(added.range);
  };

  const handleRemoveStore = (range: string) => {
    if (!window.confirm('Delete this store and all its items?')) return;
    const next = removeStore(range);
    setStoreList(next);
    if (activeRange === range) {
      const fallback = next[0]?.range ?? '';
      setActiveRange(fallback);
      setItems(getStoreItems(fallback));
    }
  };

  const handleRenameStore = (range: string, name: string) => {
    setStoreList((prev) =>
      prev.map((s) => (s.range === range ? { ...s, name } : s)),
    );
    renameStore(range, name);
  };

  // ── Item management ──────────────────────────────────
  // Persist items back to the active store (stripping the transient `checked` flag)
  // and keep counts fresh.
  const persistItems = (next: EditRow[]) => {
    setItems(next);
    if (activeRange) {
      saveStoreItems(
        activeRange,
        next.map(({ checked, ...rest }) => rest),
      );
    }
    setStoreList(getStoreList());
  };

  const handleItemChange = (index: number, field: keyof DataItem, value: string) => {
    persistItems(items.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  };

  const handleAddItem = () => {
    if (!activeRange) return;
    persistItems([...items, { eng: '', vi: '', customDefine: '' }]);
  };

  const handleDeleteItem = (index: number) => {
    persistItems(items.filter((_it, i) => i !== index));
  };

  // Toggling the checkbox is selection only — no need to persist to localStorage.
  const handleToggleCheck = (index: number, checked: boolean) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, checked } : it)));
  };

  const handleToggleCheckAll = (checked: boolean) => {
    setItems((prev) => prev.map((it) => ({ ...it, checked })));
  };

  // ── Save checked rows to Google Sheet ────────────────
  const handleSaveCheckedToSheet = async () => {
    const rows = items.filter((it) => it.checked);
    if (rows.length === 0) {
      setSheetMsg('⚠️ No rows checked');
      return;
    }
    if (!saveRange) {
      setSheetMsg('⚠️ Please select a target sheet');
      return;
    }
    setIsSaving(true);
    setSheetMsg(`Saving ${rows.length} row(s)…`);
    let ok = 0;
    try {
      // Save sequentially so each row lands on the next free line.
      for (const row of rows) {
        const resp = await saveRowToSheet(saveRange, row.eng ?? '', row.vi ?? '');
        if (resp?.success) ok += 1;
      }
      setSheetMsg(`💾 Saved ${ok}/${rows.length} row(s) to sheet`);
    } catch (err: any) {
      setSheetMsg(`❌ Error: ${err?.message ?? 'Failed to save'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="store-editor">
      <h2 className="store-editor-title">Custom Store Editor</h2>

      {/* ── Store list / management ── */}
      <section className="store-editor-stores">
        <div className="store-editor-section-head">Stores</div>
        {storeList.length === 0 && <p className="store-editor-empty">No stores yet.</p>}
        <ul className="store-editor-store-list">
          {storeList.map((store) => {
            const count = getStoreItems(store.range).length;
            const isActive = store.range === activeRange;
            return (
              <li
                key={store.range}
                className={`store-editor-store-item ${isActive ? 'active' : ''}`}
              >
                <button
                  type="button"
                  className="store-editor-store-pick"
                  onClick={() => selectStore(store.range)}
                  title="Edit items of this store"
                >
                  <input
                    className="store-editor-input store-editor-store-name"
                    type="text"
                    value={store.name}
                    placeholder="Store name"
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleRenameStore(store.range, e.target.value)
                    }
                  />
                  <span className="store-editor-count">{count}</span>
                </button>
                <button
                  type="button"
                  className="store-editor-btn danger"
                  title="Delete store"
                  onClick={() => handleRemoveStore(store.range)}
                >
                  <FaTrash />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="store-editor-add-store">
          <input
            className="store-editor-input"
            type="text"
            value={newStoreName}
            placeholder="New store name"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStoreName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddStore();
            }}
          />
          <button type="button" className="store-editor-btn primary" onClick={handleAddStore}>
            <FaPlus /> Add Store
          </button>
        </div>
      </section>

      {/* ── Item editor for the active store ── */}
      <section className="store-editor-items">
        <div className="store-editor-section-head">
          Items {activeStore ? `· ${activeStore.name}` : ''}
          {activeRange && (
            <button
              type="button"
              className="store-editor-btn ghost"
              title="Reload items"
              onClick={() => selectStore(activeRange)}
            >
              <FaSync />
            </button>
          )}
        </div>

        {!activeRange && <p className="store-editor-empty">Select a store to edit its items.</p>}

        {activeRange && items.length === 0 && (
          <p className="store-editor-empty">No items in this store yet.</p>
        )}

        {activeRange && items.length > 0 && (
          <div className="store-editor-table-wrap">
            <table className="store-editor-table">
              <thead>
                <tr>
                  <th className="col-check">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      title="Select all"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleToggleCheckAll(e.target.checked)
                      }
                    />
                  </th>
                  <th>English</th>
                  <th>Vietnamese</th>
                  <th>Note</th>
                  <th className="col-action" />
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={item.checked ? 'is-checked' : ''}>
                    <td className="col-check">
                      <input
                        type="checkbox"
                        checked={!!item.checked}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleToggleCheck(index, e.target.checked)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="store-editor-input"
                        type="text"
                        value={item.eng ?? ''}
                        placeholder="English"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleItemChange(index, 'eng', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="store-editor-input"
                        type="text"
                        value={item.vi ?? ''}
                        placeholder="Vietnamese"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleItemChange(index, 'vi', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="store-editor-input"
                        type="text"
                        value={item.customDefine ?? ''}
                        placeholder="Note (optional)"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleItemChange(index, 'customDefine', e.target.value)
                        }
                      />
                    </td>
                    <td className="col-action">
                      <button
                        type="button"
                        className="store-editor-btn danger"
                        title="Delete item"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeRange && (
          <div className="store-editor-actions">
            <button type="button" className="store-editor-btn primary" onClick={handleAddItem}>
              <FaPlus /> Add Item
            </button>
          </div>
        )}

        {/* ── Save checked rows to Google Sheet ── */}
        {activeRange && items.length > 0 && (
          <div className="store-editor-sheet-save">
            <span className="store-editor-checked-count">{checkedCount} checked</span>
            <select
              className="store-editor-input"
              value={saveRange}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSaveRange(e.target.value)}
              disabled={isSaving}
            >
              {SHEET_AUTO.map((opt) => (
                <option key={opt.range} value={opt.range}>
                  {opt.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="store-editor-btn primary"
              onClick={handleSaveCheckedToSheet}
              disabled={isSaving || checkedCount === 0}
            >
              {isSaving ? 'Saving…' : '💾 Save checked to Sheet'}
            </button>
            {sheetMsg && <span className="store-editor-sheet-msg">{sheetMsg}</span>}
          </div>
        )}
      </section>
    </div>
  );
};

export default StoreEditor;

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  ListPlus,
  PackageCheck,
  X,
  Palette,
} from 'lucide-react';
import { groceryApi } from '../services/api';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export default function GroceryPage({ showToast }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [listColor, setListColor] = useState('#4f46e5');

  // New item inputs per list: { [listId]: { name: '', quantity: '' } }
  const [itemInputs, setItemInputs] = useState({});

  // Delete modal state
  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const fetchLists = async () => {
    try {
      setLoading(true);
      const data = await groceryApi.getLists();
      setLists(data);
    } catch (err) {
      showToast(err.message || 'Failed to load grocery lists', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!listTitle.trim()) return;

    try {
      await groceryApi.createList({
        title: listTitle.trim(),
        description: listDesc.trim() || null,
        color: listColor,
      });
      showToast(`Created checklist: "${listTitle}"`, 'success');
      setListTitle('');
      setListDesc('');
      setIsNewListModalOpen(false);
      fetchLists();
    } catch (err) {
      showToast(err.message || 'Failed to create list', 'error');
    }
  };

  const handleDeleteListPrompt = (list) => {
    setDeleteModalState({
      isOpen: true,
      title: `Delete "${list.title}"?`,
      message: `Are you sure you want to delete this checklist and all its ${list.items?.length || 0} items?`,
      onConfirm: async () => {
        try {
          await groceryApi.deleteList(list.id);
          showToast(`Deleted checklist: "${list.title}"`, 'success');
          setDeleteModalState({ isOpen: false });
          fetchLists();
        } catch (err) {
          showToast(err.message || 'Failed to delete list', 'error');
        }
      },
    });
  };

  const handleAddItem = async (listId, e) => {
    e.preventDefault();
    const current = itemInputs[listId] || {};
    if (!current.name || !current.name.trim()) return;

    try {
      await groceryApi.addItem(listId, {
        name: current.name.trim(),
        quantity: current.quantity ? current.quantity.trim() : null,
      });
      setItemInputs((prev) => ({
        ...prev,
        [listId]: { name: '', quantity: '' },
      }));
      fetchLists();
    } catch (err) {
      showToast(err.message || 'Failed to add item', 'error');
    }
  };

  const handleToggleItem = async (itemId) => {
    try {
      await groceryApi.toggleItem(itemId);
      fetchLists();
    } catch (err) {
      showToast(err.message || 'Failed to toggle item', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await groceryApi.deleteItem(itemId);
      fetchLists();
    } catch (err) {
      showToast(err.message || 'Failed to delete item', 'error');
    }
  };

  const colorPalette = ['#4f46e5', '#0891b2', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShoppingCart size={26} color="#4f46e5" />
            Everyday Checklists & Groceries
          </h1>
          <p className="page-subtitle">
            Manage your grocery shopping, supermarket items, household supplies, and daily routines.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsNewListModalOpen(true)}
        >
          <Plus size={16} />
          <span>New Checklist</span>
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p>Loading checklists...</p>
        </div>
      ) : lists.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart className="empty-icon" />
          <h3 className="empty-title">No checklists created yet</h3>
          <p className="empty-description">
            Organize everyday shopping, milk and vegetable runs, or household supplies by creating a checklist.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsNewListModalOpen(true)}
          >
            <Plus size={16} />
            <span>Create First Checklist</span>
          </button>
        </div>
      ) : (
        <div className="grocery-lists-grid">
          {lists.map((list) => {
            const currentInput = itemInputs[list.id] || { name: '', quantity: '' };
            const percent = list.totalItems > 0
              ? Math.round((list.purchasedItems / list.totalItems) * 100)
              : 0;

            return (
              <div
                key={list.id}
                className="grocery-card"
                style={{ borderTop: `4px solid ${list.color || '#4f46e5'}` }}
              >
                <div className="grocery-card-header">
                  <div>
                    <h3 className="grocery-card-title">{list.title}</h3>
                    {list.description && (
                      <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
                        {list.description}
                      </p>
                    )}
                  </div>
                  <button
                    className="btn-icon"
                    onClick={() => handleDeleteListPrompt(list)}
                    title="Delete list"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Progress bar */}
                <div style={{ margin: '8px 0 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: 4 }}>
                    <span>{list.purchasedItems} of {list.totalItems} items purchased</span>
                    <span style={{ fontWeight: 700, color: list.color || '#4f46e5' }}>{percent}%</span>
                  </div>
                  <div className="progress-container" style={{ height: 6 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${percent}%`,
                        background: list.color || '#4f46e5',
                      }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="grocery-items-list">
                  {list.items && list.items.length > 0 ? (
                    list.items.map((item) => (
                      <div
                        key={item.id}
                        className={`grocery-item-row ${item.purchased ? 'purchased' : ''}`}
                      >
                        <div className="grocery-item-left">
                          <button
                            className={`checkbox-btn ${item.purchased ? 'checked' : ''}`}
                            onClick={() => handleToggleItem(item.id)}
                            style={{
                              width: 20,
                              height: 20,
                              background: item.purchased ? list.color || '#4f46e5' : '#ffffff',
                              borderColor: item.purchased ? list.color || '#4f46e5' : '#cbd5e1',
                            }}
                          >
                            {item.purchased && <Check size={12} strokeWidth={3} />}
                          </button>
                          <span className="grocery-item-name">{item.name}</span>
                          {item.quantity && (
                            <span className="grocery-item-qty">({item.quantity})</span>
                          )}
                        </div>
                        <button
                          className="btn-icon"
                          onClick={() => handleDeleteItem(item.id)}
                          style={{ padding: 4, color: '#94a3b8' }}
                          title="Delete item"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                      No items in this checklist yet
                    </div>
                  )}
                </div>

                {/* Inline Add Item Form */}
                <form
                  onSubmit={(e) => handleAddItem(list.id, e)}
                  style={{ display: 'flex', gap: 6, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f1f5f9' }}
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Item (e.g. Milk, Rice)..."
                    value={currentInput.name}
                    onChange={(e) =>
                      setItemInputs((prev) => ({
                        ...prev,
                        [list.id]: { ...currentInput, name: e.target.value },
                      }))
                    }
                    style={{ padding: '7px 10px', fontSize: '0.85rem', flex: 2 }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Qty (2L, 1kg)"
                    value={currentInput.quantity}
                    onChange={(e) =>
                      setItemInputs((prev) => ({
                        ...prev,
                        [list.id]: { ...currentInput, quantity: e.target.value },
                      }))
                    }
                    style={{ padding: '7px 10px', fontSize: '0.85rem', flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={!currentInput.name.trim()}
                    style={{ padding: '7px 12px', background: list.color || '#4f46e5' }}
                  >
                    <Plus size={14} />
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create New Checklist */}
      {isNewListModalOpen && (
        <div className="modal-overlay" onClick={() => setIsNewListModalOpen(false)}>
          <div className="modal-container" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Checklist</h2>
              <button className="btn-icon" onClick={() => setIsNewListModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateList}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">
                    List Title <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Weekly Groceries, Pharmacy Run..."
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Items to buy from organic market"
                    value={listDesc}
                    onChange={(e) => setListDesc(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Accent Color</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                    {colorPalette.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setListColor(c)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: c,
                          border: listColor === c ? '3px solid #0f172a' : '2px solid #ffffff',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsNewListModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!listTitle.trim()}
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={deleteModalState.message}
        onConfirm={deleteModalState.onConfirm}
        onCancel={() => setDeleteModalState({ isOpen: false })}
      />
    </div>
  );
}

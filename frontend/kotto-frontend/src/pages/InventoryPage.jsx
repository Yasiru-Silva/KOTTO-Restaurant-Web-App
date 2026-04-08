import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import IngredientForm from "../components/IngredientForm";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../services/inventoryService";
import styles from "./InventoryPage.module.css";

function formatUnit(unit) {
  switch (unit) {
    case "KG":
      return "kg";
    case "G":
      return "g";
    case "L":
      return "L";
    case "ML":
      return "ml";
    default:
      return unit;
  }
}

function formatQuantity(quantity) {
  if (quantity === null || quantity === undefined) return "";
  return Number(quantity).toFixed(2);
}

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);

  const loadIngredients = async () => {
    try {
      setLoading(true);
      setPageError("");
      const data = await getIngredients();
      setIngredients(data);
    } catch (error) {
      setPageError(error.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const handleAdd = async (payload) => {
    try {
      setActionLoading(true);
      await createIngredient(payload);
      setShowAddModal(false);
      await loadIngredients();
      alert("Ingredient added successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add ingredient");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (payload) => {
    if (!editingIngredient) return;

    try {
      setActionLoading(true);
      await updateIngredient(editingIngredient.id, payload);
      setEditingIngredient(null);
      await loadIngredients();
      alert("Ingredient updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update ingredient");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (ingredient) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${ingredient.name}"?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      await deleteIngredient(ingredient.id);
      await loadIngredients();
      alert("Ingredient deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete ingredient");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <PageShell>
      <main className={styles.container}>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Inventory Management</h1>
            <p className={styles.subtitle}>
              View, add, edit, and delete ingredients.
            </p>
          </div>

          <button
            className={styles.primaryButton}
            onClick={() => setShowAddModal(true)}
          >
            Add Ingredient
          </button>
        </div>

        {loading && <p className={styles.loading}>Loading inventory...</p>}

        {!loading && pageError && <p className={styles.error}>{pageError}</p>}

        {!loading && !pageError && ingredients.length === 0 && (
          <div className={styles.emptyState}>
            <p>No ingredients available.</p>
            <button
              className={styles.primaryButton}
              onClick={() => setShowAddModal(true)}
            >
              Add First Ingredient
            </button>
          </div>
        )}

        {!loading && !pageError && ingredients.length > 0 && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableScroll}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ingredient Name</th>
                    <th>Quantity</th>
                    <th>Updated At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {ingredients.map((ingredient) => (
                    <tr key={ingredient.id}>
                      <td>{ingredient.id}</td>
                      <td>{ingredient.name}</td>
                      <td>
                        {formatQuantity(ingredient.quantity)}{" "}
                        {formatUnit(ingredient.unit)}
                      </td>
                      <td>
                        {ingredient.updatedAt
                          ? new Date(ingredient.updatedAt).toLocaleString()
                          : "-"}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => setEditingIngredient(ingredient)}
                            disabled={actionLoading}
                          >
                            Edit
                          </button>

                          <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDelete(ingredient)}
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddModal && (
          <IngredientForm
            mode="add"
            onSubmit={handleAdd}
            onCancel={() => setShowAddModal(false)}
            loading={actionLoading}
          />
        )}

        {editingIngredient && (
          <IngredientForm
            mode="edit"
            initialData={editingIngredient}
            onSubmit={handleEdit}
            onCancel={() => setEditingIngredient(null)}
            loading={actionLoading}
          />
        )}
      </main>
    </PageShell>
  );
}
import { useEffect, useState } from "react";
import { getCategories, getMoods } from "../services/menuService";
import {
  createCategory,
  createMenuItem,
  createMood,
} from "../services/adminMenuService";
import { useToast } from "../context/ToastContext";
import styles from "./AdminAddItemPage.module.css";

export default function AdminAddItemPage() {
  const { addToast } = useToast();

  const [categories, setCategories] = useState([]);
  const [moods, setMoods] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedMoodIds, setSelectedMoodIds] = useState(new Set());
  const [bestSeller, setBestSeller] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newMoodName, setNewMoodName] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const loadMeta = async () => {
    try {
      const [cats, mds] = await Promise.all([getCategories(), getMoods()]);
      setCategories(cats);
      setMoods(mds);
      if (cats.length && !categoryId) {
        setCategoryId(String(cats[0].id));
      }
    } catch (e) {
      console.error(e);
      addToast("Could not load categories or moods.", "error");
    } finally {
      setLoadingMeta(false);
    }
  };

  useEffect(() => {
    loadMeta();
  }, []);

  const toggleMood = (id) => {
    setSelectedMoodIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    try {
      const created = await createCategory(trimmed);
      setCategories((c) => [...c, created].sort((a, b) => a.name.localeCompare(b.name)));
      setCategoryId(String(created.id));
      setNewCategoryName("");
      addToast(`Category "${created.name}" added.`, "success");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Could not add category.";
      addToast(msg, "error");
    }
  };

  const handleAddMood = async (e) => {
    e.preventDefault();
    const trimmed = newMoodName.trim();
    if (!trimmed) return;
    try {
      const created = await createMood(trimmed);
      setMoods((m) => [...m, created].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedMoodIds((prev) => new Set(prev).add(created.id));
      setNewMoodName("");
      addToast(`Mood "${created.name}" added.`, "success");
    } catch (err) {
      const msg = err?.response?.data?.message || "Could not add mood.";
      addToast(msg, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast("Name is required.", "error");
      return;
    }
    const priceNum = parseFloat(price);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      addToast("Enter a valid price in LKR.", "error");
      return;
    }
    if (!categoryId) {
      addToast("Select a category.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("price", String(priceNum));
    formData.append("categoryId", categoryId);
    formData.append("bestSeller", bestSeller ? "true" : "false");
    selectedMoodIds.forEach((mid) => {
      formData.append("moodIds", String(mid));
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    setLoading(true);
    try {
      await createMenuItem(formData);
      addToast("Menu item created successfully.", "success");
      setName("");
      setDescription("");
      setPrice("");
      setBestSeller(false);
      setImageFile(null);
      setSelectedMoodIds(new Set());
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Could not create menu item.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingMeta) {
    return (
      <div className={styles.page}>
        <p className={styles.muted}>Loading…</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Add menu item</h1>
        <p className={styles.sub}>
          Upload an image, set price in LKR, pick a category and moods. You can
          add new categories and moods anytime.
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span>Name *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Spicy Beef Kottu"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Short description for customers"
          />
        </label>

        <label className={styles.field}>
          <span>Price (LKR) *</span>
          <input
            type="number"
            min="1"
            step="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="850"
            required
          />
        </label>

        <label className={styles.field}>
          <span>Image</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {imageFile ? (
            <span className={styles.fileHint}>{imageFile.name}</span>
          ) : (
            <span className={styles.muted}>Optional — uses placeholder if empty</span>
          )}
        </label>

        <div className={styles.field}>
          <span>Category *</span>
          <div className={styles.row}>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inlineAdd}>
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
            />
            <button type="button" onClick={handleAddCategory}>
              Add category
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <span>Moods (mood-based ordering)</span>
          <div className={styles.moodGrid}>
            {moods.map((m) => (
              <label key={m.id} className={styles.moodChip}>
                <input
                  type="checkbox"
                  checked={selectedMoodIds.has(m.id)}
                  onChange={() => toggleMood(m.id)}
                />
                <span>{m.name}</span>
              </label>
            ))}
          </div>
          <div className={styles.inlineAdd}>
            <input
              value={newMoodName}
              onChange={(e) => setNewMoodName(e.target.value)}
              placeholder="New mood name"
            />
            <button type="button" onClick={handleAddMood}>
              Add mood
            </button>
          </div>
        </div>

        <label className={styles.check}>
          <input
            type="checkbox"
            checked={bestSeller}
            onChange={(e) => setBestSeller(e.target.checked)}
          />
          <span>Mark as best seller</span>
        </label>

        <button
          type="submit"
          className={styles.submit}
          disabled={loading}
        >
          {loading ? "Saving…" : "Create menu item"}
        </button>
      </form>
    </div>
  );
}

import { useEffect, useState } from "react";
import styles from "./IngredientForm.module.css";

const UNIT_OPTIONS = [
  { value: "KG", label: "kg" },
  { value: "G", label: "g" },
  { value: "L", label: "L" },
  { value: "ML", label: "ml" },
];

export default function IngredientForm({
  mode = "add",
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    unit: "KG",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        quantity:
          initialData.quantity !== undefined && initialData.quantity !== null
            ? String(initialData.quantity)
            : "",
        unit: initialData.unit || "KG",
      });
    } else {
      setForm({
        name: "",
        quantity: "",
        unit: "KG",
      });
    }
  }, [initialData]);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Ingredient name is required";
    }

    if (form.quantity === "") {
      nextErrors.quantity = "Quantity is required";
    } else if (Number(form.quantity) < 0) {
      nextErrors.quantity = "Quantity cannot be negative";
    }

    if (!form.unit) {
      nextErrors.unit = "Unit is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit({
      name: form.name.trim(),
      quantity: Number(form.quantity),
      unit: form.unit,
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{mode === "edit" ? "Edit Ingredient" : "Add Ingredient"}</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="name">Ingredient Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter ingredient name"
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                step="0.01"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0.00"
              />
              {errors.quantity && <p className={styles.error}>{errors.quantity}</p>}
            </div>

            <div className={styles.field}>
              <label htmlFor="unit">Unit</label>
              <select
                id="unit"
                name="unit"
                value={form.unit}
                onChange={handleChange}
              >
                {UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.unit && <p className={styles.error}>{errors.unit}</p>}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : mode === "edit"
                ? "Update Ingredient"
                : "Add Ingredient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
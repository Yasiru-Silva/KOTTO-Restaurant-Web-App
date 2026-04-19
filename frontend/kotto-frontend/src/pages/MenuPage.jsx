import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import MenuList from "../components/MenuList";
import { getCategories, getMoods } from "../services/menuService";
import { moodEmoji } from "../utils/moodEmoji";
import "../styles/MenuPage.css";

function MenuPage() {
  const [moods, setMoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [menuRefresh, setMenuRefresh] = useState(0);

  useEffect(() => {
    Promise.all([getMoods(), getCategories()])
      .then(([m, c]) => {
        setMoods(m);
        setCategories(c);
      })
      .catch(() => {
        setMoods([]);
        setCategories([]);
      });
  }, []);

  const bumpMenu = () => setMenuRefresh((n) => n + 1);

  return (
    <div className="menu-page">
      <Hero />

      <section className="best-deals">
        <h2>🔥 Our Best Deals</h2>
        <MenuList
          onlyBestSellers={true}
          refreshKey={menuRefresh}
          onMenuChanged={bumpMenu}
        />
      </section>

      <section id="menu-section">
        <h2 className="menu-title">🍜 Our Menu</h2>

        <div className="what-you-feel">
          <h3 className="what-you-feel-title">What you feel?</h3>
          <p className="what-you-feel-sub">
            Tap a mood — we&apos;ll suggest dishes that match your vibe.
          </p>
          <div className="mood-tabs-large" role="tablist" aria-label="Mood filter">
            <button
              type="button"
              role="tab"
              aria-selected={selectedMoodId === null}
              className={
                selectedMoodId === null
                  ? "mood-tab-large mood-tab-large-active"
                  : "mood-tab-large"
              }
              onClick={() => setSelectedMoodId(null)}
            >
              <span className="mood-tab-emoji" aria-hidden>
                🌟
              </span>
              <span className="mood-tab-label">All moods</span>
            </button>
            {moods.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={selectedMoodId === m.id}
                className={
                  selectedMoodId === m.id
                    ? "mood-tab-large mood-tab-large-active"
                    : "mood-tab-large"
                }
                onClick={() => setSelectedMoodId(m.id)}
              >
                <span className="mood-tab-emoji" aria-hidden>
                  {moodEmoji(m.name)}
                </span>
                <span className="mood-tab-label">{m.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="category-filter-block">
          <h3 className="category-filter-title">Category</h3>
          <p className="category-filter-sub">Narrow down by food type</p>
          <div className="category-chips" role="group" aria-label="Category filter">
            <button
              type="button"
              className={
                selectedCategoryId === null
                  ? "category-chip category-chip-active"
                  : "category-chip"
              }
              onClick={() => setSelectedCategoryId(null)}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={
                  selectedCategoryId === c.id
                    ? "category-chip category-chip-active"
                    : "category-chip"
                }
                onClick={() => setSelectedCategoryId(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <MenuList
          moodId={selectedMoodId}
          categoryId={selectedCategoryId}
          refreshKey={menuRefresh}
          onMenuChanged={bumpMenu}
        />
      </section>
    </div>
  );
}

export default MenuPage;

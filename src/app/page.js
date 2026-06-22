import HomeClient from "@/components/HomeClient";

// Disable caching for live community counts & popular updates
export const revalidate = 0;

export default async function Home() {
  let featuredRecipes = [];
  let popularRecipes = [];
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    // Fetch 4 featured recipes
    const featuredRes = await fetch(`${apiBase}/api/recipes?featured=true&limit=4`, { cache: "no-store" });
    if (featuredRes.ok) {
      const data = await featuredRes.json();
      featuredRecipes = data.recipes;
    }

    // Fetch 4 popular recipes based on likes
    const popularRes = await fetch(`${apiBase}/api/recipes?sort=likes&limit=4`, { cache: "no-store" });
    if (popularRes.ok) {
      const data = await popularRes.json();
      popularRecipes = data.recipes;
    }
  } catch (err) {
    console.error("Home Page Data Fetching failed", err);
  }

  return (
    <HomeClient
      featuredRecipes={featuredRecipes}
      popularRecipes={popularRecipes}
    />
  );
}

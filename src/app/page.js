import HomeClient from "@/components/HomeClient";

// Disable caching for live community counts & popular updates
export const revalidate = 0;

// Helper to fetch with a timeout
async function fetchWithTimeout(url, options = {}) {
  const { timeout = 3000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export default async function Home() {
  let featuredRecipes = [];
  let popularRecipes = [];
  
  // Set production fallback URL if env is not set
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 
    (process.env.NODE_ENV === "production" 
      ? "https://recipehub-backend-alpha.vercel.app" 
      : "http://localhost:5000");

  try {
    // Fetch 4 featured recipes with a timeout
    const featuredRes = await fetchWithTimeout(`${apiBase}/api/recipes?featured=true&limit=4`, { 
      cache: "no-store",
      timeout: 3000 
    });
    if (featuredRes.ok) {
      const data = await featuredRes.json();
      featuredRecipes = data.recipes;
    }
  } catch (err) {
    console.error("Home Page: Featured Recipes Fetching failed:", err.message || err);
  }

  try {
    // Fetch 4 popular recipes based on likes with a timeout
    const popularRes = await fetchWithTimeout(`${apiBase}/api/recipes?sort=likes&limit=4`, { 
      cache: "no-store",
      timeout: 3000
    });
    if (popularRes.ok) {
      const data = await popularRes.json();
      popularRecipes = data.recipes;
    }
  } catch (err) {
    console.error("Home Page: Popular Recipes Fetching failed:", err.message || err);
  }

  return (
    <HomeClient
      featuredRecipes={featuredRecipes}
      popularRecipes={popularRecipes}
    />
  );
}


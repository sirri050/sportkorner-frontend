// src/lib/scores.ts

export async function getLiveScores() {
  const url = "https://v3.football.api-sports.io/fixtures?live=all"; //"https://v1.basketball.api-sports.io";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-apisports-key": process.env.RAPIDAPI_KEY || "",
        // "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
      },
      // Next.js Cache: Revalidate every 3600 seconds (1 hour)
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error("Failed to fetch scores");

    const data = await response.json();
    //console.log(data);

    // Transform API-Football data into a simpler format for our UI
    return data.response.map((item: any) => ({
      id: item.fixture.id,
      home: item.teams.home.name,
      away: item.teams.away.name,
      homeLogo: item.teams.home.logo,
      awayLogo: item.teams.away.logo,
      homeScore: item.goals.home,
      awayScore: item.goals.away,
      status: item.fixture.status.short, // e.g., '1H', '2H', 'FT'
      minute: item.fixture.status.elapsed,
      league: item.league.name,
    }));
  } catch (error) {
    console.error("Score API Error:", error);
    return []; // Return empty array so UI doesn't crash
  }
}

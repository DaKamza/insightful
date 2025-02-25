
import { toast } from "sonner";

const API_KEY = "0b4fffd306426aa886003c4401009cb7";
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-rapidapi-host": "v3.football.api-sports.io",
  "x-rapidapi-key": API_KEY
};

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    venue: { name: string };
    status: { short: string };
  };
  teams: {
    home: { name: string; logo: string };
    away: { name: string; logo: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  league: {
    name: string;
    country: string;
  };
}

export interface H2H {
  fixtures: Fixture[];
  wins: { home: number; away: number; total: number };
  draws: { total: number };
  goals: { 
    home: { total: number; average: string };
    away: { total: number; average: string };
  };
}

export interface Prediction {
  comparison: {
    form: { home: string; away: string };
    att: { home: string; away: string };
    def: { home: string; away: string };
    goals: { home: string; away: string };
  };
  predictions: {
    winner: { id: number; name: string; comment: string };
    win_or_draw: boolean;
    under_over: string;
    goals: { home: string; away: string };
    advice: string;
    percent: { home: string; draw: string; away: string };
  };
}

export const footballApi = {
  async getLiveFixtures(): Promise<Fixture[]> {
    try {
      const response = await fetch(`${BASE_URL}/fixtures?live=all`, { headers });
      const data = await response.json();
      return data.response || [];
    } catch (error) {
      toast.error("Failed to fetch live fixtures");
      return [];
    }
  },

  async getUpcomingFixtures(): Promise<Fixture[]> {
    const today = new Date().toISOString().split('T')[0];
    try {
      const response = await fetch(`${BASE_URL}/fixtures?date=${today}&status=NS`, { headers });
      const data = await response.json();
      return data.response || [];
    } catch (error) {
      toast.error("Failed to fetch upcoming fixtures");
      return [];
    }
  },

  async getH2H(homeTeamId: number, awayTeamId: number): Promise<H2H> {
    try {
      const response = await fetch(
        `${BASE_URL}/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}&last=5`,
        { headers }
      );
      const data = await response.json();
      return data.response || { fixtures: [], wins: { home: 0, away: 0, total: 0 }, draws: { total: 0 } };
    } catch (error) {
      toast.error("Failed to fetch head-to-head statistics");
      throw error;
    }
  },

  async getPrediction(fixtureId: number): Promise<Prediction> {
    try {
      const response = await fetch(`${BASE_URL}/predictions?fixture=${fixtureId}`, { headers });
      const data = await response.json();
      return data.response[0];
    } catch (error) {
      toast.error("Failed to fetch prediction");
      throw error;
    }
  }
};

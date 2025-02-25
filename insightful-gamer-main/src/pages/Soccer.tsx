
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { footballApi, type Fixture } from "@/services/footballApi";
import { useState } from "react";
import { Target, TrendingUp, Users, ArrowUpRight } from "lucide-react";

const Soccer = () => {
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const { data: upcomingFixtures = [] } = useQuery({
    queryKey: ["upcomingFixtures"],
    queryFn: footballApi.getUpcomingFixtures,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: prediction } = useQuery({
    queryKey: ["prediction", selectedFixture?.fixture.id],
    queryFn: () => 
      selectedFixture ? footballApi.getPrediction(selectedFixture.fixture.id) : null,
    enabled: !!selectedFixture,
  });

  const filterHighAccuracyPredictions = (percent: { home: string; draw: string; away: string }) => {
    const maxPercent = Math.max(
      parseFloat(percent.home),
      parseFloat(percent.draw),
      parseFloat(percent.away)
    );
    return maxPercent >= 84;
  };

  const getPredictionLabel = (prediction: any) => {
    if (!prediction) return [];
    
    const predictions = [];
    const totalGoals = parseFloat(prediction.predictions.goals.home) + parseFloat(prediction.predictions.goals.away);
    
    // Winner prediction
    if (prediction.predictions.winner.name) {
      predictions.push(prediction.predictions.winner.name === selectedFixture?.teams.home.name ? "H-Win" : "A-Win");
    }

    // Goals predictions
    if (totalGoals > 0.5) predictions.push("Over 0.5");
    if (totalGoals > 1.5) predictions.push("Over 1.5");
    if (totalGoals > 2.5) predictions.push("Over 2.5");
    if (totalGoals > 3.5) predictions.push("Over 3.5");

    // BTTS prediction
    if (parseFloat(prediction.predictions.goals.home) > 0 && parseFloat(prediction.predictions.goals.away) > 0) {
      predictions.push("BTTS");
    }

    return predictions;
  };

  // Filter matches that are scheduled for today but haven't started
  const todaysUpcomingMatches = upcomingFixtures.filter((fixture) => {
    const matchTime = new Date(fixture.fixture.date);
    const now = new Date();
    const isToday = matchTime.toDateString() === now.toDateString();
    const hasntStarted = matchTime > now;
    return isToday && hasntStarted;
  });

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-4xl font-display font-semibold">Soccer Predictions</h1>
        <p className="text-lg text-muted-foreground mt-2">
          High-accuracy predictions for today's upcoming matches
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {todaysUpcomingMatches.map((fixture) => (
          <Card 
            key={fixture.fixture.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedFixture(fixture)}
          >
            <CardHeader>
              <CardTitle className="text-lg">
                {fixture.teams.home.name} vs {fixture.teams.away.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {fixture.league.name} • {fixture.league.country}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    Kickoff: {new Date(fixture.fixture.date).toLocaleTimeString()}
                  </div>
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary">
                    Upcoming
                  </span>
                </div>
                {selectedFixture?.fixture.id === fixture.fixture.id && prediction && (
                  <div className="flex flex-wrap gap-2">
                    {getPredictionLabel(prediction).map((label, index) => (
                      <span 
                        key={index}
                        className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {prediction && selectedFixture && filterHighAccuracyPredictions(prediction.predictions.percent) && (
        <div className="mt-8">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>High Confidence Prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <h3 className="font-semibold">Match Winner</h3>
                  <p className="text-primary font-medium">
                    {prediction.predictions.winner.name === selectedFixture.teams.home.name ? "H-Win" : "A-Win"}
                  </p>
                  <p className="text-sm text-muted-foreground">{prediction.predictions.winner.comment}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Goals Prediction</h3>
                  <p className="text-primary font-medium">
                    {parseFloat(prediction.predictions.goals.home) + parseFloat(prediction.predictions.goals.away) > 2.5 
                      ? "Over 2.5" 
                      : "Under 2.5"
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expected Goals: {prediction.predictions.goals.home} - {prediction.predictions.goals.away}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Probability Distribution</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{prediction.predictions.percent.home}%</div>
                      <div className="text-sm text-muted-foreground">H-Win</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{prediction.predictions.percent.draw}%</div>
                      <div className="text-sm text-muted-foreground">Draw</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{prediction.predictions.percent.away}%</div>
                      <div className="text-sm text-muted-foreground">A-Win</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default Soccer;

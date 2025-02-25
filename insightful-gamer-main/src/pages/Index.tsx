
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { footballApi, type Fixture } from "@/services/footballApi";
import { useState } from "react";

const Dashboard = () => {
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

  const { data: liveFixtures = [] } = useQuery({
    queryKey: ["liveFixtures"],
    queryFn: footballApi.getLiveFixtures,
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: upcomingFixtures = [] } = useQuery({
    queryKey: ["upcomingFixtures"],
    queryFn: footballApi.getUpcomingFixtures,
  });

  const { data: prediction } = useQuery({
    queryKey: ["prediction", selectedFixture?.fixture.id],
    queryFn: () => 
      selectedFixture ? footballApi.getPrediction(selectedFixture.fixture.id) : null,
    enabled: !!selectedFixture,
  });

  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-4xl font-display font-semibold text-balance">
          Sports Analysis Dashboard
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Real-time insights and predictions for your betting strategy
        </p>
      </header>

      {prediction && selectedFixture && (
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <MetricCard
            title="Home Win"
            value={prediction.predictions.percent.home}
            trend={prediction.comparison.form.home}
            icon={<TrendingUp className="w-5 h-5 text-teal-500" />}
          />
          <MetricCard
            title="Draw"
            value={prediction.predictions.percent.draw}
            trend={prediction.predictions.advice}
            icon={<Users className="w-5 h-5 text-teal-500" />}
          />
          <MetricCard
            title="Away Win"
            value={prediction.predictions.percent.away}
            trend={prediction.comparison.form.away}
            icon={<Target className="w-5 h-5 text-teal-500" />}
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 glass glass-hover">
          <h3 className="text-lg font-semibold mb-4">Live Matches</h3>
          <div className="space-y-4">
            {liveFixtures.slice(0, 3).map((fixture) => (
              <div
                key={fixture.fixture.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                onClick={() => setSelectedFixture(fixture)}
              >
                <div>
                  <h4 className="font-medium">
                    {fixture.teams.home.name} vs {fixture.teams.away.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {fixture.goals.home} - {fixture.goals.away} ({fixture.fixture.status.short})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary">
                    {fixture.league.name}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-teal-500" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 glass glass-hover">
          <h3 className="text-lg font-semibold mb-4">Upcoming Matches</h3>
          <div className="space-y-4">
            {upcomingFixtures.slice(0, 3).map((fixture) => (
              <div
                key={fixture.fixture.id}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer"
                onClick={() => setSelectedFixture(fixture)}
              >
                <div>
                  <h4 className="font-medium">
                    {fixture.teams.home.name} vs {fixture.teams.away.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(fixture.fixture.date).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium px-2 py-1 rounded-full bg-secondary">
                    {fixture.league.name}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-teal-500" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {selectedFixture && prediction && (
          <Card className="p-6 glass glass-hover md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Match Analysis</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Prediction Details</h4>
                <ul className="space-y-2">
                  <li>
                    <span className="text-muted-foreground">Winner: </span>
                    {prediction.predictions.winner.name}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Win/Draw Probability: </span>
                    {prediction.predictions.win_or_draw ? "Yes" : "No"}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Goals Over/Under: </span>
                    {prediction.predictions.under_over}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Advice: </span>
                    {prediction.predictions.advice}
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Team Comparison</h4>
                <ul className="space-y-2">
                  <li>
                    <span className="text-muted-foreground">Home Attack: </span>
                    {prediction.comparison.att.home}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Away Attack: </span>
                    {prediction.comparison.att.away}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Home Defense: </span>
                    {prediction.comparison.def.home}
                  </li>
                  <li>
                    <span className="text-muted-foreground">Away Defense: </span>
                    {prediction.comparison.def.away}
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

function MetricCard({
  title,
  value,
  trend,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="p-6 glass glass-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-full bg-teal-50">{icon}</div>
        <span className="text-sm font-medium text-teal-500">{trend}</span>
      </div>
      <h3 className="text-2xl font-semibold mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </Card>
  );
}

export default Dashboard;

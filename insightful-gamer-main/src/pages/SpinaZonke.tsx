
import { Layout } from "@/components/Layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";

const SpinaZonke = () => {
  return (
    <Layout>
      <header className="mb-8">
        <h1 className="text-4xl font-display font-semibold">Spina Zonke Games</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Coming Soon
        </p>
      </header>

      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6" />
            Feature Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We're working on bringing you exciting gaming predictions and analysis. Stay tuned!
          </p>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default SpinaZonke;

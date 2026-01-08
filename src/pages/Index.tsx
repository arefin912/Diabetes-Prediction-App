import { useState } from "react";
import { Header } from "@/components/Header";
import { PredictionForm } from "@/components/PredictionForm";
import { PredictionResults } from "@/components/PredictionResults";
import { ApiConfigModal } from "@/components/ApiConfigModal";
import { toast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";

interface SinglePrediction {
  prediction: number;
  result: string;
  confidence: number;
}

interface PredictionResponse {
  random_forest: SinglePrediction;
  logistic_regression: SinglePrediction;
}

const Index = () => {
  const [apiUrl, setApiUrl] = useState("https://diabetis-prediction-api.onrender.com");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: {
    Pregnancies: number;
    Glucose: number;
    BloodPressure: number;
    SkinThickness: number;
    Insulin: number;
    BMI: number;
    DiabetesPedigreeFunction: number;
    Age: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      setResults(data);
      
      toast({
        title: "Prediction Complete",
        description: "Analysis finished successfully",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get prediction";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/3 to-transparent rounded-full blur-3xl" />
      </div>

      <ApiConfigModal apiUrl={apiUrl} onSave={setApiUrl} />

      <main className="relative z-10 container max-w-3xl mx-auto px-4 py-12 md:py-20">
        <Header />

        <div className="glass-card rounded-3xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            Enter Health Parameters
          </h2>
          <PredictionForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>

        {error && (
          <div className="glass-card rounded-2xl p-4 mb-8 border-destructive/20 bg-destructive/5 fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">Connection Error</p>
                <p className="text-sm text-muted-foreground">
                  {error}. Make sure your FastAPI server is running and configure the API URL using the settings button.
                </p>
              </div>
            </div>
          </div>
        )}

        {results && (
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Prediction Results
            </h2>
            <PredictionResults results={results} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

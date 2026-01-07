import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Brain, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SinglePrediction {
  prediction: number;
  result: string;
  confidence: number;
}

interface PredictionResultsProps {
  results: {
    random_forest: SinglePrediction;
    logistic_regression: SinglePrediction;
  };
}

function ResultCard({
  title,
  icon: Icon,
  prediction,
  delay = 0,
}: {
  title: string;
  icon: React.ElementType;
  prediction: SinglePrediction;
  delay?: number;
}) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const isDiabetic = prediction.result === "Diabetic";
  const confidencePercent = Math.round(prediction.confidence * 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(confidencePercent);
    }, delay + 300);
    return () => clearTimeout(timer);
  }, [confidencePercent, delay]);

  return (
    <div
      className={cn(
        "result-card slide-up",
        isDiabetic
          ? "bg-gradient-to-br from-destructive/10 via-card to-card border border-destructive/20"
          : "bg-gradient-to-br from-success/10 via-card to-card border border-success/20"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-xl",
              isDiabetic ? "bg-destructive/10" : "bg-success/10"
            )}
          >
            <Icon
              className={cn(
                "w-5 h-5",
                isDiabetic ? "text-destructive" : "text-success"
              )}
            />
          </div>
          <span className="font-display font-semibold text-foreground">
            {title}
          </span>
        </div>
      </div>

      {/* Result */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {isDiabetic ? (
            <AlertTriangle className="w-8 h-8 text-destructive" />
          ) : (
            <CheckCircle2 className="w-8 h-8 text-success" />
          )}
          <span
            className={cn(
              "text-2xl font-display font-bold",
              isDiabetic ? "text-destructive" : "text-success"
            )}
          >
            {isDiabetic ? "At Risk" : "Low Risk"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {isDiabetic
            ? "Indicators suggest elevated diabetes risk"
            : "Indicators suggest low diabetes risk"}
        </p>
      </div>

      {/* Confidence */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Model Confidence
          </span>
          <span
            className={cn(
              "text-lg font-bold font-display",
              isDiabetic ? "text-destructive" : "text-success"
            )}
          >
            {animatedConfidence}%
          </span>
        </div>
        <div className="confidence-bar">
          <div
            className={cn(
              "confidence-fill",
              isDiabetic
                ? "bg-gradient-to-r from-destructive to-warning"
                : "bg-gradient-to-r from-success to-primary"
            )}
            style={{ width: `${animatedConfidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function PredictionResults({ results }: PredictionResultsProps) {
  const bothAgree =
    results.random_forest.result === results.logistic_regression.result;
  const consensusIsDiabetic = results.random_forest.result === "Diabetic";

  return (
    <div className="space-y-6 fade-in">
      {/* Consensus Banner */}
      <div
        className={cn(
          "p-4 rounded-2xl text-center",
          bothAgree
            ? consensusIsDiabetic
              ? "bg-destructive/10 border border-destructive/20"
              : "bg-success/10 border border-success/20"
            : "bg-warning/10 border border-warning/20"
        )}
      >
        <div className="flex items-center justify-center gap-2 mb-1">
          {bothAgree ? (
            consensusIsDiabetic ? (
              <AlertTriangle className="w-5 h-5 text-destructive" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-success" />
            )
          ) : (
            <AlertTriangle className="w-5 h-5 text-warning" />
          )}
          <span className="font-display font-bold text-lg">
            {bothAgree
              ? "Both Models Agree"
              : "Models Have Different Predictions"}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {bothAgree
            ? consensusIsDiabetic
              ? "Consult a healthcare professional for proper evaluation"
              : "Continue maintaining a healthy lifestyle"
            : "Consider consulting a healthcare professional for clarification"}
        </p>
      </div>

      {/* Model Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultCard
          title="Random Forest"
          icon={Brain}
          prediction={results.random_forest}
          delay={0}
        />
        <ResultCard
          title="Logistic Regression"
          icon={TrendingUp}
          prediction={results.logistic_regression}
          delay={150}
        />
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground px-4">
        This prediction is for informational purposes only and should not be
        considered medical advice. Please consult a healthcare professional for
        proper diagnosis.
      </p>
    </div>
  );
}

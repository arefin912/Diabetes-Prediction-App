import { Activity, Heart } from "lucide-react";

export function Header() {
  return (
    <header className="text-center mb-10">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl pulse-ring" />
          <div className="relative p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-lg">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
      </div>
      
      <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
        <span className="gradient-text">Diabetes</span>{" "}
        <span className="text-foreground">Risk Predictor</span>
      </h1>
      
      <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
        Powered by advanced machine learning models to help assess diabetes risk
        based on key health indicators
      </p>
      
      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
        <Heart className="w-4 h-4 text-primary" />
        <span>Using Random Forest & Logistic Regression</span>
      </div>
    </header>
  );
}

import { useState } from "react";
import { Activity, Droplets, Heart, Scale, User, Baby, Dna, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormData {
  Pregnancies: number;
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  BMI: number;
  DiabetesPedigreeFunction: number;
  Age: number;
}

interface PredictionFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const formFields = [
  { key: "Pregnancies", label: "Pregnancies", icon: Baby, placeholder: "0-17", min: 0, max: 17, step: 1 },
  { key: "Glucose", label: "Glucose (mg/dL)", icon: Droplets, placeholder: "70-200", min: 0, max: 300, step: 1 },
  { key: "BloodPressure", label: "Blood Pressure (mm Hg)", icon: Heart, placeholder: "60-120", min: 0, max: 200, step: 1 },
  { key: "SkinThickness", label: "Skin Thickness (mm)", icon: User, placeholder: "10-50", min: 0, max: 100, step: 1 },
  { key: "Insulin", label: "Insulin (μU/mL)", icon: Activity, placeholder: "0-300", min: 0, max: 900, step: 1 },
  { key: "BMI", label: "BMI (kg/m²)", icon: Scale, placeholder: "18-40", min: 0, max: 70, step: 0.1 },
  { key: "DiabetesPedigreeFunction", label: "Diabetes Pedigree", icon: Dna, placeholder: "0.0-2.5", min: 0, max: 3, step: 0.001 },
  { key: "Age", label: "Age (years)", icon: Calendar, placeholder: "21-80", min: 1, max: 120, step: 1 },
];

export function PredictionForm({ onSubmit, isLoading }: PredictionFormProps) {
  const [formData, setFormData] = useState<FormData>({
    Pregnancies: 0,
    Glucose: 0,
    BloodPressure: 0,
    SkinThickness: 0,
    Insulin: 0,
    BMI: 0,
    DiabetesPedigreeFunction: 0,
    Age: 0,
  });

  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (key: keyof FormData, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({ ...prev, [key]: numValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {formFields.map((field, index) => {
          const Icon = field.icon;
          const isFocused = focused === field.key;
          
          return (
            <div
              key={field.key}
              className={cn(
                "relative group fade-in",
                "transition-all duration-300"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <label
                htmlFor={field.key}
                className="block text-sm font-medium text-foreground/80 mb-2 flex items-center gap-2"
              >
                <Icon className={cn(
                  "w-4 h-4 transition-colors duration-200",
                  isFocused ? "text-primary" : "text-muted-foreground"
                )} />
                {field.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id={field.key}
                  value={formData[field.key as keyof FormData] || ""}
                  onChange={(e) => handleChange(field.key as keyof FormData, e.target.value)}
                  onFocus={() => setFocused(field.key)}
                  onBlur={() => setFocused(null)}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className={cn(
                    "input-field",
                    "pr-4",
                    isFocused && "ring-2 ring-primary/50 border-primary"
                  )}
                  required
                />
                <div className={cn(
                  "absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-300",
                  "bg-gradient-to-r from-primary/5 to-accent/5",
                  isFocused ? "opacity-100" : "opacity-0"
                )} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="hero"
          size="xl"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="inline-block w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Activity className="w-5 h-5" />
              Predict Diabetes Risk
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

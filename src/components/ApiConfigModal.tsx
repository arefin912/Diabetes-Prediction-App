import { useState } from "react";
import { Settings, X, Server, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ApiConfigModalProps {
  apiUrl: string;
  onSave: (url: string) => void;
}

export function ApiConfigModal({ apiUrl, onSave }: ApiConfigModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(apiUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(`${url}/health`);
      if (response.ok) {
        setTestResult("success");
      } else {
        setTestResult("error");
      }
    } catch {
      setTestResult("error");
    }
    setIsTesting(false);
  };

  const handleSave = () => {
    onSave(url);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 p-3 rounded-full bg-card shadow-lg border border-border hover:bg-secondary transition-colors duration-200 z-50"
        title="API Settings"
      >
        <Settings className="w-5 h-5 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 fade-in border border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Server className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-display font-bold">API Configuration</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  FastAPI Server URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="http://localhost:8000"
                  className="input-field"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Enter the base URL of your FastAPI backend
                </p>
              </div>

              {testResult && (
                <div
                  className={cn(
                    "p-3 rounded-lg flex items-center gap-2 text-sm",
                    testResult === "success"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {testResult === "success" ? (
                    <>
                      <Check className="w-4 h-4" />
                      Connection successful!
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Failed to connect. Check the URL and server.
                    </>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleTest}
                  disabled={isTesting}
                >
                  {isTesting ? "Testing..." : "Test Connection"}
                </Button>
                <Button
                  type="button"
                  variant="default"
                  className="flex-1"
                  onClick={handleSave}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

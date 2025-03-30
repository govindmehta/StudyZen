import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/Loader";

const FlowChart = () => {
  const [topic, setTopic] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateFlowchart = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/flowchart/?subtopic=${topic}`
      );
      setImageUrl(response.data.image_url);
    } catch (err) {
      setError("Failed to generate flowchart. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-2">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Generate Flowchart</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (e.g., Machine Learning)"
            />
            <Button onClick={generateFlowchart} disabled={loading}>
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {loading && (
        <div className="flex justify-center">
          <Loader />
        </div>
      )}

      {imageUrl && (
        <div className="flex justify-center">
          <img
            src={imageUrl}
            alt="Flowchart"
            className="rounded-lg shadow-lg w-full h-auto mt-5 max-w-5xl max-h-[80vh]"
          />
        </div>
      )}
    </div>
  );
};

export default FlowChart;

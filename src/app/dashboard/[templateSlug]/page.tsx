"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contentTemplates } from "@/lib/content-templates";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Editor } from "./_components/editor";
import { chatSession } from "@/lib/gemini-ai";
import axios from "axios";

interface templateSlugProps {
  templateSlug: string;
}

const Templatepage = ({ params }: { params: templateSlugProps }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const selectedTemplate = contentTemplates.find(
    (item) => item.slug === params.templateSlug
  );

  const generateAIContent = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const dataset = {
        title: formData.get("title"),
        description: formData.get("description")
      };

      console.log("Dataset being sent:", dataset);

      const SelectedPrompt = selectedTemplate?.aiPrompt;
      const finalAIPrompt = JSON.stringify(dataset) + ", " + SelectedPrompt;

      const result = await chatSession.sendMessage(finalAIPrompt);
      const aiResponse = await result.response.text();
      setAiOutput(aiResponse);

      const postData = {
        title: dataset.title,
        description: aiResponse,
        templateUsed: selectedTemplate?.name,
      };

      console.log("Post data being sent to server:", postData);

      await axios.post('/api/', postData);

      setIsLoading(false);
    } catch (error) {
      console.error("Error generating AI content:", error);
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
      }
      setIsLoading(false);
    }
  };

  const onsubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    generateAIContent(formData);
  };

  return (
    <div className="mx-5 py-2">
      <div className="mt-5 py-6 px-4 bg-white rounded">
        <h2 className="font-medium">{selectedTemplate?.name}</h2>
      </div>
      <form onSubmit={onsubmit}>
        <div className="flex flex-col gap-4 p-5 mt-5 bg-white">
          {selectedTemplate?.form?.map((form) => (
            <div key={form.label}>
              <label>{form.label}</label>
              {form.field === "input" ? (
                <div className="mt-5">
                  <Input name="title" />
                </div>
              ) : (
                <div className="mt-5">
                  <Textarea name="description" />
                </div>
              )}
            </div>
          ))}
        </div>
        <Button className="mt-5" type="submit" disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin" /> : "Generate Content"}
        </Button>
      </form>
      <div className="my-10">
        <Editor value={isLoading ? "Generating..." : aiOutput} />
      </div>
    </div>
  );
};

export default Templatepage;

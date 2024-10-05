"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clipboard, MoveRight, Loader, Copy } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copying, setCopying] = useState(false);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error messages
    setLoading(true);

    // Validate URL before proceeding
    if (!validateUrl(url)) {
      setErrorMessage("Please enter a valid URL.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `https://url.dokopi.com/api/v1/url/create`,
        {
          originalURL: url,
        }
      );
      setShortUrl(response.data.data);
    } catch (error) {
      console.error("Error shortening URL:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    setCopying(true);
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied to clipboard");
    setTimeout(() => {
      setCopying(false);
    }, 500);
  };

  return (
    <main className="flex items-center justify-center w-full h-screen p-5 md:p-10">
      <div className="w-full rounded-2xl md:w-[450px] p-5 md:p-8 border border-white/50 flex flex-col gap-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col gap-2.5">
            <Label className="text-sm text-white">
              Enter URL to shorten:{" "}
              <span className="text-xs text-red-500">*</span>
            </Label>
            <div className="flex flex-col gap-2">
              <Input
                type="text"
                placeholder="https://example.com"
                className="text-white"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              {errorMessage && (
                <p className="text-xs text-red-500">{errorMessage}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-2 transition-all duration-300 bg-blue-500 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <span className="text-sm">Generating Short URL</span>
                <Loader className="w-4 h-4 ml-2 animate-spin" />
              </>
            ) : (
              <>
                <span className="text-sm">Shorten URL</span>
                <MoveRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          <div className="flex flex-col gap-2.5 mt-4">
            <Label className="text-sm text-white">Generated URL:</Label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="https://url.dokopi.com/..."
                value={`https://url.dokopi.com/${shortUrl}`}
                className="text-white"
                readOnly
              />
              <button
                type="button"
                className="px-1 py-2 rounded-lg"
                onClick={handleCopy}
                disabled={!shortUrl}
              >
                {copying ? (
                  <>
                    <Loader className="w-4 h-4 ml-2 text-white animate-spin" />
                  </>
                ) : (
                  <>
                    <Clipboard className="w-5 h-5 ml-2 text-white" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

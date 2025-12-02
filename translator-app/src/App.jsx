import { useState } from "react";

const LANGUAGE_OPTIONS = [
  { code: "hi", label: "Hindi" },
  { code: "mr", label: "Marathi" },
  { code: "bn", label: "Bengali" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "gu", label: "Gujarati" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "fr", label: "French" },
  { code: "es", label: "Spanish" },
  { code: "de", label: "German" },
];

const SUGGESTIONS = [
  "Hello, how are you?",
  "Thank you for your help.",
  "Where is the nearest railway station?",
  "I am learning programming.",
  "Have a great day!",
];

function App() {
  const [sourceText, setSourceText] = useState("");
  const [targetLang, setTargetLang] = useState("hi");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);

  const charCount = sourceText.length;

const handleTranslate = async () => {
  setErrorMsg("");
  setTranslatedText("");

  if (!sourceText.trim()) {
    setErrorMsg("Please type something to translate.");
    return;
  }

  setIsLoading(true);

  try {
    const url = import.meta.env.VITE_TRANSLATE_URL;
    const key = import.meta.env.VITE_RAPIDAPI_KEY;
    const host = import.meta.env.VITE_RAPIDAPI_HOST;

    console.log("Using URL:", url);
    console.log("Host:", host);
    console.log("Key present:", !!key);

    const encodedParams = new URLSearchParams();
    encodedParams.set("source_language", "en");
    encodedParams.set("target_language", targetLang);
    encodedParams.set("text", sourceText);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": key,
        "X-RapidAPI-Host": host,
      },
      body: encodedParams.toString(),
    });

    const data = await response.json();
    console.log("HTTP status:", response.status);
    console.log("API raw data:", data);

    if (!response.ok || data.status !== "success") {
      const msg =
        data?.message ||
        data?.error ||
        JSON.stringify(data);
      throw new Error(`API error ${response.status}: ${msg}`);
    }

    const translated = data?.data?.translatedText || "No translatedText in response";

    setTranslatedText(translated);

    setHistory((prev) => [
      {
        id: Date.now(),
        source: sourceText,
        target: translated,
        lang: targetLang,
      },
      ...prev.slice(0, 4),
    ]);
  } catch (err) {
    console.error(err);
    setErrorMsg(err.message || "Something went wrong while translating.");
  } finally {
    setIsLoading(false);
  }
};

const handleCopy = async () => {
    if (!translatedText) return;
    try {
      await navigator.clipboard.writeText(translatedText);
      alert("Translated text copied to clipboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to copy text.");
    }
  };

  const handleSuggestionClick = (sentence) => {
    setSourceText(sentence);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
              <span className="text-indigo-400">Translate</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">
              Type in English. Get instant translations in your favourite
              language.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live · No signup · Free via RapidAPI</span>
          </div>
        </header>

        {/* Main Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {/* Left: Input */}
            <div className="p-5 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  From
                </span>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded-full text-slate-300">
                  English (source)
                </span>
              </div>

              <textarea
                className="flex-1 bg-slate-900/60 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 outline-none rounded-2xl px-4 py-3 text-sm sm:text-base text-slate-50 placeholder:text-slate-500 resize-none"
                rows={6}
                placeholder="Type or paste English text here..."
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />

              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>{charCount} characters</span>
                <span className="italic">Powered by RapidAPI</span>
              </div>

              {/* Suggestions */}
              <div className="mt-4">
                <p className="text-xs text-slate-400 mb-2">Try one of these:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Output */}
            <div className="p-5 sm:p-6 flex flex-col bg-gradient-to-br from-slate-900 to-slate-950">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    To
                  </span>
                  <select
                    className="mt-1 bg-slate-900/70 border border-slate-700 text-sm text-slate-100 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 font-medium px-4 py-2 rounded-full text-sm shadow-lg shadow-indigo-500/30 transition"
                >
                  {isLoading ? (
                    <>
                      <span className="h-3 w-3 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                      Translating...
                    </>
                  ) : (
                    <>
                      <span>⚡</span>
                      <span>Translate</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex-1 bg-slate-900/70 border border-slate-700 rounded-2xl px-4 py-3 text-sm sm:text-base text-slate-100 relative">
                {translatedText ? (
                  <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                  <p className="text-slate-500 italic">
                    Translation will appear here…
                  </p>
                )}

                <button
                  onClick={handleCopy}
                  disabled={!translatedText}
                  className="absolute top-3 right-3 text-xs bg-slate-800 hover:bg-slate-700 text-slate-100 px-2 py-1 rounded-full disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Copy
                </button>
              </div>

              {errorMsg && (
                <p className="mt-2 text-xs text-red-400">{errorMsg}</p>
              )}

              {/* History */}
              {history.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                      Recent translations
                    </h2>
                    <span className="text-[10px] text-slate-500">
                      Last {history.length} items
                    </span>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        className="text-xs bg-slate-900/80 border border-slate-800 rounded-xl p-2"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-[10px] uppercase text-slate-500">
                            EN →{" "}
                            {
                              LANGUAGE_OPTIONS.find(
                                (l) => l.code === item.lang
                              )?.label
                            }
                          </span>
                        </div>
                        <p className="text-slate-400 line-clamp-1">
                          {item.source}
                        </p>
                        <p className="text-slate-50 font-medium line-clamp-1">
                          {item.target}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 bg-slate-950/60">
            <span>
              Tip: Use it for chats, emails, captions, and exam prep notes.
            </span>
            <span>Built with React · Tailwind CSS · RapidAPI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

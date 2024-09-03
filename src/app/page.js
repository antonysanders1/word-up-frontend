"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [wordData, setWordData] = useState({
    word: "",
    partOfSpeech: "",
    definition: "",
    examples: [],
    synonyms: [],
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsDrawerOpen(false);
      } else {
        setIsDrawerOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSearch = async () => {
    const isValid = /^[A-Za-z]+$/.test(searchTerm);

    if (!isValid) {
      setError(
        "Please enter a valid word (letters only, no numbers or special characters)."
      );
      return;
    }

    if (searchTerm.trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:3000/words?word=${searchTerm}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch word data");
        }

        const data = await response.json();

        setWordData({
          word: data.word,
          partOfSpeech: data.results[0].partOfSpeech || "",
          definition: data.results[0].definition || "No definition available",
          examples: data.results[0].examples || [],
          synonyms: data.results[0].synonyms || [],
        });

        const currentDateTime = new Date().toLocaleString();
        const updatedHistory = history.filter(
          (item) => item.term.toLowerCase() !== searchTerm.toLowerCase()
        );
        setHistory([
          { term: searchTerm, date: currentDateTime },
          ...updatedHistory,
        ]);
        setError("");
      } catch (error) {
        setError(
          "There was an error fetching the word data. Please try again later."
        );
      }
    }
  };

  const handleSynonymClick = (synonym) => {
    setSearchTerm(synonym);
    handleSearch(synonym);
  };

  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    setError("");
  };

  const handleRemoveHistoryItem = (termToRemove) => {
    setHistory(history.filter((item) => item.term !== termToRemove));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 relative">
      <div className="w-full max-w-md h-[35dvh] flex flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-600">Word Up</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
          Welcome to <span className="font-bold text-blue-500">Word Up</span> –
          your ultimate tool to enhance your vocabulary! Search for any word to
          find its definition, explore usage examples, and discover alternative
          words (synonyms) to expand your language skills.
        </p>
        <div className="w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter a word to search..."
            className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 text-black"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleSearch}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Search
          </button>
        </div>
      </div>

      {/* div that contains the returned definition, part of speech, examples, and synonyms */}
      {wordData.word && (
        <div className="w-full max-w-md min-h-[35dvh] mt-6 p-6 bg-white rounded-md shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Word: <span className="text-blue-600">{wordData.word}</span>
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Part of Speech:
            </h3>
            <p className="text-gray-600">{wordData.partOfSpeech}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Definition:</h3>
            <p className="text-gray-600">{wordData.definition}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Examples:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {wordData.examples.length > 0 ? (
                wordData.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))
              ) : (
                <li>No examples available.</li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Synonyms:</h3>
            {wordData?.synonyms?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {wordData?.synonyms?.map((synonym, index) => (
                  <span
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the click on the term
                      handleSynonymClick(synonym);
                    }}
                    className="cursor-pointer text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    {synonym}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Drawer for Search History */}
      <div
        className={`fixed top-0 right-0 w-72 bg-white shadow-lg h-full transform ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Search History</h2>
            <button
              onClick={handleClearHistory}
              className="text-sm text-red-500 hover:underline"
            >
              Clear History
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto space-y-4">
            {history.map(({ term, date }, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center p-3 rounded-md bg-gray-200 cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-200"
                whileHover={{ scale: 0.99 }}
                onClick={() => handleHistoryClick(term)}
              >
                <div>
                  <p className="text-blue-600 font-semibold">{term}</p>
                  <p className="text-gray-500 text-sm">{date}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveHistoryItem(term);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <button
        className="fixed top-4 right-4 bg-blue-500 text-white p-2 rounded-md shadow-lg z-50 block md:hidden"
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
        {isDrawerOpen ? "Close" : "History"}
      </button>
    </div>
  );
}

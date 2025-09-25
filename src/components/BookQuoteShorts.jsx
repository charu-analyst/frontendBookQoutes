import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Heart,
  Share2,
  Play,
  Pause,
  BookOpen,
  User,
  LogOut,
} from "lucide-react";
import { useAutoPlay } from "../hooks/useAutoPlay";
import axios from "axios";

const apiUrl =
  "https://backendbookqoutes.onrender.com" || "http://localhost:5000";

// API service functions
const apiService = {
  async getQuotesList() {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${apiUrl}/api/quotes/quotesList`);

      if (response.status != 200) throw new Error("Failed to fetch quotes");
      return await response.data.data;
    } catch (error) {
      console.error("Error fetching quotes:", error);
      throw error;
    }
  },

  async likeQuote(quoteId) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(`${apiUrl}/api/quotes/${quoteId}/like`);

      if (response.status != 200) throw new Error("Failed to like quote");
      return await response.data.data;
    } catch (error) {
      console.error("Error liking quote:", error);
      throw error;
    }
  },

  async unlikeQuote(quoteId) {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `${apiUrl}/api/quotes/${quoteId}/unlike`
      );
      if (response.status != 200) throw new Error("Failed to like quote");
      return await response.data.data;
    } catch (error) {
      console.error("Error unliking quote:", error);
      throw error;
    }
  },
};

const Loader = () => {
  return (
    <div className="flex flex-col items-center space-y-4 text-white">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      <p>Loading quotes...</p>
    </div>
  );
};

const BookQuoteShorts = ({ user, onLogout }) => {
  const [quotes, setQuotes] = useState([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState(new Set());
  const [transitioning, setTransitioning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const quotesData = await apiService.getQuotesList();
      setQuotes(quotesData);

      if (quotesData.length > 0) {
        const initialLikedQuotes = new Set();
        quotesData.forEach((quote) => {
          if (quote.likes && quote.likes.length > 0) {
            initialLikedQuotes.add(quote._id);
          }
        });
        setLikedQuotes(initialLikedQuotes);
      }
    } catch (err) {
      setError("Failed to load quotes. Please try again.");
      console.error("Error fetching quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  const nextQuote = () => {
    if (transitioning || quotes.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
      setTransitioning(false);
    }, 150);
  };

  const prevQuote = () => {
    if (transitioning || quotes.length === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentQuoteIndex(
        (prev) => (prev - 1 + quotes.length) % quotes.length
      );
      setTransitioning(false);
    }, 150);
  };

  useAutoPlay(isAutoPlay, nextQuote, currentQuoteIndex);

  const toggleLike = async (quoteId) => {
    if (!user) {
      alert("Please sign in to like quotes");
      return;
    }

    const wasLiked = likedQuotes.has(quoteId);
    const originalLikedQuotes = new Set(likedQuotes);

    setLikedQuotes((prev) => {
      const newLiked = new Set(prev);
      if (wasLiked) {
        newLiked.delete(quoteId);
      } else {
        newLiked.add(quoteId);
      }
      return newLiked;
    });

    try {
      if (wasLiked) {
        await apiService.unlikeQuote(quoteId);
      } else {
        await apiService.likeQuote(quoteId);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setLikedQuotes(originalLikedQuotes);
      alert("Failed to update like. Please try again.");
    }
  };

  const handleShare = async (quote) => {
    const shareData = {
      title: `Quote from ${quote.bookTitle}`,
      text: `"${quote.text}" - ${quote.author}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `"${quote.text}" - ${quote.author}, ${quote.bookTitle}`
        );
        alert("Quote copied to clipboard!");
      }
    } catch (error) {
      try {
        await navigator.clipboard.writeText(
          `"${quote.text}" - ${quote.author}, ${quote.bookTitle}`
        );
        alert("Quote copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard error:", clipboardError);
      }
    }
  };

  const handleQuoteClick = (index) => {
    if (!transitioning && quotes.length > 0) {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentQuoteIndex(index);
        setTransitioning(false);
      }, 150);
    }
  };

  const currentQuote = quotes[currentQuoteIndex];

  if (loading) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <p className="text-xl">{error}</p>
          <button
            onClick={fetchQuotes}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">No quotes available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          currentQuote.gradient || "from-purple-500 to-pink-500"
        } transition-all duration-500 opacity-90`}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-xl font-bold">Book Quotes</h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="flex items-center space-x-2 bg-black bg-opacity-30 rounded-full px-3 py-2 hover:bg-opacity-50 transition-all"
          >
            {isAutoPlay ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span className="text-sm">
              {isAutoPlay ? "Pause" : "Auto Play"}
            </span>
          </button>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-black bg-opacity-30 rounded-full px-3 py-2 hover:bg-opacity-50 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">{user.name || "User"}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-black bg-opacity-90 rounded-lg shadow-lg py-2 z-30">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900 hover:bg-opacity-20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main quote display */}
      <div className="relative z-10 flex items-center justify-center h-full px-6">
        <div
          className={`text-center max-w-4xl transition-all duration-300 ${
            transitioning
              ? "opacity-0 transform scale-95"
              : "opacity-100 transform scale-100"
          }`}
        >
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-relaxed mb-8 text-shadow">
            "{currentQuote.text}"
          </blockquote>

          <div className="text-white space-y-2">
            <p className="text-xl md:text-2xl font-medium text-shadow">
              — {currentQuote.author}
            </p>
            <p className="text-lg md:text-xl opacity-80 italic text-shadow">
              {currentQuote.bookTitle}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-4">
        <button
          onClick={prevQuote}
          disabled={transitioning}
          className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all disabled:opacity-50"
          aria-label="Previous quote"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <button
          onClick={nextQuote}
          disabled={transitioning}
          className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all disabled:opacity-50"
          aria-label="Next quote"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="absolute right-4 bottom-20 z-20 flex flex-col space-y-4">
        <button
          onClick={() => toggleLike(currentQuote._id)}
          className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all"
          aria-label="Like quote"
        >
          <Heart
            className={`w-6 h-6 ${
              likedQuotes.has(currentQuote._id)
                ? "fill-red-500 text-red-500"
                : ""
            }`}
          />
        </button>
        <button
          onClick={() => handleShare(currentQuote)}
          className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all"
          aria-label="Share quote"
        >
          <Share2 className="w-6 h-6" />
        </button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => handleQuoteClick(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentQuoteIndex
                ? "bg-white"
                : "bg-white bg-opacity-50"
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>

      {/* Quote counter */}
      <div className="absolute bottom-4 left-4 z-20 text-white text-sm opacity-75">
        {currentQuoteIndex + 1} / {quotes.length}
      </div>

      {/* Touch/swipe area for mobile */}
      <div
        className="absolute inset-0 z-5"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const centerY = rect.height / 2;

          if (y < centerY - 50) {
            prevQuote();
          } else if (y > centerY + 50) {
            nextQuote();
          }
        }}
      />

      {/* Overlay to close user menu when clicking outside */}
      {showUserMenu && (
        <div
          className="absolute inset-0 z-20"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </div>
  );
};

export default BookQuoteShorts;

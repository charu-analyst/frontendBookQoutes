import React from 'react';
import { Heart, Share2, Quote } from 'lucide-react';

const QuoteCard = ({ quote, onLike, onShare, isActive }) => {
  return (
    <div className={`w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden quote-transition ${isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5"></div>
      
      <div className="relative z-10 max-w-2xl">
        <Quote className="h-12 w-12 text-blue-600 mx-auto mb-6 opacity-50" />
        
        <p className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed mb-8">
          "{quote.text}"
        </p>
        
        <div className="space-y-2 mb-8">
          <p className="text-lg font-semibold text-gray-700">— {quote.author}</p>
          <p className="text-sm text-gray-500 font-medium">{quote.bookTitle}</p>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {quote.category}
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={() => onLike(quote.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full quote-transition ${
              quote.isLiked 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart 
              className={`h-5 w-5 quote-transition ${
                quote.isLiked ? 'fill-current' : ''
              }`} 
            />
            <span className="font-medium">{quote.likeCount}</span>
          </button>
          
          <button
            onClick={() => onShare(quote)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full quote-transition"
          >
            <Share2 className="h-5 w-5" />
            <span className="font-medium">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteCard;
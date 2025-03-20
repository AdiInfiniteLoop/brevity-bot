import React, { useState, useEffect } from "react";
import { copy, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // Load data from localStorage on mount
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const existingArticle = allArticles.find(
      (item) => item.url === article.url
    );

    if (existingArticle) return setArticle(existingArticle);

    const { data } = await getSummary({ articleUrl: article.url });
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };

  return (

    <section className="mt-16 w-full max-w-2xl mx-auto px-4">
      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text">
          Article Summarizer
        </h1>
        
        <div className="w-full">
          <form
            className="relative flex items-center mb-6"
            onSubmit={handleSubmit}
          >
            <input
              type="url"
              placeholder="Paste the article link"
              value={article.url}
              onChange={(e) => setArticle({ ...article, url: e.target.value })}
              onKeyDown={handleKeyDown}
              required
              className="w-full py-3 pl-10 pr-16 bg-white border border-gray-200 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />

            <button
              type="submit"
              className="right-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-r-lg transition-colors duration-200"
            >
              Summarize
            </button>
          </form>
            
          {/* History Section */}
          {allArticles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Recent Articles
              </h2>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {allArticles.map((item, index) => (
                    <div
                      key={`link-${index}`}
                      onClick={() => setArticle(item)}
                      className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      <div 
                        className="flex-shrink-0 p-2 rounded-md hover:bg-gray-100 mr-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(item.url);
                        }}
                      >
                        <img
                          src={copied === item.url ? tick : copy}
                          alt={copied === item.url ? "tick_icon" : "copy_icon"}
                          className="w-4 h-4"
                        />
                      </div>
                      <p className="flex-1 font-medium text-blue-600 text-sm truncate">
                        {item.url}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="w-full">
          {isFetching ? (
            <div className="flex justify-center items-center py-10">
              <img src={loader} alt="loader" className="w-16 h-16" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <p className="font-bold text-red-600 mb-2">
                Something went wrong
              </p>
              <p className="text-gray-700">
                {error?.data?.error || "Failed to summarize the article. Please try again."}
              </p>
            </div>
          ) : (
            article.summary && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-bold text-xl flex items-center gap-2">
                    <span className="text-gray-800">Article</span>
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text">
                      Summary
                    </span>
                  </h2>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Demo;

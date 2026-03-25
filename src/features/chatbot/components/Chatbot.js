"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import Image from "next/image";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! How can I help you find the perfect product today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch response");

      setMessages((prev) => [...prev, { role: "ai", text: data.reply, products: data.products }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I had trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        
        <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-gray-200">
          <div className="bg-black text-white p-4 font-bold flex justify-between items-center">
            <span>Store Assistant</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">✕</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === "user" 
                    ? "bg-black text-white self-end rounded-br-none" 
                    : "bg-white text-black border shadow-sm self-start rounded-bl-none"
                }`}
              >
                {msg.role === "user" ? (
                  msg.text
                ) : (
                  <div className="flex flex-col gap-2">
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-0 leading-relaxed" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-0" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-0" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                    {msg.products && msg.products.length > 0 && (
                      <div className="flex flex-col gap-2 mt-2">
                        <p className="text-xs font-semibold text-gray-500">Recommended for you:</p>
                        {msg.products.map(product => (
                          <Link href={`/products/${product.id}`} key={product.id} className="flex gap-3 bg-white border border-gray-100 p-2 rounded-xl hover:shadow-md hover:border-blue-200 transition-all group">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                              <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="56px" />
                            </div>
                            <div className="flex flex-col justify-center flex-1 min-w-0">
                              <span className="text-xs font-bold text-gray-900 truncate">{product.name}</span>
                              <span className="text-xs text-blue-600 font-bold mt-0.5">${Number(product.price).toFixed(2)}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="bg-white text-gray-500 border shadow-sm self-start p-3 rounded-2xl rounded-bl-none animate-pulse">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about a product..."
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button 
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center float-right"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      )}
    </div>
  );
}

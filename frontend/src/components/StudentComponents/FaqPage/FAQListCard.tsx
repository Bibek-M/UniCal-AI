import { useState, useEffect } from 'react';

interface FAQElement {
  _id: string;
  question: string;
  answer: string;
}

const FAQListCard = () => {
  const [faqs, setFaqs] = useState<FAQElement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track which item index is currently open (-1 means all closed)
  const [openIndex, setOpenIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/faqs');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setFaqs(data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  if (loading) {
    return <div className="w-full text-center py-10 font-medium text-gray-500">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="w-full text-center py-10 text-rose-500 font-medium">Error: {error}</div>;
  }

  return (
    <div className="w-full max-w-5xl min-w-6xl mx-auto py-8 px-2 bg-white">
    
      <div className="border-t border-gray-400">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          
          return (
            <div key={faq._id} className="border-b border-gray-400">
              {/* Question Header Row */}
              <button
                onClick={() => toggleAccordion(i)}
                className="w-full flex items-center justify-between text-left py-4 text-base font-normal text-gray-900 hover:text-blue-600 transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                {/* Plus / Minus Symbol State Toggle */}
                <span className="text-xl font-light text-gray-500 ml-4 select-none">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {/* Collapsible Answer Pane */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="text-sm text-gray-600 leading-relaxed pr-8 whitespace-pre-line">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}

        {faqs.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No active questions loaded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQListCard;
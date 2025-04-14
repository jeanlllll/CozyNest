import { useDispatch, useSelector } from 'react-redux';
import { setChatHistory } from '../store/features/chatHistory';
import { sendChatMessage } from '../api/sendChatMessage';
import { useState, useEffect, useRef } from 'react';
import { getChatHistory } from '../api/getChatHistory';
import { useNavigate } from 'react-router-dom';

export const AIChatBoxFullScreenPage = () => {
    const navigate = useNavigate();
    const chatHistory = useSelector((state) => state.chat.chatHistory);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const langauage = useSelector((state) => state.language.language);
    const isEnglish = langauage === "en";
    const chatContainerRef = useRef(null);

    // Check screen size and redirect if not mobile
    useEffect(() => {
        const checkScreenSize = () => {
            if (window.innerWidth >= 640) { // sm breakpoint
                navigate('/');
            }
        };
        
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, [navigate]);

    const handleNewMessageSend = async () => {
        if (!message) return;

        const updatedChatHistory = [
            ...chatHistory,
            { role: 'user', content: message }
        ];
        dispatch(setChatHistory(updatedChatHistory));

        setLoading(true);
        setMessage("");

        const response = await sendChatMessage(message);
        const assistantMessage = response.data.reply;

        dispatch(setChatHistory([...updatedChatHistory, { role: 'assistant', content: assistantMessage }]));
        setLoading(false);
    };

    useEffect(() => {
        const fetchChatHistory = async () => {
            const response = await getChatHistory();
            if (response.data.length > 0) {
                dispatch(setChatHistory(response.data));
            }
        };
        
        if (chatHistory.length <= 1) {
            fetchChatHistory();
        }
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNewMessageSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white font-uinter">
            {/* Header */}
            <div className="h-16 bg-secondPrimary flex items-center justify-between px-4 shadow-md">
                <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                            <circle cx="12" cy="5" r="2"></circle>
                            <path d="M12 7v4"></path>
                            <line x1="8" y1="16" x2="8" y2="16"></line>
                            <line x1="16" y1="16" x2="16" y2="16"></line>
                        </svg>
                    </div>
                    <div className="ml-3">
                        <div className="text-buttonMain font-bold">{isEnglish ? "Support Service" : "支援服務"}</div>
                        <div className="text-gray-700 text-sm">{isEnglish ? "AI Bot" : "AI 機器人"}</div>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className="text-gray-600 p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-lg ${
                            message.role === 'user'
                                ? 'bg-gray-300 text-gray-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}>
                            {message.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                            Typing...
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-100">
                <div className="flex items-center bg-white rounded-full border border-gray-300 overflow-hidden">
                    <textarea
                        className="flex-1 px-4 py-2 focus:outline-none resize-none"
                        rows={1}
                        placeholder={loading ? "Waiting for Reply..." : "Ask something..."}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={loading}
                        onKeyDown={handleKeyDown}
                    />
                    <button 
                        onClick={handleNewMessageSend}
                        className="p-2 text-gray-500 hover:text-buttonMain"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
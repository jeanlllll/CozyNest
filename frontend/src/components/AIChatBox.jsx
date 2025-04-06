import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setChatHistory } from '../store/features/chatHistory';
import { sendChatMessage } from '../api/sendChatMessage';
import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { getChatHistory } from '../api/getChatHistory';
import { useEffect } from 'react';
import { useRef } from 'react';

export const AIChatBox = ({ onClickFunc }) => {

    const chatHistory = useSelector((state) => state.chat.chatHistory);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const chatContainerRef = useRef(null);

    const handleNewMessageSend = async () => {
        if (!message) return;

        const updatedChatHistory = [
            ...chatHistory,
            { role: 'user', content: message }
        ];
        console.log(updatedChatHistory)
        dispatch(setChatHistory(updatedChatHistory))

        setLoading(true);
        setMessage("Loading...")

        const response = await sendChatMessage(message)
        console.log(message)
        const assistantMessage = response.data.reply;

        dispatch(setChatHistory([...updatedChatHistory, { role: 'assistant', content: assistantMessage }]))

        setLoading(false);
        setMessage("");
    }

    useEffect(() => {
        const fetchChatHistory = async () => {
            const response = await getChatHistory();
            if (response.data.length > 0) {
                dispatch(setChatHistory(response.data));
            }
        }
        console.log(chatHistory)
        if (chatHistory.length <= 1) {
            fetchChatHistory();
        }
    }, [])

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory])

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNewMessageSend();
        }
    }

    return (
        <div className="fixed bottom-7 right-50 mb-3 mr-3 w-100 h-auto border border-gray-300 bg-white drop-shadow-2xl rounded-xl flex flex-col overflow-hidden font-inter">

            <div className="h-20 bg-secondPrimary flex flex-row drop-shadow-xl justify-between">
                <div className="flex flex-row items-center">
                    <div className="ml-6 my-2 h-16 w-16 rounded-full bg-white flex items-center justify-center inset-shadow-sm ">
                    <svg className="w-11 h-11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="3" y="11" width="18" height="10" rx="2"></rect> <circle cx="12" cy="5" r="2"></circle> <path d="M12 7v4"></path> <line x1="8" y1="16" x2="8" y2="16"></line> <line x1="16" y1="16" x2="16" y2="16"></line> </g></svg>
                    </div>

                    <div className="ml-4 flex flex-col items-center justify-start ">
                        <div className="text-buttonMain font-bold">Support Service</div>
                        <div className="text-gray-700 w-full text-left mt-1">AI Bot</div>
                    </div>

                </div>


                <div className="w-9 h-9 text-white font-bold cursor-pointer flex justify-center items-center mr-2 mt-2 rounded-sm hover:bg-buttonMain" onClick={() => onClickFunc()}>
                    <CloseIcon />
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 min-h-[500px] max-h-[500px] overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
                {chatHistory.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-3 py-2 rounded-lg ${message.role === 'user'
                                ? 'bg-gray-300 text-gray-800 rounded-lg'
                                : 'bg-gray-100 text-gray-800 rounded-lg'
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

            <div className="h-18 bg-gray-100 drop-shadow-lg flex justify-center items-center">
                <div className="border w-92 h-10 rounded-full bg-white border-gray-300 inset-shadow-sm flex flex-row justify-between items-center">
                    <div className="ml-4 mr-2 w-full flex items-center">
                        <textarea className="w-full resize-none focus:outline-none focus:border-transparent h-full text-gray-600"
                            rows={1}
                            placeholder={loading ? "Waiting for Reply..." : "Ask something..."}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            disabled={loading}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <div className="h-10 mr-1 flex items-center" onClick={() => handleNewMessageSend()}>
                        <svg className="w-9 h-9 cursor-pointer hover:text-buttonMain text-gray-500" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

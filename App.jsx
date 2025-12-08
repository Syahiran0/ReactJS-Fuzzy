import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, BarChart3, Bot, Send, Download, RefreshCw, Loader2, MessageSquare, Home as HomeIcon, ArrowLeft } from 'lucide-react';

// --- SERVICE LOGIC IMPORTS (Fixed to ensure resolution) ---
import { callEvaluate, callGetSuggestion, callChatWithLecturer, callDownloadReport } from './apiService';

// --- Global Styles and Color Palette ---
// Primary: #BC6FF1, Secondary: #892CDC, Dark Accent: #52057B, Text: #000000
const PRIMARY_COLOR = 'rgb(188, 111, 241)'; // #BC6FF1
const SECONDARY_COLOR = 'rgb(137, 44, 220)'; // #892CDC
const DARK_ACCENT = 'rgb(82, 5, 123)'; // #52057B
const INPUT_BASE_COLOR = 'bg-white/90 border-gray-300 focus:ring-secondary';


// --- HOMEPAGE COMPONENTS ---

const FlipText = ({ words }) => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            const fadeTimeout = setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % words.length);
                setFade(true);
            }, 500); // Wait for fade-out

            return () => clearTimeout(fadeTimeout);
        }, 3000); // Total cycle time

        return () => clearInterval(interval);
    }, [words.length]);

    const displayWord = words[index];

    return (
        <span className={`inline-block font-extrabold transition-opacity duration-500 ease-in-out ${fade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`} style={{ color: PRIMARY_COLOR }}>
            {displayWord}
        </span>
    );
};

const HomePageView = ({ onStartEvaluation }) => {
    const words = ["Performance", "Future", "Potential", "Success"];

    // Static placeholder for GoogleGeminiEffect
    const GeminiEffectPlaceholder = () => (
        <div className="relative h-[600px] w-full mt-20 overflow-hidden rounded-xl shadow-2xl bg-gray-900 border border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-gray-800 opacity-90"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-dashed animate-spin" style={{ borderColor: PRIMARY_COLOR, borderTopColor: 'transparent' }}></div>
                <p className="absolute text-white/50 text-xl font-light">Deep Evaluation Engine Ready</p>
            </div>
            <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-black/80 to-transparent"></div>
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black overflow-hidden p-6 flex flex-col items-center">
            <div className="relative z-10 text-center max-w-4xl pt-20">
                <h1 className="text-6xl md:text-8xl font-black text-white leading-tight mb-4">
                    Unlock Student <FlipText words={words} />
                </h1>
                <p className="text-xl md:text-2xl font-light text-gray-300 max-w-3xl mx-auto">
                    A cutting-edge evaluation system using **Fuzzy Logic** and **Local LLMs** to provide precise, personalized academic insights.
                </p>
                <button
                    onClick={onStartEvaluation}
                    className="mt-10 px-10 py-4 text-lg font-bold text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mx-auto"
                    style={{ backgroundColor: PRIMARY_COLOR, boxShadow: `0 8px 20px -5px ${PRIMARY_COLOR}66` }}
                >
                    <BarChart3 className="w-5 h-5 mr-2" /> Start Performance Evaluation
                </button>
            </div>
            
            {/* The Placeholder section for the Google Gemini Effect */}
            <div className="w-full max-w-6xl p-6">
                <GeminiEffectPlaceholder />
            </div>

            <div className="text-center mt-10">
                <span className="text-sm font-semibold text-gray-400 mb-1">Scroll down to see more features</span>
                <ChevronDown className="w-8 h-8 text-gray-400 mx-auto animate-bounce" />
            </div>
        </div>
    );
};


// --- EVALUATION PAGE COMPONENTS ---

const InputSlider = ({ label, value, onChange, name }) => (
    <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2 flex justify-between">
            {label}
            <span className="font-bold text-lg" style={{ color: SECONDARY_COLOR }}>{value}%</span>
        </label>
        <input
            type="range"
            id={name}
            name={name}
            min="0"
            max="100"
            step="1"
            value={value}
            onChange={onChange}
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${INPUT_BASE_COLOR}`}
            style={{
                background: `linear-gradient(to right, ${PRIMARY_COLOR} 0%, ${PRIMARY_COLOR} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
            }}
        />
    </div>
);

const EvaluationForm = ({ onEvaluate, isLoading }) => {
    const [inputs, setInputs] = useState({
        attendance: 80,
        test_score: 75,
        assignment_score: 90,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onEvaluate(inputs);
    };

    return (
        <div className="p-6 md:p-8 rounded-2xl shadow-2xl bg-white transition-all duration-500 w-full" style={{ border: `2px solid ${PRIMARY_COLOR}` }}>
            <h2 className="text-2xl font-bold mb-6 text-black flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" style={{ color: SECONDARY_COLOR }} />
                Fuzzy Logic Evaluation
            </h2>
            <form onSubmit={handleSubmit}>
                <InputSlider
                    label="Attendance Percentage"
                    name="attendance"
                    value={inputs.attendance}
                    onChange={handleChange}
                />
                <InputSlider
                    label="Test Score Percentage"
                    name="test_score"
                    value={inputs.test_score}
                    onChange={handleChange}
                />
                <InputSlider
                    label="Assignment Score Percentage"
                    name="assignment_score"
                    value={inputs.assignment_score}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="w-full py-3 mt-4 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: DARK_ACCENT }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Calculating...
                        </>
                    ) : (
                        "Run Fuzzy Evaluation"
                    )}
                </button>
            </form>
        </div>
    );
};

const ResultsDisplay = ({ result, onGetSuggestion, onDownloadReport, isLoading, evaluationInputs }) => {
    const getLevelClass = (level) => {
        switch (level) {
            case 'Excellent': return 'bg-green-100 text-green-800 border-green-400';
            case 'Good': return 'bg-blue-100 text-blue-800 border-blue-400';
            case 'Average': return 'bg-yellow-100 text-yellow-800 border-yellow-400';
            case 'Weak': return 'bg-red-100 text-red-800 border-red-400';
            default: return 'bg-gray-100 text-gray-800 border-gray-400';
        }
    };

    if (!result) return <div className="p-8 bg-gray-50 rounded-xl text-center text-gray-500">Enter scores and run evaluation to see results.</div>;

    return (
        <div className="p-6 md:p-8 rounded-2xl shadow-2xl bg-white w-full" style={{ border: `2px solid ${SECONDARY_COLOR}` }}>
            <h3 className="text-2xl font-bold mb-4 text-black flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" style={{ color: PRIMARY_COLOR }} />
                Evaluation Result
            </h3>

            <div className={`inline-block px-4 py-2 font-extrabold text-xl rounded-full border-2 mb-4 ${getLevelClass(result.performance_level)}`}>
                Level: {result.performance_level}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-purple-50">
                    <p className="text-sm font-medium text-gray-600">Fuzzy Score (0-100)</p>
                    <p className="text-3xl font-black" style={{ color: DARK_ACCENT }}>{result.fuzzy_score}</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50">
                    <p className="text-sm font-medium text-gray-600">Attendance</p>
                    <p className="text-xl font-bold text-gray-800">{evaluationInputs.attendance}%</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50">
                    <p className="text-sm font-medium text-gray-600">Test Score</p>
                    <p className="text-xl font-bold text-gray-800">{evaluationInputs.test_score}%</p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50">
                    <p className="text-sm font-medium text-gray-600">Assignment Score</p>
                    <p className="text-xl font-bold text-gray-800">{evaluationInputs.assignment_score}%</p>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    onClick={onGetSuggestion}
                    className="w-full py-3 font-semibold rounded-xl text-white transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                    disabled={isLoading.suggestion}
                >
                    {isLoading.suggestion ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating Suggestion...
                        </>
                    ) : (
                        <>
                            <Bot className="w-5 h-5 mr-2" /> Get AI Suggestion
                        </>
                    )}
                </button>
                <button
                    onClick={onDownloadReport}
                    className="w-full py-3 font-semibold rounded-xl text-gray-800 border-2 transition-colors duration-300 flex items-center justify-center disabled:opacity-50"
                    style={{ borderColor: DARK_ACCENT }}
                    disabled={isLoading.report}
                >
                    {isLoading.report ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating PDF...
                        </>
                    ) : (
                        <>
                            <Download className="w-5 h-5 mr-2" /> Download Full Report
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

const SuggestionDisplay = ({ suggestionText, isLoading, error }) => {
    return (
        <div className="p-6 rounded-2xl shadow-lg bg-white w-full h-full flex flex-col" style={{ border: `1px dashed ${DARK_ACCENT}` }}>
            <h3 className="text-xl font-bold mb-3 text-black flex items-center">
                <Bot className="w-5 h-5 mr-2" style={{ color: PRIMARY_COLOR }} />
                Personalized AI Suggestion
            </h3>
            <div className="flex-grow bg-gray-50 p-4 rounded-lg overflow-y-auto">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        AI is thinking...
                    </div>
                ) : error ? (
                    <p className="text-red-500 font-medium">Error: {error}</p>
                ) : suggestionText ? (
                    <p className="text-gray-700 whitespace-pre-wrap">{suggestionText}</p>
                ) : (
                    <p className="text-gray-500 italic">Click 'Get AI Suggestion' to generate personalized feedback based on the Fuzzy Score.</p>
                )}
            </div>
        </div>
    );
};


// --- CHAT COMPONENTS ---

const ChatBox = ({ performanceLevel }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = React.useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping || !performanceLevel) return;

        const userMessage = { role: 'user', content: input.trim() };
        const newHistory = [...messages, userMessage];
        setMessages(newHistory);
        setInput('');
        setIsTyping(true);

        const chatHistoryForAPI = newHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        try {
            const payload = {
                student_performance_level: performanceLevel,
                question: userMessage.content,
                history: chatHistoryForAPI 
            };
            
            const response = await callChatWithLecturer(payload);
            
            if (response.status === 'success') {
                const assistantMessage = { role: 'assistant', content: response.answer };
                setMessages(prev => [...prev, assistantMessage]);
            } else {
                // This branch should ideally be caught by the callChatWithLecturer check, 
                // but included as a final safeguard.
                setMessages(prev => [...prev, { role: 'system', content: `Error: Could not get response.` }]);
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'system', content: `API Error: ${error.message}` }]);
        } finally {
            setIsTyping(false);
        }
    };

    const ChatMessage = ({ message }) => {
        const isUser = message.role === 'user';
        const roleName = isUser ? 'You' : 'Lecturer Bot';
        const bgColor = isUser ? 'bg-purple-100' : 'bg-gray-100';
        const textColor = isUser ? 'text-gray-800' : 'text-gray-700';
        const align = isUser ? 'self-end' : 'self-start';

        return (
            <div className={`max-w-[80%] my-2 ${align}`}>
                <div className={`text-xs font-semibold mb-1 ${isUser ? 'text-right' : 'text-left'}`} style={{ color: isUser ? SECONDARY_COLOR : DARK_ACCENT }}>
                    {roleName}
                </div>
                <div className={`p-3 rounded-xl shadow-md ${bgColor} ${textColor}`}>
                    {message.content}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl" style={{ border: `2px solid ${DARK_ACCENT}` }}>
            <div className="p-4 border-b rounded-t-2xl flex items-center" style={{ backgroundColor: DARK_ACCENT }}>
                <MessageSquare className="w-5 h-5 mr-2 text-white" />
                <h3 className="text-xl font-bold text-white">Chat with Virtual Lecturer</h3>
            </div>
            <div className="flex-grow p-4 space-y-3 overflow-y-auto custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic">
                        Ask your lecturer about your evaluation results or suggestions.
                        <p className="mt-2 text-sm">Current Level: <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>{performanceLevel || 'N/A'}</span></p>
                    </div>
                ) : (
                    messages.map((msg, index) => <ChatMessage key={index} message={msg} />)
                )}
                {isTyping && (
                    <div className="max-w-[80%] my-2 self-start">
                        <div className="text-xs font-semibold mb-1" style={{ color: DARK_ACCENT }}>Lecturer Bot</div>
                        <div className="p-3 rounded-xl bg-gray-100 shadow-md text-gray-700">
                            <span className="flex items-center">
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse mr-1" />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-75 mr-1" />
                                <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
                            </span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleChatSubmit} className="p-4 border-t bg-gray-50 rounded-b-2xl">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={performanceLevel ? "Ask a question..." : "Run evaluation first to chat..."}
                        className="flex-grow p-3 border rounded-lg focus:outline-none"
                        style={{ borderColor: PRIMARY_COLOR }}
                        disabled={!performanceLevel || isTyping}
                    />
                    <button
                        type="submit"
                        className="p-3 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                        style={{ backgroundColor: PRIMARY_COLOR }}
                        disabled={!performanceLevel || isTyping || !input.trim()}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setMessages([])}
                        className="p-3 text-gray-700 border rounded-lg transition-colors duration-200 hover:bg-gray-100"
                        title="Clear Chat"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Evaluation Page Wrapper ---

const EvaluationPageView = ({ onBackToHome }) => {
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [evaluationInputs, setEvaluationInputs] = useState(null); // Store inputs used for evaluation
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState({ evaluate: false, suggestion: false, report: false });
    const [error, setError] = useState(null);

    const handleEvaluate = useCallback(async (inputs) => {
        setError(null);
        setIsLoading(prev => ({ ...prev, evaluate: true }));
        setAiSuggestion('');

        try {
            // API Call: /evaluate
            const result = await callEvaluate(inputs);
            setEvaluationResult(result);
            setEvaluationInputs(inputs); // Store inputs for suggestion/report
        } catch (err) {
            setError(`Evaluation failed: ${err.message}`);
            console.error("Evaluation API Error:", err);
        } finally {
            setIsLoading(prev => ({ ...prev, evaluate: false }));
        }
    }, []);

    const handleGetSuggestion = useCallback(async () => {
        if (!evaluationInputs) return;
        
        setError(null);
        setIsLoading(prev => ({ ...prev, suggestion: true }));
        setAiSuggestion('');

        try {
            // API Call: /suggestion
            const response = await callGetSuggestion(evaluationInputs);
            setAiSuggestion(response.suggestion);
        } catch (err) {
            setError(`AI Suggestion failed: ${err.message}`);
            console.error("Suggestion API Error:", err);
        } finally {
            setIsLoading(prev => ({ ...prev, suggestion: false }));
        }
    }, [evaluationInputs]);

    const handleDownloadReport = useCallback(() => {
        if (!evaluationInputs) return;

        setIsLoading(prev => ({ ...prev, report: true }));
        try {
            // API Call: /report/download (uses GET with query params)
            callDownloadReport(evaluationInputs);
        } catch (err) {
            setError(`Report download failed: ${err.message}`);
            console.error("Report API Error:", err);
        } finally {
            // The download is initiated, but we don't wait for completion, so reset state shortly.
            setTimeout(() => setIsLoading(prev => ({ ...prev, report: false })), 1500);
        }
    }, [evaluationInputs]);

    const performanceLevel = evaluationResult?.performance_level || null;

    return (
        <div className="py-10 px-4 md:px-10 lg:px-20 min-h-screen" style={{ backgroundColor: '#f9fafb' }}>
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={onBackToHome}
                    className="mb-8 px-4 py-2 text-sm font-semibold rounded-full border transition-colors duration-200 flex items-center hover:bg-gray-100"
                    style={{ borderColor: DARK_ACCENT, color: DARK_ACCENT }}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </button>

                <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center" style={{ color: DARK_ACCENT }}>
                    Student Performance Dashboard
                </h2>

                {error && (
                    <div className="p-4 mb-8 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium text-center">
                        <p>Connection Error: {error}</p>
                        <p className="text-sm mt-1">Ensure your FastAPI backend is running at <code>http://localhost:8000</code>.</p>
                    </div>
                )}

                {/* Main Grid: Evaluation Form + Results */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <EvaluationForm
                        onEvaluate={handleEvaluate}
                        isLoading={isLoading.evaluate}
                    />
                    <ResultsDisplay
                        result={evaluationResult}
                        evaluationInputs={evaluationInputs}
                        onGetSuggestion={handleGetSuggestion}
                        onDownloadReport={handleDownloadReport}
                        isLoading={isLoading}
                    />
                </div>

                {/* Detail Grid: Suggestion + Chat */}
                <div className="grid lg:grid-cols-5 gap-8 h-[600px]">
                    <div className="lg:col-span-3 h-full">
                        <SuggestionDisplay
                            suggestionText={aiSuggestion}
                            isLoading={isLoading.suggestion}
                            error={error}
                        />
                    </div>
                    <div className="lg:col-span-2 h-full">
                        <ChatBox performanceLevel={performanceLevel} />
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
// Manages the "page" routing logic

const App = () => {
    const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'evaluation'

    return (
        <div className="min-h-screen font-sans">
            {currentPage === 'home' && (
                <HomePageView onStartEvaluation={() => setCurrentPage('evaluation')} />
            )}
            
            {currentPage === 'evaluation' && (
                <EvaluationPageView onBackToHome={() => setCurrentPage('home')} />
            )}

            {/* Tailwind/Color Utility Setup - Not visible, just ensuring colors are registered by Tailwind */}
            <div className="hidden">
                <div className="bg-purple-100 text-purple-800 border-purple-400 bg-green-100 text-green-800 border-green-400 bg-blue-100 text-blue-800 border-blue-400 bg-yellow-100 text-yellow-800 border-yellow-400 bg-red-100 text-red-800 border-red-400" />
                <div className="text-secondary text-primary text-dark-accent bg-dark-accent bg-secondary bg-primary" />
            </div>
        </div>
    );
};

export default App;
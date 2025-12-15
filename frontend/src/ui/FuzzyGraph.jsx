import React from 'react';
import { Activity, ArrowRight } from 'lucide-react';

/**
 * CONFIGURATION FOR POLYGONS
 * Maps your Python fuzz.trimf logic to SVG coordinates (0-300 width)
 * Y-Axis: 10 is Top (Peak), 100 is Bottom (Base)
 */
const GRAPH_CONFIG = {
    attendance: [
        { points: "0,10 0,10 150,100 0,100", color: "#ef4444", label: "LOW" },
        { points: "75,100 150,10 225,100", color: "#eab308", label: "MEDIUM" },
        { points: "150,100 300,10 300,100 300,100", color: "#22c55e", label: "HIGH" }
    ],
    test: [
        { points: "0,10 0,10 150,100 0,100", color: "#ef4444", label: "LOW" },
        { points: "90,100 180,10 240,100", color: "#eab308", label: "MEDIUM" },
        { points: "210,100 300,10 300,100 300,100", color: "#22c55e", label: "HIGH" }
    ],
    assignment: [
        { points: "0,10 0,10 150,100 0,100", color: "#ef4444", label: "LOW" },
        { points: "90,100 180,10 240,100", color: "#eab308", label: "MEDIUM" },
        { points: "210,100 300,10 300,100 300,100", color: "#22c55e", label: "HIGH" }
    ],
    // OUTPUT: Weak, Average, Good, Excellent
    performance: [
        { points: "0,10 0,10 90,100 0,100", color: "#ef4444", label: "WEAK" },         
        { points: "60,100 135,10 210,100", color: "#eab308", label: "AVERAGE" },           
        { points: "150,100 225,10 270,100", color: "#3b82f6", label: "GOOD" },         
        { points: "240,100 300,10 300,100 300,100", color: "#22c55e", label: "EXCELLENT" }   
    ]
};

const MembershipGraph = ({ title, value, config, unit = "%" }) => {
    
    // Map 0-100 input to 0-300 SVG width
    const currentX = (value / 100) * 300;

    return (
        <div style={{ marginBottom: '24px', background: '#45295a59', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            {/* 1. Header: Title and Value Box */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {title}
                </span>
                <div style={{ background: '#334155', padding: '4px 12px', borderRadius: '6px', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    {value}{unit}
                </div>
            </div>

            {/* 2. LEGEND (New Addition) */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #334155' }}>
                {config.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                        {/* Color Dot */}
                        <div style={{ 
                            width: '8px', 
                            height: '8px', 
                            borderRadius: '50%', 
                            backgroundColor: item.color,
                            marginRight: '6px'
                        }} />
                        {/* Label Text */}
                        <span style={{ fontSize: '0.7rem', fontWeight: '600', color: '#ffffffff' }}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* 3. Graph Area (Polygons Only) */}
            <div style={{ position: 'relative', height: '150px', width: '100%' }}>
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                    
                    {/* Base Line */}
                    <line x1="0" y1="100" x2="300" y2="100" stroke="#475569" strokeWidth="2" />

                    {/* Render Polygons dynamically from Config */}
                    {config.map((shape, index) => (
                        <g key={index}>
                            <polygon 
                                points={shape.points} 
                                fill={shape.color} 
                                fillOpacity="0.2" 
                                stroke={shape.color} 
                                strokeWidth="2"
                            />
                        </g>
                    ))}

                    {/* Crisp Value Line (Dashed Vertical Line) */}
                    <line 
                        x1={currentX} y1="0" 
                        x2={currentX} y2="100" 
                        stroke="white" 
                        strokeWidth="1.5" 
                        strokeDasharray="5,5" 
                    />
                    {/* White Dot at bottom of line */}
                    <circle cx={currentX} cy="100" r="4" fill="white" stroke="#1e293b" strokeWidth="2" />
                    
                </svg>
            </div>
        </div>
    );
};

const FuzzyGraph = ({ inputs, result }) => {
    const finalScore = result?.fuzzy_score || 0;
    const finalLevel = result?.performance_level || "---";

    return (
        <div className="card-base" style={{ padding: '0', overflow: 'hidden', backgroundColor: '#ceb9d4ff' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0' }}>
                
                {/* INPUT LAYER */}
                <div style={{ padding: '24px', borderRight: '1px solid #ceb9d4ff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: '#52057b' }}>
                        <Activity size={18} style={{ marginRight: '8px' }} />
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase' }}>Input Layer</h3>
                    </div>

                    <MembershipGraph 
                        title="Attendance" 
                        value={inputs.attendance} 
                        config={GRAPH_CONFIG.attendance}
                    />
                    <MembershipGraph 
                        title="Test Score" 
                        value={inputs.test_score} 
                        config={GRAPH_CONFIG.test}
                    />
                    <MembershipGraph 
                        title="Assignment Score" 
                        value={inputs.assignment_score} 
                        config={GRAPH_CONFIG.assignment}
                    />
                </div>

                {/* OUTPUT LAYER */}
                <div style={{ padding: '24px', backgroundColor: '#ceb9d4ff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', color: '#52057b' }}>
                        <ArrowRight size={18} style={{ marginRight: '8px' }} />
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase' }}>Output Layer</h3>
                    </div>

                    {/* Result Box */}
                    <div style={{ marginTop: '32px', padding: '20px', background: '#52057b39', borderRadius: '8px', borderLeft: '4px solid #52057b' }}>
                        <div style={{ marginTop: '16px' }}>
                            <span style={{ color: '#52057b', fontSize: '1.5rem', fontWeight: '900' }}>
                                {finalLevel}
                            </span>
                        </div>
                    </div>
                    <br/>
                    
                    {/* Performance Graph with 4 Variables */}
                    <MembershipGraph 
                        title="Performance Prediction" 
                        value={finalScore} 
                        config={GRAPH_CONFIG.performance}
                    />
                </div>
            </div>
        </div>
    );
};

export default FuzzyGraph;
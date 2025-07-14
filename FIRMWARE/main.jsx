import React, { useState, useRef, useEffect, useCallback } from 'react';

// --- Constants ---
const ARM_LENGTH = 120; // mm
const STEPPER_DIST = 43; // mm
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;
const SCALE = 1.0; // Pixels per mm
const ORIGIN_X = CANVAS_WIDTH / 2;
const ORIGIN_Y = CANVAS_HEIGHT / 1.5;

// --- Kinematics Calculations ---
const stepper1Pos = { x: -STEPPER_DIST / 2, y: 0 };
const stepper2Pos = { x: STEPPER_DIST / 2, y: 0 };

const inverseKinematics = (px, py) => {
    // This function calculates the motor angles for a given (x, y) point.
    // It enforces the "elbows out" configuration to prevent linkage crossover.

    const L = ARM_LENGTH;
    let angles = { theta1: null, theta2: null, elbow1: null, elbow2: null };

    // --- Left Arm (Motor 1) ---
    const d1 = Math.sqrt(Math.pow(px - stepper1Pos.x, 2) + Math.pow(py - stepper1Pos.y, 2));
    if (d1 > L * 2 || d1 < 1e-6) return null; // Unreachable or at the origin

    const a1 = Math.atan2(py - stepper1Pos.y, px - stepper1Pos.x);
    const b1 = Math.acos(d1 / (L * 2));

    // Corrected to "elbows out" configuration
    angles.theta1 = a1 + b1; 
    angles.elbow1 = {
        x: stepper1Pos.x + L * Math.cos(angles.theta1),
        y: stepper1Pos.y + L * Math.sin(angles.theta1),
    };

    // --- Right Arm (Motor 2) ---
    const d2 = Math.sqrt(Math.pow(px - stepper2Pos.x, 2) + Math.pow(py - stepper2Pos.y, 2));
    if (d2 > L * 2 || d2 < 1e-6) return null; // Unreachable or at the origin

    const a2 = Math.atan2(py - stepper2Pos.y, px - stepper2Pos.x);
    const b2 = Math.acos(d2 / (L * 2));
    
    // Corrected to "elbows out" configuration
    angles.theta2 = a2 - b2; 
     angles.elbow2 = {
        x: stepper2Pos.x + L * Math.cos(angles.theta2),
        y: stepper2Pos.y + L * Math.sin(angles.theta2),
    };

    // Convert radians to degrees for output
    const theta1_rad = angles.theta1;
    const theta2_rad = angles.theta2;

    angles.theta1 = theta1_rad * 180 / Math.PI;
    angles.theta2 = theta2_rad * 180 / Math.PI;
    
    // Recalculate elbow positions using the original radians for precision in drawing
    angles.elbow1 = {
        x: stepper1Pos.x + L * Math.cos(theta1_rad),
        y: stepper1Pos.y + L * Math.sin(theta1_rad),
    };
    angles.elbow2 = {
        x: stepper2Pos.x + L * Math.cos(theta2_rad),
        y: stepper2Pos.y + L * Math.sin(theta2_rad),
    };


    return angles;
};


// --- React Components ---
const SimulatorCanvas = ({ path, setPath, isDrawing, setIsDrawing, robotPose }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        contextRef.current = context;
    }, []);

    const toCanvasCoords = (point) => {
        return {
            x: point.x * SCALE + ORIGIN_X,
            y: -point.y * SCALE + ORIGIN_Y
        };
    };
    
    const fromCanvasCoords = (point) => {
         return {
            x: (point.x - ORIGIN_X) / SCALE,
            y: -(point.y - ORIGIN_Y) / SCALE
        };
    }

    const draw = useCallback(() => {
        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw workspace
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw axes
        ctx.strokeStyle = '#d1d5db';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, ORIGIN_Y);
        ctx.lineTo(CANVAS_WIDTH, ORIGIN_Y);
        ctx.moveTo(ORIGIN_X, 0);
        ctx.lineTo(ORIGIN_X, CANVAS_HEIGHT);
        ctx.stroke();


        // Draw user path
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (path.length > 0) {
            const startPoint = toCanvasCoords(path[0]);
            ctx.moveTo(startPoint.x, startPoint.y);
            for (let i = 1; i < path.length; i++) {
                const point = toCanvasCoords(path[i]);
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();

        // Draw robot
        if (robotPose && robotPose.elbow1 && robotPose.elbow2 && path.length > 0) {
            const s1 = toCanvasCoords(stepper1Pos);
            const s2 = toCanvasCoords(stepper2Pos);
            const e1 = toCanvasCoords(robotPose.elbow1);
            const e2 = toCanvasCoords(robotPose.elbow2);
            const pen = toCanvasCoords(path[path.length - 1]);

            // Draw arms
            ctx.strokeStyle = '#ef4444'; // Red for left arm
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(e1.x, e1.y);
            ctx.lineTo(pen.x, pen.y);
            ctx.stroke();
            
            ctx.strokeStyle = '#10b981'; // Green for right arm
            ctx.beginPath();
            ctx.moveTo(s2.x, s2.y);
            ctx.lineTo(e2.x, e2.y);
            ctx.lineTo(pen.x, pen.y);
            ctx.stroke();
            
            // Draw joints
            ctx.fillStyle = '#1f2937';
            ctx.beginPath();
            ctx.arc(s1.x, s1.y, 8, 0, 2 * Math.PI); // Stepper 1
            ctx.fill();
            ctx.beginPath();
            ctx.arc(s2.x, s2.y, 8, 0, 2 * Math.PI); // Stepper 2
            ctx.fill();
            ctx.fillStyle = '#4b5563';
            ctx.beginPath();
            ctx.arc(e1.x, e1.y, 6, 0, 2 * Math.PI); // Elbow 1
            ctx.fill();
            ctx.beginPath();
            ctx.arc(e2.x, e2.y, 6, 0, 2 * Math.PI); // Elbow 2
            ctx.fill();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(pen.x, pen.y, 7, 0, 2 * Math.PI); // Pen
            ctx.fill();
        }
    }, [path, robotPose]);

    useEffect(() => {
        draw();
    }, [draw]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        const point = fromCanvasCoords({x: offsetX, y: offsetY});
        setPath([point]);
    };

    const finishDrawing = () => {
        setIsDrawing(false);
    };

    const drawOnCanvas = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const point = fromCanvasCoords({x: offsetX, y: offsetY});
        setPath(prevPath => [...prevPath, point]);
    };

    return (
        <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={drawOnCanvas}
            onMouseLeave={finishDrawing}
            className="border-2 border-gray-300 rounded-lg cursor-crosshair"
        />
    );
};

const CodePanel = ({ code, onCopy, copyStatus }) => {
    return (
        <div className="w-full bg-gray-800 rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-200 font-mono">CircuitPython Code</h3>
                <button 
                    onClick={onCopy}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-sm w-20"
                >
                    {copyStatus}
                </button>
            </div>
            <textarea
                value={code}
                readOnly
                className="w-full h-full flex-grow bg-gray-900 text-gray-300 font-mono text-sm p-3 rounded-md border border-gray-700 resize-none focus:outline-none"
            />
        </div>
    );
};


export default function App() {
    const [path, setPath] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [robotAngles, setRobotAngles] = useState([]);
    const [micropythonCode, setMicropythonCode] = useState('');
    const [robotPose, setRobotPose] = useState(null);
    const [copyStatus, setCopyStatus] = useState('Copy');

    useEffect(() => {
        if (path.length > 0) {
            const lastPoint = path[path.length - 1];
            const pose = inverseKinematics(lastPoint.x, lastPoint.y);
            setRobotPose(pose);
        } else {
            setRobotPose(null);
        }
    }, [path]);

    const handleClear = () => {
        setPath([]);
        setRobotAngles([]);
        setMicropythonCode('');
        setRobotPose(null);
    };

    const handleGenerateCode = () => {
        const angles = path.map(p => inverseKinematics(p.x, p.y)).filter(Boolean);
        setRobotAngles(angles);
        
        const angleData = angles.map(a => `    (${a.theta1.toFixed(2)}, ${a.theta2.toFixed(2)})`).join(',\n');

        const code = `
# CircuitPython Code for 5-Bar SCARA Robot
# Generated by React Simulator

import board
import digitalio
import time

# --- Motor Configuration ---
DIR1_PIN = board.D7
STEP1_PIN = board.D8
DIR2_PIN = board.D9
STEP2_PIN = board.D10

# --- Stepper Motor Driver ---
# This class manually controls a standard step/direction stepper driver.
# It does not require any external libraries like adafruit_motor.
class StepperMotor:
    def __init__(self, dir_pin, step_pin):
        self.dir = digitalio.DigitalInOut(dir_pin)
        self.dir.direction = digitalio.Direction.OUTPUT
        self.step = digitalio.DigitalInOut(step_pin)
        self.step.direction = digitalio.Direction.OUTPUT

        self.current_angle = 0.0
        # IMPORTANT: Calibrate this value for your specific motors and microstepping.
        self.steps_per_rev = 200 * 16
        # Controls the speed. Lower is faster.
        self.delay = 0.0005 

    def move_to_angle(self, target_angle):
        steps_per_degree = self.steps_per_rev / 360.0
        delta_angle = target_angle - self.current_angle
        num_steps = int(abs(delta_angle) * steps_per_degree)

        if delta_angle > 0:
            self.dir.value = True # Set direction (e.g., Clockwise)
        else:
            self.dir.value = False # Set direction (e.g., Counter-Clockwise)

        for _ in range(num_steps):
            self.step.value = True
            time.sleep(self.delay)
            self.step.value = False
            time.sleep(self.delay)

        self.current_angle = target_angle
        print(f"Moved to {target_angle:.2f} degrees")

# --- Main Program ---
motor1 = StepperMotor(DIR1_PIN, STEP1_PIN)
motor2 = StepperMotor(DIR2_PIN, STEP2_PIN)

# Path data (motor1_angle, motor2_angle)
path_angles = [
${angleData}
]

print("Starting robot path...")

# IMPORTANT: Home your robot first to a known zero-angle position.
# The script assumes the robot starts at 0 degrees for both motors.
# motor1.current_angle = 0.0
# motor2.current_angle = 0.0

for target_angle1, target_angle2 in path_angles:
    # This moves motors sequentially. For smoother motion, you would need
    # a more advanced algorithm (e.g., Bresenham's line) to interleave the steps.
    motor1.move_to_angle(target_angle1)
    motor2.move_to_angle(target_angle2)
    time.sleep(0.01) # Small pause between points

print("Path complete.")
`;
        setMicropythonCode(code.trim());
    };
    
    const handleCopyCode = () => {
        if (!micropythonCode) return;

        const textArea = document.createElement("textarea");
        textArea.value = micropythonCode;
        
        // Make the textarea invisible
        textArea.style.position = 'fixed';
        textArea.style.top = '-9999px';
        textArea.style.left = '-9999px';

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                setCopyStatus('Copied!');
            } else {
                setCopyStatus('Failed!');
            }
        } catch (err) {
            console.error('Failed to copy code', err);
            setCopyStatus('Failed!');
        }

        document.body.removeChild(textArea);

        setTimeout(() => {
            setCopyStatus('Copy');
        }, 2000);
    };


    return (
        <div className="bg-gray-100 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">5-Bar SCARA Robot Simulator</h1>
                    <p className="text-md text-gray-600 mt-1">Draw a path on the canvas, then generate the CircuitPython code to control your robot.</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Simulator and Controls */}
                    <div className="flex-grow lg:w-2/3">
                        <SimulatorCanvas 
                            path={path} 
                            setPath={setPath}
                            isDrawing={isDrawing}
                            setIsDrawing={setIsDrawing}
                            robotPose={robotPose}
                        />
                         <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Controls</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleGenerateCode}
                                    disabled={path.length === 0}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-all"
                                >
                                    Generate CircuitPython Code
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75 transition-all"
                                >
                                    Clear Drawing
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Code Panel */}
                    <div className="lg:w-1/3 h-[600px] flex">
                        <CodePanel code={micropythonCode} onCopy={handleCopyCode} copyStatus={copyStatus} />
                    </div>
                </div>
                 <footer className="text-center text-gray-500 mt-8 text-sm">
                    <p>Simulator Parameters: Arm Length = {ARM_LENGTH}mm, Stepper Distance = {STEPPER_DIST}mm.</p>
                    <p>The origin (0,0) is centered between the two steppers.</p>
                </footer>
            </div>
        </div>
    );
}


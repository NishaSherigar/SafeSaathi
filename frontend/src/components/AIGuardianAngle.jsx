import React, { useState } from "react";
import axios from "axios";

const AIGuardianAngel = () => {
    const [safetyPlan, setSafetyPlan] = useState("");
    const [userData, setUserData] = useState({
        "Time of Travel": "",
        "Alone": "",
        "Risk Level": ""
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const getSafetyPlan = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict_safety", userData);
            setSafetyPlan(response.data.safety_plan);
        } catch (error) {
            console.error("Error fetching safety plan", error);
        }
    };

    return (
        <div className="p-6 bg-black text-white">
            <h2 className="text-2xl font-bold">🛡 AI Guardian Angel</h2>
            <input
                type="text"
                name="Time of Travel"
                placeholder="Enter travel time (e.g., 10 PM)"
                onChange={handleChange}
                className="p-2 m-2 bg-gray-800 text-white"
            />
            <select name="Alone" onChange={handleChange} className="p-2 m-2 bg-gray-800 text-white">
                <option value="">Are you alone?</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
            </select>
            <select name="Risk Level" onChange={handleChange} className="p-2 m-2 bg-gray-800 text-white">
                <option value="">Select Risk Level</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select>

            <button onClick={getSafetyPlan} className="bg-blue-600 px-4 py-2 mt-4 rounded">
                Get Safety Plan
            </button>

            {safetyPlan && <p className="mt-4 text-green-400">Recommended: {safetyPlan}</p>}
        </div>
    );
};

export default AIGuardianAngel;

import React from "react";
import AudioComponent from "../components/AudioComponent";
import AudioRecorder from "../components/AudioRecorder";

const AudioPage = () => {
    return (
        <div style={styles.pageContainer}>
            <h1>Audio Page</h1>
            <p>Record and listen to audio here.</p>

            {/* Audio Player Component */}
            <AudioComponent />

            {/* Audio Recorder Component */}
            <AudioRecorder />
        </div>
    );
};

// Styles
const styles = {
    pageContainer: {
        textAlign: "center",
        padding: "20px",
    },
};

export default AudioPage;

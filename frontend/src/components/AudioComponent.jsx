import React from "react";

const AudioComponent = () => {
    return (
        <div style={styles.container}>
            <h2>Audio Player</h2>
            <audio controls>
                <source src="/audio/sample.mp3" type="audio/mp3" />
                Your browser does not support the audio element.
            </audio>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9",
        marginTop: "20px",
    },
};

export default AudioComponent;

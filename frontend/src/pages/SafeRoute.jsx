import React, { useEffect } from "react";

const SafeRoute = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyCVNyLcK1zpOaRyuq3llW6s2zPVLsLmhQg&libraries=places&callback=initMap";
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      // Your map and route safety logic will go here, or in script.js file
      console.log("Google Maps API loaded");
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Safety Route Finder</h1>

      <div className="input-group flex gap-4 mb-6">
        <input
          type="text"
          id="source"
          placeholder="Enter starting point"
          className="p-2 border border-gray-300 rounded text-black w-64"
        />
        <input
          type="text"
          id="destination"
          placeholder="Enter destination"
          className="p-2 border border-gray-300 rounded text-black w-64"
        />
        <button
          id="findRouteBtn"
          className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
        >
          Find Safest Route
        </button>
      </div>

      <div id="map" className="w-full h-[400px] mb-8 rounded border border-gray-500" />

      <div className="results bg-gray-900 p-4 rounded shadow-md">
        <h2 className="text-2xl mb-3">Route Safety Analysis</h2>
        <table className="min-w-full table-auto border border-gray-600 text-white" id="crimeTable">
          <thead className="bg-gray-800">
            <tr>
              <th className="border px-4 py-2">Route</th>
              <th className="border px-4 py-2">Crime Score</th>
              <th className="border px-4 py-2">Safety Level</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamic rows will be added via JS */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SafeRoute;

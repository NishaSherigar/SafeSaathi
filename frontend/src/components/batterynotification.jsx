import React, { useState, useEffect } from 'react';

const BatteryNotification = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [audio] = useState(new Audio('/battery-alert.mp3'));

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryLevel(battery.level * 100);
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level * 100);
          if (battery.level * 100 <= 15) {
            setShowNotification(true);
            audio.play().catch(error => console.log('Audio play failed:', error));
          }
        });

        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    } else {
      console.log('Battery API not supported');
    }
  }, [audio]);

  const getBatteryColor = () => {
    if (batteryLevel <= 15) return '#ff4444';
    if (batteryLevel <= 30) return '#ffbb33';
    return '#00C851';
  };

  const getBatteryIcon = () => {
    if (batteryLevel <= 15) return '🔴';
    if (batteryLevel <= 30) return '🟡';
    return '🟢';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white p-6">
      <div className="w-80 bg-opacity-70 backdrop-blur-lg border border-gray-700 shadow-lg shadow-blue-500/50 rounded-xl p-6 text-center">
        <div className="text-4xl animate-pulse">{getBatteryIcon()}</div>
        <h2 className="text-xl font-bold mt-2">Battery Status</h2>
        <div className="relative w-full h-6 bg-gray-800 rounded-lg mt-4 overflow-hidden border border-gray-600">
          <div 
            className="h-full transition-all duration-300" 
            style={{ width: `${batteryLevel}%`, backgroundColor: getBatteryColor() }}
          />
        </div>
        <p className="mt-2 text-lg font-semibold">{Math.round(batteryLevel)}%</p>
        <p className="mt-1 text-sm font-light">
          {isCharging ? '🔌 Charging' : '🔋 Not Charging'}
        </p>
      </div>

      {showNotification && batteryLevel <= 15 && (
        <div className="fixed bottom-6 bg-red-600 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 animate-bounce">
          <div className="text-2xl">⚠️</div>
          <div>
            <h3 className="text-lg font-bold">Low Battery Alert!</h3>
            <p className="text-sm">Your battery is critically low. Please charge your device.</p>
          </div>
          <button 
            className="text-xl font-bold bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition-all"
            onClick={() => setShowNotification(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default BatteryNotification;
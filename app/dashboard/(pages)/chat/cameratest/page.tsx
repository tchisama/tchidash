import React, { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const VirtualKeyboard = () => {
  const [stream, setStream] = useState(null);
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsRecording(false);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stopCamera();
      }
    };
  }, [stream]);

  return (
    <div className="w-full max-w-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Virtual Air Keyboard</h2>
        <Button 
          onClick={isRecording ? stopCamera : startCamera}
          className={isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
        >
          <Camera className="mr-2 h-4 w-4" />
          {isRecording ? 'Stop Camera' : 'Start Camera'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
        {stream ? (
          <video
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            ref={video => {
              if (video && stream) video.srcObject = stream;
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="h-16 w-16 text-slate-500" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Detected Text:</label>
        <textarea
          value={text}
          readOnly
          className="w-full h-24 p-2 border rounded-md bg-slate-50"
          placeholder="Your gestures will appear here..."
        />
      </div>
    </div>
  );
};

export default VirtualKeyboard;

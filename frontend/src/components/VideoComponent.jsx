import React from 'react';
import {
  AgoraRTCProvider,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useRemoteUsers,
  RemoteUser,
  LocalVideoTrack,
} from 'https://esm.sh/agora-rtc-react@2.1.0';

/**
 * Internal component that renders the video UI.
 * It must be a child of AgoraRTCProvider to use the hooks.
 */
const VideoCallUI = () => {
  const { localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();

  // Publish tracks automatically when the component mounts
  useLocalCameraTrack(true);
  useLocalMicrophoneTrack(true);

  return (
    <div className="flex flex-col gap-4">
      {/* Local User Video */}
      <div className="relative w-full overflow-hidden bg-black border-2 border-blue-500 rounded-lg aspect-video">
        <div className="absolute z-10 px-2 py-1 text-xs text-white rounded-br-md top-2 left-2 bg-black/50">
          You
        </div>
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />
      </div>
      
      {/* Remote Users Video Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {remoteUsers.map((user) => (
          <div
            key={user.uid}
            className="relative overflow-hidden bg-gray-800 rounded-lg aspect-video"
          >
            <div className="absolute z-10 px-2 py-1 text-xs text-white rounded-br-md top-2 left-2 bg-black/50">
              User: {user.uid}
            </div>
            <RemoteUser
              user={user}
              playVideo={true}
              playAudio={true}
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Video Component Wrapper.
 * This component connects to the Agora channel using the provided config.
 *
 * @param {object} props
 * @param {object} props.config - The Agora config object (appId, channel, token, uid).
 */
export default function VideoComponent({ config }) {
  if (!config) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">Waiting for call configuration...</p>
      </div>
    );
  }

  return (
    <AgoraRTCProvider config={config}>
      <VideoCallUI />
    </AgoraRTCProvider>
  );
}
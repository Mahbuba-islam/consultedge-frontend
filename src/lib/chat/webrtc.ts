const rtcConfiguration: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

export const createChatPeerConnection = ({
  onIceCandidate,
  onRemoteTrack,
}: {
  onIceCandidate: (candidate: RTCIceCandidate) => void;
  onRemoteTrack: (stream: MediaStream) => void;
}) => {
  const peer = new RTCPeerConnection(rtcConfiguration);

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      onIceCandidate(event.candidate);
    }
  };

  peer.ontrack = (event) => {
    const [stream] = event.streams;

    if (stream) {
      onRemoteTrack(stream);
      return;
    }

    const fallbackStream = new MediaStream([event.track]);
    onRemoteTrack(fallbackStream);
  };

  return peer;
};

export const stopMediaStream = (stream?: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};


export function gatherCandidates({ iceServers, onCandidate, onDone, onStateChange }) {
  const pc = new RTCPeerConnection({ iceServers });

  pc.createDataChannel("probe");

  pc.onicegatheringstatechange = () => {
    onStateChange?.(pc.iceGatheringState);
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      onCandidate(e.candidate);
    } else {
      onDone();
    }
  };

  pc.createOffer()
  .then((offer) => pc.setLocalDescription(offer))
  .catch((error) => console.error("ICE gathering error:", error));

  return () => pc.close();
}

export function parseCandidate(candidateString) {
  const regex =
    /^candidate:(\S+)\s+\d+\s+(udp|tcp)\s+(\d+)\s+(\S+)\s+(\d+)\s+typ\s+(\S+)/i;

  const match = candidateString.match(regex);

  if (!match) {
    return null;
  }

  return {
    foundation: match[1],
    protocol: match[2].toLowerCase(),
    priority: Number(match[3]),
    address: match[4],
    port: Number(match[5]),
    type: match[6].toLowerCase(),
  };
}

export function gatherCandidates({
  iceServers,
  onCandidate,
  onDone,
  onStateChange,
}) {
  const pc = new RTCPeerConnection({ iceServers });

  pc.createDataChannel("probe");

  pc.onicegatheringstatechange = () => {
    onStateChange?.(pc.iceGatheringState);
  };

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      const browserCandidate = e.candidate;

      const parsed = parseCandidate(
        browserCandidate.candidate
      );

      if (parsed) {
        const matchesBrowser =
          parsed.foundation === browserCandidate.foundation &&
          parsed.protocol === browserCandidate.protocol?.toLowerCase() &&
          parsed.priority === browserCandidate.priority &&
          parsed.address === browserCandidate.address &&
          parsed.port === browserCandidate.port &&
          parsed.type === browserCandidate.type;

        console.log("Parsed ICE Candidate:", parsed);
        console.log("Matches browser properties:", matchesBrowser);
      } else {
        console.log("Could not parse candidate:", browserCandidate.candidate);
      }

      onCandidate(browserCandidate);
    } else {
      onDone();
    }
  };

  pc.createOffer()
    .then((offer) => pc.setLocalDescription(offer))
    .catch((error) =>
      console.error("ICE gathering error:", error)
    );

  return () => pc.close();
}
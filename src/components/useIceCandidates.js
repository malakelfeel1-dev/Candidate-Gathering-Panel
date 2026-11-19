import { useEffect, useState } from "react";
import { gatherCandidates } from "../lib/gatherCandidates";

export function useIceCandidates(iceServers) {
  const [candidates, setCandidates] = useState([]);
  const [gatheringState, setGatheringState] = useState("new");
  const [elapsed, setElapsed] = useState(null);

  useEffect(() => {
    let active = true;

    setCandidates([]);
    setGatheringState("new");
    setElapsed(null);

    const start = performance.now();

    const stop = gatherCandidates({
      iceServers,

      onCandidate: (candidate) => {
        if (!active) return;

        setCandidates((previous) => [
          ...previous,
          candidate,
        ]);
      },

      onDone: () => {
        if (!active) return;

        const end = performance.now();
        setElapsed(Math.round(end - start));
      },

      onStateChange: (state) => {
        if (!active) return;

        setGatheringState(state);
      },
    });

    return () => {
      active = false;
      stop();
    };
  }, [iceServers]);

  return {
    candidates,
    gatheringState,
    elapsed,
  };
}
import { useState } from "react";
import { useIceCandidates } from "./useIceCandidates";

const CONFIGS = {
  none: [],
  stun: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
  wrong: [
    { urls: "stun:stun.invalid.example:3478" },
  ],
};

const COLORS = {
  host: "#d5f0ec",
  srflx: "#fdecc8",
  relay: "#fbd9cf",
};

function CandidateTable({ title, candidates }) {
  const sorted = [...candidates].sort(
    (a, b) => b.priority - a.priority
  );

  return (
    <section style={{ marginTop: "25px" }}>
      <h2>{title}</h2>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Type</th>
            <th>Protocol</th>
            <th>Address : Port</th>
            <th>Priority</th>
            <th>Foundation</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map((c) => (
            <tr
              key={c.candidate}
              style={{
                background: COLORS[c.type] ?? "white",
              }}
            >
              <td>{c.type}</td>
              <td>{c.protocol}</td>
              <td>{c.address}:{c.port}</td>
              <td>{c.priority}</td>
              <td>{c.foundation}</td>
            </tr>
          ))}

          {sorted.length === 0 && (
            <tr>
              <td colSpan={5}>
                No {title} found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default function CandidatePanel() {
  const [configName, setConfigName] = useState("stun");

  const iceServers = CONFIGS[configName];

  const {
    candidates,
    gatheringState,
    elapsed,
  } = useIceCandidates(iceServers);

  const udpCandidates = candidates.filter(
    (c) => c.protocol?.toLowerCase() === "udp"
  );

  const tcpCandidates = candidates.filter(
    (c) => c.protocol?.toLowerCase() === "tcp"
  );

  return (
    <div style={{ padding: "24px" }}>
      <h1>ICE Candidate Panel</h1>

      <label>Configuration: </label>

      <select
        value={configName}
        onChange={(e) => setConfigName(e.target.value)}
      >
        <option value="none">No STUN</option>
        <option value="stun">Google STUN</option>
        <option value="wrong">Unreachable STUN</option>
      </select>

      <p>Gathering State: {gatheringState}</p>

      <p>
        Gathering Time:{" "}
        {elapsed !== null ? `${elapsed} ms` : "Gathering..."}
      </p>

      <CandidateTable
        title="UDP Candidates"
        candidates={udpCandidates}
      />

      <CandidateTable
        title="TCP Candidates"
        candidates={tcpCandidates}
      />
    </div>
  );
}
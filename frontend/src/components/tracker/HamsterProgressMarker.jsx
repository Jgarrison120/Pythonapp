function Wheel({ x, y, radius }) {
  // Wheel rim, three spokes, open hub, stand, and foot match public/favicon.svg.
  return (
    <g transform={`translate(${x} ${y}) scale(${radius / 20})`} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <g className="hamster-wheel-rotor">
        <circle r="20" strokeWidth="4.5" />
        <path d="M0-3V-19M-3 2-16 13M3 2 16 13" strokeWidth="3" />
        <circle r="3" fill="#fff" strokeWidth="3" />
      </g>
      <path d="M0 21v4M-11 25h22" strokeWidth="3" />
    </g>
  );
}

function Hamster({ x, y, scale = 1, tail = true, pushing = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {tail && <path d="M-8-3c-5-4-8-3-10 0" fill="none" stroke="currentColor" strokeWidth="3.5" />}
      <g className="hamster-paw hamster-paw-back">
        <path d="M-6 6q-3 6-9 7l-5-2q6-3 8-9Z" />
      </g>
      <g className="hamster-paw hamster-paw-front">
        <path d="M4 7q5 5 11 7l3-3q-5-5-7-10Z" />
      </g>
      <ellipse cx="0" cy="0" rx="14" ry="10" transform="rotate(-25 0 0)" />
      <circle cx="13" cy="-7" r="8.5" />
      <circle cx="9" cy="-16" r="4.6" />
      <circle cx="17" cy="-16" r="3.4" />
      <ellipse cx="22" cy="-4" rx="4" ry="3" />
      <circle cx="16" cy="-8" r="1.6" fill="#fff" />
      {pushing && <path d="M9 2 26 4" fill="none" stroke="currentColor" strokeWidth="3.5" />}
    </g>
  );
}

function SittingHamster() {
  return (
    <g fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 67q7 2 9 9" fill="none" strokeWidth="3.5" />
      <ellipse cx="38" cy="57" rx="15" ry="18" transform="rotate(-10 38 57)" stroke="none" />
      <path d="M29 72q-5 5-11 3M43 73q2 5 8 4" fill="none" strokeWidth="4" />
      <circle cx="30" cy="42" r="11" stroke="none" />
      <circle cx="35" cy="29" r="4.7" stroke="none" />
      <circle cx="27" cy="31" r="3.5" stroke="none" />
      <circle cx="19" cy="45" r="2.3" stroke="none" />
      <circle cx="25" cy="41" r="1.6" fill="#fff" stroke="none" />
      <path d="M27 54q4 5 9 4" fill="none" strokeWidth="3" />
    </g>
  );
}

function SpeedLines() {
  return (
    <g className="hamster-speed-lines" fill="none" stroke="#6eae83" strokeWidth="2.5" strokeLinecap="round">
      <path d="M10 43h15M17 52h10M5 60h16" />
    </g>
  );
}

function HamsterProgressMarker({ progress }) {
  const pose = progress === 0 ? "ready" : progress === 0.25 ? "push" : progress === 0.5 ? "inside" : progress === 0.75 ? "top" : "carry";

  return (
    <svg className="hamster-marker-art" viewBox="0 0 120 92" aria-hidden="true" data-pose={pose}>
      {pose === "ready" && <>
        <Wheel x={70} y={55} radius={22} />
        <SittingHamster />
      </>}
      {pose === "push" && <>
        <Wheel x={75} y={57} radius={23} />
        <Hamster x={27} y={55} pushing />
      </>}
      {pose === "inside" && <>
        <Wheel x={61} y={53} radius={29} />
        <Hamster x={57} y={57} scale={0.7} />
      </>}
      {pose === "top" && <>
        <SpeedLines />
        <Wheel x={63} y={62} radius={20} />
        <Hamster x={55} y={31} scale={0.95} />
      </>}
      {pose === "carry" && <>
        <SpeedLines />
        <path d="M52 52q-12-4-12-15-1-8-8-7" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        <Wheel x={32} y={17} radius={15} />
        <Hamster x={70} y={54} tail={false} />
      </>}
    </svg>
  );
}

export default HamsterProgressMarker;

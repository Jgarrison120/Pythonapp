function Wheel({ x, y, radius }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="hamster-wheel-rotor" fill="none" stroke="#276a4a" strokeLinecap="round" strokeLinejoin="round">
        <circle r={radius} strokeWidth="4" />
        <circle r="3" fill="#276a4a" stroke="none" />
        <path d={`M0 ${-radius + 5}V-4M0 4V${radius - 5}M${-radius + 5} 0H-4M4 0H${radius - 5}`} strokeWidth="2.5" />
      </g>
    </g>
  );
}

function Hamster({ x, y, scale = 1, tail = true, pushing = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#205c40" strokeLinecap="round" strokeLinejoin="round">
      {tail && <path d="M-15-2q-12-4-12-12 1-6 7-4" fill="none" strokeWidth="3" />}
      <g className="hamster-paw hamster-paw-back" fill="none" strokeWidth="3.5">
        <path d="M-8 7-13 17l-5 2" />
      </g>
      <g className="hamster-paw hamster-paw-front" fill="none" strokeWidth="3.5">
        <path d="M6 7 11 17l5 1" />
      </g>
      <ellipse cx="0" cy="0" rx="17" ry="11" fill="#f8f8ed" strokeWidth="2.5" />
      <circle cx="13" cy="-7" r="9" fill="#f8f8ed" strokeWidth="2.5" />
      <circle cx="9" cy="-17" r="4" fill="#f8f8ed" strokeWidth="2" />
      <circle cx="17" cy="-16" r="3.2" fill="#f8f8ed" strokeWidth="2" />
      <circle cx="18" cy="-9" r="1.6" fill="#205c40" stroke="none" />
      <circle cx="22" cy="-4" r="2.3" fill="#205c40" stroke="none" />
      {pushing && <path d="M10 2 26 4" fill="none" strokeWidth="3" />}
    </g>
  );
}

function SittingHamster() {
  return (
    <g stroke="#205c40" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 67q7 2 9 9" fill="none" strokeWidth="3" />
      <ellipse cx="38" cy="57" rx="15" ry="18" transform="rotate(-10 38 57)" fill="#f8f8ed" strokeWidth="2.5" />
      <path d="M29 72q-5 5-11 3M43 73q2 5 8 4" fill="none" strokeWidth="3" />
      <circle cx="30" cy="42" r="11" fill="#f8f8ed" strokeWidth="2.5" />
      <circle cx="35" cy="29" r="4.7" fill="#f8f8ed" strokeWidth="2" />
      <circle cx="27" cy="31" r="3.5" fill="#f8f8ed" strokeWidth="2" />
      <circle cx="25" cy="41" r="1.6" fill="#205c40" stroke="none" />
      <circle cx="19" cy="45" r="2.3" fill="#205c40" stroke="none" />
      <path d="M27 54q4 5 9 4" fill="none" strokeWidth="2.5" />
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
        <Hamster x={55} y={24} scale={0.95} />
      </>}
      {pose === "carry" && <>
        <SpeedLines />
        <path d="M52 52q-12-4-12-15-1-8-8-7" fill="none" stroke="#205c40" strokeWidth="3.5" strokeLinecap="round" />
        <Wheel x={32} y={17} radius={15} />
        <Hamster x={70} y={54} tail={false} />
      </>}
    </svg>
  );
}

export default HamsterProgressMarker;

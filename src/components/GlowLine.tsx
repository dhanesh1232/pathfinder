import React from "react";

// Type definitions
type Orientation = "vertical" | "horizontal";
type ColorScheme = "purple" | "blue" | "green" | "red";
type Variant = "straight" | "curved";

interface GlowLineProps {
  orientation: Orientation;
  position?: string;
  className?: string;
  color: ColorScheme;
  variant?: Variant;
}

interface GlowLayer {
  size: string;
  blur: string;
  opacity: string;
  color: string;
}

interface ColorSchemeConfig {
  core: string;
  glow: string[];
}

// Color schemes configuration for Straight Lines (Background Gradients)
const COLOR_SCHEMES: Record<ColorScheme, ColorSchemeConfig> = {
  purple: {
    core: "via-purple-400",
    glow: [
      "via-purple-400",
      "via-purple-500",
      "via-purple-400",
      "via-purple-300",
    ],
  },
  blue: {
    core: "via-blue-400",
    glow: ["via-blue-400", "via-blue-500", "via-blue-400", "via-blue-300"],
  },
  green: {
    core: "via-green-400",
    glow: ["via-green-400", "via-green-500", "via-green-400", "via-green-300"],
  },
  red: {
    core: "via-red-400",
    glow: ["via-red-400", "via-red-500", "via-red-400", "via-red-300"],
  },
};

// Text Colors for SVG CurrentColor (Curved Lines)
const TEXT_COLORS: Record<ColorScheme, string> = {
  purple: "text-purple-400",
  blue: "text-blue-400",
  green: "text-green-400",
  red: "text-red-400",
};

const CurvedGlowLine: React.FC<GlowLineProps> = ({
  orientation,
  className = "",
  color,
}) => {
  const isVertical = orientation === "vertical";
  const textColor = TEXT_COLORS[color];
  const gradientId = `glow-grad-${color}-${orientation}`;
  const flareId = `glow-flare-${color}-${orientation}`;
  const auroraId = `glow-aurora-${color}-${orientation}`;

  // Paths:
  // Horizontal: Horizon Arc - Shallower curve resembling a planet sunrise.
  // M-5,70 Q50,20 105,70
  // Starts slightly outside (-5) and lower (75), peaks at (50,25), ends at (105,75).
  const horizontalPath = "M-5,75 Q50,25 105,75";

  // Vertical: C-Curve (Bulges Left) - Adjusted to match style if used vertically.
  const verticalPath = "M100,0 Q15,50 100,100";

  const d = isVertical ? verticalPath : horizontalPath;

  return (
    <div className={`relative w-full h-full ${textColor} ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="overflow-visible"
      >
        <defs>
          {/* Main Line Gradient - Fades at ends, bright in center */}
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2={isVertical ? "0%" : "100%"}
            y2={isVertical ? "100%" : "0%"}
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="15%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="30%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="45%" stopColor="white" stopOpacity="1" />
            <stop offset="55%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="85%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>

          {/* Flare - Intense white dot at center */}
          <radialGradient
            id={flareId}
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="20%" stopColor="white" stopOpacity="0.8" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>

          {/* Aurora/Atmosphere - Soft haze rising from the curve */}
          <radialGradient
            id={auroraId}
            cx="50%"
            cy="100%"
            r="80%"
            fx="50%"
            fy="100%"
          >
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Atmosphere / Aurora Glow (Behind) */}
        {!isVertical && (
          <ellipse
            cx="50"
            cy="35"
            rx="40"
            ry="25"
            fill={`url(#${auroraId})`}
            className="blur-2xl opacity-60 blend-screen"
          />
        )}

        {/* Flare/Bloom at Apex */}
        <circle
          cx={isVertical ? "15" : "50"}
          cy={isVertical ? "50" : "25"}
          r="8"
          fill={`url(#${flareId})`}
          className="blur-md opacity-100 mix-blend-screen"
        />

        {/* Sharp Central Flare Spot */}
        <circle
          cx={isVertical ? "15" : "50"}
          cy={isVertical ? "50" : "25"}
          r="1.5"
          fill="white"
          className="blur-[1px] opacity-100"
        />

        {/* Glow Layer 1 (Wide Blur) */}
        <path
          d={d}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          className="blur-lg opacity-50 mix-blend-screen"
        />

        {/* Glow Layer 2 (Medium Blur) */}
        <path
          d={d}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="3"
          strokeLinecap="round"
          className="blur-md opacity-80 mix-blend-screen"
        />

        {/* Core Line - Thinner and sharper */}
        <path
          d={d}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="1"
          strokeLinecap="round"
          className="opacity-100 drop-shadow-[0_0_5px_rgba(255,255,255,1)]"
        />
      </svg>
    </div>
  );
};

const StraightGlowLine: React.FC<GlowLineProps> = ({
  orientation,
  position = "50%",
  className = "",
  color,
}) => {
  const isVertical = orientation === "vertical";
  const containerClasses = isVertical
    ? "absolute w-px h-full"
    : "absolute w-full h-px";
  const positionStyle: React.CSSProperties = isVertical
    ? { left: position }
    : { top: position };
  const gradientDirection = isVertical
    ? "bg-gradient-to-b"
    : "bg-gradient-to-r";

  const selectedScheme = COLOR_SCHEMES[color];

  const glowLayers: GlowLayer[] = [
    {
      size: isVertical ? "w-1 -ml-0.5" : "h-1 -mt-0.5",
      blur: "blur-sm",
      opacity: "opacity-100",
      color: selectedScheme.glow[0],
    },
    {
      size: isVertical ? "w-2 -ml-1" : "h-2 -mt-1",
      blur: "blur-md",
      opacity: "opacity-80",
      color: selectedScheme.glow[1],
    },
    {
      size: isVertical ? "w-4 -ml-2" : "h-4 -mt-2",
      blur: "blur-lg",
      opacity: "opacity-60",
      color: selectedScheme.glow[2],
    },
  ];

  return (
    <div className={`${containerClasses} ${className}`} style={positionStyle}>
      <div
        className={`absolute inset-0 ${gradientDirection} from-transparent ${selectedScheme.core} to-transparent`}
      />
      <div
        className={`absolute inset-0 ${isVertical ? "w-0.5 -ml-px" : "h-0.5 -mt-px"} ${gradientDirection} from-transparent via-white to-transparent opacity-60`}
      />
      {glowLayers.map((layer, index) => (
        <div
          key={index}
          className={`absolute inset-0 ${layer.size} ${gradientDirection} from-transparent ${layer.color} to-transparent ${layer.blur} ${layer.opacity}`}
        />
      ))}
    </div>
  );
};

const GlowLine: React.FC<GlowLineProps> = (props) => {
  if (props.variant === "curved") {
    return <CurvedGlowLine {...props} />;
  }
  return <StraightGlowLine {...props} />;
};

export default GlowLine;

import Icon from "@hackclub/icons";

export default function Pill({
  msg,
  color,
  glyph,
  glyphImage,
  glyphSize,
  glyphStyles,
}: {
  msg: string;
  color?: string;
  glyph?: any;
  glyphImage?: any;
  glyphSize?: number;
  glyphStyles?: object;
}) {
  let textColour = "text-gray-600",
    bgColour = "bg-gray-50",
    borderColour = "border-gray-500/10";

  switch (color) {
    case "red":
      textColour = "text-red-600";
      bgColour = "bg-red-50";
      borderColour = "border-red-500/10";
      break;
    case "yellow":
      textColour = "text-yellow-600";
      bgColour = "bg-yellow-50";
      borderColour = "border-yellow-500/10";
      break;
    case "green":
      textColour = "text-green-600";
      bgColour = "bg-green-50";
      borderColour = "border-green-500/10";
      break;
    case "blue":
      textColour = "text-blue-600";
      bgColour = "bg-blue-50";
      borderColour = "border-blue-500/10";
      break;
    case "purple":
      textColour = "text-purple-600";
      bgColour = "bg-purple-50";
      borderColour = "border-purple-500/10";
      break;
  }

  return (
    <div
      className={`flex items-center gap-1 ${textColour} ${bgColour} rounded-full px-2 border ${borderColour}`}
    >
      {glyphImage ? glyphImage : null}
      {glyph ? (
        <Icon glyph={glyph} size={glyphSize || 24} style={glyphStyles} />
      ) : null}
      {msg}
    </div>
  );
}

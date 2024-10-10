import Icon from "@hackclub/icons";

export default function Pill({
  msg,
  color = "gray",
  glyph,
  glyphImage,
  glyphSize,
  glyphStyles,
}: {
  msg: string;
  color?: string;
  glyph?: any;
  glyphImage: any;
  glyphSize?: number;
  glyphStyles?: Object;
}) {
  const textColour = `text-${color}-600`;
  const bgColour = `bg-${color}-50`;

  return (
    <div
      className={`flex items-center gap-1 ${textColour} ${bgColour} rounded-full px-2`}
    >
      {glyphImage ? glyphImage : null}
      {glyph ? (
        <Icon glyph={glyph} size={glyphSize || 24} style={glyphStyles} />
      ) : null}
      {msg}
    </div>
  );
}

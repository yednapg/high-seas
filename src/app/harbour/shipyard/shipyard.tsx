import Ships from "./ships";

function ShipsLoading() {
  return <div>Loading ships...</div>;
}

export default function Shipyard({ ships }: any) {
  if (!ships) {
    return <ShipsLoading />;
  } else {
    return (
      <div>
        <h1>Your ships</h1>
        <Ships ships={ships} />
      </div>
    );
  }
}

// import { AnimatePresence, motion } from "framer-motion";
// import { getShips } from "./ships";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";

// export async function Shipyard() {
//   const ships = await getShips();

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Your Ships</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {ships.map((ship, index) => (
//           <Card key={index}>
//             <CardHeader>
//               <h2 className="text-xl font-semibold">{ship.title}</h2>
//             </CardHeader>
//             <CardContent>
//               <p>
//                 <strong>Rating:</strong> {ship.rating}/10
//               </p>
//               <p>
//                 <strong>Hours:</strong> {ship.hours}
//               </p>
//               <div className="mt-2">
//                 <a
//                   href={ship.repoUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline mr-4"
//                 >
//                   Repository
//                 </a>
//                 <a
//                   href={ship.readmeUrl}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-500 hover:underline"
//                 >
//                   README
//                 </a>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }

import Ships from "./ships";
import { getShips, Ship } from "./ship-utils"; // Adjust the import path as necessary
import { Suspense } from "react";

function ShipsLoading() {
  return <div>Loading ships...</div>;
}

export default function Shipyard({ ships }: { ships: Ship[] | null }) {
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

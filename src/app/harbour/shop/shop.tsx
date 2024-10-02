import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SoundButton } from "./sound-button.js";
import { LoadingSpinner } from "@/components/ui/loading_spinner.js";

export default function Shop({ items }: any) {
  if (!items) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-screen"
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Shop ({items.length} items)</h1>
      <SoundButton />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: any) => (
          <motion.div key={item.id} whileHover={{ scale: 1.05 }}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <p className="text-sm text-gray-600">{item.subtitle || ""}</p>
              </CardHeader>
              {item.imageUrl && (
                <CardContent>
                  <img src={item.imageUrl} alt={item.name} className="w-full" />
                </CardContent>
              )}
              <CardFooter>
                <Button>Buy</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

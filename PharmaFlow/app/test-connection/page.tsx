import { ConnectionTest } from "@/components/ConnectionTest";

export default function TestConnectionPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Test de connexion Frontend-Backend</h1>
      <ConnectionTest />
    </div>
  );
} 
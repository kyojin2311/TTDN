import { Button } from "@/components/ui/button";
import Image from "next/image";
import ThemeSettingsModal from "@/components/ThemeSettingsModal";
import { useAuthContext } from "@/lib/context/AuthContext";

export default function TodoHeader() {
  const { logout } = useAuthContext();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <h1 className="text-3xl font-bold text-foreground">My Todo List</h1>
      </div>
      <div className="flex items-center space-x-4">
        <Button onClick={logout} variant="outline">
          Sign Out
        </Button>
        <ThemeSettingsModal />
      </div>
    </div>
  );
}

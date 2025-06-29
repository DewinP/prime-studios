import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function TestShadcnPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md space-y-6 p-6">
        <h1 className="text-2xl font-bold">shadcn/ui Test Page</h1>
        <Badge variant="default">Badge Example</Badge>
        <Input placeholder="Type something..." />
        <Button>Click Me</Button>
      </Card>
    </div>
  );
}

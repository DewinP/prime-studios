import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function TestShadcnPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="border-border bg-gradient-card shadow-glow w-full max-w-md border">
        <CardHeader>
          <CardTitle className="text-gradient-brand text-2xl font-bold">
            shadcn/ui Test Page
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Badge variant="default">Badge Example</Badge>
          <Input
            placeholder="Type something..."
            className="border-border border"
          />
          <Button>Click Me</Button>
        </CardContent>
      </Card>
    </div>
  );
}

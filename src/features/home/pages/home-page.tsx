import { Link } from "react-router";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export function HomePage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>EcoMetric</CardTitle>
          <CardDescription>
            Carbon accounting platform — sign in to access your workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

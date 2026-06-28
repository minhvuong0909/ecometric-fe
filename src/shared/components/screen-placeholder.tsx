import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import type { FigmaScreen } from "@/shared/constants/figma-screens";
import { figmaFrameUrl, SCREEN_PLACEHOLDER_COPY } from "@/shared/constants/figma-screens";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type ScreenPlaceholderProps = {
  screen: FigmaScreen;
};

export function ScreenPlaceholder({ screen }: ScreenPlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Figma {screen.figmaNodeId}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {screen.title}
        </h1>
        <p className="mt-2 text-muted-foreground">{screen.description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{SCREEN_PLACEHOLDER_COPY.scaffoldTitle}</CardTitle>
          <CardDescription>
            {SCREEN_PLACEHOLDER_COPY.scaffoldDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {screen.nextPath && screen.nextLabel ? (
            <Button asChild className="gap-2">
              <Link to={screen.nextPath}>
                {screen.nextLabel}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
          <Button variant="outline" asChild className="gap-2">
            <a
              href={figmaFrameUrl(screen.figmaNodeId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {SCREEN_PLACEHOLDER_COPY.openFigma}
              <ExternalLink className="size-4" aria-hidden />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { allSquads } from "content-collections";
import Link from "next/link";
import TextPage from "@/components/layouts/text-page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Squads = () => {
  return (
    <TextPage title="Squads" lead>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Fecit oratio boni!
      </p>

      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>

      <div className="not-prose grid grid-cols-1 gap-4 text-black md:grid-cols-2">
        {allSquads.map((squad) => (
          <Link
            key={squad._meta.filePath}
            href={`/about/squads/${squad._meta.fileName.split(".")[0]}`}
            className="group"
          >
            <Card className="transition-colors group-hover:divide-blue-500 group-hover:border-blue-500">
              <CardHeader className="transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <CardTitle>{squad.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="transition-colors group-hover:text-black">
                  {squad.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </TextPage>
  );
};

export default Squads;

import { Plate } from "@/components/iso/react/draw";
import { COURSES, type CourseId, readoutOf } from "./course";
import { courseArt, modelArt } from "./geometry";
import { CourseLive } from "./live";
import { HEIGHT, WIDTH } from "./view";
import "@/components/iso/iso.css";
import "./course-model.css";

const CAPTIONS: Record<CourseId, string> = {
  "350m":
    "Sprint eights start on the move from Lady Island, just above the tight bend, and race 350 m upstream on the straight to the shared finish by the boating jetties. Crews race at about 6 m/s, shown at three times speed.",
  "650m":
    "Every other boat starts stern-on from the stake boats below the bend, rounds the tight left-hander past Lady Island and races 650 m upstream to the finish by the boating jetties. Crews race at about 5.4 m/s, shown at three times speed.",
};

const html = (svg: string) => ({ __html: svg });

// The land, water and buildings, drawn once and shared by every course figure on the page.
export const CourseModelDefs = () => {
  const art = modelArt();

  return (
    <svg
      aria-hidden="true"
      className="iso-svg cm-defs"
      focusable="false"
      height="0"
      width="0"
    >
      <defs>
        <clipPath id="cm-clip">
          <path d={art.clip} />
        </clipPath>
        <g dangerouslySetInnerHTML={html(art.under)} id="cm-under" />
        <g dangerouslySetInnerHTML={html(art.water)} id="cm-water" />
        <g dangerouslySetInnerHTML={html(art.fixtures)} id="cm-fixtures" />
        <g dangerouslySetInnerHTML={html(art.over)} id="cm-over" />
      </defs>
    </svg>
  );
};

export const CourseFigure = ({ id, fig }: { id: CourseId; fig: string }) => {
  const art = courseArt(id);
  const course = COURSES[id];

  return (
    <div className="iso cm" data-theme="light">
      <Plate
        caption={`${CAPTIONS[id]} The river and boats are drawn 1.5 times their true width.`}
        fig={fig}
        hint="Hover the river · ← →"
        keys={[
          { label: `The ${course.id} course`, mark: "edge" },
          { label: `Crews in ${course.boat.name}`, mark: "lit" },
          ...(id === "350m"
            ? [
                {
                  label: "The rest of the 650m course",
                  mark: "dotted" as const,
                },
              ]
            : []),
        ]}
        readout={readoutOf(
          course,
          course.crews.map((crew) => crew.speed),
          0,
        )}
        title={`${course.id} course`}
      >
        <CourseLive id={id} points={art.points}>
          <svg
            aria-label={`A tabletop model of the River Stour from Sudbury Quay to Cornard weir, with the ${course.id} course marked on the water and two crews racing upstream to the finish.`}
            className="iso-svg"
            focusable="false"
            role="img"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          >
            <use href="#cm-under" />
            <g clipPath="url(#cm-clip)">
              <use href="#cm-water" />
              <g dangerouslySetInnerHTML={html(art.lines)} />
              <use href="#cm-fixtures" />
              <g data-boats="" />
            </g>
            <use href="#cm-over" />
          </svg>
        </CourseLive>
      </Plate>
    </div>
  );
};

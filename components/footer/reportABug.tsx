type Props = {
  userAgent: string | null;
  currentPath: string | null;
};

const ReportABug = ({ userAgent, currentPath }: Props) => (
  <a
    href={`/contact?to=5b54081d-46f0-485b-83c2-691e086fdf19&message=User-Agent: ${userAgent}. Path: ${currentPath}. Please describe the bug below:`}
    className="transition hover:text-black"
  >
    Report a bug.
  </a>
);

export default ReportABug;

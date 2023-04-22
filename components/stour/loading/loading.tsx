import styles from "./loading.module.css";

type LoadingProps = {
  className?: string;
  children?: React.ReactNode;
  visible?: boolean;
};

const Dot = () => (
  <i
    className={`inline-block w-1 h-1 mx-0.5 bg-gray-600 rounded-full ${styles.dots}`}
  />
);

const Loading = ({ className, children, visible = true }: LoadingProps) => (
  <div
    className={`w-full h-full min-w-[48px] inline-flex items-center relative text-base min-h-[1em] ${className}`}
  >
    <div className={`${visible ? "hidden" : "visible"} w-full`}>{children}</div>
    <span
      className={`absolute flex items-center content-center justify-center visible w-full h-full -translate-x-1/2 
        -translate-y-1/2 bg-transparent select-none top-1/2 left-1/2
        ${visible ? " visible" : " hidden"}`}
    >
      <Dot />
      <Dot />
      <Dot />
    </span>
  </div>
);

export default Loading;

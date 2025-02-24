import { type VariantProps, cva } from "class-variance-authority";
import Container from "../../layouts/container";
import Breadcrumbs from "../breadcrumbs";

interface BaseProps {
  title: string;
  children?: React.ReactNode;
  breadcrumbs?: boolean;
  /** @deprecated */
  transparent?: boolean;
}

const ROOT_LABEL = "Home";

const headingVariants = cva("text-4xl sm:text-5xl md:text-6xl", {
  variants: {
    color: {
      blue: "font-bold",
      gray: "font-semibold",
      transparent: "font-semibold",
    },
    prose: {
      true: "mx-auto max-w-prose text-center",
    },
  },
});

const heroVariants = cva(
  "relative flex h-24 flex-wrap content-center sm:h-36 md:h-48",
  {
    variants: {
      color: {
        blue: "bg-blue-950 text-blue-50",
        gray: "bg-gray-900 text-gray-50",
        transparent: "bg-transparent text-gray-900",
      },
    },
  },
);

const HeroTitleSubcomponent = ({
  color,
  title,
  children,
  prose,
}: BaseProps & VariantProps<typeof headingVariants>) => (
  <div className={heroVariants({ color })}>
    <Container>
      <div className={headingVariants({ color, prose })}>
        <h1>{title}</h1>
        {children}
      </div>
    </Container>
  </div>
);

const breadcrumbContainerVariants = cva("py-2", {
  variants: {
    color: {
      blue: "bg-blue-50",
      gray: "border-b bg-gray-100",
      transparent: "bg-gray-50",
    },
    prose: { true: "", false: "" },
  },
  compoundVariants: [
    {
      color: "transparent",
      prose: true,
      className:
        "mx-auto w-fit max-w-[calc(100%-2rem)] rounded-full border px-4",
    },
    {
      color: "transparent",
      prose: false,
      className: "border-y",
    },
  ],
});

const breadcrumbListVariants = cva("flex flex-wrap text-sm", {
  variants: { prose: { true: "mx-auto justify-center" } },
});

const breadcrumbInactiveItemVariants = cva(
  "whitespace-nowrap capitalize transition after:px-2 after:text-gray-400 after:content-['→']",
  {
    variants: {
      color: {
        blue: "text-blue-500 hover:text-blue-300",
        gray: "text-gray-500 hover:text-gray-300",
        transparent:
          "text-gray-800 transition hover:text-blue-500 hover:text-gray-600",
      },
      prose: { true: "", false: "" },
    },
    compoundVariants: [
      {
        color: "transparent",
        prose: true,
        className: "mx-auto",
      },
    ],
  },
);

const HeroBreadcrumbs = ({
  prose,
  color,
  title,
}: Pick<BaseProps, "title"> &
  VariantProps<typeof breadcrumbContainerVariants>) => (
  <div className={breadcrumbContainerVariants({ color, prose })}>
    <Container>
      <Breadcrumbs
        listClassName={breadcrumbListVariants({ prose })}
        rootLabel={ROOT_LABEL}
        inactiveItemClassName={breadcrumbInactiveItemVariants({ color })}
        activeItemClassName="whitespace-nowrap font-medium capitalize"
        currentLabel={title}
      />
    </Container>
  </div>
);

const HeroTitle = ({
  title,
  children,
  prose = false,
  breadcrumbs = false,
  color = "blue",
  transparent = false,
}: BaseProps & VariantProps<typeof headingVariants>) => {
  // For back compatibility with the old `transparent` prop
  color = transparent ? "transparent" : color;

  return (
    <>
      <HeroTitleSubcomponent {...{ color, title, children, prose }} />
      {breadcrumbs && <HeroBreadcrumbs {...{ color, title, prose }} />}
    </>
  );
};

export default HeroTitle;

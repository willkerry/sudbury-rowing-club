import { Component } from "react";

class RegattaIcon extends Component<
  JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
> {
  props;

  paths;

  constructor(
    props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
    paths: React.ReactElement
  ) {
    super(props);
    this.props = props;
    this.paths = paths;
  }

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="none"
        strokeLinejoin="round"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        {...this.props}
      >
        {this.paths}
      </svg>
    );
  }
}
export default RegattaIcon;

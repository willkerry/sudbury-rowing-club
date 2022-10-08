/* eslint-disable no-use-before-define */
export interface EAWarning {
  "@id": string;
  description: string;
  eaAreaName: string;
  eaRegionName: string;
  floodArea: FloodArea;
  floodAreaID: string;
  isTidal: boolean;
  message?: string;
  severity:
    | "Severe Flood Warning"
    | "Flood Warning"
    | "Flood Alert"
    | "Warning no Longer in Force";
  severityLevel: 1 | 2 | 3 | 4;
  timeMessageChanged: Date;
  timeRaised: Date;
  timeSeverityChanged: Date;
}

export interface FloodArea {
  "@id": string;
  county: string;
  envelope: Envelope;
  notation: string;
  polygon: URL;
  riverOrSea?: string;
}

export interface Envelope {
  lowerCorner: LowerCorner;
  upperCorner: UpperCorner;
}

export interface LowerCorner {
  lx: number;
  ly: number;
}

export interface UpperCorner {
  ux: number;
  uy: number;
}

import * as d3 from "d3";
import { colorInterpolates } from "./d3ColorSchemes"


interface LegendSettings {
  /**
   * Color bar settings.
   * Default: {minVal: -1, maxVal: 1, colorFun: colorInterpolates["Viridis"]}
   */
  colorBar: {
    minVal: number,
    maxVal: number,
    colorFun: (t: number) => string,
  }
  /**
   * Title of the legend.
   * Default: "Intensity"
   */
  title: string,
  /**
   * Background color of the legend. (SVG attribute colors '#rrggbbaa')
   * Default: "#00000088"
   */
  backgroundColor: string,
}


/**
 * Create a canvas element with a color gradient based on a D3 scale.
 */
function ramp(
  color: d3.ScaleSequential<string, never>,
  n = 256,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = n;
  canvas.height = 1;
  const context = canvas.getContext("2d");
  if (!context) {
    return canvas;
  }
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(i, 0, 1, 1);
  }
  return canvas;
}

/**
 * HTML legend for use with the Brain Viewer.
 */
export class Legend {
  private elem: HTMLElement;

  private color = d3.scaleSequential([-1, 1], colorInterpolates["Viridis"]);
  private tickSize = 16;
  private width = 320;
  private height = 44 + this.tickSize;

  private marginTop = 18;
  private marginBottom = 16 + this.tickSize;
  private marginLeft = 0;
  private marginRight = 0;
  //private ticks = this.width / 64;
  //private tickFormat = undefined;
  //private tickValues = undefined;
  private title: string = "Intensity";

  private backgroundColor: string = "#00000088";

  /**
   * Create a new legend.
   * Call `update(...)` to initialize or update the DOM after.
   * 
   * @param elem DOM element to attach legend to.
   */
  constructor(elem: HTMLElement, settings?: Partial<LegendSettings>) {
    this.elem = elem;
    if (settings) {
      this.update(settings);
    }
  }

  private init() {
    // create legend
    this.elem.innerHTML = "";
    const svgElem = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.elem.appendChild(svgElem);

    const svg = d3
      .select(svgElem)
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("viewBox", [0, 0, this.width, this.height])
      .style("overflow", "visible")
      .style("display", "block");

    const tickAdjust = (
      g: d3.Selection<SVGGElement, undefined, null, undefined>,
    ) =>
      g
        .selectAll(".tick line")
        .attr("y1", this.marginTop + this.marginBottom - this.height);

    const n = Math.min(this.color.domain().length, this.color.range().length);

    const x = this.color
      .copy()
      .rangeRound(
        d3.quantize(
          d3.interpolate(this.marginLeft, this.width - this.marginRight),
          n,
        ),
      );

    // legend background rectangle
    svg
      .append("rect")
      .attr("x", -12)
      .attr("y", 0)
      .attr("width", this.width + 24)
      .attr("height", this.height)
      .attr("fill", this.backgroundColor);

    // color bar
    svg
      .append("image")
      .attr("x", this.marginLeft)
      .attr("y", this.marginTop)
      .attr("width", this.width - this.marginLeft - this.marginRight)
      .attr("height", this.height - this.marginTop - this.marginBottom)
      .attr("preserveAspectRatio", "none")
      .attr(
        "xlink:href",
        ramp(
          this.color.copy().domain(d3.quantize(d3.interpolate(0, 1), n)),
        ).toDataURL(),
      );

    // ticks
    svg
      .append("g")
      .attr("transform", `translate(0,${this.height - this.marginBottom})`)
      .call(
        d3
          .axisBottom(x as unknown as d3.AxisScale<d3.AxisDomain>)
          //.ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
          //.tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
          .tickSize(this.tickSize),
        //.tickValues([1, 2, 3])
      )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(tickAdjust as any)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .append("text")
          .attr("x", this.marginLeft)
          .attr("y", this.marginTop + this.marginBottom - this.height - 6)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text(this.title),
      );
  }

  /**
   * Remove legend from DOM.
   */
  public dispose() {
    this.elem.innerHTML = "";
  }

  /**
   * Apply settings to legend.
   *
   * @param settings Legend settings.
   */
  private applySettings(settings: Partial<LegendSettings>): void {
    this.title = settings?.title ?? this.title;
    this.backgroundColor = settings?.backgroundColor ?? this.backgroundColor;
    if (settings.colorBar) {
      this.color = d3.scaleSequential(
        [settings.colorBar.minVal, settings.colorBar.maxVal],
        settings.colorBar.colorFun
      );
    }
  }

  /**
   * Update legend with new settings.
   * 
   * @param settings Legend settings.
   */
  public update(
    settings: Partial<LegendSettings>,
  ) {
    this.applySettings(settings);
    this.init();
  }
}

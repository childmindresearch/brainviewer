import * as d3 from "d3";


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

  public color = d3.scaleSequential([20, 25], d3.interpolateViridis);
  public tickSize = 16;
  public width = 320;
  public height = 44 + this.tickSize;

  public marginTop = 18;
  public marginBottom = 16 + this.tickSize;
  public marginLeft = 0;
  public marginRight = 0;
  public ticks = this.width / 64;
  public tickFormat = undefined;
  public tickValues = undefined;
  public title: string = "Intensity";

  /**
   * Create a new legend.
   * Call `update(...)` to initialize or update the DOM after.
   * 
   * @param elem DOM element to attach legend to.
   */
  constructor(elem: HTMLElement) {
    this.elem = elem;
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
      .attr("fill", "#00000088");

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
   * Update legend with new color scale.
   * 
   * @param minVal Scale minimum.
   * @param maxVal Scale maximum.
   * @param colorFun Color scale. Can be `colorInterpolates[name]`.
   * @param title Legend title.
   */
  public update(
    minVal: number,
    maxVal: number,
    colorFun: (t: number) => string,
    title: string = "Intensity",
  ) {
    this.title = title;
    this.color = d3.scaleSequential([minVal, maxVal], colorFun);
    this.init();
  }
}

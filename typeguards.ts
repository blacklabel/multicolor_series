import { Series } from "highcharts";
import { SeriesColored } from "types";

export const isSeriesColored = (
    series: Series | SeriesColored,
    type: "coloredline" | "coloredarea"
): series is SeriesColored => true;

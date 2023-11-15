/* *
 *
 *  Imports
 *
 * */

import type ColorType from 'highcharts/ts/Core/Color/ColorType';
import type DataLabelOptions from 'highcharts/ts/Core/Series/DataLabelOptions';
import type SeriesOptions from 'highcharts/ts/Core/Series/SeriesOptions';
import type { SeriesStateHoverOptions, SeriesStateInactiveOptions, SeriesStateNormalOptions, SeriesStateSelectOptions } from 'highcharts/ts/Core/Series/SeriesOptions';
import type AnimationOptions from 'highcharts/ts/Core/Animation/AnimationOptions';
import type StatesOptions, { StateGenericOptions } from 'highcharts/ts/Core/Series/StatesOptions';

/* *
 *
 *  Declarations
 *
 * */

interface SeriesStatesOptions extends StatesOptions {
    hover?: SeriesStateHoverOptions&StateGenericOptions;
    inactive?: SeriesStateInactiveOptions&StateGenericOptions;
    normal?: SeriesStateNormalOptions&StateGenericOptions;
    select?: SeriesStateSelectOptions&StateGenericOptions;
}

interface ColoredlineSeriesOptions extends SeriesOptions {
    allAreas?: boolean;
    animation?: (boolean|DeepPartial<AnimationOptions>);
    animationLimit?: number;
    boostThreshold?: number;
    borderColor?: ColorType;
    borderWidth?: number;
    colorAxis?: boolean;
    connectEnds?: boolean;
    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);
    description?: string;
    linkedTo?: string;
    pointDescriptionFormatter?: Function;
    pointStart?: number;
    skipKeyboardNavigation?: boolean;
    states?: SeriesStatesOptions;
    supportingColor?: ColorType;
}

/* *
 *
 *  Default Export
 *
 * */

export default ColoredlineSeriesOptions;

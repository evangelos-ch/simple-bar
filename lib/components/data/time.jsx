import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import * as Utils from "../../utils";
import * as Settings from "../../settings";

export { timeStyles as styles } from "../../styles/components/data/time";

const settings = Settings.get();
const { widgets, timeWidgetOptions } = settings;
const { timeWidget } = widgets;
const { refreshFrequency, hour12, dayProgress, showSeconds } = timeWidgetOptions;

const DEFAULT_REFRESH_FREQUENCY = 1000;
const REFRESH_FREQUENCY = Settings.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY);

const openClock = (e) => {
    Utils.clickEffect(e);
    const appName = "Clock";
    Uebersicht.run(`open -a "${appName}"`);
};

export const Widget = () => {
    const [state, setState] = Uebersicht.React.useState();
    const [loading, setLoading] = Uebersicht.React.useState(timeWidget);

    const options = {
        hour: "numeric",
        minute: "numeric",
        second: showSeconds ? "numeric" : undefined,
        hour12,
    };

    const getTime = () => {
        const time = new Date().toLocaleString("en-UK", options);
        setState({ time });
        setLoading(false);
    };

    useWidgetRefresh(timeWidget, getTime, REFRESH_FREQUENCY);

    if (loading) return <DataWidgetLoader.Widget className="time" />;
    if (!state) return null;
    const { time } = state;

    const [dayStart, dayEnd] = [new Date(), new Date()];
    dayStart.setHours(0, 0, 0);
    dayEnd.setHours(0, 0, 0);
    dayEnd.setDate(dayEnd.getDate() + 1);
    const range = dayEnd - dayStart;
    const diff = Math.max(0, dayEnd - new Date());
    const fillerWidth = (100 - (100 * diff) / range) / 100;

    return (
        <DataWidget.Widget classes="time" Icon={Icons.Clock} onClick={openClock} disableSlider>
            {time}
            {dayProgress && <div className="time__filler" style={{ transform: `scaleX(${fillerWidth})` }} />}
        </DataWidget.Widget>
    );
};

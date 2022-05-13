import { Fragment, useEffect, useState } from 'react';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';

import _ from 'lodash';
import { differenceInMinutes, startOfDay } from 'date-fns';
import { Tooltip, Typography } from '@material-ui/core';
import { Schedule, ScheduleItem } from '_models/Schedule';
import { DataDialogAction, DataDialogState, RowDataType } from 'main/DataTableBase';

type Point = {
  x: number;
  y: number;
};

type BoxStyle = {
  width: number;
  halfWidth: number;
  scale: number;
  transform: Point;
};

type BoxData = {
  x: number;
  width: number;
  className: string;
};

// 8-20
const shortStyle: BoxStyle = {
  width: 120,
  halfWidth: 60,
  scale: 2,
  transform: { x: -960, y: 0 },
};
// 0-24
const longStyle: BoxStyle = {
  width: 60,
  halfWidth: 30,
  scale: 1,
  transform: { x: 0, y: 0 },
};

const viewWidth = 60 * 24;
const viewHeight = 70;
const viewWidthMargin = 1; // lineの一番両端が身切れして他のlineより細くなる現象を避けるため
const viewWidthWrap = viewWidth + viewWidthMargin * 2;
const viewBox = `0 0 ${viewWidthWrap} ${viewHeight}`;
const fontHeight = 30;
const fontMargin = 5;

const timeToPoint = (zero: Date, time: Date, boxStyle: BoxStyle) => {
  // // 前日の予約があってもオフセット計算で当日に表示しないようにする。
  // const todayZero = startOfDay(new Date());
  // const offset differenceInMinutes(zero, todayZero);
  const offset = 0;
  return (differenceInMinutes(time, zero) + offset) * boxStyle.scale;
};

const pointToTime = (point: number, boxStyle: BoxStyle) => {
  const offset = 0;
  return ((point + offset) / boxStyle.scale) * 60 * 1000;
  // const timestamp = startOfDay(new Date()).getTime() + minutes * 60 * 1000;
  // return new Date(timestamp);
};

const getBoxData = (item: ScheduleItem, boxStyle: BoxStyle): BoxData => {
  const start = new Date(item.start);
  const end = new Date(item.end);
  const startDay = startOfDay(start);
  const endDay = startOfDay(end);
  const x = timeToPoint(startDay, start, boxStyle);
  return {
    x: x,
    width: timeToPoint(endDay, end, boxStyle) - x,
    className: item.status,
  };
};

const calcX = (hour: number, width: number) => (hour + 1) * width + viewWidthMargin;

const createTransform = (boxStyle: BoxStyle) => {
  return `translate(${boxStyle.transform.x},${boxStyle.transform.y})`;
};

const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${theme.palette.grey[300]}`,
  },
}))(Tooltip);

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '5vmin',
      '& svg': {
        fontSize: '1.5rem',
        '& line': {
          strokeWidth: 2,
        },
        '& line.hour-line': {
          stroke: theme.palette.grey[400],
        },
        '& line.hour-half-line': {
          stroke: theme.palette.grey[300],
        },
        '& text': {
          fill: theme.palette.grey[400],
        },
        '& text.subject': {
          fill: '#fff',
          fontSize: '1.2rem',
          dominantBaseline: 'central',
          cursor: 'pointer',
        },
        '& rect': {
          strokeWidth: 1,
          fillOpacity: 0.5,
        },
        '& rect.new-event-bar': {
          fillOpacity: 0,
        },
        '& rect.event': {
          stroke: theme.palette.success.main,
          fill: theme.palette.success.light,
          fillOpacity: 0.9,
          cursor: 'pointer',
        },
        '& rect.wait': {
          stroke: theme.palette.warning.light,
          fill: theme.palette.warning.main,
        },
        '& rect.busy': {
          stroke: theme.palette.error.light,
          fill: theme.palette.error.main,
        },
      },
    },
    title: {
      // color: theme.palette.grey[500],
    },
  })
);

type TimeBarProps = {
  // rangesw: BoxStyle;
  currentDate: Date;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
  schedule: Schedule;
  events: RowDataType[];
  onClickCallback: (rowData: RowDataType) => void;
};

export function TimeBar(props: TimeBarProps) {
  const { currentDate, dataDialogHook, schedule, events, onClickCallback } = props;
  const classes = useStyles();

  const [boxStyle, setBoxStyle] = useState(shortStyle);
  const [transform, setTransform] = useState(createTransform(boxStyle));

  // useEffect(() => {
  //   setBoxStyle(rangesw ? longStyle : shortStyle);
  // }, [rangesw]);

  useEffect(() => {
    setTransform(createTransform(boxStyle));
  }, [boxStyle, events]);

  const hRatio = 1;
  const rectY = fontHeight + (viewHeight - fontHeight) * (1 - hRatio) + 1;
  const rectHeight = (viewHeight - fontHeight) * hRatio - 1;

  // スケジュール枠の作成
  const createScheduleBox = (item: ScheduleItem, index: number) => {
    const boxData = getBoxData(item, boxStyle);
    return (
      <rect
        key={`${schedule.roomEmail}-sc-${index}`}
        className={boxData.className}
        x={boxData.x}
        y={rectY}
        width={boxData.width}
        height={rectHeight}
        rx={3}
        ry={5}
      ></rect>
    );
  };

  // イベント枠の作成 (textのoverflow:hiddenっぽくするためにsvgの入れ子で作成)
  const createEventBox = (event: RowDataType, index: number) => {
    const item: ScheduleItem = { status: 'event', start: event.startDateTime, end: event.endDateTime };
    const boxData = getBoxData(item, boxStyle);
    const x = boxData.x;
    const y = rectY;
    const width = boxData.width;
    const height = rectHeight;
    return (
      <HtmlTooltip
        key={`${schedule.roomEmail}-ev-${index}`}
        title={
          <>
            <Typography variant="body2">{event.subject}</Typography>
            <em>{event.apptTime}</em> <b>{event.reservationName}</b>
          </>
        }
        onClick={() => {
          onClickCallback(event);
        }}
      >
        <svg x={x} y={y} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <g>
            <rect className={boxData.className} x={0} y={0} width={width} height={height} rx={3} ry={5}></rect>
            <text className="subject" x={3} y={'50%'}>
              {event.subject}
            </text>
          </g>
        </svg>
      </HtmlTooltip>
    );
  };

  // 新規作成ボタン(開始時間の指定あり)
  const handleCreateClick = (event: React.MouseEvent<SVGRectElement, MouseEvent>, roomId: string) => {
    const svg: SVGSVGElement | null = event.currentTarget.closest('svg');
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const svgP = pt.matrixTransform(ctm.inverse());
    const rectX = svgP.x - boxStyle.transform.x + viewWidthMargin;
    const time = pointToTime(rectX, boxStyle);
    const start = new Date(startOfDay(currentDate).getTime() + time);

    dataDialogHook.dispatch({ type: 'addDataOpen', addDefault: { start: start, roomId: roomId } });
  };

  return (
    <>
      <Typography className={classes.title}>{schedule.roomName}</Typography>
      <div className={classes.container}>
        <svg viewBox={viewBox} preserveAspectRatio="none">
          <g transform={transform}>
            <line className="hour-line" x1={0} y1={0} x2={0} y2={viewHeight}></line>
            <line className="hour-half-line" x1={boxStyle.halfWidth} y1={fontHeight} x2={boxStyle.halfWidth} y2={viewHeight}></line>
            {_.range(0, 24).map(($) => {
              const x = calcX($, boxStyle.width);
              const minX = x + boxStyle.halfWidth;
              const fontX = $ * boxStyle.width + fontMargin;
              return (
                <Fragment key={`fragment-${$}`}>
                  <line key={`hour-line-${$}`} className="hour-line" x1={x} y1={0} x2={x} y2={viewHeight}></line>
                  <line key={`hour-half-line-${$}`} className="hour-half-line" x1={minX} y1={fontHeight} x2={minX} y2={viewHeight}></line>
                  <text key={`hour-text-${$}`} x={fontX} y={fontHeight - 5}>
                    {$}
                  </text>
                </Fragment>
              );
            })}
            <rect
              className="new-event-bar"
              x={0}
              y={rectY}
              width={calcX(24, boxStyle.width)}
              height={rectHeight}
              onClick={(e) => handleCreateClick(e, schedule.roomId)}
            ></rect>
            {schedule.scheduleItems.map((item, index) => createScheduleBox(item, index))}
            {events.map((event, index) => createEventBox(event, index))}
          </g>
        </svg>
      </div>
    </>
  );
}

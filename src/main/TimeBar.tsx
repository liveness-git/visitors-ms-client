import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Tooltip, Typography, Button } from '@material-ui/core';
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles';

import { differenceInMinutes, endOfDay, isAfter, isBefore, isSameDay, startOfDay } from 'date-fns';
import _ from 'lodash';
import clsx from 'clsx';

import { Schedule, ScheduleItem } from '_models/Schedule';
import { UsageRangeForVisitor } from '_models/Room';
import { LroomsType } from '_models/Lrooms';

import { DataDialogAction, DataDialogState, RowDataType } from 'main/DataTableBase';

type Point = {
  x: number;
  y: number;
};

export type BoxStyleType = 'short' | 'long';

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
const fontHeight = 30;
const fontMargin = 5;

const timeToPoint = (time: Date, boxStyle: BoxStyle) => {
  const zero = startOfDay(time);
  return differenceInMinutes(time, zero) * boxStyle.scale;
};

const pointToTime = (point: number, boxStyle: BoxStyle) => {
  const offset = 0;
  return ((point + offset) / boxStyle.scale) * 60 * 1000;
};

const getBoxData = (item: ScheduleItem, boxStyle: BoxStyle, currentDate: Date): BoxData => {
  const start = new Date(item.start);
  const end = new Date(item.end);
  let x = timeToPoint(start, boxStyle);
  let x2 = timeToPoint(end, boxStyle);
  // 日を跨ぐ場合
  if (!isSameDay(start, end)) {
    const startOfCurrent = startOfDay(currentDate);
    const endOfCurrent = endOfDay(currentDate);
    // 翌日に続く
    if (isBefore(endOfCurrent, end)) {
      x2 = timeToPoint(endOfCurrent, boxStyle);
    }
    // 前日から続いている
    if (isAfter(startOfCurrent, start)) {
      x = timeToPoint(startOfCurrent, boxStyle);
    }
  }
  return {
    x: x,
    width: x2 - x,
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
      marginBottom: '0.5rem',
      // height: '5vmin',
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
        '& rect.myOwn': {
          stroke: theme.palette.info.main,
          fill: theme.palette.info.light,
        },
        '& rect.myOwnPending': {
          stroke: theme.palette.info.main,
          fill: theme.palette.info.light,
          strokeWidth: 10,
          strokeDasharray: 5,
          strokeOpacity: 0.8,
        },
        '& rect.wait': {
          stroke: theme.palette.warning.light,
          fill: theme.palette.warning.main,
        },
        '& rect.busy': {
          stroke: theme.palette.error.light,
          fill: theme.palette.error.main,
        },
        '& rect.lrooms': {
          cursor: 'pointer',
          fillOpacity: 0.1,
        },
      },
    },
    title: {
      // color: theme.palette.grey[500],
      fontSize: '1rem',
      paddingBottom: 0,
    },
  })
);

type TimeBarProps = {
  rangeToggle: BoxStyleType;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
  schedule: Schedule;
  events: RowDataType[][];
  lrooms: LroomsType[][];
  onClickCallback: (rowData: RowDataType) => void;
  keyLabel: string; //schedule.roomName
  keyValue: string; //schedule.roomEmail
  onTitleClick: (timestamp: number, categoryId: string, roomId: string) => void;
};

export function TimeBar(props: TimeBarProps) {
  const { rangeToggle, dataDialogHook, schedule, events, lrooms, onClickCallback, keyLabel, keyValue, onTitleClick } = props;
  const classes = useStyles();

  const [boxStyle, setBoxStyle] = useState(shortStyle);
  const [transform, setTransform] = useState(createTransform(boxStyle));

  useEffect(() => {
    setBoxStyle(rangeToggle === 'short' ? shortStyle : longStyle);
  }, [rangeToggle]);

  useEffect(() => {
    setTransform(createTransform(boxStyle));
  }, [boxStyle, events]);

  const hRatio = 1;
  const rectY = fontHeight + (viewHeight - fontHeight) * (1 - hRatio) + 1;
  const rectHeight = (viewHeight - fontHeight) * hRatio - 1;
  const viewHeightDup = schedule.type === 'free' ? viewHeight + rectHeight * (schedule.scheduleItems.length - 1) + rectHeight : viewHeight;

  // スケジュール枠の作成
  const createScheduleBox = useCallback(
    (item: ScheduleItem, index: number, timestamp: number, rowIndex: number) => {
      const boxData = getBoxData(item, boxStyle, new Date(timestamp));
      return (
        <rect
          key={`${keyValue}-sc-${index}`}
          className={boxData.className}
          x={boxData.x}
          y={rectY + rectHeight * rowIndex}
          width={boxData.width}
          height={rectHeight}
          rx={3}
          ry={5}
        ></rect>
      );
    },
    [boxStyle, keyValue, rectY, rectHeight]
  );

  // イベント枠の作成 (textのoverflow:hiddenっぽくするためにsvgの入れ子で作成)
  const createEventBox = useCallback(
    (event: RowDataType, index: number, timestamp: number, rowIndex: number) => {
      const item: ScheduleItem = { status: 'event', start: event.startDateTime, end: event.endDateTime + event.cleaningTime };
      const boxData = getBoxData(item, boxStyle, new Date(timestamp));
      const x = boxData.x;
      const y = rectY + rectHeight * rowIndex;
      const width = boxData.width;
      const height = rectHeight;
      const myEvent = event.isAttendees ? `myOwn${event.roomStatus !== 'accepted' ? 'Pending' : ''}` : '';
      return (
        <HtmlTooltip
          key={`${keyValue}-ev-${index}`}
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
              <rect className={clsx(boxData.className, myEvent)} x={0} y={0} width={width} height={height} rx={3} ry={5}></rect>
              <text className="subject" x={3} y={'50%'}>
                {event.subject}
              </text>
            </g>
          </svg>
        </HtmlTooltip>
      );
    },
    [boxStyle, rectY, rectHeight, keyValue, onClickCallback]
  );

  // LivnessRooms枠の作成 (textのoverflow:hiddenっぽくするためにsvgの入れ子で作成)
  const createLroomsBox = useCallback(
    (event: LroomsType, index: number, timestamp: number, rowIndex: number) => {
      const item: ScheduleItem = { status: 'busy', start: event.startDateTime, end: event.endDateTime };
      const boxData = getBoxData(item, boxStyle, new Date(timestamp));
      const x = boxData.x;
      const y = rectY + rectHeight * rowIndex;
      const width = boxData.width;
      const height = rectHeight;
      return (
        <HtmlTooltip
          key={`${keyValue}-ev-${index}`}
          title={
            <>
              <Typography variant="body2">{event.subject}</Typography>
              <em>{event.apptTime}</em> <b>{event.reservationName}</b>
            </>
          }
        >
          <svg x={x} y={y} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <g>
              <rect className={clsx(boxData.className, 'lrooms')} x={0} y={0} width={width} height={height} rx={3} ry={5}></rect>
              <text className="subject" x={3} y={'50%'}>
                {event.subject}
              </text>
            </g>
          </svg>
        </HtmlTooltip>
      );
    },
    [boxStyle, rectY, rectHeight, keyValue]
  );

  // 新規作成ボタン(開始時間の指定あり)
  const handleCreateClick = (
    event: React.MouseEvent<SVGRectElement, MouseEvent>,
    timestamp: number,
    roomId: string,
    usageRange: UsageRangeForVisitor
  ) => {
    const svg: SVGSVGElement | null = event.currentTarget.closest('svg');
    if (!svg) return;

    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;

    const svgP = pt.matrixTransform(ctm.inverse());
    const rectX = svgP.x - boxStyle.transform.x + viewWidthMargin;
    const $time = pointToTime(rectX, boxStyle);
    const time = Math.floor($time / 1000 / 60 / 30) * 1000 * 60 * 30; //TODO: Interval config化？
    const start = new Date(startOfDay(timestamp).getTime() + time);

    dataDialogHook.dispatch({ type: 'addDataOpen', addDefault: { start: start, roomId: roomId, usageRange: usageRange } });
  };

  // スケジュール枠の表示（不要レンダリングが起きるためメモ化）
  const rectSchedules = useMemo(() => {
    return <>{schedule.scheduleItems.map((row, rowIndex) => row.map((item, index) => createScheduleBox(item, index, schedule.date, rowIndex)))}</>;
  }, [createScheduleBox, schedule]);

  // イベント枠の表示（不要レンダリングが起きるためメモ化）
  const rectEvents = useMemo(() => {
    return <>{events.map((row, rowIndex) => row.map((event, index) => createEventBox(event, index, schedule.date, rowIndex)))}</>;
  }, [createEventBox, events, schedule]);

  // LivnessRooms枠の表示（不要レンダリングが起きるためメモ化）
  const rectLrooms = useMemo(() => {
    return <>{lrooms.map((row, rowIndex) => row.map((event, index) => createLroomsBox(event, index, schedule.date, rowIndex)))}</>;
  }, [createLroomsBox, lrooms, schedule]);

  return (
    <>
      {/* <Typography className={classes.title}>{keyLabel}</Typography> */}
      <Button
        color="secondary"
        className={classes.title}
        size="small"
        onClick={() => onTitleClick(schedule.date, schedule.categoryId, schedule.roomId)}
      >
        {keyLabel}
      </Button>
      <div className={classes.container}>
        <svg viewBox={`0 0 ${viewWidthWrap} ${viewHeightDup}`} preserveAspectRatio="none">
          <g transform={transform}>
            <line className="hour-line" x1={0} y1={0} x2={0} y2={viewHeightDup}></line>
            <line className="hour-half-line" x1={boxStyle.halfWidth} y1={fontHeight} x2={boxStyle.halfWidth} y2={viewHeightDup}></line>
            {_.range(0, 24).map(($) => {
              const x = calcX($, boxStyle.width);
              const minX = x + boxStyle.halfWidth;
              const fontX = $ * boxStyle.width + fontMargin;
              return (
                <Fragment key={`fragment-${$}`}>
                  <line key={`hour-line-${$}`} className="hour-line" x1={x} y1={0} x2={x} y2={viewHeightDup}></line>
                  <line key={`hour-half-line-${$}`} className="hour-half-line" x1={minX} y1={fontHeight} x2={minX} y2={viewHeightDup}></line>
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
              height={viewHeightDup - rectY}
              onClick={(e) => handleCreateClick(e, schedule.date, schedule.roomId, schedule.usageRange)}
            ></rect>
            {rectSchedules}
            {rectEvents}
            {rectLrooms}
          </g>
        </svg>
      </div>
    </>
  );
}

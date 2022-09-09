import { makeStyles } from '@material-ui/core';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import i18next from 'i18next';
import clsx from 'clsx';
import { FrontRowData } from 'main/front/DataTable';
import { RowDataType } from 'main/DataTableBase';

export const frontCellPadding = '12px 6px';

export const makeVisitorTableStyles = (isFront: boolean) => {
  const cellPadding = isFront ? frontCellPadding : '';
  return makeStyles(() => ({
    cellApptTime: {
      padding: cellPadding,
    },
    cellRoomName: {
      padding: cellPadding,
    },
    cellTeaSupply: {
      padding: cellPadding,
    },
    cellRoomStatus: {
      padding: cellPadding,
    },
    cellReservationName: {
      padding: cellPadding,
    },
    cellVisitCompany: {
      padding: cellPadding,
    },
    cellVisitorName: {
      padding: cellPadding,
    },
    cellSubject: {
      padding: cellPadding,
    },
    cellContactAddr: {
      padding: cellPadding,
    },
    cellCheckIn: {
      padding: cellPadding,
      // textAlign: 'center',
      overflowWrap: 'break-word',
    },
    cellCheckOut: {
      padding: cellPadding,
      // textAlign: 'center',
      overflowWrap: 'break-word',
    },
    cellComment: {
      padding: cellPadding,
    },
    // 会議室状態が辞退の場合
    declinedApptTime: { textDecoration: 'line-through 2px solid red' },
    declinedRoomName: {
      '&::after': {
        wordBreak: 'keep-all',
        marginLeft: 5,
        padding: '1px 5px',
        color: 'red',
        border: '1px solid red',
        content: `"${i18next.t('visitdialog.view.resource-status-declined')}"`,
      },
    },
  }));
};

export const cellStyle = (field: String, rowData: RowDataType | FrontRowData, classes: ClassNameMap<string>) => {
  const className = field.charAt(0).toUpperCase() + field.slice(1);
  return clsx(
    classes[`cell${className}` as keyof ClassNameMap],
    rowData.roomStatus === 'declined' && classes[`declined${className}` as keyof ClassNameMap]
  );
};

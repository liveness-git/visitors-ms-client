import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MaterialTable, { Column, MTableCell } from '@material-table/core';

import BorderColorIcon from '@material-ui/icons/BorderColor';

import { pageingOntions, tableIcons } from '_utils/MaterialTableIcons';
import { useLoadData } from '_utils/useLoadData';
import { UseDataTable } from '_utils/UseDataTable';

import { DataDialogAction, DataDialogState, DataTableBase, RowDataType } from '../DataTableBase';
import { RowDataFrontDialog } from './RowDataFrontDialog';

import { LocationParams } from '_models/Location';
import { VisitorInfoFront } from '_models/VisitorInfo';
import { cellStyle, makeVisitorTableStyles, frontCellPadding } from '_styles/VisitorTableStyle';
import { tableTheme } from '_styles/TableTheme';

const useStyles = makeVisitorTableStyles(true);

export type Columns = {
  title: string;
  field: string;
  width?: string;
  cellStyle?: object | void;
  render?: (rowData: FrontRowData) => any;
};

export type FrontRowData = RowDataType & VisitorInfoFront;

type DataTableProps = {
  currentDate: Date;
  dataDialogHook: {
    state: DataDialogState;
    dispatch: React.Dispatch<DataDialogAction>;
  };
};

export function DataTable(props: DataTableProps) {
  const { currentDate, dataDialogHook } = props;

  const { t } = useTranslation();
  const classes = useStyles();
  const match = useRouteMatch<LocationParams>();

  // データ取得
  const [{ data, isLoading, isError }, reload, setUrl] = useLoadData<FrontRowData[]>('', []);
  useEffect(() => {
    setUrl(`/front/visitlist?timestamp=${currentDate!.getTime()}&location=${match.params.location}`);
  }, [currentDate, match.params.location, setUrl]);

  // フロント用ダイアログの状態
  const [frontDialogOpen, setFrontDialogOpen] = useState(false);

  // 編集用選択行の状態
  const [{ currentRow }, , handleDialogOpen, handleRecConfClose] = UseDataTable({ dataDialogHook: dataDialogHook });
  // フロント用選択行の状態
  const [fronCurrentRow, setFronCurrentRow] = useState<FrontRowData | null>(null);

  // フロント用ダイアログを開く
  const handleFrontDialogOpen = (selectedRow: FrontRowData) => {
    setFrontDialogOpen(true);
    setFronCurrentRow(selectedRow);
  };
  // フロント用ダイアログを閉じる
  const handleFrontDialogClose = async () => {
    setFrontDialogOpen(false);
  };

  const columns: Columns[] = [
    {
      title: t('visittable.header.appt-time'),
      field: 'apptTime',
      render: (rowData) => rowData.apptTime.split(' ')[1],
      width: '95px',
    },
    { title: t('visittable.header.room-name'), field: 'roomName' },
    {
      title: t('visittable.header.number-of-people'),
      field: 'teaSupply',
      render: (rowData) => {
        const roomId = Object.keys(rowData.resourcies)[0]; // TODO:複数会議室未対応
        const strNumOfTeaSupply = `${t('visitdialog.view.tea-supply.number-of-tea-supply')}:${rowData.resourcies[roomId].numberOfTeaSupply}`;

        const strNumOfVisitor = `${t('visitdialog.view.tea-supply.number-of-visitor')}:${rowData.numberOfVisitor}`;
        const strNumOfEmployee = `${t('visitdialog.view.tea-supply.number-of-employee')}:${rowData.numberOfEmployee}`;

        return (
          <>
            <span style={rowData.resourcies[roomId].teaSupply ? { color: 'red' } : undefined}>{strNumOfTeaSupply}</span>
            <br />
            {strNumOfVisitor}
            <br />
            {strNumOfEmployee}
          </>
        );
      },
      width: '70px',
    },
    {
      title: `${t('visittable.header.visit-company')} / ${t('visittable.header.visitor-name')}`,
      field: 'visitCompany',
      render: (rowData) => (
        <>
          {rowData.visitCompany}
          <br />
          {rowData.visitorName}
        </>
      ),
    },
    {
      title: t('visittable.header.check-in'),
      field: 'checkIn',
      render: (rowData) =>
        rowData.checkIn ? (
          <>
            <span>✓</span>
            <br />
            <span>{rowData.visitorCardNumber}</span>
          </>
        ) : (
          <span></span>
        ),
      width: '70px',
    },
    {
      title: t('visittable.header.check-out'),
      field: 'checkOut',
      render: (rowData) => (rowData.checkOut ? <span>✓</span> : <span></span>),
      width: '50px',
    },
    {
      title: `${t('visittable.header.reservation-name')} / ${t('visittable.header.contact-addr')}`,
      field: 'reservationName',
      render: (rowData) => (
        <>
          {rowData.reservationName}
          <br />
          {rowData.contactAddr}
        </>
      ),
    },
    {
      title: `${t('visittable.header.tea-details')} / ${t('visittable.header.comment')}`,
      field: 'comment',
      render: (rowData) => {
        const roomId = Object.keys(rowData.resourcies)[0]; // TODO:複数会議室未対応
        const teaDetails = !!rowData.resourcies[roomId].teaDetails ? (
          <>
            <span style={{ color: 'red' }}>{rowData.resourcies[roomId].teaDetails}</span>
            <br />
          </>
        ) : undefined;
        return (
          <>
            {teaDetails}
            {rowData.comment}
          </>
        );
      },
      width: '70%',
    },
  ];

  // データ取得失敗した場合
  if (isError) {
    return <div>{t('common.msg.fetch-failed')}</div>;
  }

  return (
    <DataTableBase currentRow={currentRow} dataDialogHook={dataDialogHook} isLoading={isLoading} reload={reload} onRecConfClose={handleRecConfClose}>
      <MaterialTable
        columns={columns as Column<FrontRowData>[]}
        components={{
          Cell: (props) => <MTableCell {...props} className={cellStyle(props.columnDef.field, props.rowData, classes)} />,
        }}
        data={data!}
        onRowClick={(_event, selectedRow?) => !!selectedRow && handleFrontDialogOpen(selectedRow)}
        actions={[
          {
            icon: () => <BorderColorIcon />,
            tooltip: t('visittable.header.edit-action'),
            onClick: (_, rowData) => !!rowData && handleDialogOpen(rowData as FrontRowData),
          },
        ]}
        localization={{
          header: { actions: '' },
        }}
        options={{
          showTitle: false,
          toolbar: false,
          search: false,
          headerStyle: { backgroundColor: tableTheme.palette.primary.light, padding: frontCellPadding },
          tableLayout: 'fixed',
          // actionsColumnIndex: -1,
          ...pageingOntions,
        }}
        icons={tableIcons}
      />
      {fronCurrentRow && <RowDataFrontDialog open={frontDialogOpen} onClose={handleFrontDialogClose} data={fronCurrentRow} reload={reload} />}
    </DataTableBase>
  );
}

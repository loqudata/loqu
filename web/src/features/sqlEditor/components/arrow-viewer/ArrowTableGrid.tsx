// From github.com/cwharris/arrow-viewer
import {Table as ArrowTable} from "apache-arrow";

import { valueToString } from "utils/arrow-utils"

import { Table, Column, AutoSizer, Index } from "react-virtualized";

import "react-virtualized/styles.css";
import { defaultRowRenderer, TableCellProps, TableHeaderProps, TableHeaderRowProps, TableRowProps } from "react-virtualized/dist/es/Table";

export function ArrowTableGrid({
  table,
  width,
  height,
}: {
  table: ArrowTable;
  width: number;
  height: number;
}): JSX.Element {
  return (
    <AutoSizer>
      {(size) => (
        <Table
          {...size}
          height={height - 10}
          rowHeight={28}
          headerHeight={40}
          rowStyle={rowStyle}
          rowCount={table.length}
          rowGetter={({ index }: Index) => table.get(index)}
          rowRenderer={(props: TableRowProps) => {
            // console.log(props);

            return defaultRowRenderer({
              ...props,
              style: { ...props.style, width: props.style.width - 15 },
            });
          }}
          headerStyle={headerStyle()}
          headerRowRenderer={({
            className,
            columns,
            style,
          }: TableHeaderRowProps) => (
            <div
              role="row"
              className={className}
              style={{ ...style, ...headerStyle(), width: size.width }}
            >
              {columns}
            </div>
          )}
        >
          {table.schema.fields.map((field, idx) => {
            // console.log(field, idx);

            return (
              <Column
                key={idx}
                width={25}
                minWidth={25}
                flexGrow={1}
                dataKey={idx.toString()}
                label={`${field.toString()}`}
                columnData={table.getColumn(field.name).toArray()}
                cellDataGetter={(props) => {
                  // console.log(props);
                  const d = props.rowData[idx];
                  // console.log(d);
                  return d;
                }}
                cellRenderer={({ cellData }: TableCellProps) =>
                  valueToString(cellData)
                }
                headerRenderer={({
                  label,
                }: TableHeaderProps) => label}
              />
            );
          })}
        </Table>
      )}
    </AutoSizer>
  );
}

const headerStyle = () =>
  ({ textAlign: "right", textTransform: "none" } as React.CSSProperties);

const rowStyle = ({ index }: Index) =>
  index % 2 === 0
    ? {
        ...headerStyle(),
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fff",
      }
    : {
        ...headerStyle(),
        borderBottom: "1px solid #e0e0e0",
        backgroundColor: "#fafafa",
      };

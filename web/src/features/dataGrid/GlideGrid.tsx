import React, { useState } from "react";

import data from "data/cars.json";
import DataEditor, {
  DataEditorContainer,
  GridCell,
  GridCellKind,
  GridColumn,
  Rectangle,
} from "@glideapps/glide-data-grid";
import { useDataCache } from "./dataService";
import BodyEnd from "./BodyEnd";
import produce from "immer";
import { useImmer } from "use-immer";
import { sortBy } from "lodash";

// interface CustomColumn extends GridColumn {
//   idx: number;
// }

const columns: GridColumn[] = Object.keys(data[0]).map((k, i) => ({
  //   idx: i,
  title: k,
  width: 150,
}));

export const GlideGrid = () => {
  const [dynamicColumns, setDynamicColumns] = useState(columns);
//   const [colV, setColV] = useState(0)
  const [numRows, setNumRows] = useState(data.length);

  const onColMoved = React.useCallback(
    (startIndex: number, endIndex: number): void => {
      setDynamicColumns((old) => {
        //   no use for immer

        const newCols = [...old];
        const [toMove] = newCols.splice(startIndex, 1);
        newCols.splice(endIndex, 0, toMove);
        //@ts-ignore
        return newCols.map((v) => {v.up = true; return v});
        //   draft.filter((v) => v.idx == startIndex)[0].idx = endIndex
        //   draft.filter((v) => v.idx == startIndex)[0].idx = endIndex
      });
    //   setColV((i)=>i+1)
    },
    []
  );

  // If fetching data is slow you can use the DataEditor ref to send updates for cells
  // once data is loaded.
  const getGridCell = React.useCallback(
    ([col, row]: readonly [number, number]): GridCell => {
      for (let idx = 0; idx < dynamicColumns.length; idx++) {
        const refCol = dynamicColumns[idx];
        if (col == idx) {
          if (!data[row]) {
            console.log(data);
            return null;
          }
          if (row == 1) {
            console.log(idx, refCol);
          }

          const value = String(data[row][refCol.title]);
          return {
            kind: GridCellKind.Text,
            data: value,
            displayData: value,
            // IMPORTANT: Critical, needed for editing
            allowOverlay: true,
            readonly: false,
          };
        }
      }
      console.warn("er");
    },
    [dynamicColumns[0].title]
  );


  const {
    getCellContent,
    getCellsForSelection,
    setCellValue,
    setCellValueRaw,
    onRowAppended,
  } = React.useCallback(useDataCache, [getGridCell])(numRows, setNumRows, getGridCell);

  console.log(dynamicColumns);

  return (
    <>
      <BodyEnd />
      <DataEditorContainer width={1600} height={700}>
        <DataEditor
          getCellContent={getCellContent}
          columns={dynamicColumns} //sortBy(, "idx")}
          onColumnMoved={onColMoved}
          rows={numRows}
          // isDraggable={true}

          // edit
          onCellEdited={setCellValue}
          // copy
          getCellsForSelection={getCellsForSelection}
          // paste
          onPaste={true}
          // add row
          trailingRowOptions={{
            hint: "New row...",
            sticky: true,
            tint: true,
          }}
          onRowAppended={onRowAppended}
        />
      </DataEditorContainer>
    </>
  );
};

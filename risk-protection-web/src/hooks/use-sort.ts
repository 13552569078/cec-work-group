import { ref, Ref } from 'vue';

function useSort(tableRef: Ref, cols: Ref<any[]>) {
  const sortQuery = ref();

  const resetColumnSort = (prop: string) => {
    return cols.value.map(column => {
      if (column.prop !== prop && column.sortable) {
        column.sortable = true;
      }
      return column;
    });
  };

  const sortChange = (prop: string, sort: string) => {
    if (sort) {
      sortQuery.value = {
        prop,
        sort: sort.replace('ending', '')
      };
    } else {
      sortQuery.value = false;
    }
    cols.value = resetColumnSort(prop);
    tableRef.value.reset();
  };

  return {
    sortQuery,
    sortChange
  };
}

export { useSort };

'use client';

import { useState, useMemo, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { themeBalham } from 'ag-grid-community';
import useSWR from 'swr';
import { roundToTwoDecimals, wbTheme } from '@/lib/helper';

ModuleRegistry.registerModules([AllCommunityModule]);

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .catch((err) => {
      console.error(`Fetcher error for ${url}:`, err);
      throw err;
    });

// Cache for select options
const selectOptionsCache: Record<string, { value: string; label: string }[]> = {};
 
const selectFieldMapping: Record<string, { sourceModel: string; displayField: string }> = {
  BusinessTitle: { sourceModel: 'BusinessTitles', displayField: 'TitleName' },
  RoleResponsibility: { sourceModel: 'RoleResponsibilities', displayField: 'RoleName' },
  FunctionCategory: { sourceModel: 'FunctionCategories', displayField: 'CategoryName' },
  ServiceAccount: { sourceModel: 'ServiceAccounts', displayField: 'ServiceDescription' },
  Employee: { sourceModel: 'Employees', displayField: 'EE_NO' },
};

interface DynamicTableProps {
  model: string;
  relationDisplayFields?: Record<string, string>;
}

export default function DynamicTable({ model, relationDisplayFields = {} }: DynamicTableProps) {
  const { data, error, isLoading } = useSWR(`/api/${model}`, fetcher, {
    fallbackData: { data: [], metadata: { model: { fields: [] }, fields: [] } },
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const { data: rowData = [], metadata = { model: { fields: [] }, fields: [] } } = data || {};
  const [selectOptions, setSelectOptions] = useState<Record<string, { value: string; label: string }[]>>({});
  const [isLoadingSelectOptions, setIsLoadingSelectOptions] = useState(false);

  // Memoize metadata and relationDisplayFields
  const stableMetadata = useMemo(() => metadata, [JSON.stringify(metadata)]);
  const stableRelationDisplayFields = useMemo(() => relationDisplayFields, [JSON.stringify(relationDisplayFields)]);
 
  useEffect(() => {
    if (!stableMetadata?.fields?.length) return;

    const fetchSelectOptions = async () => {
      setIsLoadingSelectOptions(true);
      const fieldsToFetch = Object.keys(selectFieldMapping)

      console.log('Fetching select options for:', fieldsToFetch);

      const promises = fieldsToFetch.map(async (fieldName: string) => {
        let sourceModel: string;
        let displayField: string;

        if (selectFieldMapping[fieldName]) {
          ({ sourceModel, displayField } = selectFieldMapping[fieldName]);
        } else{
          console.log(`ERROR!!!!: No selectFieldMapping for ${fieldName}`);
          return;
        } 

        const cacheKey = `${sourceModel}-${displayField}`;

        if (selectOptionsCache[cacheKey]) {
          console.log(`Using cached options for ${cacheKey}:`, selectOptionsCache[cacheKey]);
          return { fieldName, options: selectOptionsCache[cacheKey] };
        }

        console.log(`Fetching options for ${sourceModel}, field: ${fieldName}, displayField: ${displayField}`);
        try {
          const opts = await fetch(`/api/relations/${sourceModel}?displayField=${displayField}`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch options for ${sourceModel}: ${res.status}`);
            return res.json();
          }); 
          const options = Array.isArray(opts)
            ? opts
                .filter((opt: any) => 
                  opt?.value != null && 
                  typeof opt.value === 'string' && 
                  opt.value.trim() !== '' &&
                  opt?.label != null &&
                  typeof opt.label === 'string' && 
                  opt.label.trim() !== ''
                )
                .map((opt: any) => ({
                  value: opt.value,
                  label: opt.label,
                }))
            : [];
          if (options.length === 0) {
            console.warn(`No valid options returned for ${sourceModel}`);
          }
          selectOptionsCache[cacheKey] = options; 
          return { fieldName, options };
        } catch (error) {
          console.error(`Error fetching options for ${sourceModel}:`, error);
          return { fieldName, options: [] };
        }
      });

      const results = await Promise.all(promises);
      // Filter out undefined results and map to [fieldName, options] pairs
      setSelectOptions((prev) => ({
        ...prev,
        ...Object.fromEntries(
          results
            .filter((result): result is { fieldName: string; options: { value: string; label: string }[] } => result !== undefined)
            .map(({ fieldName, options }) => [fieldName, options])
        ),
      }));
      setIsLoadingSelectOptions(false);
    };

    fetchSelectOptions();
  }, [stableMetadata, stableRelationDisplayFields, model]);

  // Define columns
  const columnDefs = useMemo(() => {
    if (!stableMetadata?.fields?.length) return [];

    const relationFieldNames = stableMetadata.fields
      .filter((f: any) => f.kind === 'object' && !f.isList && f.relationFromFields?.length)
      .flatMap((f: any) => f.relationFromFields || []);

    const nonRelationFields = stableMetadata.fields.filter(
      (f: any) => f.kind !== 'object' && !relationFieldNames.includes(f.name)
    );

    const relationColumns = stableMetadata.fields
      .filter((f: any) => f.kind === 'object' && !f.isList && f.relationFromFields?.length)
      .map((field: any) => {
        const fkField = field.relationFromFields[0];
        const options = selectOptions[field.name] || [];
        const values = options.length > 0 
          ? options.map((opt: any) => opt.value)
          : []; 
        return {
          headerName: field.relatedModel,
          field: fkField,
          editable: !isLoadingSelectOptions && options.length > 0 && values.length > 0 && values.every((v: any) => typeof v === 'string' && v.trim() !== ''),
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values,
            cellEditorPopup: true,
          },
          valueGetter: (params: any) => {
            const value = params.data[fkField];
            if (!value) return '';
            const opt = options.find((o: any) => o.value === value);
            return opt ? opt.label : value;
          },
          valueSetter: (params: any) => {
            const newValue = params.newValue;
            if (!newValue || newValue === '') {
              console.error(`Invalid value for ${field.relatedModel}: ${newValue}`);
              return false;
            }
            const selectedOption = options.find((o: any) => o.value === newValue);
            if (!selectedOption) {
              console.error(`Value ${newValue} not found in options for ${field.relatedModel}`);
              return false;
            }
            params.data[fkField] = newValue;
            params.api.refreshCells({ rowNodes: [params.node], columns: [fkField] });
            return true;
          },
          cellRenderer: (params: any) => {
            const value = params.data[fkField];
            if (!Array.isArray(options) || options.length === 0) {
              return value || 'No options available';
            }
            const opt = options.find((o: any) => o.value === value);
            return opt ? opt.label : value || 'N/A';
          },
        };
      });

    const nonRelationColumns = nonRelationFields.map((field: any) => {
      const base = {
        headerName: field.name,
        field: field.name,
        editable: true,
        valueSetter: (params: any) => {
          const newValue = params.newValue;
          if (newValue === undefined) {
            console.error(`Invalid value for ${field.name}: ${newValue}`);
            return false;
          }
          let value = newValue;
          if (field.type === 'DateTime') {
            value = newValue ? new Date(newValue).toISOString() : null;
          }
          params.data[field.name] = value;
          params.api.refreshCells({ rowNodes: [params.node], columns: [field.name] });
          return true;
        },
      };
 
      if (selectFieldMapping[field.name]) {
        const options = selectOptions[field.name] || [];
        const values = options.length > 0 
          ? options.map((opt: any) => opt.value)
          : []; 
        return {
          ...base,
          editable: !isLoadingSelectOptions && options.length > 0 && values.length > 0 && values.every((v: any) => typeof v === 'string' && v.trim() !== ''),
          cellEditor: 'agSelectCellEditor',
          cellEditorParams: {
            values,
            cellEditorPopup: true,
          },
          valueGetter: (params: any) => {
            const value = params.data[field.name];
            if (!value) return '';
            const opt = options.find((o: any) => o.value === value);
            return opt ? opt.label : value;
          },
          valueSetter: (params: any) => {
            const newValue = params.newValue;
            if (!newValue || newValue === '') {
              console.error(`Invalid value for ${field.name}: ${newValue}`);
              return false;
            }
            const selectedOption = options.find((o: any) => o.value === newValue);
            if (!selectedOption) {
              console.error(`Value ${newValue} not found in options for ${field.name}`);
              return false;
            }
            params.data[field.name] = newValue;
            params.api.refreshCells({ rowNodes: [params.node], columns: [field.name] });
            return true;
          },
          cellRenderer: (params: any) => {
            const value = params.data[field.name];
            if (!Array.isArray(options) || options.length === 0) {
              return value || 'No options available';
            }
            const opt = options.find((o: any) => o.value === value);
            return opt ? opt.label : value || 'N/A';
          },
        };
      }

      if (field.type === 'DateTime') {
       
          return {
            ...base,
            cellEditor: 'agDateCellEditor',
            cellEditorParams: {
              min: '2000-01-01',
              max: '2099-12-31',
              dateFormat: 'yyyy-MM-dd',
              cellEditorPopup: true,
            },
            cellRenderer: (params: any) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
            width:80
          };          
        
      } else if (field.type === 'Int' || field.type === 'Decimal') {
        return {
          ...base,
          cellEditor: 'agNumberCellEditor',
          cellEditorParams: {
            precision: field.type === 'Decimal' ? 2 : 0,
          },
          width:80
        };
      } else {
        return { ...base, cellEditor: 'agTextCellEditor',width:80 };
      }
    });

    return [...nonRelationColumns, ...relationColumns];
  }, [stableMetadata, selectOptions, isLoadingSelectOptions, model]);

  // Handle updates via API
  const onCellValueChanged = useMemo(
    () => async (params: any) => {
      console.log('Cell value changed:', {
        field: params.colDef.field,
        oldValue: params.oldValue,
        newValue: params.newValue,
        data: params.data,
      });

      const pkField = stableMetadata.fields.find((f: any) => f.isId)?.name;
      const payload = {
        [pkField]: params.data[pkField],
        field: params.colDef.field,
        value: params.newValue || params.value,
      };

      try {
        const response = await fetch(`/api/${model}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Update failed for ${params.colDef.field}: HTTP ${response.status}`, errorData);
          params.data[params.colDef.field] = params.oldValue;
          params.api.refreshCells({ rowNodes: [params.node], columns: [params.colDef.field] });
          return;
        }
        console.log(`Update successful for ${params.colDef.field}`);
      } catch (error) {
        console.error(`Error updating ${params.colDef.field}:`, error);
        params.data[params.colDef.field] = params.oldValue;
        params.api.refreshCells({ rowNodes: [params.node], columns: [params.colDef.field] });
      }
    },
    [model, stableMetadata]
  );

  if (isLoading || isLoadingSelectOptions) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading data: {error.message}</div>;
  }

  // enables pagination in the grid
  const pagination = true;

  // sets 10 rows per page (default is 100)
  const paginationPageSize = 35;

  // allows the user to select the page size from a predefined list of page sizes
  const paginationPageSizeSelector = [20, 35, 50, 100];

  return ( 
     
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          minWidth: 80,
        }}
        className={`--font-roboto-condensed`}
        theme={wbTheme}
        singleClickEdit={false}
        stopEditingWhenCellsLoseFocus={true}
        onCellValueChanged={onCellValueChanged}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector}
      /> 
     
  );
}
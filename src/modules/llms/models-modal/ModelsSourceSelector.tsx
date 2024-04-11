import * as React from 'react';
import { shallow } from 'zustand/shallow';

import { Badge, Box, Button, IconButton, ListItemDecorator, MenuItem, Option, Select, Typography } from '@mui/joy';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { getBackendCapabilities } from '~/modules/backend/store-backend-capabilities';

import { CloseableMenu } from '~/common/components/CloseableMenu';
import { ConfirmationModal } from '~/common/components/ConfirmationModal';
import { themeZIndexOverMobileDrawer } from '~/common/app.theme';
import { useIsMobile } from '~/common/components/useMatchMedia';

import type { IModelVendor } from '../vendors/IModelVendor';
import { DModelSourceId, useModelsStore } from '../store-llms';
import { createModelSourceForVendor, findAllVendors, findVendorById, ModelVendorId } from '../vendors/vendors.registry';
import { vendorHasBackendCap } from '../vendors/useSourceSetup';


/*function locationIcon(vendor?: IModelVendor | null) {
  if (vendor && vendor.id === 'openai' && vendorHasBackendCap(...))
    return <CloudDoneOutlinedIcon />;
  return !vendor ? null : vendor.location === 'local' ? <ComputerIcon /> : <CloudOutlinedIcon />;
}*/

function vendorIcon(vendor: IModelVendor | null, greenMark: boolean) {
  let icon: React.JSX.Element | null = null;
  if (vendor?.Icon)
    icon = <vendor.Icon />;
  return (greenMark && icon)
    ? <Badge size='sm' badgeContent='' slotProps={{ badge: { sx: { backgroundColor: 'lime', boxShadow: 'none', border: '1px solid gray', p: 0 } } }}>{icon}</Badge>
    : icon;
}


export function ModelsSourceSelector(props: {
  selectedSourceId: DModelSourceId | null, setSelectedSourceId: (sourceId: DModelSourceId | null) => void,
}) {

  // state
  const [vendorsMenuAnchor, setVendorsMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [confirmDeletionSourceId, setConfirmDeletionSourceId] = React.useState<DModelSourceId | null>(null);

  // external state
  const isMobile = useIsMobile();
  const { modelSources, addModelSource, removeModelSource } = useModelsStore(state => ({
    modelSources: state.sources,
    addModelSource: state.addSource, removeModelSource: state.removeSource,
  }), shallow);

  const handleShowVendors = (event: React.MouseEvent<HTMLElement>) => setVendorsMenuAnchor(event.currentTarget);

  const closeVendorsMenu = () => setVendorsMenuAnchor(null);

  const handleAddSourceFromVendor = React.useCallback((vendorId: ModelVendorId) => {
    closeVendorsMenu();
    const { sources: modelSources } = useModelsStore.getState();
    const modelSource = createModelSourceForVendor(vendorId, modelSources);
    if (modelSource) {
      addModelSource(modelSource);
      props.setSelectedSourceId(modelSource.id);
    }
  }, [addModelSource, props]);


  const enableDeleteButton = !!props.selectedSourceId && modelSources.length > 1;

  const handleDeleteSource = (id: DModelSourceId) => setConfirmDeletionSourceId(id);

  const handleDeleteSourceConfirmed = React.useCallback(() => {
    if (confirmDeletionSourceId) {
      props.setSelectedSourceId(modelSources.find(source => source.id !== confirmDeletionSourceId)?.id ?? null);
      removeModelSource(confirmDeletionSourceId);
      setConfirmDeletionSourceId(null);
    }
  }, [confirmDeletionSourceId, modelSources, props, removeModelSource]);


  // vendor list items
  const vendorItems = React.useMemo(() => findAllVendors()
    .filter(v => !!v.instanceLimit)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(vendor => {
        const sourceInstanceCount = modelSources.filter(source => source.vId === vendor.id).length;
        const enabled = vendor.instanceLimit > sourceInstanceCount;
        const backendCaps = getBackendCapabilities();
        return {
          vendor,
          enabled,
          component: (
            <MenuItem key={vendor.id} disabled={!enabled} onClick={() => handleAddSourceFromVendor(vendor.id)}>
              <ListItemDecorator>
                {vendorIcon(vendor, vendorHasBackendCap(vendor, backendCaps))}
              </ListItemDecorator>
              {vendor.name}

              {/*{sourceInstanceCount > 0 && ` (added)`}*/}

              {/* Free indication */}
              {!!vendor.hasFreeModels && ` 🎁`}

              {/* Multiple instance hint */}
              {vendor.instanceLimit > 1 && !!sourceInstanceCount && enabled && (
                <Typography component='span' level='body-sm'>
                  #{sourceInstanceCount + 1}
                  {/*/{vendor.instanceLimit}*/}
                </Typography>
              )}

              {/* Local chip */}
              {/*{vendor.location === 'local' && (*/}
              {/*  <Chip variant='solid' size='sm'>*/}
              {/*    local*/}
              {/*  </Chip>*/}
              {/*)}*/}
            </MenuItem>
          ),
        };
      },
    ), [handleAddSourceFromVendor, modelSources]);


  // source items
  const sourceItems = React.useMemo(() => modelSources
      .map(source => {
        const icon = vendorIcon(findVendorById(source.vId), false);
        return {
          source,
          icon,
          component: (
            <Option key={source.id} value={source.id}>
              {/*<ListItemDecorator>{icon}</ListItemDecorator>*/}
              {source.label}
            </Option>
          ),
        };
      })
      .sort((a, b) => a.source.label.localeCompare(b.source.label))
    , [modelSources]);

  const selectedSourceItem = sourceItems.find(item => item.source.id === props.selectedSourceId);
  const noSources = !sourceItems.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>

     

    </Box>
  );
}
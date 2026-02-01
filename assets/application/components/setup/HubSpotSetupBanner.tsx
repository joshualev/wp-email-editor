import React from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import useEditorStore from '@/application/store/editorStore';

export default function HubSpotSetupBanner() {
  const isHubSpotConfigured = useEditorStore((state) => state.isHubSpotConfigured);
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);

  if (isHubSpotConfigured) return null;

  return (
    <>
      <Alert
        severity="info"
        sx={{ mx: 2, mt: 2, mb: 1, alignItems: 'flex-start' }}
        action={
          <Stack
            alignItems="flex-end"
            sx={{ minWidth: 120, maxWidth: 150 }}
          >
            <Button
              color="inherit"
              size="small"
              onClick={() => setIsGuideOpen((prev) => !prev)}
              sx={{ textAlign: 'right', whiteSpace: 'normal', lineHeight: 1.2 }}
            >
              {isGuideOpen ? 'Hide setup guide' : 'View setup guide'}
            </Button>
          </Stack>
        }
      >
        <AlertTitle>Saving is disabled</AlertTitle>
        Connect a HubSpot HubDB table to enable saving. You can continue editing in the meantime.
        Use the settings (gear icon) to connect your account.
      </Alert>

      <Collapse in={isGuideOpen}>
        <Paper variant="outlined" sx={{ mx: 2, mb: 2, p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">HubSpot HubDB setup guide</Typography>
            <Typography variant="body2" color="text.secondary">
              Follow these steps to connect HubSpot and enable saving from the editor.
            </Typography>

            <List sx={{ listStyleType: 'disc', pl: 3 }}>
              <ListItem sx={{ display: 'list-item' }}>
                In HubSpot, create a <strong>Private App</strong> (Settings &gt; Integrations &gt; Private Apps).
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                Grant the app HubDB read/write access (and any related CMS scopes required by your org).
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                Copy the access token from the private app.
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                In the editor, open the settings (gear icon) and verify the API key.
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                Create a HubDB table when prompted. This stores your newsletter blocks.
              </ListItem>
              <ListItem sx={{ display: 'list-item' }}>
                Return to the editor and use Save — it will now persist to HubDB.
              </ListItem>
            </List>

            <Typography variant="body2" color="text.secondary">
              Tip: You can edit newsletters without connecting HubSpot, but saving requires a configured table.
            </Typography>
          </Stack>
        </Paper>
      </Collapse>
    </>
  );
}

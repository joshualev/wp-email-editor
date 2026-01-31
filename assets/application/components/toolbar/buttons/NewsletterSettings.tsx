/**
 * NewsletterSettings.tsx - HubSpot Configuration Wizard
 *
 * Modal dialog for configuring the HubSpot integration. Provides
 * a step-by-step wizard for API key verification and table setup.
 *
 * Wizard Steps:
 * 1. Verify API Key - Validates HubSpot API credentials
 * 2. Configure HubSpot Table - Creates custom object for storage
 *
 * API Integration:
 * - validateApiKey: Verifies HubSpot API access
 * - createNewsletter: Creates custom object table in HubSpot
 *
 * Table Name Format:
 * Input is sanitized to remove special characters and replace
 * spaces with underscores for HubSpot compatibility.
 *
 * @module application/components/toolbar/buttons
 */
import React, { useState } from 'react';
import {
  IconButton,
  Tooltip,
  Modal,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button
} from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { newsletterApi } from '@/infrastructure/newsletter/api';
import TextInput from '@/application/components/inspector-drawer/forms/inputs/TextInput';
import useEditorStore from '@/application/store/editorStore';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function formatTableName(name: string): string {
  // Remove special characters and replace spaces with underscores
  return name.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
}

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [apiKey, setApiKey] = useState('');
  const [tableName, setTableName] = useState('');
  const setHubSpotConfigured = useEditorStore((state) => state.setHubSpotConfigured);

  const verifyApiKeyMutation = useMutation({
    mutationFn: async (key: string) => {
      const response = await newsletterApi.validateApiKey(key);
      if (response.error) throw new Error(response.error);
      return response.data;
    }
  });

  const createTableMutation = useMutation({
    mutationFn: async (params: { name: string; label: string }) => {
      const formattedTableName = formatTableName(params.name);
      const response = await newsletterApi.createNewsletter({
        name: formattedTableName,
        label: formattedTableName
      });
      if (response.error) throw new Error(response.error);
      return response;
    }
  });

  const handleVerifyApiKey = async () => {
    try {
      await verifyApiKeyMutation.mutateAsync(apiKey);
      setActiveStep(1);
    } catch (error) {
      console.error('API Key verification failed:', error);
      // Handle error (show error message)
    }
  };

  const handleCreateTable = async () => {
    try {
      await createTableMutation.mutateAsync({ name: tableName, label: tableName });
      setHubSpotConfigured(true);
      setOpen(false);
      setActiveStep(0);
      // Show success message
    } catch (error) {
      console.error('Table creation failed:', error);
      // Handle error
    }
  };

  return (
    <>
      <Tooltip title="Settings">
        <IconButton onClick={() => setOpen(true)}>
          <SettingsIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {['Verify API Key', 'Configure HubSpot Table'].map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Verify API Key
              </Typography>
              <TextInput
                label="API Key"
                defaultValue={apiKey}
                onChange={setApiKey}
                placeholder="Enter your API key"
              />
              <Button
                variant="contained"
                onClick={handleVerifyApiKey}
                disabled={verifyApiKeyMutation.isPending || !apiKey}
                sx={{ mt: 2 }}
              >
                Verify
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Configure HubSpot Table
              </Typography>
              <TextInput
                label="Table Name"
                defaultValue={tableName}
                onChange={setTableName}
                placeholder="Enter table name"
              />
              <Button
                variant="contained"
                onClick={handleCreateTable}
                disabled={createTableMutation.isPending || !tableName}
                sx={{ mt: 2 }}
              >
                Create Table
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
}

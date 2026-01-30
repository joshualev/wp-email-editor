import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Typography,
  IconButton,
} from '@mui/material';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';

type SidebarAccordionProps = {
  id: string;
  title: string;
  isHidden: boolean;
  onToggleHidden: (event: React.MouseEvent) => void;
  expanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  children: React.ReactNode;
};

export default function SidebarAccordion({
  id,
  title,
  isHidden,
  onToggleHidden,
  expanded,
  onChange,
  children,
}: SidebarAccordionProps) {
  return (
    <Accordion
      expanded={expanded && !isHidden}
      onChange={onChange}
      disableGutters
      elevation={0}
      slotProps={{ transition: { unmountOnExit: true } }}
      sx={{
        opacity: isHidden ? 0.7 : 1,
        '&.MuiAccordion-root': {
          backgroundColor: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: 1,
          transition: 'background-color 0.3s, box-shadow 0.3s',
        },
        '&:before': {
          display: 'none',
        },
        '&.Mui-expanded': {
          boxShadow: 'none',
          // margin: 0,
        },
        // Override MUI default that removes margin-top on first expanded accordion
        '&.Mui-expanded:first-of-type': {
          marginTop: '16px',
        },
      }}
    >
      <AccordionSummary
        expandIcon={
          !isHidden && <ChevronDown size={20} color={expanded && !isHidden ? '#1976d2' : '#757575'} />
        }
        aria-controls={`${id}-content`}
        id={`${id}-header`}
        sx={{
          minHeight: '48px',
          padding: '0 16px',
          '& .MuiAccordionSummary-content': {
            margin: '0',
            display: 'flex',
            alignItems: 'center',
          },
          '&.Mui-expanded': {
            minHeight: '48px',
          },
          backgroundColor: expanded && !isHidden ? '#f5f9ff' : '#fafafa',
          borderRadius: '4px',
          transition: 'background-color 0.3s',
          '&:hover': {
            backgroundColor: expanded && !isHidden ? '#e0efff' : '#f0f0f0',
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" width="100%">
          <Typography
            variant="body2"
            sx={{
              flexGrow: 1,
              color: isHidden ? 'text.disabled' : 'text.primary',
              fontWeight: expanded && !isHidden ? 600 : 400,
              transition: 'font-weight 0.3s',
              fontSize: '0.875rem',
              lineHeight: '1.43',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onToggleHidden(e);
            }}
            sx={{
              color: isHidden ? '#bdbdbd' : '#1976d2',
              transition: 'color 0.3s',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconButton>
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '8px 16px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Stack sx={{ py: 2 }}>{children}</Stack>
      </AccordionDetails>
    </Accordion>
  );
}

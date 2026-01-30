import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
    Stack,
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
} from '@mui/material';
import {
    AlignLeft,
    AlignCenter,
    AlignRight,
    Monitor,
    Smartphone,
} from 'lucide-react';
import { HorizontalAlignValue, ResponsiveHorizontalAlignValue } from '@/Domain/Blocks/helpers/layout';
import { StyledToggleButtonGroup } from './ToggleButtonGroupInput';

// Device selector styled component
const DeviceToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    padding: 2,
    '& .MuiToggleButton-root': {
        border: 'none',
        borderRadius: theme.shape.borderRadius,
        padding: theme.spacing(0.5, 1.25),
        minWidth: 'auto',
        color: theme.palette.text.secondary,
        '&.Mui-selected': {
            backgroundColor: theme.palette.common.white,
            color: theme.palette.primary.main,
            boxShadow: theme.shadows[1],
            '&:hover': {
                backgroundColor: theme.palette.common.white,
            },
        },
        '&:hover': {
            backgroundColor: 'transparent',
        },
    },
}));

// Alignment options styled component
const AlignmentToggleGroup = styled(StyledToggleButtonGroup)(({ theme }) => ({
    width: '100%',
    '& .MuiToggleButton-root': {
        flex: 1,
        padding: theme.spacing(1),
    },
}));

interface ResponsiveAlignmentInputProps {
    label?: string;
    value: ResponsiveHorizontalAlignValue;
    onChange: (value: ResponsiveHorizontalAlignValue) => void;
    showLabel?: boolean;
}

export default function ResponsiveAlignmentInput({
    label = 'Alignment',
    value,
    onChange,
    showLabel = true,
}: ResponsiveAlignmentInputProps) {
    const [activeDevice, setActiveDevice] = useState<'desktop' | 'mobile'>('desktop');

    const alignmentOptions = [
        { label: <AlignLeft size={18} />, value: 'left', tooltip: 'Left' },
        { label: <AlignCenter size={18} />, value: 'center', tooltip: 'Center' },
        { label: <AlignRight size={18} />, value: 'right', tooltip: 'Right' },
    ];

    const handleDeviceChange = (
        _: React.MouseEvent<HTMLElement>,
        newDevice: 'desktop' | 'mobile' | null
    ) => {
        if (newDevice !== null) {
            setActiveDevice(newDevice);
        }
    };

    const handleAlignmentChange = (
        _: React.MouseEvent<HTMLElement>,
        newAlignment: HorizontalAlignValue | null
    ) => {
        if (newAlignment !== null) {
            onChange({
                ...value,
                [activeDevice]: newAlignment,
            });
        }
    };

    const currentValue = activeDevice === 'desktop' ? value.desktop : value.mobile;

    return (
        <Stack spacing={1.5}>
            {showLabel && (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <Box sx={{ typography: 'body2', color: 'text.secondary', pl: 0.5 }}>
                        {label}
                    </Box>
                    <DeviceToggleGroup
                        size="small"
                        value={activeDevice}
                        exclusive
                        onChange={handleDeviceChange}
                    >
                        <ToggleButton value="desktop" aria-label="desktop alignment">
                            <Tooltip title="Desktop" arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Monitor size={14} />
                                </Box>
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="mobile" aria-label="mobile alignment">
                            <Tooltip title="Mobile" arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Smartphone size={14} />
                                </Box>
                            </Tooltip>
                        </ToggleButton>
                    </DeviceToggleGroup>
                </Box>
            )}

            <Box>
                <AlignmentToggleGroup
                    size="small"
                    value={currentValue}
                    exclusive
                    onChange={handleAlignmentChange}
                >
                    {alignmentOptions.map((option) => (
                        <ToggleButton key={option.value} value={option.value}>
                            <Tooltip title={option.tooltip} arrow>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {option.label}
                                </Box>
                            </Tooltip>
                        </ToggleButton>
                    ))}n                </AlignmentToggleGroup>
            </Box>

            {/* Visual indicator showing both values */}
            <Box sx={{
                display: 'flex',
                gap: 1.5,
                px: 0.5,
                mt: 0.5,
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    typography: 'caption',
                    color: activeDevice === 'desktop' ? 'primary.main' : 'text.disabled',
                }}>
                    <Monitor size={12} />
                    <span style={{ textTransform: 'capitalize' }}>{value.desktop}</span>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    typography: 'caption',
                    color: activeDevice === 'mobile' ? 'secondary.main' : 'text.disabled',
                }}>
                    <Smartphone size={12} />
                    <span style={{ textTransform: 'capitalize' }}>{value.mobile}</span>
                </Box>
            </Box>
        </Stack>
    );
}

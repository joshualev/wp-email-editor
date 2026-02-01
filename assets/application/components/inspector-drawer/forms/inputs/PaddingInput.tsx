import React, { useState } from 'react';
import {
  AlignVerticalCenterOutlined,
  AlignHorizontalCenterOutlined,
  AlignHorizontalLeftOutlined,
  AlignHorizontalRightOutlined,
  AlignVerticalBottomOutlined,
  AlignVerticalTopOutlined,
} from '@mui/icons-material';
import { InputLabel, Stack, Button, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import RawSliderInput from './raw/RawSliderInput';

type TPaddingValue = {
  top: number;
  bottom: number;
  right: number;
  left: number;
};

type InputType = 'all' | 'vertical' | 'horizontal';

type Props = {
  label: string;
  defaultValue: TPaddingValue | null;
  onChange: (value: TPaddingValue) => void;
  inputType?: InputType;
};

const SliderTooltip: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Tooltip 
    title={title}
    placement="left"
    enterDelay={300}
    leaveDelay={0}
  >
    <div>
      {children}
    </div>
  </Tooltip>
);

export default function PaddingInput({ 
  label, 
  defaultValue, 
  onChange, 
  inputType = 'all' 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState<TPaddingValue>(
    defaultValue ?? { top: 0, left: 0, bottom: 0, right: 0 }
  );

  function handleChange(internalName: keyof TPaddingValue, nValue: number) {
    const v = {
      ...value,
      [internalName]: nValue,
    };
    if (!isExpanded) {
      if (internalName === 'top') v.bottom = nValue;
      if (internalName === 'bottom') v.top = nValue;
      if (internalName === 'left') v.right = nValue;
      if (internalName === 'right') v.left = nValue;
    }
    setValue(v);
    onChange(v);
  }

  const renderSliders = () => {
    if (!isExpanded) {
      if (inputType === 'horizontal') {
        return (
          <SliderTooltip title="Horizontal padding">
            <RawSliderInput
              iconLabel={<AlignHorizontalCenterOutlined sx={{ fontSize: 16 }} />}
              value={value.left}
              setValue={(num) => handleChange('left', num)}
              units="px"
              step={1}
              min={0}
              max={40}
              marks
            />
          </SliderTooltip>
        );
      }
      if (inputType === 'vertical') {
        return (
          <SliderTooltip title="Vertical padding">
            <RawSliderInput
              iconLabel={<AlignVerticalCenterOutlined sx={{ fontSize: 16 }} />}
              value={value.top}
              setValue={(num) => handleChange('top', num)}
              units="px"
              step={1}
              min={0}
              max={40}
              marks
            />
          </SliderTooltip>
        );
      }
      return (
        <>
          <SliderTooltip title="Horizontal padding">
            <RawSliderInput
              iconLabel={<AlignHorizontalCenterOutlined sx={{ fontSize: 16 }} />}
              value={value.left}
              setValue={(num) => handleChange('left', num)}
              units="px"
              step={1}
              min={0}
              max={40}
              marks
            />
          </SliderTooltip>
          <SliderTooltip title="Vertical padding">
            <RawSliderInput
              iconLabel={<AlignVerticalCenterOutlined sx={{ fontSize: 16 }} />}
              value={value.top}
              setValue={(num) => handleChange('top', num)}
              units="px"
              step={1}
              min={0}
              max={40}
              marks
            />
          </SliderTooltip>
        </>
      );
    }

    return (
      <>
        {(inputType === 'all' || inputType === 'vertical') && (
          <>
            <SliderTooltip title="Top padding">
              <RawSliderInput
                iconLabel={<AlignVerticalTopOutlined sx={{ fontSize: 16 }} />}
                value={value.top}
                setValue={(num) => handleChange('top', num)}
                units="px"
                step={1}
                min={0}
                max={40}
                marks
              />
            </SliderTooltip>
            <SliderTooltip title="Bottom padding">
              <RawSliderInput
                iconLabel={<AlignVerticalBottomOutlined sx={{ fontSize: 16 }} />}
                value={value.bottom}
                setValue={(num) => handleChange('bottom', num)}
                units="px"
                step={1}
                min={0}
                max={40}
                marks
              />
            </SliderTooltip>
          </>
        )}
        {(inputType === 'all' || inputType === 'horizontal') && (
          <>
            <SliderTooltip title="Right padding">
              <RawSliderInput
                iconLabel={<AlignHorizontalRightOutlined sx={{ fontSize: 16 }} />}
                value={value.right}
                setValue={(num) => handleChange('right', num)}
                units="px"
                step={1}
                min={0}
                max={40}
                marks
              />
            </SliderTooltip>
            <SliderTooltip title="Left padding">
              <RawSliderInput
                iconLabel={<AlignHorizontalLeftOutlined sx={{ fontSize: 16 }} />}
                value={value.left}
                setValue={(num) => handleChange('left', num)}
                units="px"
                step={1}
                min={0}
                max={40}
                marks
              />
            </SliderTooltip>
          </>
        )}
      </>
    );
  };

  return (
    <Stack spacing={2} alignItems="flex-start" pb={1}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        width="100%"
        justifyContent="space-between"
        sx={{ minHeight: 32 }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <InputLabel
            shrink
            sx={{
              transform: 'none',
              position: 'relative',
              minWidth: 120,
            }}
          >
            {label}
          </InputLabel>
        </Stack>
        <Button
          size="small"
          variant="text"
          onClick={() => setIsExpanded(!isExpanded)}
          endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            textTransform: 'none',
            py: 0,
            fontSize: '0.75rem',
            minWidth: 'auto',
            ml: 'auto',
          }}
        >
          {isExpanded ? 'Show less' : 'Advanced options'}
        </Button>
      </Stack>

      <Stack spacing={2} width="100%" pl={2}>
        {renderSliders()}
      </Stack>
    </Stack>
  );
}

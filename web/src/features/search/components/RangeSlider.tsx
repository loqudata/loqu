import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";

import React from "react";
import { connectRange } from "react-instantsearch-dom";

interface AlgoliaRangeState {
  min: number;
  max: number;
}
interface RangeSliderProps extends AlgoliaRangeState {
  currentRefinement: AlgoliaRangeState;
  canRefine: boolean;
  refine: (value: AlgoliaRangeState) => any;
}

const ChakraRangeSlider = ({
  min,
  max,
  currentRefinement,
  canRefine,
  refine,
}: RangeSliderProps) => {
  const [stateMin, setStateMin] = React.useState(min);
  const [stateMax, setStateMax] = React.useState(max);

  React.useEffect(() => {
    if (canRefine) {
      setStateMin(currentRefinement.min);
      setStateMax(currentRefinement.max);
    }
  }, [currentRefinement.min, currentRefinement.max]);

  if (min === max) {
    return null;
  }

  const onChange = (values: number[]) => {
    const [min, max] = values;
    if (currentRefinement.min !== min || currentRefinement.max !== max) {
      refine({ min, max });
    }
  };

  const onValuesUpdated = (values: number[]) => {
    const [min, max] = values;
    setStateMin(min);
    setStateMax(max);
  };

  return (
    <RangeSlider
      aria-label={["min", "max"]}
      value={[stateMin, stateMax]}
      onChange={onChange}
      onChangeEnd={onValuesUpdated}
    >
      <RangeSliderTrack>
        <RangeSliderFilledTrack />
      </RangeSliderTrack>
      <RangeSliderThumb index={0} />
      <RangeSliderThumb index={1} />
    </RangeSlider>
  );
};

const CustomRangeSlider = connectRange(ChakraRangeSlider);

export default CustomRangeSlider;

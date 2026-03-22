import { Box, Slider, Typography } from "@mui/material";
import type { SliderProps } from "@mui/material";
import { useAtom } from "jotai";
import type { FrequencyListWeights } from "../search/vocab-types";
import { frequencyListWeightsAtom } from "../../utils/jotai";
import { ValueLabel } from "./value-label";

const frequencyLists = [
  { name: "animeJDrama", title: "Anime & J-Drama" },
  { name: "bccwj", title: "BCCWJ" },
  { name: "innocent", title: "Innocent Corpus" },
  { name: "kokugojiten", title: "国語辞典" },
  { name: "narou", title: "Narou" },
  { name: "netflix", title: "Netflix" },
  { name: "novels", title: "Novels" },
  { name: "vn", title: "Visual Novels" },
  { name: "wikipedia", title: "Wikipedia" },
];

function FrequencySliders() {
  const [frequencyListWeights, setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );

  return (
    <Box sx={{ paddingX: 4, paddingY: 2 }}>
      {frequencyLists.map((list) => (
        <Box key={list.name}>
          <Typography lang="ja" gutterBottom>
            {list.title}
          </Typography>
          <Slider
            onChange={(
              _event: Event,
              value: Parameters<NonNullable<SliderProps["onChange"]>>[1]
            ) => {
              setFrequencyListWeights({
                ...frequencyListWeights,
                [list.name]: Array.isArray(value) ? value[0] ?? 0 : value,
              });
            }}
            valueLabelDisplay="auto"
            components={{
              ValueLabel,
            }}
            aria-label="custom thumb label"
            value={
              frequencyListWeights[list.name as keyof FrequencyListWeights]
            }
          />
        </Box>
      ))}
    </Box>
  );
}

export { FrequencySliders };

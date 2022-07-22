import { Box, Slider, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { FrequencyListWeights } from '../../server/resource/vocab/vocab.schema';
import { frequencyListWeightsAtom } from '../../utils/jotai';
import ValueLabelComponent from './value-label';

const frequencyLists = [
  { name: 'animeJDrama', title: 'Anime & J-Drama' },
  { name: 'bccwj', title: 'BCCWJ' },
  { name: 'innocent', title: 'Innocent Corpus' },
  { name: 'kokugojiten', title: '国語辞典' },
  { name: 'narou', title: 'Narou' },
  { name: 'netflix', title: 'Netflix' },
  { name: 'novels', title: 'Novels' },
  { name: 'vn', title: 'Visual Novels' },
  { name: 'wikipedia', title: 'Wikipedia' },
];

function Sliders() {
  const [frequencyListWeights, setFrequencyListWeights] = useAtom(
    frequencyListWeightsAtom
  );

  return (
    <Box sx={{ paddingX: 4, paddingY: 2 }}>
      {frequencyLists.map((list) => (
        <Box key={list.name}>
          <Typography lang='ja' gutterBottom>
            {list.title}
          </Typography>
          <Slider
            onChange={(e: Event) => {
              setFrequencyListWeights({
                ...frequencyListWeights,
                [list.name]: (e.target as HTMLInputElement).value,
              });
            }}
            valueLabelDisplay='auto'
            components={{
              ValueLabel: ValueLabelComponent,
            }}
            aria-label='custom thumb label'
            value={
              frequencyListWeights[list.name as keyof FrequencyListWeights]
            }
          />
        </Box>
      ))}
    </Box>
  );
}

export default Sliders;
